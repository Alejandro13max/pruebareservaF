/* ==========================================================================
   LÓGICA DE COMPONENTES: TARJETA DE CANCHA (ENCAPSULAMIENTO Y SIMULACIÓN)
   Materia: Diseño Web II (SIS-0141) - Guía Práctica Parte 1
   Docente: Ing. Miguel Angel Cruz Ramos
   ========================================================================== */

/* COMPONENTE REUTILIZABLE:
   Función generadora que desacopla la fuente de datos (Array de objetos) de la
   presentación HTML. Retorna la estructura estandarizada de cada tarjeta,
   permitiendo inyectar nuevas canchas o elementos sin reescribir el HTML base. */
function crearTarjetaComponente(cancha) {
    const fallback = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
          <rect width="100%" height="100%" fill="#1a2530"/>
          <text x="50%" y="50%" fill="#10b981" font-family="Arial" font-size="28" text-anchor="middle" dominant-baseline="middle">Imagen no disponible</text>
        </svg>`);

    return `
        <article class="card-item" data-id="${cancha.id}" data-deporte="${cancha.deporte}">
            <!-- Encapsulamiento de medios -->
            <div class="card-item__media">
                <img class="card-item__imagen" 
                     src="${cancha.img}" 
                     alt="${cancha.nombre}" 
                     loading="lazy" 
                     decoding="async" 
                     onerror="this.onerror=null;this.src='${fallback}';">
                <span class="card-item__tag">${cancha.tipo}</span>
                <span class="card-item__estado" id="estado-${cancha.id}">
                    <i class="fas fa-circle text-success me-1"></i>Disponible
                </span>
            </div>

            <!-- FLEXBOX: Cuerpo de la tarjeta con alineación unidimensional vertical -->
            <div class="card-cuerpo card-item__cuerpo">
                <header class="card-item__header">
                    <h3 class="card-item__titulo">${cancha.nombre}</h3>
                    <p class="card-item__subtitulo">${cancha.deporte.toUpperCase()} • ${cancha.tipo}</p>
                </header>

                <!-- FLEXBOX: Distribución de precio y acciones en el pie -->
                <footer class="card-item__pie">
                    <div class="card-item__precio-box">
                        <span class="card-item__precio">Bs. ${cancha.precio}</span>
                        <small class="card-item__precio-unidad">/hr</small>
                    </div>
                    <div class="card-item__acciones">
                        <!-- SIMULACIÓN ACADÉMICA: Botón independiente para verificar reactividad -->
                        <button type="button" 
                                class="btn-simular card-item__btn-simular btn-tactil" 
                                title="Simular selección individual en esta tarjeta" 
                                data-id="${cancha.id}">
                            <i class="fas fa-hand-pointer me-1"></i>Simular
                        </button>

                        <!-- RESERVA REAL: Botón funcional que activa el flujo de modal y pago -->
                        <button type="button" 
                                class="btn btn-neon rounded-0 btn-sm btn-reservar btn-tactil card-item__btn-reservar" 
                                data-nombre="${cancha.nombre}" 
                                data-foto="${cancha.img}" 
                                data-precio="${cancha.precio}" 
                                data-deporte="${cancha.deporte}">
                            RESERVAR
                        </button>
                    </div>
                </footer>
            </div>
        </article>
    `;
}

/* SIMULACIÓN:
   Lógica encapsulada mediante delegación de eventos en el documento (Guía Práctica 1).
   Garantiza que al presionar el botón de simulación (.btn-simular), ÚNICAMENTE se modifique
   el estado interno de la tarjeta correspondiente (.card-item) sin alterar a sus hermanas
   ni interferir con el sistema de reservas real. */
document.addEventListener('click', (e) => {
    const btnSimular = e.target.closest('.btn-simular');
    if (!btnSimular) return;

    // ENCAPSULAMIENTO: Se aísla el nodo padre del componente más cercano
    const tarjeta = btnSimular.closest('.card-item');
    if (!tarjeta) return;

    const estado = tarjeta.querySelector('.card-item__estado');
    const activo = tarjeta.classList.toggle('card-item--activo');

    // Modificación exclusiva del estado visual de esta tarjeta
    if (estado) {
        estado.innerHTML = activo 
            ? '<i class="fas fa-check-circle text-dark me-1"></i>Seleccionado (Simulación)' 
            : '<i class="fas fa-circle text-success me-1"></i>Disponible';
    }

    // Actualización del botón de la tarjeta actual
    btnSimular.innerHTML = activo
        ? '<i class="fas fa-undo me-1"></i>Deseleccionar'
        : '<i class="fas fa-hand-pointer me-1"></i>Simular';

    // Notificación en pantalla (Toast) diferenciando simulación de reserva real
    const titulo = tarjeta.querySelector('.card-item__titulo')?.textContent || 'Cancha';
    if (typeof mostrarToast === 'function') {
        mostrarToast(
            activo 
                ? `[Simulación] ${titulo} seleccionada individualmente (No altera reserva real)` 
                : `[Simulación] ${titulo} restaurada a disponible`,
            activo ? 'success' : 'info'
        );
    }
});

