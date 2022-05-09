import { API_URL } from "./config.js";
import { LoadingBar } from "./LoadingBar.js";

let listaAlumnos = [];
const id_proyecto = document.querySelector('input[name="id_proyecto"]').value;

const solicitarAlumnos = async () => {
  //SOLICITAR TODOS LOS ALUMNOS QUE PERTENEZCAN A LA MATERIA
  const nrc = document.querySelector('input[name="nrc"]').value;

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

const confirmarIncorporación = (matricula) => {
  return Swal.fire({
    title: `¿Desea agregar al alumno ${matricula} al equipo?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
  }).then((result) => result.isConfirmed);
};

const confirmarExpulsion = (matricula) => {
  return Swal.fire({
    title: `¿Desea expulsar al alumno ${matricula} del equipo?`,
    text: "Esta acción no puede ser revertida.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
  }).then((result) => result.isConfirmed);
};

const agregarAEquipo = async (id_proyecto, matricula) => {
  LoadingBar.show();

  const res = await fetch(`${API_URL}proyectos/${id_proyecto}/equipo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matricula,
    }),
  });

  LoadingBar.close();

  switch (res.status) {
    case 201: {
      Swal.fire({
        title: "Alumno incorporado",
        icon: "success",
      });
      break;
    }
    case 404: {
      Swal.fire({
        title: "No se encontró el alumno ingresado.",
        text: "Favor de no manipular el DOM.",
        icon: "warning",
      });
      break;
    }
    case 500: {
      const body = await res.json();

      Swal.fire({
        title: "Error del servidor",
        text: body.error || body.message,
        icon: "error",
      });

      throw new Error(body.error || body.message);
    }
  }
};

const expulsarDeEquipo = async (id_proyecto, matricula) => {
  LoadingBar.show();

  const res = await fetch(`${API_URL}proyectos/${id_proyecto}/equipo`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      matricula,
    }),
  });

  LoadingBar.close();

  switch (res.status) {
    case 201: {
      Swal.fire({
        title: "Alumno expulsado",
        icon: "success",
      });
      break;
    }
    case 404: {
      Swal.fire({
        title: "No se encontró el alumno ingresado.",
        text: "Favor de no manipular el DOM.",
        icon: "warning",
      });
      break;
    }
    case 500: {
      const body = await res.json();

      Swal.fire({
        title: "Error del servidor",
        text: body.error || body.message,
        icon: "error",
      });
      break;
    }
  }
};

const cargarNuevoIntegrante = (integrante) => {
  const integrantes = document.querySelector("#integrantes");

  const contenedor = document.createElement("tr");
  const input = document.createElement("input");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const estado = document.createElement("span");
  const rol = document.createElement("span");
  const btnExpulsar = document.createElement("input");

  contenedor.setAttribute("class", "list-item");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "matricula");
  input.setAttribute("value", integrante.matricula);
  td1.setAttribute("scope", "row");
  td1.setAttribute("class", "text-left");
  td4.setAttribute("class", "d-flex justify-content-around");
  img.setAttribute("src", "/public/img/user.jpg");
  span.setAttribute("class", "text-center");
  span.innerHTML = `${integrante.matricula} - ${integrante.nombre} ${integrante.paterno} ${integrante.materno}`;
  btnExpulsar.setAttribute("type", "button");
  btnExpulsar.setAttribute("value", "Expulsar");
  btnExpulsar.setAttribute("class", "btn btn-danger");
  btnExpulsar.addEventListener("click", async (e) => {
    if (await confirmarExpulsion(integrante.matricula)) {
      try {
        await expulsarDeEquipo(id_proyecto, integrante.matricula);
        integrantes.removeChild(contenedor);
      } catch (err) {}
    }
  });
  estado.innerHTML = integrante.estado;
  rol.innerHTML = integrante.rol;

  contenedor.appendChild(input);
  contenedor.appendChild(td1);
  contenedor.appendChild(td2);
  contenedor.appendChild(td3);
  contenedor.appendChild(td4);
  td1.appendChild(img);
  td1.appendChild(span);
  td2.appendChild(estado);
  td3.appendChild(rol);
  td4.appendChild(btnExpulsar);

  integrantes.appendChild(contenedor);
};

const solicitarEquipo = (id_proyecto) => {
  return fetch(`${API_URL}proyectos/${id_proyecto}/equipo`)
    .then((res) => {
      if (res.status === 200) return res.json();
      return [];
    })
    .then((equipo) => equipo)
    .catch((err) => []);
};

const desplegarEquipo = async () => {
  const equipo = await solicitarEquipo(id_proyecto);

  for (let integrante of equipo) {
    cargarNuevoIntegrante(integrante);
  }
};

const main = async () => {
  listaAlumnos = await solicitarAlumnos();
  cargarAlumnos(listaAlumnos);
  desplegarEquipo();

  document
    .querySelector("#btn_agregar_integrante")
    .addEventListener("click", async (e) => {
      const matricula = document.querySelector("#lista_alumnos").value;
      const nuevoIntegrante = listaAlumnos.find(
        (alumno) => alumno.matricula == matricula
      );

      if (nuevoIntegrante) {
        if (await confirmarIncorporación(nuevoIntegrante.matricula)) {
          try {
            await agregarAEquipo(id_proyecto, nuevoIntegrante.matricula);
            nuevoIntegrante.rol = "INTEGRANTE";
            nuevoIntegrante.estado = "PENDIENTE";
            cargarNuevoIntegrante(nuevoIntegrante);
          } catch (err) {}
        }
      }
    });
};

main();
