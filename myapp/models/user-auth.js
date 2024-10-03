const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class UserAuth extends Model {}
  UserAuth.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'User_Auth',
    timestamps: true,
  });
  return UserAuth;
};
