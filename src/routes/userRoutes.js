const { Router } = require('express')
const userController = require('../controllers/userControllers')
const postController = require('../controllers/postControllers')
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

module.exports = router;

/*
//usuario
router.get('/', userController.obtenerUsers)
router.get('/:id', userController.crearUser)
router.post('/', userController.crearUser)
router.put('/:id', userController.actualizarUser)
router.delete('/:id', userController.eliminarUser)

//publicaciones
router.post('/:userId/post', postController.crearPublicacion)


module.exports = router
*/