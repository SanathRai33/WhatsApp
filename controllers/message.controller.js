const { Message, User } = require("../models");

const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const savedMessage = await Message.create({
      userId,
      message,
    });

    const io = req.app.get("io");

    io.emit("new-message", {
      id: savedMessage.id,
      message: savedMessage.message,
      userId: savedMessage.userId,
      createdAt: savedMessage.createdAt,
    });

    res.status(201).json({
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      userId: msg.userId,
      username: msg.User.name,
      createdAt: msg.createdAt,
    }));

    res.status(200).json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
