const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define("Message", {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Message;