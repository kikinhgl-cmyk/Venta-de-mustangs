// ======================= app.js =======================

// ======================================================
// 🎨 EFECTO DEGRADADO HSL CON MOUSE MOVE (GRIS/AZUL MARINO)
// ======================================================

document.addEventListener('mousemove', (e) => {
    // Obtenemos la altura total de la ventana (para la escala)
    const viewportHeight = window.innerHeight;
    
    // Obtenemos la posición vertical del ratón (Y), normalizada de 0 a 1
    // Si Y es 0 (arriba), L es alto (claro). Si Y es viewportHeight (abajo), L es bajo (oscuro).
    const normalizedY = e.clientY / viewportHeight;
    
    // Mapeamos el rango de luminosidad (L) a un rango invertido:
    // 0.8 (muy claro/gris) cuando el ratón está arriba -> 0.1 (muy oscuro/negro) cuando está abajo.
    // Esto crea la escala de grises y tonos oscuros.
    const luminosity = (1 - normalizedY) * 70; // Rango de 0 a 70
    
    // Mapeamos el rango de Saturación (S) para mantenerlo bajo (grisáceo/apagado):
    // 0 (desaturado/gris) cuando está en el centro -> 15 (sutil azul marino) en los extremos.
    // La saturación varía un poco para introducir el azul marino sutilmente.
    const saturation = 10 + Math.abs(normalizedY - 0.5) * 10; // Rango aprox. 10% a 15%
    
    // Matiz (H): 240 es azul. Con saturación baja, se ve gris o azul marino oscuro/negro.
    const hue = 240; 
    
    // Generamos el color HSL
    const color = ⁠ hsl(${hue}, ${saturation}%, ${luminosity}%) ⁠;
    
    // Aplicamos al fondo del body
    document.body.style.backgroundColor = color;
});

// ======================================================
// /🎨 EFECTO DEGRADADO HSL CON MOUSE MOVE (GRIS/AZUL MARINO)
// ======================================================


// Chicos: lógica del "Hacer pedido" para playeras.
// Lee el formulario, calcula total (modelo * cantidad + extras + envío)
// y muestra un resumen. Está escrito paso a paso y con comentarios.

/** Utilidad: formatea a moneda MXN */
function toMXN(num) {
  return Number(num || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

/** Utilidad: toma precio desde data-precio (en selects/checks) */
function getPrecioFromDataset(el) {
  const raw = el?.dataset?.precio;
  return raw ? Number(raw) : 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos que usaremos:
  const form = document.getElementById('formPedido');
  const outNombre = document.getElementById('outNombre');
  const outLista  = document.getElementById('outLista');
  const outTotal  = document.getElementById('outTotal');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const confirmNombre = document.getElementById('confirmNombre');

  // Toast UX (aviso corto)
  const toastBtn = document.getElementById('btnToast');
  const toastEl  = document.getElementById('toastAviso');
  const toast    = bootstrap.Toast.getOrCreateInstance(toastEl);
  toastBtn.addEventListener('click', () => toast.show());

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recargar la página

    // 1) Leemos campos base
    const nombre = document.getElementById('nombreCliente').value.trim();
    const selModelo = document.getElementById('selModelo');
    const selTalla  = document.getElementById('selTalla');
    const selColor  = document.getElementById('selColor');
    const cantidad  = Number(document.getElementById('inpCantidad').value || 0);

    // Validación mínima:
    if (!nombre || !selModelo.value || !selTalla.value || !selColor.value || cantidad < 1) {
      alert('Completa nombre, modelo, talla, color y cantidad (mínimo 1).');
      return;
    }

    // 2) Precios base
    const optModelo = selModelo.options[selModelo.selectedIndex];
    const precioModelo = getPrecioFromDataset(optModelo); // precio unitario del modelo
    let total = precioModelo * cantidad;

    // 3) Extras / personalización
    const chkNombreNumero = document.getElementById('chkNombreNumero');
    const chkParcheLiga   = document.getElementById('chkParcheLiga');

    const extrasSeleccionados = [];
    if (chkNombreNumero.checked) {
      total += getPrecioFromDataset(chkNombreNumero) * cantidad; // costo por prenda
      extrasSeleccionados.push('Nombre y número');
    }
    if (chkParcheLiga.checked) {
      total += getPrecioFromDataset(chkParcheLiga) * cantidad; // costo por prenda
      extrasSeleccionados.push('Parche de liga');
    }

    // Campos condicionales (solo se muestran en resumen si tienen contenido)
    const inpNombre = document.getElementById('inpNombre').value.trim();
    const inpNumero = document.getElementById('inpNumero').value.trim();

    // 4) Envío e instrucciones
    const selEnvio = document.getElementById('selEnvio');
    const optEnvio = selEnvio.options[selEnvio.selectedIndex];
    const costoEnvio = getPrecioFromDataset(optEnvio);
    total += costoEnvio;

    const txtInstr = document.getElementById('txtInstrucciones').value.trim();

    // 5) Pintamos resumen
    outNombre.textContent = nombre;

    // Lista HTML del pedido
    outLista.innerHTML = `
      <li><strong>Modelo:</strong> ${selModelo.value} — ${toMXN(precioModelo)} c/u × ${cantidad}</li>
      <li><strong>Talla:</strong> ${selTalla.value}</li>
      <li><strong>Color:</strong> ${selColor.value}</li>
      <li><strong>Extras:</strong> ${extrasSeleccionados.length ? extrasSeleccionados.join(', ') : 'Ninguno'}</li>
      ${inpNombre || inpNumero ? ⁠ <li><strong>Personalización:</strong> ${inpNombre ? 'Nombre: ' + inpNombre : ''} ${inpNumero ? ' | Número: ' + inpNumero : ''}</li> ⁠ : ''}
      <li><strong>Envío:</strong> ${selEnvio.value} — ${toMXN(costoEnvio)}</li>
      ${txtInstr ? ⁠ <li><strong>Instrucciones:</strong> ${txtInstr}</li> ⁠ : ''}
    `;

    outTotal.textContent = toMXN(total);

    // Habilitamos confirmar y pasamos nombre al modal
    btnConfirmar.disabled = false;
    confirmNombre.textContent = nombre;
  });

  // Reset: limpiar también el resumen
  form.addEventListener('reset', () => {
    setTimeout(() => {
      outNombre.textContent = '—';
      outLista.innerHTML = '<li class="text-muted">Aún no has generado tu pedido.</li>';
      outTotal.textContent = '$0';
      btnConfirmar.disabled = true;
    }, 0);
  });
});
// ===================== /app.js ======================


// ================== Actividades DOM (Banner, Testimonios, Contacto) ==================
document.addEventListener('DOMContentLoaded', () => {
  // -------- Actividad 1: Banner con getElementById --------
  // Chicos: selecciono el banner por ID y el botón de demo.
  const banner = document.getElementById('banner');
  const btnPromo = document.getElementById('btnPromo');

  // Al hacer clic, cambio clases de Bootstrap (ej. bg-dark -> bg-warning).
  btnPromo?.addEventListener('click', () => {
    // Limpio posibles fondos previos del banner
    banner.classList.remove('bg-dark', 'bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning');
    // Aplico un nuevo color de fondo (warning = amarillo)
    banner.classList.add('bg-warning');
    // Ajusto contraste del texto
    banner.classList.remove('text-white');
    banner.classList.add('text-dark');
  });

  // -------- Actividad 2: Testimonios --------
  // 2.1 VIP en azul (text-primary) usando getElementsByClassName
  // Chicos: HTML marca VIP con .testimonio-vip; aquí iteramos y estilizamos.
  const vipItems = document.getElementsByClassName('testimonio-vip');
  for (const item of vipItems) {
    item.classList.add('text-primary'); // color azul Bootstrap
  }

  // 2.2 TODOS los párrafos en rojo (text-danger) usando getElementsByTagName
  // OJO: esto afecta toda la página como pide la actividad.
  // Si solo quieres afectar la sección de testimonios, usa la línea comentada.
  const allParagraphs = document.getElementsByTagName('p');
  // const allParagraphs = document.querySelectorAll('#testimonios p'); // <- opción localizada
  for (const p of allParagraphs) {
    p.classList.add('text-danger');
  }

  // -------- Actividad 3: Formulario de contacto --------
  // 3.1 Primer input de texto con querySelector (le pongo bg-success para resaltarlo)
  // Chicos: querySelector toma el primer match del selector CSS dado.
  const firstTextInput = document.querySelector('#formContacto input[type="text"]');
  firstTextInput?.classList.add('bg-success', 'bg-opacity-10'); // fondo verdoso suave

  // 3.2 Todos los botones del formulario a btn-danger con querySelectorAll
  const contactoButtons = document.querySelectorAll('#formContacto button');
  contactoButtons.forEach(btn => {
    // Quito estilos previos "suaves" y paso a rojo Bootstrap
    btn.classList.remove('btn-primary', 'btn-outline-secondary');
    btn.classList.add('btn-danger');
  });

  // 3.3 Campo "nombre" via getElementsByName -> color de texto text-warning
  // Chicos: getElementsByName devuelve una NodeList por atributo name.
  const nombreInputs = document.getElementsByName('nombre');
  if (nombreInputs.length > 0) {
    const nombreInput = nombreInputs[0];
    nombreInput.classList.add('text-warning'); // texto del input en amarillo
    // Opcional: también pinto el <label> asociado
    const label = document.querySelector('label[for="cNombre"]');
    label?.classList.add('text-warning');
  }
});