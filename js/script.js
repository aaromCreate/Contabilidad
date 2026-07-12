// ===============================
// GENERAR TARJETAS
// ===============================

function crearTarjetas(datos, contenedorId) {

    const contenedor = document.getElementById(contenedorId);

    if (!contenedor) return;

    datos.forEach(item => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML=`

<img src="${item.imagen}">

<div class="infoCard">

    <h3>${item.titulo}</h3>

    <p>${item.descripcion}</p>

    <div class="accionesCard">

        <button class="playBtn">

            ▶ Abrir

        </button>

        <button class="infoBtn">

            ⓘ

        </button>

    </div>

</div>

`;

        // Cambiar Hero al pasar el mouse

        card.addEventListener("mouseenter", () => {

            actualizarHero(item);

        });

        // Abrir PDF al hacer click

        card.addEventListener("click", () => {
            abrirDocumento(item);
        });

        contenedor.appendChild(card);

    });

}



// ===============================
// ACTUALIZAR HERO
// ===============================

function actualizarHero(item){

    const heroImage = document.getElementById("heroImage");

    heroImage.style.opacity = "0";

    setTimeout(()=>{

        heroImage.src = item.imagen;

        document.getElementById("heroTitle").textContent = item.titulo;

        document.getElementById("heroDescription").textContent = item.descripcion;

        heroImage.style.opacity="1";

    },250);

}
//===============================
// MODAL PDF
//===============================

const modal = document.getElementById("modal");

const visor = document.getElementById("visorPDF");

const titulo = document.getElementById("modalTitulo");

const cerrar = document.getElementById("cerrarModal");


function abrirDocumento(item) {

    if (item.archivo === "#") return;

    titulo.textContent = item.titulo;

    const baseURL = window.location.origin +
        window.location.pathname.replace("/paginas/pantallaPrincipal.html", "/");

    const archivoURL = new URL(item.archivo.replace("../", ""), baseURL).href;

    switch (item.tipo) {

        case "pdf":

            visor.src = item.archivo;
            break;

        case "word":

        case "ppt":

        case "excel":

            visor.src =
                "https://view.officeapps.live.com/op/embed.aspx?src=" +
                encodeURIComponent(archivoURL);

            break;

        default:

            visor.src = item.archivo;

    }

    modal.classList.add("activo");

}


cerrar.addEventListener("click",()=>{

    visor.src="";

    modal.classList.remove("activo");

});


modal.addEventListener("click",(e)=>{

    if(e.target===modal){

        visor.src="";

        modal.classList.remove("activo");

    }

});



// ===============================
// CARGAR TODO
// ===============================

crearTarjetas(presentacion,"listaPresentacion");

crearTarjetas(actividades,"listaActividades");

crearTarjetas(laboratorios,"listaLaboratorios");

crearTarjetas(proyectos,"listaProyectos");

crearTarjetas(material,"listaMaterial");

crearTarjetas(parciales,"listaParciales");

crearTarjetas(conclusion,"listaConclusion");