const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '../spellinator-assist');

function load() {
  const ctx = vm.createContext({ window: {}, localStorage: { getItem: () => null } });
  vm.runInContext(fs.readFileSync(path.join(root, 'words.js'), 'utf8'), ctx);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  // Exercise the application's actual dictionary loading, filtering and ranking.
  vm.runInContext(inline.slice(0, inline.indexOf('function setError(')) +
    '\nglobalThis.app={state,rank,validate,words,rejected};})();', ctx);
  return ctx;
}

test('the full supplied dictionary is retained, regardless of familiarity or word category', () => {
  const ctx = load();
  assert.equal(ctx.window.SPELL_DICTIONARY.length, 178691);
  const source = new Set(ctx.window.SPELL_DICTIONARY);
  const bundled = new Set(ctx.window.SPELL_WORDS.map(row => row[0]));
  assert.equal(source.size, 178691);
  for (const word of source) assert.ok(bundled.has(word), word);
  assert.equal(bundled.size, source.size + 1);
  assert.ok(bundled.has('jynx'));
  const eligible = new Set(ctx.app.words.map(row => row.word));
  for (const word of source) {
    if (/^[a-z]{4,6}$/.test(word) && new Set(word).size === word.length)
      assert.ok(eligible.has(word), `Unexpected dictionary exclusion: ${word}`);
  }
});

test('LAZY → THROW screenshot replay offers CUPIDS and CUSPID in the final round', () => {
  const { app } = load();
  app.state.racks = ['ZPSAGOYXIVLDEJT', 'ILEPTJNUXOWRHSF', 'CABXWPTSYDOUFRI'];
  app.state.words = ['lazy', 'throw', ''];
  assert.equal(app.validate('lazy', 0, true), '');
  assert.equal(app.validate('throw', 1, true), '');
  app.state.wave = 2;
  const results = app.rank().map(row => row.word);
  assert.ok(results.includes('cupids'));
  assert.ok(results.includes('cuspid'));
  for (const word of results) assert.equal(app.validate(word, 2, true), '');
  app.rejected.add('cupids');
  assert.ok(!app.rank().some(row => row.word === 'cupids'));
  assert.ok(app.rank().some(row => row.word === 'cuspid'));
});
