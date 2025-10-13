const { Router } = require('express')
const userController = require('../controllers/userControllers')
const postController = require('../controllers/postControllers')
const router = Router()

//usuario
router.get('/', userController.obtenerUsers)
router.get('/:id', userController.validarUsuarioExiste, userController.obtenerUser)
router.get('/:id', userController.crearUser)
router.post('/', userController.crearUser)
router.put('/:id', userController.validarUsuarioExiste, userController.actualizarUser)
router.delete('/:id', userController.validarUsuarioExiste, userController.eliminarUser)

//publicaciones
router.post('/:userId/post', validarUsuarioExiste, validarPost, postController.crearPublicacion)


module.exports = router