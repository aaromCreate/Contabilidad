// ==========================================
// GENERAR TARJETAS (CON DESCARGA INTEGRADA)
// ==========================================

function crearTarjetas(datos, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;

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
            e.stopPropagation(); 

            if (!item.archivo || item.archivo === "#") {
                alert("Este elemento no contiene un archivo para descargar.");
                return;
            }

            const enlaceTemporal = document.createElement("a");
            enlaceTemporal.href = item.archivo;
            
            const nombreArchivo = item.archivo.split('/').pop();
            enlaceTemporal.download = nombreArchivo;

            document.body.appendChild(enlaceTemporal);
            enlaceTemporal.click();
            document.body.removeChild(enlaceTemporal);
        });

        // Cambiar Hero de forma interactiva al pasar el mouse
        card.addEventListener("mouseenter", () => {
            actualizarHero(item);
        });

        // Abrir visor de documentos al dar clic a la tarjeta
        card.addEventListener("click", () => {
            abrirDocumento(item);
        });

        contenedor.appendChild(card);
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

    heroImage.style.opacity = "0";

    setTimeout(() => {
        heroImage.src = item.imagen;
        if (heroTitle) heroTitle.textContent = item.titulo;
        if (heroDescription) heroDescription.textContent = item.descripcion;

        heroImage.style.opacity = "1";
    }, 300); 
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
// INICIALIZACIÓN DE SECCIONES
// ==========================================

crearTarjetas(presentacion, "listaPresentacion");
crearTarjetas(actividades, "listaActividades");
crearTarjetas(laboratorios, "listaLaboratorios");
crearTarjetas(proyectos, "listaProyectos");
crearTarjetas(material, "listaMaterial");
crearTarjetas(parciales, "listaParciales");
crearTarjetas(conclusion, "listaConclusion");