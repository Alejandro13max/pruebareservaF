/* =========================================================
   MULTI CANCHA - PWA
   ========================================================= */

let deporteActualFiltro = 'todos';
let reservaTimerInterval = null;
let segundosRestantes = 0;
let canchaActual = { nombre: '', foto: '', precioHora: 0, deporte: '' };

const deportesData = {
    futbol: { titulo: 'FÚTBOL',   icono: '<i class="fas fa-futbol"></i>', desc: 'Césped sintético de última generación para Fútbol 5, 7 y 11. Iluminación LED y vestuarios.' },
    futsal: { titulo: 'FUTSAL',   icono: '<i class="fas fa-futbol"></i>', desc: 'Canchas techadas con piso de parquet profesional. Ideal para torneos 5v5 sin preocuparte por el clima.' },
    padel:  { titulo: 'PÁDEL',    icono: '<i class="fas fa-table-tennis-paddle-ball"></i>', desc: 'Canchas techadas con cristal panorámico. Iluminación profesional.' },
    basquet:{ titulo: 'BÁSQUET',  icono: '<i class="fas fa-basketball-ball"></i>', desc: 'Piso de parquet profesional, aros reglamentarios y graderías. Torneos 3x3 o 5v5.' },
    tenis:  { titulo: 'TENIS',    icono: '<i class="fas fa-baseball-ball"></i>', desc: 'Canchas de arcilla y superficie dura con mantenimiento diario.' },
    voley:  { titulo: 'VÓLEY',    icono: '<i class="fas fa-volleyball-ball"></i>', desc: 'Canchas de arena fina para vóley playa y canchas techadas para indoor.' }
};

const canchasData = [
    { id:'f1', deporte:'futbol', nombre:'Fútbol 5 - Cancha 1', tipo:'SINTÉTICO', precio:80,  img:'img/futbol1.jpg' },
    { id:'f2', deporte:'futbol', nombre:'Fútbol 5 - Cancha 2', tipo:'SINTÉTICO', precio:80,  img:'img/futbol2.jpg' },
    { id:'f3', deporte:'futbol', nombre:'Fútbol 7 - Central',  tipo:'SINTÉTICO', precio:120, img:'img/futbol3.jpg' },
    { id:'f4', deporte:'futbol', nombre:'Fútbol 11 - Estadio', tipo:'CÉSPED',    precio:200, img:'img/futbol4.jpg' },
    { id:'f5', deporte:'futbol', nombre:'Fútbol 8 - Norte',    tipo:'SINTÉTICO', precio:150, img:'img/futbol5.jpg' },
    { id:'fs1', deporte:'futsal', nombre:'Futsal - Parquet 1', tipo:'PARQUET',   precio:90,  img:'img/futsal1.jpg' },
    { id:'fs2', deporte:'futsal', nombre:'Futsal - Parquet 2', tipo:'PARQUET',   precio:90,  img:'img/futsal2.jpg' },
    { id:'fs3', deporte:'futsal', nombre:'Futsal - Techada',   tipo:'TECHADA',   precio:100, img:'img/futsal3.jpg' },
    { id:'fs4', deporte:'futsal', nombre:'Futsal - Central',   tipo:'PARQUET',   precio:110, img:'img/futsal4.jpg' },
    { id:'fs5', deporte:'futsal', nombre:'Futsal - Sur',       tipo:'SINTÉTICO', precio:80,  img:'img/futsal5.jpg' },
    { id:'p1', deporte:'padel', nombre:'Pádel - Cristal 1', tipo:'TECHADA',     precio:90,  img:'img/padel1.jpg' },
    { id:'p2', deporte:'padel', nombre:'Pádel - Cristal 2', tipo:'TECHADA',     precio:90,  img:'img/padel2.jpg' },
    { id:'p3', deporte:'padel', nombre:'Pádel - Exterior',  tipo:'AIRE LIBRE',  precio:70,  img:'img/padel3.jpg' },
    { id:'p4', deporte:'padel', nombre:'Pádel - VIP',       tipo:'TECHADA VIP', precio:110, img:'img/padel4.jpg' },
    { id:'t1', deporte:'tenis', nombre:'Tenis - Arcilla 1', tipo:'ARCILLA', precio:80,  img:'img/tenis1.jpg' },
    { id:'t2', deporte:'tenis', nombre:'Tenis - Arcilla 2', tipo:'ARCILLA', precio:80,  img:'img/tenis2.jpg' },
    { id:'t3', deporte:'tenis', nombre:'Tenis - Dura',      tipo:'DURA',    precio:70,  img:'img/tenis3.jpg' },
    { id:'t4', deporte:'tenis', nombre:'Tenis - Indoor',    tipo:'TECHADA', precio:100, img:'img/tenis4.jpg' },
    { id:'b1', deporte:'basquet', nombre:'Básquet - Principal', tipo:'PARQUET',      precio:100, img:'img/basquet1.jpg' },
    { id:'b2', deporte:'basquet', nombre:'Básquet - Exterior',  tipo:'ASFALTO',      precio:50,  img:'img/basquet2.jpg' },
    { id:'b3', deporte:'basquet', nombre:'Básquet - 3x3',       tipo:'MEDIA CANCHA', precio:60,  img:'img/basquet3.jpg' },
    { id:'b4', deporte:'basquet', nombre:'Básquet - VIP',       tipo:'TECHADA',      precio:120, img:'img/basquet4.jpg' },
    { id:'v1', deporte:'voley', nombre:'Vóley - Playa 1', tipo:'ARENA',   precio:60, img:'img/voley1.jpg' },
    { id:'v2', deporte:'voley', nombre:'Vóley - Playa 2', tipo:'ARENA',   precio:60, img:'img/voley2.jpg' },
    { id:'v3', deporte:'voley', nombre:'Vóley - Indoor',  tipo:'TECHADA', precio:80, img:'img/voley3.jpg' },
    { id:'v4', deporte:'voley', nombre:'Vóley - Mixto',   tipo:'TECHADA', precio:70, img:'img/voley4.jpg' }
];

const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
  <rect width="100%" height="100%" fill="#1a2530"/>
  <text x="50%" y="50%" fill="#10b981" font-family="Arial" font-size="28" text-anchor="middle" dominant-baseline="middle">Imagen no disponible</text>
</svg>`);

function cambiarSeccion(idSeccion, elementoBoton = null) {
    document.querySelectorAll('.app-seccion').forEach(sec => sec.classList.remove('activa'));
    const sec = document.getElementById('sec-' + idSeccion);
    if (sec) sec.classList.add('activa');
    document.querySelectorAll('.nav-link-sidebar').forEach(nav => nav.classList.remove('active'));
    if (elementoBoton) elementoBoton.classList.add('active');
    cerrarPaneles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + idSeccion);
}

function cerrarPaneles() {
    document.getElementById('sidebarMenu').classList.remove('show');
    document.getElementById('panelDeporte').classList.remove('show');
    document.getElementById('overlay').style.display = 'none';
    document.body.classList.remove('no-scroll');
}

function abrirMenu() {
    document.getElementById('sidebarMenu').classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('no-scroll');
}

function verDeporte(deporte) {
    const data = deportesData[deporte];
    if (!data) return;
    document.getElementById('deporteTitulo').textContent = data.titulo;
    document.getElementById('deporteIcono').innerHTML = data.icono;
    document.getElementById('deporteDesc').textContent = data.desc;
    deporteActualFiltro = deporte;
    document.getElementById('panelDeporte').classList.add('show');
    document.getElementById('overlay').style.display = 'block';
    document.body.classList.add('no-scroll');
}

function filtrarYCambiarSeccion() {
    cerrarPaneles();
    cambiarSeccion('canchas');
    renderizarCanchas(deporteActualFiltro);
}

function renderizarDisciplinas() {
    const grid = document.getElementById('gridDisciplinas');
    const orden = ['futbol','futsal','padel','basquet','tenis','voley'];
    grid.innerHTML = orden.map(k => `
        <div class="col-6 col-md-4 col-lg-2">
            <div class="sport-box p-3 text-center" data-deporte="${k}" role="button" tabindex="0">
                ${deportesData[k].icono.replace('<i ', '<i class="fs-2 text-neon mb-2 d-block" ')}
                <h5 class="fw-bold m-0">${deportesData[k].titulo}</h5>
            </div>
        </div>
    `).join('');
}

function renderizarBotonesFiltro() {
    const cont = document.getElementById('botonesFiltro');
    const orden = ['futbol','futsal','padel','basquet','tenis','voley','todos'];
    cont.innerHTML = orden.map(k => {
        const label = k === 'todos' ? 'Todas' : deportesData[k].titulo;
        const icono = k === 'todos' ? '<i class="fas fa-list"></i>' : deportesData[k].icono;
        const btnClass = k === 'todos' ? 'btn-neon' : 'btn-outline-neon';
        return `<button class="btn ${btnClass} rounded-0 btn-tactil" data-filtro="${k}">
                    ${icono.replace('<i ', '<i class="me-2" ')} ${label}
                </button>`;
    }).join('');
}

/* COMPONENTE REUTILIZABLE:
   Renderizado del catálogo en la estructura CSS Grid (.catalogo-grid).
   Utiliza la función modular crearTarjetaComponente() para desacoplar los datos
   de la presentación HTML y encapsular estilos e interactividad de cada tarjeta. */
function renderizarCanchas(filtro) {
    const cont = document.getElementById('contenedorCanchas');
    const lista = canchasData.filter(c => filtro === 'todos' || c.deporte === filtro);
    if (!lista.length) {
        cont.innerHTML = `<div class="w-100 text-center py-5"><p class="text-muted">No hay canchas disponibles para este filtro.</p></div>`;
        return;
    }
    cont.innerHTML = lista.map(c => {
        if (typeof crearTarjetaComponente === 'function') {
            return crearTarjetaComponente(c);
        }
        return `
            <article class="card-item" data-id="${c.id}">
                <div class="card-item__media">
                    <img class="card-item__imagen" src="${c.img}" alt="${c.nombre}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
                    <span class="card-item__tag">${c.tipo}</span>
                    <span class="card-item__estado"><i class="fas fa-circle text-success me-1"></i>Disponible</span>
                </div>
                <div class="card-cuerpo card-item__cuerpo">
                    <div class="card-item__header">
                        <h3 class="card-item__titulo">${c.nombre}</h3>
                        <p class="card-item__subtitulo">${c.deporte.toUpperCase()} • ${c.tipo}</p>
                    </div>
                    <div class="card-item__pie">
                        <div class="card-item__precio-box">
                            <span class="card-item__precio">Bs. ${c.precio}</span>
                            <small class="card-item__precio-unidad">/hr</small>
                        </div>
                        <div class="card-item__acciones">
                            <button type="button" class="btn-simular card-item__btn-simular btn-tactil">Simular</button>
                            <button type="button" class="btn btn-neon rounded-0 btn-sm btn-reservar btn-tactil card-item__btn-reservar"
                                    data-nombre="${c.nombre}"
                                    data-foto="${c.img}"
                                    data-precio="${c.precio}"
                                    data-deporte="${c.deporte}">RESERVAR</button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function filtrarCanchas(deporte) {
    cambiarSeccion('canchas');
    renderizarCanchas(deporte);
}

function renderizarCalendario() {
    const grid = document.getElementById('calendarGrid');
    const eventos = { 15: 'event', 20: 'discount' };
    let html = '<div class="cal-box text-muted opacity-25">30</div><div class="cal-box text-muted opacity-25">31</div>';
    for (let i = 1; i <= 30; i++) {
        const tipo = eventos[i];
        const cls = tipo === 'event' ? 'event-day' : tipo === 'discount' ? 'discount-day' : '';
        const dot = tipo === 'event' ? '<span class="event-dot"></span>' : tipo === 'discount' ? '<span class="discount-dot"></span>' : '';
        html += `<div class="cal-box ${cls}">${i}${dot}</div>`;
    }
    grid.innerHTML = html;
}

function mostrarToast(msg, tipo = 'success') {
    const icon = document.getElementById('toastIcon');
    if (tipo === 'success') icon.className = 'fas fa-check-circle text-neon fs-4';
    else if (tipo === 'warning') icon.className = 'fas fa-exclamation-triangle text-warning fs-4';
    else icon.className = 'fas fa-info-circle text-info fs-4';
    document.getElementById('toastMsg').textContent = msg;
    const box = document.getElementById('toastBox');
    box.classList.add('show');
    clearTimeout(box._t);
    box._t = setTimeout(() => box.classList.remove('show'), 3000);
}

/* ---------- MODAL Y PRECIOS DINÁMICOS ---------- */

// Actualiza el resumen de pago según las opciones seleccionadas
function actualizarPrecio() {
    const horas = parseInt(document.getElementById('selectHoras').value, 10);
    const precioBase = canchaActual.precioHora;
    
    // Calcular cancha
    const totalCancha = precioBase * horas;
    document.getElementById('precioCancha').textContent = `Bs. ${totalCancha}`;

    // Calcular extras
    let totalExtras = 0;
    document.querySelectorAll('#formReserva .form-check-input:checked').forEach(checkbox => {
        totalExtras += parseInt(checkbox.dataset.precio, 10);
    });
    document.getElementById('precioExtras').textContent = `Bs. ${totalExtras}`;

    // Total
    document.getElementById('precioTotal').textContent = `Bs. ${totalCancha + totalExtras}`;
}

function abrirModalReserva(nombre, foto, precio, deporte) {
    canchaActual = { nombre, foto, precioHora: precio, deporte };
    
    document.getElementById('modalNombreCancha').textContent = nombre;
    const img = document.getElementById('modalImgCancha');
    img.src = foto;
    img.onerror = () => { img.onerror = null; img.src = FALLBACK_IMG; };
    
    // Reiniciar formulario y opciones
    document.getElementById('formReserva').reset();
    document.getElementById('errorNombre').textContent = '';
    
    // Adaptar el texto del extra (balón/pelota) según deporte
    const labelBalon = document.querySelector('label[for="extraBalon"]');
    if (deporte === 'tenis' || deporte === 'padel' || deporte === 'voley') {
        labelBalon.innerHTML = '<i class="fas fa-baseball-ball text-neon me-1"></i> Alquilar pelota <span class="text-muted small">(+ Bs. 15)</span>';
    } else {
        labelBalon.innerHTML = '<i class="fas fa-futbol text-neon me-1"></i> Alquilar balón <span class="text-muted small">(+ Bs. 15)</span>';
    }

    // Mostrar/Ocultar chalecos (solo fútbol, futsal, básquet)
    const boxChalecos = document.getElementById('boxChalecos');
    if (['futbol', 'futsal', 'basquet'].includes(deporte)) {
        boxChalecos.style.display = 'block';
    } else {
        boxChalecos.style.display = 'none';
        document.getElementById('extraChalecos').checked = false;
    }

    // Adaptar opciones de jugadores según deporte
    const selectJugadores = document.getElementById('selectJugadores');
    if (deporte === 'tenis' || deporte === 'padel') {
        selectJugadores.innerHTML = `
            <option value="2">2 personas (1v1)</option>
            <option value="4">4 personas (2v2)</option>
        `;
    } else if (deporte === 'voley') {
        selectJugadores.innerHTML = `
            <option value="6">6 personas (3v3)</option>
            <option value="12">12 personas (6v6)</option>
        `;
    } else {
        selectJugadores.innerHTML = `
            <option value="10">10 personas (5v5)</option>
            <option value="14">14 personas (7v7)</option>
            <option value="22">22 personas (11v11)</option>
            <option value="4">4 personas (2v2)</option>
        `;
    }

    actualizarPrecio();
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalReserva'));
    modal.show();
}

function iniciarTemporizador(segundos, datos) {
    detenerTemporizador();
    segundosRestantes = segundos;
    localStorage.setItem('reservaActiva', JSON.stringify({ ...datos, fin: Date.now() + segundos * 1000 }));
    actualizarReloj();
    reservaTimerInterval = setInterval(() => {
        segundosRestantes--;
        actualizarReloj();
        if (segundosRestantes <= 0) {
            detenerTemporizador();
            finalizarReserva();
            mostrarToast('Tu reserva ha finalizado', 'info');
        }
    }, 1000);
}

function detenerTemporizador() {
    if (reservaTimerInterval) { clearInterval(reservaTimerInterval); reservaTimerInterval = null; }
}

function actualizarReloj() {
    const h = Math.floor(segundosRestantes / 3600);
    const m = Math.floor((segundosRestantes % 3600) / 60);
    const s = segundosRestantes % 60;
    document.getElementById('reservaTimer').textContent =
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function finalizarReserva() {
    detenerTemporizador();
    localStorage.removeItem('reservaActiva');
    document.getElementById('detalleReserva').style.display = 'none';
    document.getElementById('vacioReserva').style.display = 'block';
}

function restaurarReservaGuardada() {
    const raw = localStorage.getItem('reservaActiva');
    if (!raw) return;
    try {
        const r = JSON.parse(raw);
        const restante = Math.max(0, Math.floor((r.fin - Date.now()) / 1000));
        if (restante <= 0) { localStorage.removeItem('reservaActiva'); return; }
        document.getElementById('reservaNombre').textContent = r.nombre;
        document.getElementById('reservaCliente').textContent = r.cliente;
        document.getElementById('reservaFecha').textContent = r.fecha;
        document.getElementById('reservaExtras').textContent = r.extras;
        const img = document.getElementById('reservaFoto');
        img.src = r.foto;
        img.onerror = () => { img.onerror = null; img.src = FALLBACK_IMG; };
        document.getElementById('vacioReserva').style.display = 'none';
        document.getElementById('detalleReserva').style.display = 'block';
        iniciarTemporizador(restante, r);
    } catch (e) {
        localStorage.removeItem('reservaActiva');
    }
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', () => {
    renderizarDisciplinas();
    renderizarBotonesFiltro();
    renderizarCanchas('todos');
    renderizarCalendario();

    document.getElementById('btnAbrirMenu').addEventListener('click', abrirMenu);
    document.getElementById('btnCerrarMenu').addEventListener('click', cerrarPaneles);
    document.getElementById('btnCerrarDeporte').addEventListener('click', cerrarPaneles);
    document.getElementById('overlay').addEventListener('click', cerrarPaneles);
    document.getElementById('btnHome').addEventListener('click', () => cambiarSeccion('inicio'));
    document.getElementById('btnVerCanchasDeporte').addEventListener('click', filtrarYCambiarSeccion);

    document.querySelectorAll('.nav-link-sidebar[data-seccion]').forEach(link => {
        link.addEventListener('click', e => { e.preventDefault(); cambiarSeccion(link.dataset.seccion, link); });
    });
    document.querySelectorAll('.nav-link-sidebar[data-deporte]').forEach(link => {
        link.addEventListener('click', e => { e.preventDefault(); verDeporte(link.dataset.deporte); });
    });

    document.addEventListener('click', e => {
        const sport = e.target.closest('.sport-box');
        if (sport) { verDeporte(sport.dataset.deporte); return; }

        const filtro = e.target.closest('[data-filtro]');
        if (filtro) { filtrarCanchas(filtro.dataset.filtro); return; }

        const reservar = e.target.closest('.btn-reservar');
        if (reservar) {
            abrirModalReserva(
                reservar.dataset.nombre, 
                reservar.dataset.foto, 
                parseInt(reservar.dataset.precio, 10),
                reservar.dataset.deporte
            );
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.classList.contains('sport-box')) { verDeporte(e.target.dataset.deporte); }
        if (e.key === 'Escape') cerrarPaneles();
    });

    // Escuchar cambios en el formulario para actualizar precio
    document.getElementById('selectHoras').addEventListener('change', actualizarPrecio);
    document.querySelectorAll('#formReserva .form-check-input').forEach(chk => {
        chk.addEventListener('change', actualizarPrecio);
    });

    document.getElementById('formReserva').addEventListener('submit', e => {
        e.preventDefault();
        const nombreCliente = document.getElementById('inputNombre').value.trim();
        const err = document.getElementById('errorNombre');
        if (nombreCliente.length < 3) {
            err.textContent = 'Ingresa al menos 3 caracteres';
            return;
        }
        err.textContent = '';

        const canchaNombre = document.getElementById('modalNombreCancha').textContent;
        const canchaFoto = document.getElementById('modalImgCancha').getAttribute('src');
        const hora = document.getElementById('selectHora').value;
        const horas = parseInt(document.getElementById('selectHoras').value, 10);
        const totalPagar = document.getElementById('precioTotal').textContent;

        // Recolectar extras
        let extrasSeleccionados = [];
        document.querySelectorAll('#formReserva .form-check-input:checked').forEach(checkbox => {
            extrasSeleccionados.push(checkbox.dataset.nombre);
        });
        const extrasTexto = extrasSeleccionados.length > 0 ? extrasSeleccionados.join(', ') : 'Ninguno';

        bootstrap.Modal.getInstance(document.getElementById('modalReserva')).hide();
        
        cambiarSeccion('mis-reservas');
        document.getElementById('reservaNombre').textContent = canchaNombre;
        document.getElementById('reservaCliente').textContent = nombreCliente;
        document.getElementById('reservaFecha').textContent = `Hoy - ${hora}`;
        document.getElementById('reservaExtras').textContent = `${extrasTexto} (${totalPagar})`;
        
        const img = document.getElementById('reservaFoto');
        img.src = canchaFoto;
        img.onerror = () => { img.onerror = null; img.src = FALLBACK_IMG; };

        document.getElementById('vacioReserva').style.display = 'none';
        document.getElementById('detalleReserva').style.display = 'block';

        iniciarTemporizador(3600 * horas, {
            nombre: canchaNombre, cliente: nombreCliente,
            fecha: `Hoy - ${hora}`, foto: canchaFoto,
            extras: `${extrasTexto} (${totalPagar})`
        });
        mostrarToast('Reserva confirmada', 'success');
    });

    document.getElementById('btnCancelarReserva').addEventListener('click', () => {
        if (confirm('¿Cancelar reserva?')) {
            finalizarReserva();
            mostrarToast('Reserva cancelada', 'warning');
        }
    });

    document.getElementById('btnHidratar').addEventListener('click', function() {
        const txt = document.getElementById('txtHidratacion');
        const icon = this.querySelector('i');
        txt.textContent = 'Sincronizando...';
        icon.classList.add('fa-spin');
        setTimeout(() => {
            txt.textContent = '✅ Sincronizado';
            icon.classList.remove('fa-spin');
            mostrarToast('Datos sincronizados correctamente', 'success');
        }, 1000);
    });

    const modoGuardado = localStorage.getItem('stadiumModoClaro');
    if (modoGuardado === 'true') {
        document.body.classList.remove('modo-oscuro');
        document.body.classList.add('modo-claro');
        document.getElementById('themeBtn').innerHTML = '<i class="fas fa-moon"></i>';
    }
    document.getElementById('themeBtn').addEventListener('click', function() {
        document.body.classList.toggle('modo-claro');
        document.body.classList.toggle('modo-oscuro');
        const esClaro = document.body.classList.contains('modo-claro');
        this.innerHTML = esClaro ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('stadiumModoClaro', esClaro);
    });

    const estadoRed = document.getElementById('estadoRed');
    function actualizarRed() {
        if (navigator.onLine) {
            estadoRed.textContent = 'EN LÍNEA';
            estadoRed.className = 'badge bg-success border border-success px-2 py-2 rounded-0';
        } else {
            estadoRed.textContent = 'OFFLINE';
            estadoRed.className = 'badge bg-warning text-dark border border-warning px-2 py-2 rounded-0';
        }
    }
    window.addEventListener('online', actualizarRed);
    window.addEventListener('offline', actualizarRed);
    actualizarRed();

    restaurarReservaGuardada();

    if (location.hash) {
        const id = location.hash.replace('#', '');
        if (document.getElementById('sec-' + id)) cambiarSeccion(id);
    }

    /* ==========================================================================
       PWA - EVENTOS DE INSTALACIÓN (beforeinstallprompt) Y REGISTRO SW
       ========================================================================== */
    let deferredPrompt = null;
    const btnInstalar = document.getElementById('btnInstalarPwa');
    const btnInstalarMenu = document.getElementById('btnInstalarPwaMenu');

    // Capturar evento nativo antes de mostrar el prompt predeterminado
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (btnInstalar) btnInstalar.classList.remove('d-none');
        if (btnInstalarMenu) btnInstalarMenu.classList.remove('d-none');
    });

    function ejecutarInstalacionPWA() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                mostrarToast('¡MultiCancha añadida a tus aplicaciones!', 'success');
            }
            deferredPrompt = null;
            if (btnInstalar) btnInstalar.classList.add('d-none');
            if (btnInstalarMenu) btnInstalarMenu.classList.add('d-none');
        });
    }

    if (btnInstalar) btnInstalar.addEventListener('click', ejecutarInstalacionPWA);
    if (btnInstalarMenu) btnInstalarMenu.addEventListener('click', ejecutarInstalacionPWA);

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        if (btnInstalar) btnInstalar.classList.add('d-none');
        if (btnInstalarMenu) btnInstalarMenu.classList.add('d-none');
        mostrarToast('MultiCancha instalada con éxito en tu dispositivo', 'success');
    });

    if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('[PWA SW] Registrado en scope:', reg.scope))
                .catch(err => console.warn('[PWA SW] Error en registro:', err));
        });
    }
});