const { Router } = require('express')
const userControllers = require('../controllers/userControllers')
const postControllers = require('../controllers/postControllers')
const router = Router()

// C: Crear un nuevo usuario 
router.post('/', userControllers.crearUsuario);

// R: Obtener todos los usuarios 
router.get('/', userControllers.obtenerUsuarios);

// R: Obtener un usuario por su ID 
router.get('/:idUser', userControllers.obtenerUsuario); 

// U: Actualizar un usuario por su ID 
router.put('/:idUser', userControllers.actualizarUsuario);

// D: Eliminar un usuario por su ID 
router.delete('/:idUser', userControllers.eliminarUsuario);

// C: CREAR PUBLICACIÓN ANIDADA
router.post('/:idUser/post', postControllers.crearPublicacion);

module.exports = router;