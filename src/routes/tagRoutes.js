const { Router } = require('express');
const tagControllers = require('../controllers/tagControllers'); 
const router = Router();

// RUTAS CRUD DE ETIQUETA

// C: Crear una nueva etiqueta 
router.post('/', tagControllers.crearTag);

// R: Obtener todas las etiquetas
router.get('/', tagControllers.obtenerTags);

// R: Obtener una etiqueta por su ID
router.get('/:idTag', tagControllers.obtenerTag); 

// U: Actualizar una etiqueta por su ID 
router.put('/:idTag', tagControllers.actualizarTag);

// D: Eliminar una etiqueta por su ID 
router.delete('/:idTag', tagControllers.eliminarTag);

module.exports = router;
