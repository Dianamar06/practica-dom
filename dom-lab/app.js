/* ══════════════════════════════════════════════════════════
   BLUSH RIOT — Drop Panel · app.js
   DOM: querySelector · textContent · setAttribute · classList
        createElement · prepend · append · remove · dataset
        delegación de eventos · localStorage · búsqueda local
══════════════════════════════════════════════════════════ */

// ────────────────────────────────────────────────────────
// Toast
// ────────────────────────────────────────────────────────
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}


// ════════════════════════════════════════════════════════
// DROP EN VITRINA — leer y actualizar contenido/atributos
// ════════════════════════════════════════════════════════

// Selección de elementos con querySelector
const titulo    = document.querySelector('#titulo');
const nota      = document.querySelector('#nota');          // article#nota
const texto     = document.querySelector('.nota__texto');
const idInterno = document.querySelector('#idInterno');
const imgNota   = document.querySelector('#imgNota');

const btnCambiarTitulo   = document.querySelector('#btnCambiarTitulo');
const btnToggleDestacado = document.querySelector('#btnToggleDestacado');
const btnCambiarImagen   = document.querySelector('#btnCambiarImagen');

// Leer data-id con dataset y mostrarlo con textContent
idInterno.textContent = nota.dataset.id;
console.log('[BLUSH RIOT] Drop activo:', titulo.textContent);
console.log('[BLUSH RIOT] Clases:', nota.className);

// Actualizar contenido con textContent
btnCambiarTitulo.addEventListener('click', () => {
  titulo.textContent = 'BOMBER RIOT JACKET';
  toast('Título actualizado · textContent');
});

// Alternar clase con classList.toggle()
btnToggleDestacado.addEventListener('click', () => {
  nota.classList.toggle('destacada');
  const on = nota.classList.contains('destacada');
  toast(on ? '✦ Drop destacado' : 'Destacado removido');
});

// Cambiar atributo src con setAttribute()
btnCambiarImagen.addEventListener('click', () => {
  const nueva = 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80';
  imgNota.setAttribute('src', nueva);
  imgNota.setAttribute('alt', 'Drop SS25 — segunda pieza');
  texto.textContent = 'Imagen actualizada desde el DOM con setAttribute. Descripción modificada con textContent.';
  toast('Imagen cambiada · setAttribute("src", …)');
});


// ════════════════════════════════════════════════════════
// CATÁLOGO — agregar y eliminar nodos · delegación de eventos
// ════════════════════════════════════════════════════════

const formAdd    = document.querySelector('#formAdd');
const inpTitulo  = document.querySelector('#inpTitulo');
const inpTag     = document.querySelector('#inpTag');
const lista      = document.querySelector('#lista');
const counter    = document.querySelector('#counter');
const emptyState = document.querySelector('#emptyState');

function actualizarUI() {
  const total = lista.querySelectorAll('.item').length;
  counter.textContent = total;
  counter.style.transform = 'scale(1.4)';
  setTimeout(() => counter.style.transform = 'scale(1)', 200);
  emptyState.classList.toggle('visible', total === 0);
}

// Crea un <li> usando createElement + textContent (sin innerHTML para datos del usuario)
function crearItem(tituloVal, tagVal) {
  const li = document.createElement('li');
  li.className = 'item';

  const info   = document.createElement('div');

  // .item__title — mismo nombre de clase que pide la práctica
  const strong = document.createElement('strong');
  strong.className = 'item__title';
  strong.textContent = tituloVal;           // textContent: seguro, no ejecuta HTML

  const meta   = document.createElement('div');
  meta.className = 'item__meta';

  // .pill — mismo nombre que pide la práctica
  const pill   = document.createElement('span');
  pill.className = 'pill';
  pill.textContent = tagVal;

  const fecha  = document.createElement('span');
  fecha.className = 'muted';
  fecha.textContent = `Creado: ${new Date().toLocaleString('es-MX')}`;

  meta.append(pill, fecha);
  info.append(strong, meta);

  const actions = document.createElement('div');
  actions.className = 'actions';

  const btnToggle = document.createElement('button');
  btnToggle.dataset.action = 'toggle';     // dataset en botón para delegación
  btnToggle.textContent = '★';
  btnToggle.title = 'Destacar';

  const btnDelete = document.createElement('button');
  btnDelete.dataset.action = 'delete';
  btnDelete.className = 'btn-remove';
  btnDelete.textContent = '✕';
  btnDelete.title = 'Eliminar';

  actions.append(btnToggle, btnDelete);
  li.append(info, actions);

  return li;
}

// Submit: agregar con prepend() — aparece al inicio
formAdd.addEventListener('submit', (e) => {
  e.preventDefault();
  const tituloVal = inpTitulo.value.trim();
  const tagVal    = inpTag.value.trim();
  if (!tituloVal || !tagVal) return;

  const item = crearItem(tituloVal, tagVal);
  lista.prepend(item);      // prepend: inserta al INICIO de la lista

  actualizarUI();
  formAdd.reset();
  inpTitulo.focus();
  toast(`"${tituloVal}" agregado`);
  guardarEnStorage();
});

// Delegación de eventos — un solo listener en <ul> para todos los botones
// Aprovecha el event bubbling: el clic sube del <button> al <ul>
lista.addEventListener('click', (e) => {
  const btn    = e.target.closest('button[data-action]');
  if (!btn) return;

  const li     = e.target.closest('.item');
  const action = btn.dataset.action;

  if (action === 'delete') {
    const nombre = li.querySelector('.item__title').textContent;
    li.remove();             // remove(): elimina el nodo del DOM
    actualizarUI();
    guardarEnStorage();
    toast(`"${nombre}" eliminado · remove()`);
  }

  if (action === 'toggle') {
    li.classList.toggle('destacada');
    toast(li.classList.contains('destacada') ? '✦ Drop destacado' : 'Destacado removido');
    guardarEnStorage();
  }
});


// ════════════════════════════════════════════════════════
// BÚSQUEDA LOCAL — evento input, filtrar por texto
// ════════════════════════════════════════════════════════

document.querySelector('#inpBuscar').addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  lista.querySelectorAll('.item').forEach(item => {
    const nombre = item.querySelector('.item__title').textContent.toLowerCase();
    const tag    = item.querySelector('.pill').textContent.toLowerCase();
    item.style.display = (nombre.includes(q) || tag.includes(q)) ? '' : 'none';
  });
});


// ════════════════════════════════════════════════════════
// PERSISTENCIA — localStorage
// ════════════════════════════════════════════════════════

const STORAGE_KEY = 'blushRiot_drops';

function guardarEnStorage() {
  const drops = Array.from(lista.querySelectorAll('.item')).map(li => ({
    titulo:    li.querySelector('.item__title').textContent,
    tag:       li.querySelector('.pill').textContent,
    destacada: li.classList.contains('destacada'),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drops));
}

function cargarDesdeStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { toast('No hay drops guardados.'); return; }
  const drops = JSON.parse(raw);
  lista.innerHTML = '';
  drops.forEach(({ titulo, tag, destacada }) => {
    const li = crearItem(titulo, tag);
    if (destacada) li.classList.add('destacada');
    lista.append(li);       // append: inserta al FINAL
  });
  actualizarUI();
  toast(`${drops.length} drops cargados`);
}

document.querySelector('#btnGuardar').addEventListener('click', () => {
  guardarEnStorage();
  toast('Drops guardados en localStorage ✓');
});
document.querySelector('#btnCargar').addEventListener('click', cargarDesdeStorage);
document.querySelector('#btnBorrarStorage').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  toast('Storage limpiado');
});

// Auto-cargar al abrir
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem(STORAGE_KEY)) cargarDesdeStorage();
});


// ════════════════════════════════════════════════════════
// SEGURIDAD DOM — innerHTML (inseguro) vs textContent (seguro)
// ════════════════════════════════════════════════════════

const inpXSS    = document.querySelector('#inpXSS');
const xssOutput = document.querySelector('#xssOutput');

// innerHTML: interpreta el string como HTML → puede ejecutar código malicioso
document.querySelector('#btnXSSInner').addEventListener('click', () => {
  xssOutput.innerHTML = inpXSS.value;
  xssOutput.style.borderColor = 'var(--pink-dim)';
  toast('⚠ innerHTML: el HTML se ejecutó tal cual');
});

// textContent: trata el string como texto plano → nunca ejecuta código
document.querySelector('#btnXSSText').addEventListener('click', () => {
  xssOutput.textContent = inpXSS.value;
  xssOutput.style.borderColor = 'var(--pink)';
  toast('✅ textContent: el código se muestra como texto');
});
