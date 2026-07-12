// ==========================================
// GENERAR TARJETAS (CON DESCARGA INTEGRADA)
// ==========================================

function crearTarjetas(datos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

    // Limpiar el contenedor antes de renderizar (útil para el buscador)
    contenedor.innerHTML = "";

    datos.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${item.imagen}">
            <div class="infoCard">
                <h3>${item.titulo}</h3>
                <p>${item.descripcion}</p>
                <div class="accionesCard">
                    <button class="playBtn">
                        ▶ Abrir
                    </button>
                    <button class="infoBtn" title="Descargar archivo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;

// --- MANEJO DE DESCARGA DIRECTA (infoBtn) ---
const btnDescargar = card.querySelector(".infoBtn");

btnDescargar.addEventListener("click", (e) => {
    // Evita que también se abra el visor
    e.stopPropagation();

    if (!item.archivo || item.archivo === "#") {
        alert("Este elemento no contiene un archivo para descargar.");
        return;
    }

    try {
        // Convierte la ruta relativa a una URL absoluta
        const archivoURL = new URL(item.archivo, window.location.href).href;

        // Obtiene el nombre del archivo
        const nombreArchivo = decodeURIComponent(
            archivoURL.split("/").pop()
        );

        // Crea un enlace temporal para iniciar la descarga
        const enlace = document.createElement("a");
        enlace.href = archivoURL;
        enlace.download = nombreArchivo;
        enlace.style.display = "none";

        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);

    } catch (error) {
        console.error("Error al descargar:", error);
        alert("No fue posible descargar el archivo.");
    }
});

    });

}
// ==========================================
// ACTUALIZAR HERO (CAMBIO ULTRA FLUIDO)
// ==========================================

function actualizarHero(item) {
    const heroImage = document.getElementById("heroImage");
    const heroTitle = document.getElementById("heroTitle");
    const heroDescription = document.getElementById("heroDescription");

    if (!heroImage) return;

    // 1. Desvanecer la imagen anterior (Opacidad a 0)
    heroImage.style.opacity = "0";

    // 2. Esperar que culmine el fade-out para actualizar datos limpios
    setTimeout(() => {
        heroImage.src = item.imagen;
        if (heroTitle) heroTitle.textContent = item.titulo;
        if (heroDescription) heroDescription.textContent = item.descripcion;

        // 3. Traer de vuelta la opacidad a 1 usando la animación de CSS
        heroImage.style.opacity = "1";
    }, 300); 
}

// ==========================================
// SISTEMA DE FILTRADO (BARRA DE BÚSQUEDA)
// ==========================================

const buscador = document.getElementById("buscador");

if (buscador) {
    buscador.addEventListener("input", (e) => {
        const termino = e.target.value.toLowerCase().trim();

        // Helper interno para filtrar arreglos por título o descripción
        const filtrar = (arreglo) => {
            return arreglo.filter(item => 
                item.titulo.toLowerCase().includes(termino) || 
                item.descripcion.toLowerCase().includes(termino)
            );
        };

        // Renderizar dinámicamente con los datos filtrados
        crearTarjetas(filtrar(Presentacion), "listaPresentacion");
        crearTarjetas(filtrar(Actividades), "listaActividades");
        crearTarjetas(filtrar(Exposicion), "listaExposicion");
        crearTarjetas(filtrar(Material), "listaMaterial");
        crearTarjetas(filtrar(Parcial), "listaParcial");
        crearTarjetas(filtrar(conclusion), "listaConclusion");
    });
}

// ==========================================
// MODAL / MANEJO DEL VISOR MULTIMEDIA
// ==========================================

const modal = document.getElementById("modal");
const visor = document.getElementById("visorPDF");
const titulo = document.getElementById("modalTitulo");
const cerrar = document.getElementById("cerrarModal");

function abrirDocumento(item) {
    if (!modal || !visor || item.archivo === "#") return;

    if (titulo) titulo.textContent = item.titulo;

    const baseURL = window.location.origin + window.location.pathname.replace("/paginas/pantallaPrincipal.html", "/");
    const archivoURL = new URL(item.archivo.replace("../", ""), baseURL).href;

    switch (item.tipo) {
        case "pdf":
            visor.src = item.archivo;
            break;
        case "word":
        case "ppt":
        case "excel":
            visor.src = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(archivoURL);
            break;
        default:
            visor.src = item.archivo;
    }

    modal.classList.add("activo");
}

// Eventos de cierre del Modal
cerrar?.addEventListener("click", () => {
    if (visor) visor.src = "";
    modal?.classList.remove("activo");
});

modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
        if (visor) visor.src = "";
        modal.classList.remove("activo");
    }
});

// ==========================================
// INICIALIZACIÓN DE LAS SECCIONES
// ==========================================

function inicializarPortafolio() {
    crearTarjetas(Presentacion, "listaPresentacion");
    crearTarjetas(Actividades, "listaActividades");
    crearTarjetas(Exposicion, "listaExposicion");
    crearTarjetas(Material, "listaMaterial");
    crearTarjetas(Parcial, "listaParcial");
    crearTarjetas(conclusion, "listaConclusion");
}
// ==========================================
// LÓGICA DE DESPLAZAMIENTO (FLECHAS ❮ Y ❯)
// ==========================================

function configurarFlechas() {
    // Buscamos todas las secciones que tengan un título y una fila
    const secciones = document.querySelectorAll('main section');

    secciones.forEach(seccion => {
        const btnIzquierda = seccion.querySelector('.flecha.izquierda');
        const btnDerecha = seccion.querySelector('.flecha.derecha');
        const fila = seccion.querySelector('.fila');

        // Si la sección tiene ambos botones y su respectiva fila, activamos los clicks
        if (btnIzquierda && btnDerecha && fila) {
            
            btnIzquierda.addEventListener('click', () => {
                fila.scrollBy({
                    left: -400, // Se mueve 400px a la izquierda
                    behavior: 'smooth' // Desplazamiento fluido animado
                });
            });

            btnDerecha.addEventListener('click', () => {
                fila.scrollBy({
                    left: 400, // Se mueve 400px a la derecha
                    behavior: 'smooth'
                });
            });
        }
    });
}

// Asegúrate de llamarla justo debajo de inicializarPortafolio();
configurarFlechas();

// Ejecutar carga inicial
inicializarPortafolio();
