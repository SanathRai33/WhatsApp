const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Token Required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return next(new Error("Unable to decode"));
      }

      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Connected User:", socket.user.id);

    socket.on("disconnect", () => {
      console.log("Disconnected User:", socket.user.id);
    });
  });
};
