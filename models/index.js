const User = require("./user.model");
const Message = require("./message.model");

User.hasMany(Message, {
  foreignKey: "userId",
});

Message.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  User,
  Message,
};

