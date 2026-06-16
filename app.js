const cors = require("cors");
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const sequelize = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "chat.html"));
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

sequelize
  .sync()
  .then(() => {
    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(console.log);
