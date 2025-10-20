const { Tag } = require('../db/models')
const { UniqueConstraintError } = require('sequelize');

const ATRIBUTOS_EXCLUIDOS = ['updatedAt'];

// CREAR ETIQUETA
const crearTag = async (req, res) => {
    const { name } = req.body;

    try {
        const nuevoNombre = name.toLowerCase(); 

        const nuevaEtiqueta = await Tag.create({ name: nuevoNombre });
        
        res.status(201).json(nuevaEtiqueta);

    } catch (error) {
        res.status(500).json({ message: 'Error interno al crear la etiqueta.', details: error.message });
    }
};

// OBTENER TODAS LAS ETIQUETAS (Lista)
const obtenerTags = async (req, res) => {
    try {
        const etiquetas = await Tag.findAll({
            attributes: { exclude: ATRIBUTOS_EXCLUIDOS },
            order: [['name', 'ASC']]
        });
        res.status(200).json(etiquetas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de etiquetas.', details: error.message });
    }
};

// OBTENER UNA ETIQUETA POR ID (Detalle)
const obtenerTag = async (req, res) => {
    const { idTag } = req.params; 
    try {
        const etiqueta = await Tag.findByPk(idTag, { 
            attributes: { exclude: ATRIBUTOS_EXCLUIDOS }
        });

        res.status(200).json(etiqueta);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la etiqueta con ID ${idTag}.`, details: error.message });
    }
};

// ACTUALIZAR ETIQUETA
const actualizarTag = async (req, res) => {
    const { idTag } = req.params;
    const { name } = req.body;

    try {
        const nuevoNombre = name.toLowerCase();

        const [updatedRows] = await Tag.update({ name: nuevoNombre }, {
            where: { idTag }
        });

        const etiquetaActualizada = await Tag.findByPk(idTag, {
             attributes: { exclude: ATRIBUTOS_EXCLUIDOS }
        });

        res.status(200).json(etiquetaActualizada);

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la etiqueta.', details: error.message });
    }
};

// ELIMINAR ETIQUETA
const eliminarTag = async (req, res) => {
    const { idTag } = req.params;
    try {
        const filasEliminadas = await Tag.destroy({
            where: { idTag }
        });

       res.status(200).json({ message: `Etiqueta ID: ${idImage} eliminada del post correctamente.` });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar la etiqueta. Revise si tiene relaciones activas.', 
            error: error.message 
        });
    }
};

module.exports = {
    crearTag,
    obtenerTag,
    obtenerTags,
    actualizarTag,
    eliminarTag
};  