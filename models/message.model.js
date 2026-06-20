const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define("Message", {
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  messageType: {
    type: DataTypes.ENUM("text", "image", "video", "file"),
    defaultValue: "text",
  },

  fileUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Message;
