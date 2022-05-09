const { Router } = require("express");
const router = Router();

const alumnoController = require("../controllers/alumno.controller.js");

router.get("/", alumnoController.redirectToLandingPage);
router.get("/misNotificaciones", alumnoController.renderNotificaciones);
router.get("/misProyectos", alumnoController.renderProyectos);
router.get("/misTareas", alumnoController.renderTareas);
router.get("/misProyectos/nuevoProyecto", alumnoController.renderNuevoProyecto);
router.get(
  "/misProyectos/:id_proyecto",
  alumnoController.redirectToLandingProyecto
);
router.get(
  "/misProyectos/:id_proyecto/modificarProyecto",
  alumnoController.renderModificarProyecto
);
router.get(
  "/misProyectos/:id_proyecto/etapas",
  alumnoController.renderProyecto
);
router.get(
  "/misProyectos/:id_proyecto/etapas/nuevaEtapa",
  alumnoController.renderNuevaEtapa
);
router.get(
  "/misProyectos/:id_proyecto/etapas/:id_etapa",
  alumnoController.redirectToLandingEtapa
);
router.get(
  "/misProyectos/:id_proyecto/etapas/:id_etapa/modificarEtapa",
  alumnoController.renderModificarEtapa
);
router.get(
  "/misProyectos/:id_proyecto/etapas/:id_etapa/entregables",
  alumnoController.renderEntregablesEtapa
);
router.get(
  "/misProyectos/:id_proyecto/etapas/:id_etapa/entregables/:id_entregable",
  alumnoController.renderEntregable
);
router.get(
  "/misProyectos/:id_proyecto/etapas/:id_etapa/tareas",
  alumnoController.renderTareasEtapa
);
router.get("/misProyectos/:id_proyecto/equipo", alumnoController.renderEquipo);
router.get(
  "/misProyectos/:id_proyecto/resumen",
  alumnoController.renderResumen
);

module.exports = router;
