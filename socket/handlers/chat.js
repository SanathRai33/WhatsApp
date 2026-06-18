const { Message } = require("../../models");

module.exports = (socket, io) => {

  socket.on("chat-message", async (message) => {

    try {

      const savedMessage = await Message.create({
        userId: socket.user.id,
        message,
      });

      io.emit("chat-message", {
        id: savedMessage.id,
        userId: socket.user.id,
        username: socket.user.name,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt,
      });

    } catch (error) {

      console.error(
        "Error saving message:",
        error
      );

    }

  });

};