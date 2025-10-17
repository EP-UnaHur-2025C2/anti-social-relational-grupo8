'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Relación M:N con Post (Una etiqueta puede estar asociada a muchos posts)
      Tag.belongsToMany(models.Post, { 
        through: 'PostTags', 
        foreignKey: 'idTag', 
        as: 'Posts' 
      });
    }
  }
  
  Tag.init({
    idTag: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'Tags',
    timestamps: false 
  });
  return Tag;
};