const { Router } = require('express');
const tagControllers = require('../controllers/tagControllers'); 
const tagValidation = require('../middlewares/validateTag');
const router = Router();

// RUTAS CRUD DE ETIQUETA

// C: Crear una nueva etiqueta 
router.post('/', tagValidation.validateTag, tagValidation.validateTagNoExiste, tagControllers.crearTag);

// R: Obtener todas las etiquetas
router.get('/', tagControllers.obtenerTags);

// R: Obtener una etiqueta por su ID
router.get('/:idTag', tagValidation.validateExisteTag, tagControllers.obtenerTag);

// U: Actualizar una etiqueta por su ID 
router.put('/:idTag', tagValidation.validateTag, tagValidation.validateTagNoExiste,tagValidation.validateExisteTag, tagControllers.actualizarTag);

// D: Eliminar una etiqueta por su ID 
router.delete('/:idTag', tagValidation.validateExisteTag, tagControllers.eliminarTag);

module.exports = router;
  