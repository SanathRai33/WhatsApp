const User = require("./models/user.model");
const Message = require("./models/message.model");

User.hasMany(Message, {
  foreignKey: "userId",
});

Message.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, Message };
