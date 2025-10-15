const { Router } = require('express');
const commentControllers = require('../controllers/commentControllers'); 
const router = Router();

// RUTAS CRUD DE COMENTARIO

// U: Actualizar un comentario por su ID 
router.put('/:idComment', commentControllers.actualizarComentario);

// D: Eliminar un comentario por su ID 
router.delete('/:idComment', commentControllers.eliminarComentario);

module.exports = router;