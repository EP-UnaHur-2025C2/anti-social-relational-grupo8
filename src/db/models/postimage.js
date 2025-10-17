'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostImage extends Model {
    static associate(models) {
      // Relación M:1 con Post (Una imagen pertenece a un solo post)
      PostImage.belongsTo(models.Post, { 
        foreignKey: 'idPost', 
        as: 'Post' 
      });
    }
  }
  
  PostImage.init({
    idImage: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idPost: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
  }, {
    sequelize,
    modelName: 'PostImage',
    tableName: 'PostImages',
    timestamps: false
  });
  return PostImage;
};