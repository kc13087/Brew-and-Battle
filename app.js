const orders = [
  { name: 'Honey Hearth Tea', ingredients: ['Honey', 'Moonleaf'], icon: '🟢', guest: 'Moss Munchkin', line: '“Something warm, please!”' },
  { name: 'Berrybolt Fizz', ingredients: ['Starberry', 'Moonleaf'], icon: '🧚', guest: 'Dewdrop Sprite', line: '“Make it bright and bubbly!”' },
  { name: 'Golden Glow Cocoa', ingredients: ['Honey', 'Starberry'], icon: '🦔', guest: 'Hedgeknight', line: '“A brave cup for a brave knight.”' }
];
const pantry = [{ name: 'Honey', icon: '🍯' }, { name: 'Moonleaf', icon: '🌿' }, { name: 'Starberry', icon: '🫐' }];
let orderIndex = 0;
let selected = [];
let patience = 100;
let timer;

const $ = (id) => document.getElementById(id);
const screens = ['home-screen', 'battle-screen', 'result-screen'];
function showScreen(id) { screens.forEach((screen) => { const el = $(screen); el.hidden = screen !== id; el.classList.toggle('active', screen === id); }); }
function sameRecipe() { return selected.length === 2 && [...selected].sort().join('|') === [...orders[orderIndex].ingredients].sort().join('|'); }
function renderOrder() {
  const order = orders[orderIndex]; selected = []; patience = 100;
  $('round-badge').textContent = `${orderIndex + 1} / ${orders.length}`;
  $('order-name').textContent = order.name; $('enemy-art').textContent = order.icon; $('enemy-name').textContent = order.guest; $('enemy-line').textContent = order.line;
  $('recipe-chips').innerHTML = order.ingredients.map((ingredient) => `<span class="chip">${pantry.find((item) => item.name === ingredient).icon} ${ingredient}</span>`).join('');
  $('ingredient-list').innerHTML = pantry.map((item) => `<button class="ingredient" type="button" data-name="${item.name}" aria-pressed="false"><b>${item.icon}</b><span>${item.name}</span></button>`).join('');
  $('brew-status').textContent = 'Choose ingredients to brew.'; $('cauldron-glow').className = 'cauldron-big'; updateSelection();
  document.querySelectorAll('.ingredient').forEach((button) => button.addEventListener('click', () => toggleIngredient(button.dataset.name)));
  clearInterval(timer); timer = setInterval(tickPatience, 1000);
}
function toggleIngredient(name) { if (selected.includes(name)) selected = selected.filter((item) => item !== name); else if (selected.length < 2) selected.push(name); updateSelection(); }
function updateSelection() { document.querySelectorAll('.ingredient').forEach((button) => { const on = selected.includes(button.dataset.name); button.classList.toggle('selected', on); button.setAttribute('aria-pressed', on); }); $('selection-count').textContent = `${selected.length} / 2`; const ready = selected.length === 2; $('serve-button').disabled = !ready; $('cauldron-glow').classList.toggle('ready', ready); $('brew-status').textContent = ready ? 'The cauldron is ready to serve!' : 'Choose ingredients to brew.'; }
function tickPatience() { patience = Math.max(0, patience - 4); $('patience-bar').style.width = `${patience}%`; if (patience === 0) finish(false); }
function serve() { if (!sameRecipe()) { patience = Math.max(0, patience - 28); $('patience-bar').style.width = `${patience}%`; $('brew-status').textContent = 'That recipe fizzled. Try again!'; selected = []; updateSelection(); if (!patience) finish(false); return; } $('cauldron-glow').classList.add('success'); clearInterval(timer); setTimeout(() => { orderIndex += 1; if (orderIndex === orders.length) finish(true); else renderOrder(); }, 550); }
function finish(won) { clearInterval(timer); $('result-icon').textContent = won ? '✦' : '☁'; $('result-kicker').textContent = won ? 'LEVEL COMPLETE' : 'THE GUEST WANDERED OFF'; $('result-title').textContent = won ? 'The café cheers!' : 'A new brew awaits.'; $('result-copy').textContent = won ? 'You served three forest friends exactly what they needed.' : 'No worries — a little practice makes every potion brighter.'; $('reward-value').textContent = won ? '+6' : '+1'; showScreen('result-screen'); }
$('start-button').addEventListener('click', () => { orderIndex = 0; renderOrder(); showScreen('battle-screen'); });
$('serve-button').addEventListener('click', serve);
$('quit-button').addEventListener('click', () => { clearInterval(timer); showScreen('home-screen'); });
$('continue-button').addEventListener('click', () => showScreen('home-screen'));
