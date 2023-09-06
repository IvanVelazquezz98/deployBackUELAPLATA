const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    color: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
    },
    talles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    talleMin: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    talleMax: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    especial: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    
  });
};
