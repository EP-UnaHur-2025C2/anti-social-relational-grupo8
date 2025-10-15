const { Comment } = require('../models');

const ATRIBUTOS_EXCLUIDOS = ['updatedAt']; 

// ACTUALIZAR COMENTARIO 
const actualizarComentario = async (req, res) => {
    const { idComment } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Solo se permite actualizar el campo "content".' });
    }

    try {
        const [updatedRows] = await Comment.update({ content }, {
            where: { idComment }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Comentario con ID ${idComment} no encontrado.` });
        }

        const comentarioActualizado = await Comment.findByPk(idComment, {
            attributes: { exclude: ATRIBUTOS_EXCLUIDOS }
        });
        
        res.status(200).json(comentarioActualizado);

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el comentario.', error: error.message });
    }
};

// ELIMINAR COMENTARIO
const eliminarComentario = async (req, res) => {
    const { idComment } = req.params;
    
    try {
        const filasEliminadas = await Comment.destroy({
            where: { idComment }
        });

        if (filasEliminadas === 0) {
            return res.status(404).json({ message: `Comentario con ID ${idComment} no encontrado.` });
        }

        res.status(204).send();
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar el comentario.', 
            error: error.message 
        });
    }
};

module.exports = {
    actualizarComentario,
    eliminarComentario
};