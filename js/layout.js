/* ==========================================================================
   LÓGICA DE LAYOUT: SIMULACIÓN DE VISTA RESPONSIVA
   Materia: Diseño Web II (SIS-0141) - Guía Práctica Parte 2
   Docente: Ing. Miguel Angel Cruz Ramos
   ========================================================================== */

/* SIMULACIÓN:
   Módulo independiente para demostración docente en clase.
   Permite alternar con un solo clic entre la grilla adaptativa responsiva
   (CSS Grid con auto-fit) y una vista forzada móvil (1 columna fija a 380px).
   Cumple estrictamente con el código indicado en la Guía Práctica 2. */

document.addEventListener('DOMContentLoaded', () => {
    const btnSimularVista = document.getElementById('btnSimularVista');
    const contenedorCatalogo = document.querySelector('.catalogo-grid');
    const badgeModoVista = document.getElementById('badgeModoVista');

    if (!btnSimularVista || !contenedorCatalogo) return;

    btnSimularVista.addEventListener('click', () => {
        // Alterna la clase .sim-movil definida en css/layout.css
        const esMovil = contenedorCatalogo.classList.toggle('sim-movil');

        // Actualización de feedback visual para la defensa ante el docente
        if (badgeModoVista) {
            badgeModoVista.textContent = esMovil 
                ? 'Modo: Móvil Forzado (1 Columna - máx. 380px)' 
                : 'Modo: Responsivo Automático (Grid auto-fit)';
            badgeModoVista.className = esMovil 
                ? 'badge bg-warning text-dark py-2 px-3 fw-bold' 
                : 'badge bg-secondary py-2 px-3';
        }

        btnSimularVista.innerHTML = esMovil
            ? '<i class="fas fa-desktop me-2"></i>Restaurar Vista Escritorio'
            : '<i class="fas fa-mobile-alt me-2"></i>Simular Vista Móvil (1 Columna)';

        // Notificación Toast amigable
        if (typeof mostrarToast === 'function') {
            mostrarToast(
                esMovil 
                    ? 'Vista móvil activada: 1 columna forzada a 380px' 
                    : 'Vista responsiva restaurada: CSS Grid fluido',
                'info'
            );
        }
    });
});

