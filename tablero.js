/* ═══════════════════════════════════════════════════
   CideLankideak — Negotiation Board (Tablero)
   ═══════════════════════════════════════════════════

   ▶ CONFIG — fill these three after creating your free
     Supabase project (see SETUP-TABLERO.md).
     While they stay on the placeholder values, the board
     runs in DEMO mode: data is saved only in this browser
     (localStorage) so you can try it out before going live.
   ─────────────────────────────────────────────────── */
const SUPABASE_URL      = 'https://wfudzfkeqmxgnkfjcfih.supabase.co';      // e.g. https://abcd1234.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_3PDpjHxw4GJcEfaCmFS7fQ_wZizaaIq'; // the public "anon" key
const EDITOR_EMAIL      = 'cidelankideak@cidetec.es'; // the single shared editor account
const DEMO_PASSWORD     = 'cidetec';                // only used in DEMO mode

/* ─────────────────────────────────────────────────── */

const STAGES = [
  { key: 'proposed',    es: 'Planteado',               eu: 'Planteatua',        en: 'Raised' },
  { key: 'negotiating', es: 'En negociación',          eu: 'Negoziatzen',       en: 'Negotiating' },
  { key: 'awaiting',    es: 'Pendiente de respuesta',  eu: 'Erantzunaren zain', en: 'Awaiting response' },
  { key: 'agreed',      es: 'Acordado',                eu: 'Adostua',           en: 'Agreed' },
  { key: 'closed',      es: 'Cerrado',                 eu: 'Itxita',            en: 'Closed' },
];

const CATEGORIES = [
  { key: 'general',  es: 'General',     eu: 'Orokorra',     en: 'General' },
  { key: 'salary',   es: 'Salarios',    eu: 'Soldatak',     en: 'Wages' },
  { key: 'safety',   es: 'Seguridad',   eu: 'Segurtasuna',  en: 'Safety' },
  { key: 'schedule', es: 'Horarios',    eu: 'Ordutegiak',   en: 'Schedules' },
  { key: 'legal',    es: 'Legal',       eu: 'Legala',       en: 'Legal' },
];

// People a matter can be assigned to. Edit this list freely.
const ASSIGNEES = [
  'Sandra Rodríguez Salvador',
  'Amaia Narbarte',
  'Iratxe Meatza',
  'Vanesa González Saldibar',
  'Federica Santino',
  'Denis Sánchez Argoitia',
  'Ana Martiarena Iriarte',
  'Josu Manterola Matellanes',
  'Elena Iruin',
  'Marta Cazorla Soult',
  'Oihane Garrido',
  'Natalia Gutierrez Pérez de Eulate',
  'Saioa Menta',
];

const I18N = {
  es: {
    navHome: 'Inicio', navBoard: 'Tablero',
    boardTag: 'Estado de los temas',
    boardTitle: 'Temas con la dirección',
    boardSubtitle: 'Sigue en qué punto se encuentra cada asunto que el comité está tratando con la empresa.',
    login: 'Acceder', logout: 'Salir',
    loginTitle: 'Acceso miembros', passwordLabel: 'Contraseña',
    cancel: 'Cancelar', enter: 'Entrar',
    newCard: 'Nuevo tema', editCard: 'Editar tema',
    category: 'Categoría', date: 'Fecha', stage: 'Etapa',
    content: 'Contenido por idioma',
    phTitle: 'Título', phDesc: 'Descripción breve',
    delete: 'Eliminar', save: 'Guardar', add: 'Añadir tema',
    wrongPassword: 'Contraseña incorrecta.',
    needTitle: 'Escribe al menos el título en español.',
    confirmDelete: '¿Eliminar este tema?',
    statusDemo: 'Modo demo · solo en este navegador',
    statusEditing: 'Edición activada',
    saveError: 'No se pudo guardar. Inténtalo de nuevo.',
    assignee: 'Responsable', unassigned: 'Sin asignar',
    chatSub: 'Notas internas · solo visibles para miembros',
    yourName: 'Tu nombre', message: 'Mensaje', phMessage: 'Escribe una nota...',
    close: 'Cerrar', send: 'Enviar',
    noComments: 'Aún no hay notas internas.',
    needNameText: 'Escribe tu nombre y el mensaje.',
    visibleLabel: 'Visible para el público',
    hiddenBadge: 'Oculto', showCard: 'Hacer visible', hideCard: 'Ocultar al público',
  },
  eu: {
    navHome: 'Hasiera', navBoard: 'Taula',
    boardTag: 'Gaien egoera',
    boardTitle: 'Zuzendaritzarekiko gaiak',
    boardSubtitle: 'Jarraitu batzordeak enpresarekin lantzen ari den gai bakoitza zer egoeratan dagoen.',
    login: 'Sartu', logout: 'Irten',
    loginTitle: 'Kideen sarbidea', passwordLabel: 'Pasahitza',
    cancel: 'Utzi', enter: 'Sartu',
    newCard: 'Gai berria', editCard: 'Gaia editatu',
    category: 'Kategoria', date: 'Data', stage: 'Etapa',
    content: 'Edukia hizkuntzaka',
    phTitle: 'Izenburua', phDesc: 'Deskribapen laburra',
    delete: 'Ezabatu', save: 'Gorde', add: 'Gaia gehitu',
    wrongPassword: 'Pasahitz okerra.',
    needTitle: 'Idatzi gutxienez izenburua gaztelaniaz.',
    confirmDelete: 'Gai hau ezabatu?',
    statusDemo: 'Demo modua · nabigatzaile honetan soilik',
    statusEditing: 'Edizioa aktibatuta',
    saveError: 'Ezin izan da gorde. Saiatu berriro.',
    assignee: 'Arduraduna', unassigned: 'Esleitu gabe',
    chatSub: 'Barne oharrak · kideek soilik ikus ditzakete',
    yourName: 'Zure izena', message: 'Mezua', phMessage: 'Idatzi ohar bat...',
    close: 'Itxi', send: 'Bidali',
    noComments: 'Oraindik ez dago barne oharrik.',
    needNameText: 'Idatzi zure izena eta mezua.',
    visibleLabel: 'Publikoarentzat ikusgai',
    hiddenBadge: 'Ezkutatua', showCard: 'Ikusgai egin', hideCard: 'Publikoari ezkutatu',
  },
  en: {
    navHome: 'Home', navBoard: 'Board',
    boardTag: 'Status of matters',
    boardTitle: 'Matters with management',
    boardSubtitle: 'Track the stage of each matter the works council is discussing with the company.',
    login: 'Log in', logout: 'Log out',
    loginTitle: 'Members access', passwordLabel: 'Password',
    cancel: 'Cancel', enter: 'Enter',
    newCard: 'New matter', editCard: 'Edit matter',
    category: 'Category', date: 'Date', stage: 'Stage',
    content: 'Content per language',
    phTitle: 'Title', phDesc: 'Short description',
    delete: 'Delete', save: 'Save', add: 'Add matter',
    wrongPassword: 'Wrong password.',
    needTitle: 'Please write at least the Spanish title.',
    confirmDelete: 'Delete this matter?',
    statusDemo: 'Demo mode · this browser only',
    statusEditing: 'Editing enabled',
    saveError: 'Could not save. Please try again.',
    assignee: 'Assignee', unassigned: 'Unassigned',
    chatSub: 'Internal notes · visible to members only',
    yourName: 'Your name', message: 'Message', phMessage: 'Write a note...',
    close: 'Close', send: 'Send',
    noComments: 'No internal notes yet.',
    needNameText: 'Enter your name and message.',
    visibleLabel: 'Visible to the public',
    hiddenBadge: 'Hidden', showCard: 'Make visible', hideCard: 'Hide from public',
  },
};

const HOME_PAGE = { es: 'index.html', eu: 'eu.html', en: 'en.html' };

/* ── State ─────────────────────────────────────────── */
let lang     = 'es';
let editing  = false;
let cards    = [];
let supa     = null;            // Supabase client (null in demo mode)
const DEMO   = SUPABASE_URL.startsWith('YOUR_');
let editingId = null;           // card being edited (null = new)

const t = (k) => (I18N[lang] && I18N[lang][k]) || k;
const esc = (s) => (s || '').replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const initials = (name) => (name || '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ── Boot ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  const urlLang = new URLSearchParams(location.search).get('lang');
  lang = ['es','eu','en'].includes(urlLang) ? urlLang : (localStorage.getItem('boardLang') || 'es');

  if (!DEMO) {
    supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session } } = await supa.auth.getSession();
    editing = !!session;
  }

  buildStaticSelects();
  wireNav();
  wireLogin();
  wireCardModal();
  wireChat();
  wireEditToggle();

  document.body.classList.toggle('editing', editing);

  await loadCards();
  applyLang();
  render();

  if (!DEMO) subscribeRealtime();
});

/* ── Data access ───────────────────────────────────── */
async function loadCards() {
  if (DEMO) {
    const raw = localStorage.getItem('boardCards');
    cards = raw ? JSON.parse(raw) : seedDemo();
    if (!raw) saveDemo();
    return;
  }
  const { data, error } = await supa.from('board_cards').select('*').order('position');
  cards = error ? [] : data;
}

function saveDemo() { localStorage.setItem('boardCards', JSON.stringify(cards)); }

async function persistCard(card, isNew) {
  if (DEMO) {
    if (isNew) cards.push(card);
    else cards = cards.map(c => c.id === card.id ? card : c);
    saveDemo();
    return true;
  }
  const payload = { ...card };
  delete payload.created_at;
  if (isNew) delete payload.id;
  const q = isNew
    ? supa.from('board_cards').insert(payload).select().single()
    : supa.from('board_cards').update(payload).eq('id', card.id).select().single();
  const { data, error } = await q;
  if (error) return false;
  if (isNew) cards.push(data); else cards = cards.map(c => c.id === data.id ? data : c);
  return true;
}

async function deleteCard(id) {
  if (DEMO) { cards = cards.filter(c => c.id !== id); saveDemo(); return; }
  await supa.from('board_cards').delete().eq('id', id);
  cards = cards.filter(c => c.id !== id);
}

async function persistPositions(updates) {
  // updates: [{id, stage, position}]
  updates.forEach(u => {
    const c = cards.find(x => x.id === u.id);
    if (c) { c.stage = u.stage; c.position = u.position; }
  });
  if (DEMO) { saveDemo(); return; }
  await Promise.all(updates.map(u =>
    supa.from('board_cards').update({ stage: u.stage, position: u.position }).eq('id', u.id)
  ));
}

function subscribeRealtime() {
  supa.channel('board')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'board_cards' }, async () => {
      await loadCards();
      render();
      if ($('#chatModal').classList.contains('open')) renderChat();
    })
    .subscribe();
}

/* ── Rendering ─────────────────────────────────────── */
function render() {
  const board = $('#board');
  board.innerHTML = '';

  STAGES.forEach(stage => {
    const colCards = cards
      .filter(c => c.stage === stage.key && (editing || c.is_public !== false))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const col = document.createElement('div');
    col.className = 'board-col';
    col.innerHTML = `
      <div class="board-col-head">
        <span class="board-col-title">${esc(stage[lang])}</span>
        <span class="board-col-count">${colCards.length}</span>
      </div>
      <div class="board-list" data-stage="${stage.key}"></div>
      <button class="board-col-add" data-stage="${stage.key}">
        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>${esc(t('add'))}
      </button>`;
    const list = $('.board-list', col);
    colCards.forEach(c => list.appendChild(cardEl(c)));
    board.appendChild(col);
  });

  if (editing) enableDnD();
  $$('.board-col-add').forEach(b =>
    b.addEventListener('click', () => openCardModal(null, b.dataset.stage)));
}

function cardEl(c) {
  const el = document.createElement('div');
  el.className = `card cat-${c.category || 'general'}`;
  el.dataset.id = c.id;
  const cat = CATEGORIES.find(x => x.key === c.category) || CATEGORIES[0];
  const title = c[`title_${lang}`] || c.title_es || '';
  const desc  = c[`desc_${lang}`]  || c.desc_es  || '';
  const ccount = (c.comments || []).length;
  const hidden = c.is_public === false;
  if (editing && hidden) el.classList.add('card-hidden');
  const assigneeChip = (editing && c.assignee)
    ? `<div class="card-assignee"><span class="assignee-ava">${esc(initials(c.assignee))}</span>${esc(c.assignee)}</div>`
    : '';
  const hiddenBadge = (editing && hidden)
    ? `<span class="card-hidden-badge"><svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/></svg>${esc(t('hiddenBadge'))}</span>`
    : '';
  const eyeSvg = hidden
    ? `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/></svg>`
    : `<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
  el.innerHTML = `
    ${hiddenBadge}
    <span class="card-cat ${cat.key}"><span class="card-cat-dot"></span>${esc(cat[lang])}</span>
    <div class="card-title">${esc(title)}</div>
    ${desc ? `<div class="card-desc">${esc(desc)}</div>` : ''}
    ${assigneeChip}
    <div class="card-foot">
      <span class="card-date">${c.date ? formatDate(c.date) : ''}</span>
      <span class="card-actions">
        <button title="${esc(hidden ? t('showCard') : t('hideCard'))}" data-vis>${eyeSvg}</button>
        <button title="Chat" data-chat><svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg>${ccount ? `<span class="chat-count">${ccount}</span>` : ''}</button>
        <button title="Edit" data-edit><svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
      </span>
    </div>`;
  $('[data-edit]', el).addEventListener('click', (e) => { e.stopPropagation(); openCardModal(c.id); });
  $('[data-chat]', el).addEventListener('click', (e) => { e.stopPropagation(); openChat(c.id); });
  $('[data-vis]', el).addEventListener('click', (e) => { e.stopPropagation(); toggleVisibility(c.id); });
  el.addEventListener('dblclick', () => { if (editing) openCardModal(c.id); });
  return el;
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : (lang === 'eu' ? 'eu' : 'es'),
      { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
}

let sortables = [];
function enableDnD() {
  sortables.forEach(s => s.destroy());
  sortables = $$('.board-list').map(list => Sortable.create(list, {
    group: 'board',
    animation: 150,
    ghostClass: 'sortable-ghost',
    dragClass: 'sortable-drag',
    onEnd: onDragEnd,
  }));
}

async function onDragEnd(evt) {
  // Recompute positions for the two affected columns
  const affected = new Set([evt.from, evt.to]);
  const updates = [];
  affected.forEach(list => {
    const stage = list.dataset.stage;
    $$('.card', list).forEach((el, i) => updates.push({ id: el.dataset.id, stage, position: i }));
  });
  await persistPositions(updates);
  // refresh counts
  $$('.board-col').forEach(col => {
    const list = $('.board-list', col);
    $('.board-col-count', col).textContent = $$('.card', list).length;
  });
}

/* ── i18n / chrome ─────────────────────────────────── */
function applyLang() {
  document.documentElement.lang = lang;
  $('#langLabel').textContent = lang.toUpperCase();
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $('#navHome').setAttribute('href', HOME_PAGE[lang]);
  $('#navHomeLink').setAttribute('href', HOME_PAGE[lang]);

  // Legend
  $('#catLegend').innerHTML = CATEGORIES.map(c =>
    `<span class="dept-badge"><span class="dept-badge-dot ${c.key}"></span>${esc(c[lang])}</span>`).join('');

  // Selects
  $('#fldCategory').innerHTML = CATEGORIES.map(c => `<option value="${c.key}">${esc(c[lang])}</option>`).join('');
  $('#fldStage').innerHTML = STAGES.map(s => `<option value="${s.key}">${esc(s[lang])}</option>`).join('');
  $('#fldAssignee').innerHTML = `<option value="">${esc(t('unassigned'))}</option>` +
    ASSIGNEES.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');

  if ($('#chatModal').classList.contains('open')) renderChat();
  updateEditToggle();
  updateStatus();
}

function setLang(l) {
  lang = l;
  localStorage.setItem('boardLang', l);
  const url = new URL(location);
  url.searchParams.set('lang', l);
  history.replaceState(null, '', url);
  applyLang();
  render();
}

function updateStatus() {
  const s = $('#boardStatus');
  if (editing) { s.textContent = t('statusEditing'); s.classList.add('live'); }
  else if (DEMO) { s.textContent = t('statusDemo'); s.classList.remove('live'); }
  else { s.textContent = ''; s.classList.remove('live'); }
}

function updateEditToggle() {
  $('#editToggle').querySelector('span').textContent = editing ? t('logout') : t('login');
}

/* ── Wiring ────────────────────────────────────────── */
function buildStaticSelects() { /* options built in applyLang */ }

function wireNav() {
  const switcher = $('.lang-switcher');
  $('.lang-btn').addEventListener('click', (e) => { e.stopPropagation(); switcher.classList.toggle('open'); });
  document.addEventListener('click', () => switcher.classList.remove('open'));
  $$('.lang-dropdown a').forEach(a =>
    a.addEventListener('click', (e) => { e.preventDefault(); setLang(a.dataset.lang); switcher.classList.remove('open'); }));

  window.addEventListener('scroll', () => {
    $('nav').classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

function wireEditToggle() {
  $('#editToggle').addEventListener('click', async () => {
    if (editing) {            // log out
      editing = false;
      if (!DEMO) await supa.auth.signOut();
      document.body.classList.remove('editing');
      updateEditToggle(); updateStatus();
      await loadCards();   // re-fetch as public so hidden cards leave memory
      render();
    } else {
      openModal('#loginModal');
      $('#loginPassword').value = '';
      $('#loginError').textContent = '';
      setTimeout(() => $('#loginPassword').focus(), 50);
    }
  });
}

function wireLogin() {
  $('#loginSubmit').addEventListener('click', doLogin);
  $('#loginPassword').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
}

async function doLogin() {
  const pw = $('#loginPassword').value;
  const err = $('#loginError');
  if (DEMO) {
    if (pw === DEMO_PASSWORD) { onLoggedIn(); } else { err.textContent = t('wrongPassword'); }
    return;
  }
  const { error } = await supa.auth.signInWithPassword({ email: EDITOR_EMAIL, password: pw });
  if (error) { err.textContent = t('wrongPassword'); return; }
  onLoggedIn();
}

async function onLoggedIn() {
  editing = true;
  closeModal('#loginModal');
  document.body.classList.add('editing');
  updateEditToggle(); updateStatus();
  await loadCards();   // re-fetch as an authenticated member so hidden cards are included
  render();
}

function wireCardModal() {
  // language tabs inside editor
  $$('.modal-lang-tabs button').forEach(btn => btn.addEventListener('click', () => {
    $$('.modal-lang-tabs button').forEach(b => b.classList.remove('active'));
    $$('.modal-lang-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(`.modal-lang-pane[data-pane="${btn.dataset.tab}"]`).classList.add('active');
  }));
  $('#cardSave').addEventListener('click', saveCardFromModal);
  $('#cardDelete').addEventListener('click', async () => {
    if (editingId && confirm(t('confirmDelete'))) {
      await deleteCard(editingId);
      closeModal('#cardModal');
      render();
    }
  });
  $$('[data-close]').forEach(b => b.addEventListener('click', () => {
    $$('.modal-overlay').forEach(o => o.classList.remove('open'));
  }));
  $$('.modal-overlay').forEach(o => o.addEventListener('click', (e) => { if (e.target === o) closeModal('#' + o.id); }));
}

function openCardModal(id, presetStage) {
  editingId = id;
  const c = id ? cards.find(x => x.id === id) : null;
  $('#cardModalTitle').textContent = id ? t('editCard') : t('newCard');
  $('#cardDelete').style.display = id ? '' : 'none';
  $('#cardError').textContent = '';
  $('#fldCategory').value = c ? (c.category || 'general') : 'general';
  $('#fldStage').value    = c ? c.stage : (presetStage || STAGES[0].key);
  $('#fldAssignee').value = c ? (c.assignee || '') : '';
  $('#fldPublic').checked = c ? (c.is_public !== false) : true;
  $('#fldDate').value     = c && c.date ? c.date : '';
  ['es','eu','en'].forEach(l => {
    $(`#title_${l}`).value = c ? (c[`title_${l}`] || '') : '';
    $(`#desc_${l}`).value  = c ? (c[`desc_${l}`]  || '') : '';
  });
  openModal('#cardModal');
}

async function saveCardFromModal() {
  const titleEs = $('#title_es').value.trim();
  if (!titleEs) { $('#cardError').textContent = t('needTitle'); return; }

  const base = cards.find(x => x.id === editingId);
  const card = {
    id: editingId || (DEMO ? 'd' + Date.now() : undefined),
    category: $('#fldCategory').value,
    stage: $('#fldStage').value,
    assignee: $('#fldAssignee').value || null,
    is_public: $('#fldPublic').checked,
    date: $('#fldDate').value || null,
    position: base ? base.position : nextPosition($('#fldStage').value),
    title_es: titleEs, title_eu: $('#title_eu').value.trim(), title_en: $('#title_en').value.trim(),
    desc_es: $('#desc_es').value.trim(), desc_eu: $('#desc_eu').value.trim(), desc_en: $('#desc_en').value.trim(),
    comments: base ? (base.comments || []) : [],
  };
  const ok = await persistCard(card, !editingId);
  if (!ok) { $('#cardError').textContent = t('saveError'); return; }
  closeModal('#cardModal');
  render();
}

async function toggleVisibility(id) {
  const c = cards.find(x => x.id === id);
  if (!c) return;
  const next = c.is_public === false;   // hidden -> visible, visible -> hidden
  c.is_public = next;
  if (DEMO) { saveDemo(); }
  else {
    const { error } = await supa.from('board_cards').update({ is_public: next }).eq('id', id);
    if (error) { c.is_public = !next; alert(t('saveError')); return; }
  }
  render();
}

function nextPosition(stage) {
  const inStage = cards.filter(c => c.stage === stage);
  return inStage.length ? Math.max(...inStage.map(c => c.position ?? 0)) + 1 : 0;
}

/* ── Internal chat (members only) ──────────────────── */
let chatCardId = null;

function wireChat() {
  $('#chatSend').addEventListener('click', sendComment);
  $('#chatText').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendComment();
  });
}

function openChat(id) {
  chatCardId = id;
  $('#chatName').value = localStorage.getItem('chatName') || '';
  $('#chatText').value = '';
  $('#chatError').textContent = '';
  renderChat();
  openModal('#chatModal');
  setTimeout(() => $((localStorage.getItem('chatName') ? '#chatText' : '#chatName')).focus(), 50);
}

function renderChat() {
  const c = cards.find(x => x.id === chatCardId);
  if (!c) { closeModal('#chatModal'); return; }
  $('#chatModalTitle').textContent = c[`title_${lang}`] || c.title_es || '';
  const list = c.comments || [];
  const thread = $('#chatThread');
  thread.innerHTML = list.length
    ? list.map(m => `
        <div class="chat-msg">
          <div class="chat-msg-head">
            <span class="chat-msg-name">${esc(m.name)}</span>
            <span class="chat-msg-date">${esc(formatDateTime(m.at))}</span>
          </div>
          <div class="chat-msg-text">${esc(m.text)}</div>
        </div>`).join('')
    : `<p class="chat-empty">${esc(t('noComments'))}</p>`;
  thread.scrollTop = thread.scrollHeight;
}

async function sendComment() {
  const name = $('#chatName').value.trim();
  const text = $('#chatText').value.trim();
  const err = $('#chatError');
  if (!name || !text) { err.textContent = t('needNameText'); return; }
  err.textContent = '';
  localStorage.setItem('chatName', name);

  const c = cards.find(x => x.id === chatCardId);
  if (!c) return;
  // Pull the freshest comments first so we don't clobber a concurrent note
  let comments = (c.comments || []).slice();
  if (!DEMO) {
    const { data } = await supa.from('board_cards').select('comments').eq('id', chatCardId).single();
    if (data && Array.isArray(data.comments)) comments = data.comments.slice();
  }
  comments.push({ name, text, at: new Date().toISOString() });

  if (DEMO) {
    c.comments = comments; saveDemo();
  } else {
    const { error } = await supa.from('board_cards').update({ comments }).eq('id', chatCardId);
    if (error) { err.textContent = t('saveError'); return; }
    c.comments = comments;
  }
  $('#chatText').value = '';
  renderChat();
  render(); // refresh the count badge on the card
}

function formatDateTime(iso) {
  try {
    const loc = lang === 'en' ? 'en-GB' : (lang === 'eu' ? 'eu' : 'es');
    return new Date(iso).toLocaleString(loc, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function openModal(sel)  { $(sel).classList.add('open'); }
function closeModal(sel) { $(sel).classList.remove('open'); }

/* ── Demo seed ─────────────────────────────────────── */
function seedDemo() {
  return [
    { id:'d1', stage:'proposed', position:0, category:'salary', date:'2026-05-12',
      title_es:'Revisión salarial 2026', title_eu:'2026ko soldata berrikuspena', title_en:'2026 pay review',
      desc_es:'Propuesta de actualización según IPC.', desc_eu:'KPIaren araberako eguneratze proposamena.', desc_en:'Proposed update in line with inflation.' },
    { id:'d2', stage:'negotiating', position:0, category:'schedule', date:'2026-04-20',
      title_es:'Flexibilidad horaria', title_eu:'Ordutegi malgutasuna', title_en:'Flexible working hours',
      desc_es:'Entrada flexible y teletrabajo parcial.', desc_eu:'Sarrera malgua eta telelan partziala.', desc_en:'Flexible start and partial remote work.',
      assignee:'Denis Sánchez Argoitia',
      comments:[
        { name:'Denis', text:'RRHH pide una propuesta por escrito antes de la próxima reunión.', at:'2026-05-02T09:30:00.000Z' },
        { name:'Iratxe', text:'Preparo un borrador para el viernes.', at:'2026-05-02T11:05:00.000Z' },
      ] },
    { id:'d3', stage:'awaiting', position:0, category:'safety', date:'2026-03-30',
      title_es:'Evaluación de riesgos en laboratorio', title_eu:'Laborategiko arrisku ebaluazioa', title_en:'Lab risk assessment',
      desc_es:'A la espera del informe de prevención.', desc_eu:'Prebentzio txostenaren zain.', desc_en:'Awaiting the prevention report.' },
    { id:'d4', stage:'agreed', position:0, category:'general', date:'2026-02-15',
      title_es:'Calendario laboral 2026', title_eu:'2026ko lan egutegia', title_en:'2026 work calendar',
      desc_es:'Acordado con la dirección.', desc_eu:'Zuzendaritzarekin adostua.', desc_en:'Agreed with management.' },
  ];
}
