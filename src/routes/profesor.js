const {Router} = require('express');
const router = Router();
const profesorController = require('../controllers/profesor.controller')

router.get('/',
    profesorController.renderMaterias);

router.get('/details/:id_proyecto',
    profesorController.renderDetalles);

router.get('/asignacion/:id_proyecto',
    profesorController.renderAsignacion);

router.get('/cierre/:id_proyecto',
    profesorController.renderCierre);

router.get('/reporte/:id_proyecto',
    profesorController.renderReporte);
    
router.get('/creartarea/:id_proyecto',
    profesorController.renderCrearTarea);

router.get('/:nrc/reporte',
    profesorController.renderReporteMateria);

router.get('/:nrc',
    profesorController.renderMateria);

router.get('/calificar/:id_proyecto/:id_entregable',
    profesorController.renderCalificar)

module.exports=router;
