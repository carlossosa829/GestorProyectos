import { API_URL } from "./config.js";
import { LoadingBar } from "./LoadingBar.js";

let listaAlumnos = null;

const solicitarAlumnos = async () => {
  //SOLICITAR TODOS LOS ALUMNOS QUE PERTENEZCAN A LA MATERIA
  const nrc = document.querySelector("#materias").value;

  return fetch(`${API_URL}/materias/${nrc}/lista`, {
    method: "GET",
  })
    .then(async (res) => {
      return res.status === 200 ? await res.json() : null;
    })
    .then((lista) => lista.Alumnos)
    .catch((err) => {
      console.error(err);
      return null;
    });
};

const cargarAlumnos = (alumnos) => {
  const lista_alumnos = document.querySelector("#lista_alumnos");

  for (let alumno of alumnos) {
    lista_alumnos.innerHTML += `
            <option value="${alumno.matricula}">${alumno.matricula} - ${alumno.nombre} ${alumno.paterno} ${alumno.materno}</option>
        `;
  }
};

const habilitarComponenteEquipo = () => {
  const componenteEquipo = document.querySelector("#componente_equipo");
  const materias = document.querySelector("#materias");

  reiniciarComponenteEquipo();

  if (materias.value) {
    componenteEquipo.removeAttribute("disabled");
  } else {
    componenteEquipo.setAttribute("disabled", "");
  }
};

const reiniciarComponenteEquipo = () => {
  document.querySelector("#integrantes").innerHTML = "";
  document.querySelector(
    "#lista_alumnos"
  ).innerHTML = `<option value="" disabled selected>Materias</option>`;
};

const cargarNuevoIntegrante = (integrante) => {
  const integrantes = document.querySelector("#integrantes");

  const contenedor = document.createElement("div");
  const input = document.createElement("input");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const btnEliminar = document.createElement("input");

  contenedor.setAttribute(
    "class",
    "list-item d-flex justify-content-center justify-content-md-between align-items-center flex-wrap col-md-6 col-sm-12 mb-4"
  );
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "matricula");
  input.setAttribute("value", integrante.matricula);
  img.setAttribute("src", "/public/img/user.jpg");
  span.setAttribute("class", "text-center");
  span.innerHTML = `${integrante.matricula} - ${integrante.nombre} ${integrante.paterno} ${integrante.materno}`;
  btnEliminar.setAttribute("type", "button");
  btnEliminar.setAttribute("value", "Eliminar");
  btnEliminar.setAttribute("class", "btn btn-danger");
  btnEliminar.addEventListener("click", (e) => {
    btnEliminar.parentElement.remove();
  });

  contenedor.appendChild(input);
  contenedor.appendChild(img);
  contenedor.appendChild(span);
  contenedor.appendChild(btnEliminar);

  integrantes.appendChild(contenedor);
};

const enviarFormulario = (e) => {
  e.preventDefault();

  LoadingBar.show();

  const equipo = obtenerEquipo();
  const coordinador = Number.parseInt(
    e.target.querySelector('[name="coordinador"]').value
  );

  if (!equipo.includes(coordinador)) equipo.push(coordinador);

  const body = JSON.stringify({
    nombre_proyecto: `${
      e.target.querySelector('[name="nombre_proyecto"]').value
    }`,
    fecha_inicio: `${e.target.querySelector('[name="fecha_inicio"]').value}`,
    fecha_limite: `${e.target.querySelector('[name="fecha_limite"]').value}`,
    nrc: `${Number.parseInt(e.target.querySelector('[name="nrc"]').value)}`,
    descripcion: `${e.target.querySelector('[name="descripcion"]').value}`,
    coordinador,
    equipo,
  });

  fetch(`${API_URL}proyectos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
    .then(async (res) => {
      if (res.status === 201) return { status: 201 };
      return { status: res.status, ...(await res.json()) };
    })
    .then((res) => {
      LoadingBar.close();

      if (res.status === 201) {
        Swal.fire({
          title: "Proyecto creado",
          icon: "success",
        }).then(() => {
          window.location.href = "/alumno/misProyectos";
        });
      } else if (res.status === 422) {
        Swal.fire({
          title: "Campos erroneos",
          text: "Algunos de los campos introducidos no tienen el formato apropiado.",
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "Error del servidor",
          text: res.error || res.message,
          icon: "error",
        });
      }
    })
    .catch((err) => {
      LoadingBar.close();
      error.log(err);
    });
};

const obtenerEquipo = () => {
  let integrantes = document.querySelectorAll(
    '#integrantes input[name="matricula"]'
  );
  let equipo = [];

  integrantes.forEach((integrante) => {
    const matricula = Number.parseInt(integrante.value);
    if (!equipo.includes(matricula)) equipo.push(matricula);
  });

  return equipo;
};

const main = async (e) => {
  document.querySelector("#materias").addEventListener("change", async (e) => {
    habilitarComponenteEquipo();
    listaAlumnos = await solicitarAlumnos();
    cargarAlumnos(listaAlumnos);
  });

  document
    .querySelector("#btn_agregar_integrante")
    .addEventListener("click", (e) => {
      const matricula = document.querySelector("#lista_alumnos").value;
      const nuevoIntegrante = listaAlumnos.find(
        (alumno) => alumno.matricula == matricula
      );

      if (nuevoIntegrante) cargarNuevoIntegrante(nuevoIntegrante);
    });

  document
    .querySelector("form")
    .addEventListener("submit", (e) => enviarFormulario(e));
};

window.addEventListener("load", main);
