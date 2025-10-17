'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // 1. Relación M:1 con Post (Un comentario pertenece a un post)
      Comment.belongsTo(models.Post, { 
        foreignKey: 'idPost', 
        as: 'Post' 
      });
      
      // 2. Relación M:1 con User (Un comentario pertenece a un usuario)
      Comment.belongsTo(models.User, { 
        foreignKey: 'idUser', 
        as: 'User' 
      });
    }
  }
  
  Comment.init({
    idComment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idPost: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idUser: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    timestamps: true 
  });
  return Comment;
};