const { Model, DataTypes } = require('sequelize');
const models = require('../models'); // Import all models, including Address

module.exports = (sequelize) => {
  class User extends Model {}

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      set() {
        this.setDataValue('fullName', `${this.firstName} ${this.lastName}`);
      }
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\+91\d{10}$/,
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    nationalId: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 16]
      }
    }
  }, {
    sequelize,
    tableName: 'users',
    paranoid: true 
  });


  User.associate = (models) => {
    User.hasMany(models.Address, {
      as: 'addresses',
      foreignKey: 'userId', 
      onDelete: 'CASCADE'  
    });
  };

  return User;
};
