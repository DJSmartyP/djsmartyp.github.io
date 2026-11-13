const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '../spellinator-assist');

function load(rows) {
  const ctx = vm.createContext({ window: {}, localStorage: { getItem: () => null } });
  vm.runInContext(fs.readFileSync(path.join(root, 'words.js'), 'utf8'), ctx);
  if (rows) ctx.window.SPELL_WORDS = rows;
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  // Exercise the application's actual dictionary loading, filtering and ranking.
  vm.runInContext(inline.slice(0, inline.indexOf('function setError(')) +
    '\nglobalThis.app={state,rank,validate,words,rejected,accepted};})();', ctx);
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

test('unfamiliar words and future answers count equally; accepted status does not override preservation', () => {
  const { app } = load([
    ['throw', 1, 2], ['sixth', 50000, 1],
    ['cupids', 1, 2], ['cuspid', 1, 2], ['garden', 50000, 1]
  ]);
  app.state.wave = 1;
  app.state.racks[1] = 'THROWSIX';
  app.accepted.add('sixth');
  const ranked = app.rank();
  assert.equal(ranked[0].word, 'throw');
  assert.equal(ranked[0].sixLeft, 2);
  assert.equal(ranked[1].word, 'sixth');
  assert.equal(ranked[1].sixLeft, 1);
});

test('opening warns when surviving five- and six-letter words cannot form a disjoint pair', () => {
  const { app } = load([['lazy', 1, 2], ['throw', 1, 2], ['norths', 1, 2]]);
  app.state.racks[0] = 'LAZY';
  const [opening] = app.rank();
  assert.equal(opening.fiveLeft, 1);
  assert.equal(opening.sixLeft, 1);
  assert.equal(opening.continuation, false);
});

test('preserving a real continuation beats JYNX and a simple save-all-vowels rule', () => {
  const { app } = load([['lazy', 1, 2], ['jynx', 50000, 1], ['throw', 1, 2], ['jinxes', 1, 2]]);
  app.state.racks[0] = 'LAZYJNX';
  const [first, second] = app.rank();
  assert.equal(first.word, 'lazy');
  assert.equal(first.continuation, true);
  assert.equal(second.word, 'jynx');
  assert.equal(second.continuation, false);
});

test('random-wall results exactly match exhaustive full-dictionary search in all three rounds', t => {
  const { app } = load();
  let seed = 1132026;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const shuffle = input => {
    const chars = [...input];
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars;
  };
  let noMatch = 0, checkedWalls = 0;
  for (let attempt = 0; attempt < 60; attempt++) {
    app.state.words = ['', '', ''];
    for (let wave = 0; wave < 3; wave++) {
      app.state.wave = wave;
      const rack = [...shuffle('aeiou').slice(0, 4), ...shuffle('bcdfghjklmnpqrstvwxyz').slice(0, 11)];
      app.state.racks[wave] = rack.join('');
      const used = new Set(app.state.words.slice(0, wave).join(''));
      const expected = app.words.filter(entry => entry.word.length === wave + 4 &&
        [...entry.word].every(letter => rack.includes(letter) && !used.has(letter))).map(entry => entry.word).sort();
      const actual = app.rank();
      checkedWalls++;
      assert.deepEqual(Array.from(actual, entry => entry.word).sort(), Array.from(expected));
      if (wave === 1 && actual.length) {
        const counts = actual.map(entry => app.words.filter(future => future.word.length === 6 &&
          [...future.word].every(letter => !used.has(letter) && !entry.word.includes(letter))).length);
        assert.equal(actual[0].sixLeft, Math.max(...counts));
      }
      if (!actual.length) { noMatch++; break; }
      app.state.words[wave] = actual[0].word;
    }
  }
  // Arbitrary future walls may have no solution even with a complete dictionary.
  assert.ok(noMatch > 0);
  t.diagnostic(`${checkedWalls} walls checked; ${noMatch} attempts had a wall with no legal dictionary match.`);
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
