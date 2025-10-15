const { Tag } = require('../db/models')
const { UniqueConstraintError } = require('sequelize');

const ATRIBUTOS_EXCLUIDOS = ['updatedAt'];

// CREAR ETIQUETA
const crearTag = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'El nombre (name) de la etiqueta es obligatorio.' });
    }

    try {
        const nuevoNombre = name.toLowerCase(); 

        const nuevaEtiqueta = await Tag.create({ name: nuevoNombre });
        
        res.status(201).json(nuevaEtiqueta);

    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: `La etiqueta "${name}" ya existe.` });
        }
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

        if (!etiqueta) {
            return res.status(404).json({ message: `Etiqueta con ID ${idTag} no encontrada.` });
        }
        res.status(200).json(etiqueta);
    } catch (error) {
        res.status(500).json({ message: `Error al obtener la etiqueta con ID ${idTag}.`, details: error.message });
    }
};

// ACTUALIZAR ETIQUETA
const actualizarTag = async (req, res) => {
    const { idTag } = req.params;
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'El campo "name" de la etiqueta es obligatorio para actualizar.' });
    }

    try {
        const nuevoNombre = name.toLowerCase();

        const [updatedRows] = await Tag.update({ name: nuevoNombre }, {
            where: { idTag }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Etiqueta con ID ${idTag} no encontrada.` });
        }

        const etiquetaActualizada = await Tag.findByPk(idTag, {
             attributes: { exclude: ATRIBUTOS_EXCLUIDOS }
        });

        res.status(200).json(etiquetaActualizada);

    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: `La etiqueta "${name}" ya existe.` });
        }
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

        if (filasEliminadas === 0) {
            return res.status(404).json({ message: `Etiqueta con ID ${idTag} no encontrada.` });
        }

        res.status(204).send();
        
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
    obtenerTag,
    actualizarTag,
    eliminarTag
};

/*
const crearTag = async (req, res) => {
    try {
        const { name } = req.body
        const tag = await tag.create({
            name
        })
        res.status(201).json(tag)
    } catch (error) {
        res.status(500).json({ message: error.messages })
    }
}

const obtenerTags = async (req , res) => {
    const tag = await Tag.findAll()
    res.json(tag)
}

const obtenerTag = async (req , res) => {
    const tag = await Tag.findByPK(req.params.id)
    if (!tag) return res.status(404).json({ message: 'tag no encontrado' })
    res.json(tag)
}

const actualizarTag = async (req , res) => {
    const tag = await Tag.findByPK(req.params.id)
    if (!tag) return res.status(404).json({ message: 'tag no encontrado' })
    await tag.update(req.body)
    res.json(tag)
}

const eliminarTag = async (req , res) => {
    const tag = await Tag.findByPK(req.params.id)
    if (!tag) return res.status(404).json({ message: 'tag no encontrado' })
    await tag.destroy()
    res.json({ message: 'tag eliminado correctamente' })
}

module.exports = {
    crearTag,
    obtenerTags,
    obtenerTag,
    actualizarTag,
    eliminarTag
}
*/