const { Router } = require('express');
const postControllers = require('../controllers/postControllers');
const {
  validarPost,
  validarDescripcionUnica,
  validarPostExistente,
} = require('../middlewares/validatePost');

const {
  validarImagen,
  validarImagenDuplicada,
} = require('../middlewares/validateImage');

const {
  validarUsuarioExiste,
} = require('../middlewares/validateUser');

const validateComment = require('../middlewares/validateComment');

const validateTags = require('../middlewares/validateTag');

const router = Router();

// RUTAS CRUD PRINCIPAL DEL POST (Mapeo a: /api/v1/posts)

// C: Crear un nuevo post 
//router.post('/', postControllers.crearPublicacion);
router.post(
  '/',
  validarPost,                
  validarDescripcionUnica,
  validarUsuarioExiste('body'),
  validarImagen,
  validarImagenDuplicada,
  postControllers.crearPublicacion
);


// R: Obtener todos los posts 
router.get('/', postControllers.obtenerPublicaciones);

// R: Obtener un post por ID (incluye imágenes y COMENTARIOS VISIBLES)
router.get('/:idPost', validarPostExistente, postControllers.obtenerPublicacion); 

// U: Actualizar solo la descripción del post
router.put('/:idPost', validarPostExistente, validarDescripcionUnica, postControllers.actualizarPublicacion);

// D: Eliminar un post
router.delete('/:idPost', validarPostExistente, postControllers.eliminarPublicacion);


// RUTAS DE RELACIÓN 

// Agregar una o más imágenes a un post
router.post('/:idPost/imagenes', validarImagen, validarImagenDuplicada, postControllers.agregarImagenes);

// Eliminar una imagen de un post
router.delete('/:idPost/imagenes/:idImage', validarImagen, postControllers.eliminarImagen);

// Crear un comentario en un post
router.post('/:idPost/comentarios', validateComment.validarCrearComentario, validarPostExistente, postControllers.crearComentario);

// Asociar etiquetas a un post
router.post('/:idPost/etiquetas', validateTags.validateTag, validarPostExistente,postControllers.asociarEtiquetas);



// Desasociar una etiqueta de un post
router.delete('/:idPost/etiquetas/:idTag', validateTags.validateExisteTag, validarPostExistente, postControllers.eliminarEtiqueta);

module.exports = router;