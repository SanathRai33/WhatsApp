module.exports = (socket, io) => {
  socket.on("join_room", (roomId) => {
    socket.join(roomId);

    console.log(`${socket.user.name} joined ${roomId}`);

    console.log(io.sockets.adapter.rooms.get(roomId));
  });

  socket.on("new_message", ({ roomId, message }) => {
    console.log("Message:", message, "Room:", roomId);
    io.to(roomId).emit("receive_message", {
      senderId: socket.user.id,
      senderName: socket.user.name,
      message,
      createdAt: new Date(),
    });
  });
};
