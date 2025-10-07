const { Router } = require('express')
const userController = require('../controllers/userControllers')
const router = Router()

router.get('/', userController.obtenerUsers)
//router.get('/:id',)
router.post('/', userController.crearUser)
//router.put('/:id',)
//router.delete('/:id',)

module.exports = router