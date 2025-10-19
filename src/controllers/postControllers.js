const { Post, PostImage, Comment, Tag, sequelize } = require('../db/models');
const { Op } = require('sequelize');

const MONTHS_THRESHOLD = parseInt(process.env.COMMENTS_VISIBILITY_MONTHS, 10) || 6;
const ATRIBUTOS_POST_BASE = ['idPost', 'idUser', 'description', 'createdAt'];

// CREAR PUBLICACIÓN
async function crearPublicacion(req, res) {
    const { idUser, description, imageUrls } = req.body;
    if (!idUser || !description) {
        return res.status(400).json({ message: 'El post debe tener idUser y description obligatoriamente.' });
    }
    try {
        const nuevaPublicacion = await Post.create({ idUser, description });
        if (imageUrls && imageUrls.length > 0) {
            const imagenes = imageUrls.map(url => ({ idPost: nuevaPublicacion.idPost, imageUrl: url }));
            await PostImage.bulkCreate(imagenes);
        }
        res.status(201).json(nuevaPublicacion);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la publicación.', error: error.message });
    }
}

// OBTENER TODAS LAS PUBLICACIONES
async function obtenerPublicaciones(req, res) {
    try {
        const publicaciones = await Post.findAll({
            attributes: ATRIBUTOS_POST_BASE,
            include: [
                { model: sequelize.models.User, as: 'User', attributes: ['idUser', 'nickName'] },
                { model: sequelize.models.PostImage, as: 'Images', attributes: ['imageUrl'] },
                { model: sequelize.models.Tag, as: 'Tags', attributes: ['name'], through: { attributes: [] } },
            ],
            order: [['createdAt', 'DESC']] 
        });
        res.status(200).json(publicaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de publicaciones.', error: error.message });
    }
}

// OBTENER UNA PUBLICACIÓN POR ID 
async function obtenerPublicacion(req, res) {
    const { idPost } = req.params;
    try {
        const post = await Post.findByPk(idPost, {
            include: [
                { model: sequelize.models.User, as: 'User', attributes: ['idUser', 'nickName', 'firstName'] },
                { model: sequelize.models.PostImage, as: 'Images', attributes: ['idImage', 'imageUrl'] },
                { model: sequelize.models.Tag, as: 'Tags', attributes: ['idTag', 'name'], through: { attributes: [] } },
            ]
        });

        if (!post) { return res.status(404).json({ message: `Publicación con ID ${idPost} no encontrada.` }); }
        
        const fechaUmbral = new Date(); 
        fechaUmbral.setMonth(fechaUmbral.getMonth() - MONTHS_THRESHOLD); 
        
        const comentariosVisibles = await Comment.findAll({
            where: {
                idPost: idPost,
                createdAt: { [Op.gte]: fechaUmbral }
            },
            include: [{ model: sequelize.models.User, as: 'User', attributes: ['idUser', 'nickName'] }],
            order: [['createdAt', 'DESC']]
        });

        const postConComentarios = {
            ...post.toJSON(),
            Comments: comentariosVisibles
        };

        res.status(200).json(postConComentarios);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la publicación.', error: error.message });
    }
}

// ACTUALIZAR PUBLICACIÓN
async function actualizarPublicacion(req, res) {
    const { idPost } = req.params;
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ message: 'Solo se permite actualizar el campo "description".' });
    }

    try {
        const [updatedRows] = await Post.update({ description }, {
            where: { idPost }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Publicación con ID ${idPost} no encontrada.` });
        }

        const postActualizado = await Post.findByPk(idPost, { attributes: ATRIBUTOS_POST_BASE });
        res.status(200).json(postActualizado);

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la publicación.', error: error.message });
    }
}

// ELIMINAR PUBLICACIÓN
async function eliminarPublicacion(req, res) {
    const { idPost } = req.params;
    try {
        const filasEliminadas = await Post.destroy({
            where: { idPost }
        });

        if (filasEliminadas === 0) {
            return res.status(404).json({ message: `Publicación con ID ${idPost} no encontrada.` });
        }

        res.status(204).send(); 

    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar la publicación. Verifique permisos o dependencias.', 
            error: error.message 
        });
    }
}

// CREAR COMENTARIO
async function crearComentario(req, res) {
    const { idPost } = req.params;
    const { idUser, content } = req.body;

    try {
        const post = await Post.findByPk(idPost);

        const nuevoComentario = await Comment.create({ idPost, idUser, content });
        res.status(201).json(nuevoComentario);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el comentario.', error: error.message });
    }
}

// AGREGAR IMAGENES 
async function agregarImagenes(req, res) {
    const { idPost } = req.params;
    const { imageUrls } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return res.status(400).json({ message: 'Se requiere un array de imageUrls válidas.' });
    }

    try {
        const post = await Post.findByPk(idPost);
        if (!post) { return res.status(404).json({ message: `Publicación con ID ${idPost} no encontrada.` }); }

        const nuevasImagenes = imageUrls.map(url => ({ idPost: idPost, imageUrl: url }));
        const resultados = await PostImage.bulkCreate(nuevasImagenes, { ignoreDuplicates: true });

        res.status(201).json({ 
            idImage: PostImage.id,
            message: 'Imágenes agregadas.', 
            agregadas: resultados.length 
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Una o más URLs de imagen ya existen.' });
        }
        res.status(500).json({ message: 'Error al agregar imágenes.', error: error.message });
    }
}

// ELIMINAR IMAGEN 
async function eliminarImagen(req, res) {
    const { idPost, idImage } = req.params;

    try {
        const eliminadas = await PostImage.destroy({
            where: { idImage, idPost }
        });

        if (eliminadas === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada o no pertenece a este post.' });
        }

        res.status(200).json({ message: `Imagen ID: ${idImage} eliminada correctamente.` });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la imagen.', error: error.message });
    }
}

// ASOCIAR ETIQUETAS (Relación M:N)
async function asociarEtiquetas(req, res) {
    const { idPost } = req.params;
    const { tagNames } = req.body;

    const t = await sequelize.transaction(); 

    try {
        const post = await Post.findByPk(idPost, { transaction: t }); 
        
        const promesasEtiquetas = tagNames.map(tagName => 
            Tag.findOrCreate({
                where: { name: tagName.toLowerCase() },
                defaults: { name: tagName.toLowerCase() },
                transaction: t 
            })
        );

        const resultadosEtiquetas = await Promise.all(promesasEtiquetas);
        const instanciasTag = resultadosEtiquetas.map(([tag]) => tag);

        await post.addTags(instanciasTag, { transaction: t }); 
        await t.commit(); 

        res.status(200).json({ 
            message: `Etiquetas asociadas exitosamente al Post ${idPost}.`,
            tags: instanciasTag.map(t => ({ idTag: t.idTag, name: t.name }))
        });

    } catch (error) {
        await t.rollback(); 
        res.status(500).json({ message: 'Error al asociar etiquetas.', error: error.message });
    }
}

// ELIMINAR ETIQUETA (Relación M:N)
async function eliminarEtiqueta(req, res) {
    const { idPost, idTag } = req.params;

    try {
        const post = await Post.findByPk(idPost);
        const tag = await Tag.findByPk(idTag);

        const resultado = await post.removeTag(tag);

        if (resultado === 0) {
            return res.status(200).json({ message: 'La relación Post-Tag no existía, no se realizó ninguna acción.' });
        }

        res.status(204).send();

    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la etiqueta del post.', error: error.message });
    }
}


module.exports = {
    crearPublicacion,
    obtenerPublicaciones,
    obtenerPublicacion,
    actualizarPublicacion,
    eliminarPublicacion,
    crearComentario,
    agregarImagenes,
    eliminarImagen,
    asociarEtiquetas,
    eliminarEtiqueta
};