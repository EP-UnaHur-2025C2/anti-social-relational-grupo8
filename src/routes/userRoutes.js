const { Router } = require('express')
const userController = require('../controllers/userControllers')
const postController = require('../controllers/postControllers')
const router = Router()

//usuario
router.get('/', userController.obtenerUsers)
router.get('/:id', userController.crearUser)
router.post('/', userController.crearUser)
router.put('/:id', userController.actualizarUser)
router.delete('/:id', userController.eliminarUser)

//publicaciones
router.post('/:userId/post', postController.crearPublicacion)


module.exports = router