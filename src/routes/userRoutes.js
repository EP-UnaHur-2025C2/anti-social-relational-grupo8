const { Router } = require('express')
const userController = require('../controllers/userControllers')
const router = Router()

router.get('/', userController.obtenerUsers)
router.get('/:id', userController.crearUser)
router.post('/', userController.crearUser)
router.put('/:id', userController.actualizarUser)
router.delete('/:id', userController.eliminarUser)

module.exports = router