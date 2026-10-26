'use strict';

const $ = id => document.getElementById(id);
const C = JAGCatalogue;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const money = p => new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP'}).format(p / 100);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const storageKey = 'jag-snack-planner-v2';

function monday() {
  const date = new Date();
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const blankDays = () => Array.from({length:5}, () => ({count:15, recipe:'', fruit:''}));
const fresh = () => ({club:'', weekDate:monday(), session:'after', days:blankDays(), breakfastDays:blankDays(), excluded:[], budget:'', weeks:4, method:'delivery', deliveryFee:3.5, smallFee:5, threshold:50, portionPercent:100, buffer:0, products:{}, checked:[], generated:false});
let state = fresh();
let result = null;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && Array.isArray(saved.days) && saved.days.length === 5 && ['after','breakfast','both'].includes(saved.session)) {
    state = {...state, ...saved, excluded:Array.isArray(saved.excluded) ? saved.excluded.filter(id => C.products[id]) : [], products:saved.products && typeof saved.products === 'object' ? saved.products : {}, checked:Array.isArray(saved.checked) ? saved.checked : []};
    if (!Array.isArray(state.breakfastDays) || state.breakfastDays.length !== 5) state.breakfastDays = blankDays();
  }
} catch { /* Local storage can be unavailable. The planner still works. */ }

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    $('save-status').textContent = 'Saved on this device. No child names or shared accounts needed.';
  } catch {
    $('save-status').textContent = 'Device saving is unavailable. Download your PDFs before closing this page.';
  }
}
function renderAttendance(target, days, session) {
  $(target).innerHTML = `<h3>${session === 'breakfast' ? 'Breakfast club' : 'After-school club'}</h3>` + days.map((day, index) => `<label class="attendance-row"><span>${DAYS[index]}</span><input type="number" min="0" max="1000" step="1" required aria-label="${DAYS[index]} ${session} children" data-day="${index}" data-group="${target}" value="${esc(day.count)}"></label>`).join('');
}
function renderDays() {
  renderAttendance('days', state.days, state.session === 'breakfast' ? 'breakfast' : 'after');
  $('breakfast-days').hidden = state.session !== 'both';
  if (state.session === 'both') renderAttendance('breakfast-days', state.breakfastDays, 'breakfast');
}
function renderIngredients() {
  let group = '';
  const query=$('food-search').value.trim().toLowerCase();
  const matches=Object.entries(C.products).filter(([,product])=>product.name.toLowerCase().includes(query)).sort((a,b)=>a[1].group.localeCompare(b[1].group)||a[1].name.localeCompare(b[1].name));
  $('ingredient-count').textContent=`${matches.length} of ${Object.keys(C.products).length} approved foods shown`;
  $('exclusions').innerHTML = matches.map(([id, product]) => {
    const heading = group !== product.group ? `<h3>${esc(product.group)}</h3>` : '';
    group = product.group;
    return heading + `<label><input type="checkbox" data-exclude="${id}" ${state.excluded.includes(id) ? 'checked' : ''}><span>${esc(product.name)}</span></label>`;
  }).join('');
}
function renderProductEditor() {
  $('product-editor').innerHTML = Object.entries(C.products).map(([id, product]) => {
    const custom = state.products[id] || {};
    return `<div class="editor-item"><b>${esc(product.name)}</b><div class="editor-fields"><label>£ / pack<input aria-label="${esc(product.name)} pack price" data-product="${id}" data-prop="price" type="number" min="0" max="1000" step=".01" value="${custom.price ?? product.price}"></label><label>${esc(product.unit)} / pack<input aria-label="${esc(product.name)} pack quantity" data-product="${id}" data-prop="size" type="number" min=".01" max="100000" step=".01" value="${custom.size ?? product.size}"></label><label>Already have (${esc(product.unit)})<input aria-label="${esc(product.name)} stock" data-product="${id}" data-prop="stock" type="number" min="0" max="100000" step=".01" value="${custom.stock ?? 0}"></label></div></div>`;
  }).join('');
}
function showMessage(message) {
  $('invalid').textContent = message;
  $('invalid').hidden = !message;
}
function invalidate(message = 'Inputs changed. Generate a new plan to check the budget.') {
  state.generated = false;
  result = null;
  $('results').hidden = true;
  $('ready').hidden = false;
  $('ready').querySelector('p').textContent = message;
  showMessage('');
  persist();
}
function renderResults() {
  if (!result) return;
  $('ready').hidden = true;
  $('results').hidden = false;
  showMessage('');
  $('club-name').textContent = state.club;
  $('visits').textContent = `${result.children} child sessions`;
  $('weekly-total').textContent = money(result.total);
  $('food-total').textContent = money(result.food);
  $('delivery-total').textContent = money(result.delivery);
  $('small-total').textContent = money(result.surcharge);
  $('weekly-budget').textContent = money(result.weeklyBudget);
  $('projection').textContent = money(result.projection);
  $('budget-status').textContent = `${money(result.balance)} left across ${result.weeks} weeks`;
  $('menu-summary').innerHTML = DAYS.map((name, index) => {
    const sessions = state.session === 'both' ? ['breakfast','after'] : [state.session];
    return `<div class="menu-day"><h3>${name}</h3>${sessions.map(session => {
      const day = result.days.find(item => item.index === index && item.session === session);
      return `<div class="menu-line"><b>${session === 'breakfast' ? 'Breakfast' : 'After school'}</b><span>${day.count ? `${esc(day.recipe)} + ${esc(day.fruit)}` : 'Club closed'}<small>${day.count} children</small></span></div>`;
    }).join('')}</div>`;
  }).join('');
  let group = '';
  const buying = result.rows.filter(row => row.packs > 0);
  $('shopping-list').innerHTML = buying.map(row => {
    const heading = group !== row.group ? `<h3 class="group-title">${esc(row.group)}</h3>` : '';
    group = row.group;
    return heading + `<div class="shop-row"><input type="checkbox" data-purchased="${row.id}" aria-label="${esc(row.name)} bought" ${state.checked.includes(row.id) ? 'checked' : ''}><div><div class="product-name"><a href="${row.url}" target="_blank" rel="noopener">${esc(row.name)} ↗</a></div><small>${row.packs} × ${esc(row.pack)}</small><small>Need about ${Math.ceil(row.required)} ${esc(row.unit)}${row.stock ? `; already have ${row.stock} ${esc(row.unit)}` : ''}</small><small class="${row.checked && !row.customPrice ? '' : 'allowance'}">${row.customPrice ? 'Your price' : row.checked ? 'Tesco reference price' : 'Planning price allowance'}${row.availability ? ' · Check equivalent product' : ''}</small></div><div class="row-price">${money(row.total)}<small>${money(row.price)} / pack</small></div></div>`;
  }).join('');
  $('empty').hidden = buying.length > 0;
  $('list-subtitle').textContent = `${buying.reduce((sum, row) => sum + row.packs, 0)} full packs / items to buy.`;
}
function generate() {
  showMessage('');
  try {
    const plan = JAGPlanner.generate(state);
    if (plan.status !== 'ok') {
      const extra = plan.cheapest ? ` The lowest-cost menu found is about ${money(plan.cheapest.total)} per week, or ${money(plan.cheapest.projection)} for the period.` : '';
      throw new Error(`No menu fits ${money(Number(state.budget) * 100)} across ${state.weeks} weeks with the current attendance, exclusions and prices.${extra} Review the budget, attendance, fees or pack prices.`);
    }
    state.days = plan.days.map(({count, recipe, fruit}) => ({count, recipe, fruit}));
    state.breakfastDays = plan.breakfastDays.map(({count, recipe, fruit}) => ({count, recipe, fruit}));
    state.checked = [];
    state.generated = true;
    result = plan.result;
    renderResults();
    persist();
  } catch (error) {
    invalidate('Change an input and try generating again.');
    showMessage(error.message);
  }
}
function mount() {
  for (const id of ['club','weekDate','budget','weeks','deliveryFee','smallFee','threshold','portionPercent','buffer']) $(id).value = state[id];
  document.querySelector(`input[name="session"][value="${state.session}"]`).checked = true;
  document.querySelector(`input[name="method"][value="${state.method}"]`).checked = true;
  $('online-fees').hidden = state.method === 'store';
  for (const id of ['deliveryFee','smallFee','threshold']) $(id).disabled = state.method === 'store';
  renderDays();renderIngredients();renderProductEditor();
  if (state.generated) {
    try { result = JAGPlanner.calculate(state); if (result.projection <= result.budget && state.club.trim() && state.budget !== '') renderResults(); else invalidate(); }
    catch { invalidate(); }
  } else invalidate('Enter your details, then generate a menu and shopping list.');
}

$('planner-form').addEventListener('submit', event => {event.preventDefault();generate();});
$('food-search').addEventListener('input', renderIngredients);
$('planner-form').addEventListener('change', event => {
  const el = event.target;
  if (el.dataset.exclude) state.excluded = el.checked ? [...new Set([...state.excluded,el.dataset.exclude])] : state.excluded.filter(id=>id!==el.dataset.exclude);
  else if (el.dataset.day !== undefined) {
    const days = el.dataset.group === 'breakfast-days' ? state.breakfastDays : state.days;
    days[Number(el.dataset.day)].count = Number(el.value);
  } else if (el.dataset.product) {
    if (!el.checkValidity()) { el.reportValidity(); return; }
    state.products[el.dataset.product] = {...state.products[el.dataset.product], [el.dataset.prop]:Number(el.value)};
  } else if (el.name === 'session') state.session = el.value;
  else if (el.name === 'method') {
    state.method = el.value;
    state.threshold = state.method === 'collect' ? 25 : 50;
    state.deliveryFee = state.method === 'collect' ? 1.5 : state.method === 'delivery' ? 3.5 : 0;
    $('threshold').value = state.threshold;
    $('deliveryFee').value = state.deliveryFee;
    $('online-fees').hidden = state.method === 'store';
    for (const id of ['deliveryFee','smallFee','threshold']) $(id).disabled = state.method === 'store';
  } else if (el.id in state) state[el.id] = el.value;
  if (el.name === 'session') renderDays();
  invalidate();
});
$('apply-count').addEventListener('click', () => {
  if (!$('same-count').checkValidity()) { $('same-count').reportValidity(); return; }
  for (const day of [...state.days, ...state.breakfastDays]) day.count = Number($('same-count').value);
  renderDays();invalidate();
});
$('shopping-list').addEventListener('change', event => {
  const id = event.target.dataset.purchased;
  if (!id) return;
  state.checked = state.checked.filter(item => item !== id);
  if (event.target.checked) state.checked.push(id);
  persist();
});
function textReport() {
  const lines = [`JAG SNACK PLANNER - ${state.club}`, `Week commencing ${state.weekDate}`, `Budget ${money(result.budget)} / ${result.weeks} weeks`, `Weekly shop ${money(result.total)}; period forecast ${money(result.projection)}`, '', 'GENERATED MENU'];
  for (const day of result.days) lines.push(`${DAYS[day.index]} ${day.session === 'breakfast' ? 'breakfast' : 'after school'} (${day.count} children): ${day.recipe}${day.count ? ' + ' + day.fruit : ''}`);
  lines.push('', 'BUYING LIST');
  for (const row of result.rows.filter(item => item.packs > 0)) lines.push(`${row.packs} x ${row.name} (${row.pack}): ${money(row.total)}`);
  lines.push('', 'Check current prices, product labels, quantities and delivery fees before ordering.');
  return lines.join('\n');
}
function saveBlob(blob, name) {
  const a = document.createElement('a'), url = URL.createObjectURL(blob);
  a.href = url;a.download = name;a.click();setTimeout(() => URL.revokeObjectURL(url), 10000);
}
$('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(textReport());$('action-status').textContent = 'Buying list copied.'; }
  catch { $('action-status').textContent = 'Copy is unavailable here. Use Download text list instead.'; }
});
$('download').addEventListener('click', () => saveBlob(new Blob([textReport()], {type:'text/plain;charset=utf-8'}), 'JAG-Snack-Buying-List.txt'));
$('reset').addEventListener('click', () => {if (window.confirm('Reset the club, budget, ingredients, stock and generated plan saved on this device?')) {state = fresh();result = null;mount();}});
async function pdf(type) {
  const button = $(type === 'menu' ? 'menu-pdf' : 'shop-pdf');
  const status = $(type === 'menu' ? 'menu-pdf-status' : 'shop-pdf-status');
  if (!state.generated || !result || result.projection > result.budget) return;
  try {
    status.textContent = 'Preparing your PDF…';button.disabled = true;
    const bytes = await JAGPDF.create({state:JSON.parse(JSON.stringify(state)), result:JSON.parse(JSON.stringify(result)), type});
    const safeClub = state.club.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    saveBlob(new Blob([bytes], {type:'application/pdf'}), `JAG-${safeClub}-${type}-${state.weekDate}.pdf`);
    status.textContent = type === 'menu' ? 'Display menu PDF downloaded.' : 'Shopping list PDF downloaded.';
  } catch (error) {status.textContent = error.message;}
  finally {button.disabled = false;}
}
$('menu-pdf').addEventListener('click', () => pdf('menu'));
$('shop-pdf').addEventListener('click', () => pdf('shopping'));
window.JAGApp = {getState:() => JSON.parse(JSON.stringify(state)), getResult:() => result, generate};
mount();
