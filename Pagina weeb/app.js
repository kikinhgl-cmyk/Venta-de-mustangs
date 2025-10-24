// ===== EFECTO DEGRADADO HSL CON MOUSE MOVE =====
document.addEventListener('mousemove', (e) => {
    const viewportHeight = window.innerHeight;
    const normalizedY = e.clientY / viewportHeight;
    const luminosity = (1 - normalizedY) * 70;
    const saturation = 10 + Math.abs(normalizedY - 0.5) * 10;
    const hue = 240;
    const color = `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
    document.body.style.backgroundColor = color;
});

// ===== CARRITO =====
let carrito = [];
const btnCarrito = document.getElementById('btnCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const totalCarritoEl = document.getElementById('totalCarrito');
const cantidadCarritoEl = document.getElementById('cantidadCarrito');

function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;
  carrito.forEach((item, i) => {
    total += item.precio;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${item.nombre} <span>${item.precio.toLocaleString('es-MX', {style:'currency',currency:'MXN'})}</span>
      <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDelCarrito(${i})">X</button>
    `;
    listaCarrito.appendChild(li);
  });
  totalCarritoEl.textContent = total.toLocaleString('es-MX', {style:'currency',currency:'MXN'});
  cantidadCarritoEl.textContent = carrito.length;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Agregar productos al carrito
document.querySelectorAll('.agregar-carrito').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card-body');
    const nombre = card.querySelector('h2, h5').textContent;
    const precio = Number(card.querySelector('[data-precio]').dataset.precio);
    carrito.push({nombre, precio});
    actualizarCarrito();
    const carritoModal = new bootstrap.Modal(document.getElementById('modalCarrito'));
    carritoModal.show();
  });
});

// Comprar
document.getElementById('btnComprar').addEventListener('click', () => {
  if(carrito.length === 0) return alert('El carrito está vacío');
  alert('Gracias por tu compra!');
  carrito = [];
  actualizarCarrito();
  bootstrap.Modal.getInstance(document.getElementById('modalCarrito')).hide();
});