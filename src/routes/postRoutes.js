const { Router } = require('express');
const postControllers = require('../controllers/postControllers');
const router = Router();

// RUTAS CRUD PRINCIPAL DEL POST (Mapeo a: /api/v1/posts)

// C: Crear un nuevo post 
router.post('/', postControllers.crearPublicacion);

// R: Obtener todos los posts 
router.get('/', postControllers.obtenerPublicaciones);

// R: Obtener un post por ID (incluye imágenes y COMENTARIOS VISIBLES)
router.get('/:idPost', postControllers.obtenerPublicacion); 

// U: Actualizar solo la descripción del post
router.put('/:idPost', postControllers.actualizarPublicacion);

// D: Eliminar un post
router.delete('/:idPost', postControllers.eliminarPublicacion);


// RUTAS DE RELACIÓN 

// Agregar una o más imágenes a un post
router.post('/:idPost/imagenes', postControllers.agregarImagenes);

// Eliminar una imagen de un post
router.delete('/:idPost/imagenes/:idImage', postControllers.eliminarImagen);

// Crear un comentario en un post
router.post('/:idPost/comentarios', postControllers.crearComentario);

// Asociar etiquetas a un post
router.post('/:idPost/etiquetas', postControllers.asociarEtiquetas);

// Desasociar una etiqueta de un post
router.delete('/:idPost/etiquetas/:idTag', postControllers.eliminarEtiqueta);


module.exports = router;