const { Router } = require('express');
const followerControllers = require('../controllers/followerControllers'); 
const { validarAmbosUsuariosExisten } = require('../middlewares/validateFollowers');
const router = Router();

// RUTAS DE GESTIÓN DE SEGUIDORES

// C: Seguir a otro usuario
router.post('/:followerId/follow/:followingId',validarAmbosUsuariosExisten , followerControllers.seguirUsuario);

// D: Dejar de seguir a otro usuario
router.delete('/:followerId/unfollow/:followingId', validarAmbosUsuariosExisten , followerControllers.dejarDeSeguirUsuario);

// R: Obtener la lista de usuarios que sigue un usuario (Followings)
router.get('/:followerId/followings', followerControllers.obtenerSeguidos);

// R: Obtener la lista de seguidores de un usuario (Followers)
router.get('/:followerId/followers', followerControllers.obtenerSeguidores);

module.exports = router;