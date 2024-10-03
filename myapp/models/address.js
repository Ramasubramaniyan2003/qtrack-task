const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Address extends Model {}

  Address.init({
    addressType: {
      type: DataTypes.ENUM('Owned', 'Rent'),
      allowNull: false
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressLine2: DataTypes.STRING,
    addressLine3: DataTypes.STRING,
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[ 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Jammu and Kashmir',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 
        'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
        'Uttarakhand', 'West Bengal']]
      }
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isPermanent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'addresses',
    paranoid: true // Enable soft deletes
  });

  // Define association to User
  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: 'userId', // Define foreign key in Address table
      as: 'user'
    });
  };

  return Address;
};
