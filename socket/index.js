const jwt = require("jsonwebtoken");
// const chatHandler = require("./handlers/chat");
const personalChatHandler = require("./handlers/personalChat");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Token Required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Connected User:", socket.user.id);

    chatHandler(socket, io);

    personalChatHandler(socket, io);

    socket.on("disconnect", () => {
      console.log("Disconnected User:", socket.user.id);
    });
  });
};
