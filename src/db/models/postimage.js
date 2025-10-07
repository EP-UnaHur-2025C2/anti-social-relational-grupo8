'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  }
  PostImage.init({
    url: {
      type: DataTypes.STRING,
      unique:true,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'PostImage',
    timestamps:false
  });
  return PostImage;
};