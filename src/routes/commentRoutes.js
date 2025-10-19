const { Router } = require('express');
const commentControllers = require('../controllers/commentControllers'); 
const validateComment = require('../middlewares/validateComment');
const router = Router();

// RUTAS CRUD DE COMENTARIO

// U: Actualizar un comentario por su ID 
router.put('/:idComment', validateComment.validarActualizarComentario, validateComment.commentExists, commentControllers.actualizarComentario);

// D: Eliminar un comentario por su ID 
router.delete('/:idComment', validateComment.commentExists, commentControllers.eliminarComentario);

module.exports = router; 