const { Tag } = require('../db/models')

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