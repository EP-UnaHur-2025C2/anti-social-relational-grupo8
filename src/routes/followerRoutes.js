const { Router } = require('express');
const followerControllers = require('../controllers/followerControllers'); 
const { validarUsuarioExiste } = require('../middlewares/validateUser');
const router = Router();

// RUTAS DE GESTIÓN DE SEGUIDORES

// C: Seguir a otro usuario
router.post('/:followerId/follow/:followingId', validarUsuarioExiste, followerControllers.seguirUsuario);

// D: Dejar de seguir a otro usuario
router.delete('/:followerId/unfollow/:followingId', validarUsuarioExiste, followerControllers.dejarDeSeguirUsuario);

// R: Obtener la lista de usuarios que sigue un usuario (Followings)
router.get('/:followerId/followings', followerControllers.obtenerSeguidos);

// R: Obtener la lista de seguidores de un usuario (Followers)
router.get('/:followingId/followers', followerControllers.obtenerSeguidores);

module.exports = router;