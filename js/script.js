// ==========================================
// GENERAR TARJETAS (CON DESCARGA INTEGRADA)
// ==========================================

function crearTarjetas(datos, contenedorId) {

    const contenedor = document.getElementById(contenedorId);

    if (!contenedor) return;

    // Limpiar el contenedor
    contenedor.innerHTML = "";

    datos.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.imagen}" alt="${item.titulo}">

            <div class="infoCard">

                <h3>${item.titulo}</h3>

                <p>${item.descripcion}</p>

                <div class="accionesCard">

                    <button class="playBtn">
                        ▶ Abrir
                    </button>

                    <button class="infoBtn" title="Descargar archivo">

                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round">

                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>

                            <polyline points="7 10 12 15 17 10"></polyline>

                            <line x1="12" y1="15" x2="12" y2="3"></line>

                        </svg>

                    </button>

                </div>

            </div>
        `;

        // =====================================
        // BOTÓN ABRIR
        // =====================================

        const btnAbrir = card.querySelector(".playBtn");

        btnAbrir.addEventListener("click", (e) => {

            e.stopPropagation();

            actualizarHero(item);

            abrirDocumento(item);

        });

        // =====================================
        // BOTÓN DESCARGAR
        // =====================================

        const btnDescargar = card.querySelector(".infoBtn");

        btnDescargar.addEventListener("click", async (e) => {

            e.stopPropagation();

            if (!item.archivo || item.archivo === "#") {

                alert("Este documento no está disponible.");

                return;

            }

            try {

                document.body.style.cursor = "wait";

                const archivoURL = new URL(
                    item.archivo,
                    window.location.href
                ).href;

                const respuesta = await fetch(archivoURL);

                if (!respuesta.ok) {

                    throw new Error("No se pudo descargar.");

                }

                const blob = await respuesta.blob();

                const urlBlob = URL.createObjectURL(blob);

                const nombreArchivo = decodeURIComponent(
                    archivoURL.split("/").pop()
                );

                const enlace = document.createElement("a");

                enlace.href = urlBlob;

                enlace.download = nombreArchivo;

                document.body.appendChild(enlace);

                enlace.click();

                document.body.removeChild(enlace);

                URL.revokeObjectURL(urlBlob);

            } catch (error) {

                console.error(error);

                alert("No fue posible descargar el archivo.");

            } finally {

                document.body.style.cursor = "default";

            }

        });

        // Agregar tarjeta
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


    // Ocultar imagen actual
    heroImage.style.opacity = "0";


    setTimeout(() => {

        heroImage.src = item.imagen;

        if (heroTitle) {
            heroTitle.textContent = item.titulo;
        }

        if (heroDescription) {
            heroDescription.textContent = item.descripcion;
        }


        // Mostrar nueva imagen
        heroImage.style.opacity = "1";


    }, 300);

}



// ==========================================
// MODAL / VISOR MULTIMEDIA
// ==========================================

const modal = document.getElementById("modal");
const visor = document.getElementById("visorPDF");
const tituloModal = document.getElementById("modalTitulo");
const cerrarModal = document.getElementById("cerrarModal");



function abrirDocumento(item) {


    if (!modal || !visor || !item.archivo) {
        return;
    }


    if (tituloModal) {

        tituloModal.textContent = item.titulo;

    }



    // Convertir ruta relativa a URL completa
    const archivoURL = new URL(
        item.archivo,
        window.location.href
    ).href;



    switch (item.tipo) {


        // =========================
        // PDF
        // =========================

        case "pdf":

            visor.src = archivoURL;

            break;



        // =========================
        // WORD
        // EXCEL
        // POWERPOINT
        // =========================

        case "word":

        case "excel":

        case "ppt":


            visor.src =
                "https://view.officeapps.live.com/op/embed.aspx?src="
                +
                encodeURIComponent(archivoURL);


            break;



        default:


            visor.src = archivoURL;


            break;

    }



    modal.classList.add("activo");

}



// ==========================================
// CERRAR MODAL
// ==========================================


cerrarModal?.addEventListener("click", () => {


    if (visor) {

        visor.src = "";

    }


    modal?.classList.remove("activo");


});




// Cerrar al pulsar fuera

modal?.addEventListener("click", (e) => {


    if (e.target === modal) {


        if (visor) {

            visor.src = "";

        }


        modal.classList.remove("activo");


    }


});
// ==========================================
// SISTEMA DE FILTRADO (BARRA DE BÚSQUEDA)
// ==========================================

const buscador = document.getElementById("buscador");


if (buscador) {


    buscador.addEventListener("input", (e) => {


        const termino = e.target.value
            .toLowerCase()
            .trim();



        const filtrar = (arreglo) => {


            return arreglo.filter(item =>


                item.titulo
                    .toLowerCase()
                    .includes(termino)

                ||

                item.descripcion
                    .toLowerCase()
                    .includes(termino)


            );


        };



        crearTarjetas(
            filtrar(Presentacion),
            "listaPresentacion"
        );


        crearTarjetas(
            filtrar(Actividades),
            "listaActividades"
        );


        crearTarjetas(
            filtrar(Exposicion),
            "listaExposicion"
        );


        crearTarjetas(
            filtrar(Material),
            "listaMaterial"
        );


        crearTarjetas(
            filtrar(Parcial),
            "listaParcial"
        );


        crearTarjetas(
            filtrar(conclusion),
            "listaConclusion"
        );


    });


}





// ==========================================
// INICIALIZACIÓN DEL PORTAFOLIO
// ==========================================


function inicializarPortafolio() {


    crearTarjetas(
        Presentacion,
        "listaPresentacion"
    );


    crearTarjetas(
        Actividades,
        "listaActividades"
    );


    crearTarjetas(
        Exposicion,
        "listaExposicion"
    );


    crearTarjetas(
        Material,
        "listaMaterial"
    );


    crearTarjetas(
        Parcial,
        "listaParcial"
    );


    crearTarjetas(
        conclusion,
        "listaConclusion"
    );


}





// ==========================================
// LÓGICA DE DESPLAZAMIENTO (FLECHAS)
// ==========================================


function configurarFlechas() {


    const secciones =
        document.querySelectorAll(
            "main section"
        );



    secciones.forEach(seccion => {


        const btnIzquierda =
            seccion.querySelector(
                ".flecha.izquierda"
            );


        const btnDerecha =
            seccion.querySelector(
                ".flecha.derecha"
            );


        const fila =
            seccion.querySelector(
                ".fila"
            );



        if (
            btnIzquierda &&
            btnDerecha &&
            fila
        ) {



            btnIzquierda.addEventListener(
                "click",
                () => {


                    fila.scrollBy({

                        left: -400,

                        behavior: "smooth"

                    });


                }
            );




            btnDerecha.addEventListener(
                "click",
                () => {


                    fila.scrollBy({

                        left: 400,

                        behavior: "smooth"

                    });


                }
            );


        }



    });



}





// ==========================================
// EJECUCIÓN INICIAL
// ==========================================


configurarFlechas();

inicializarPortafolio();