const Message = require("../models/message.model");

const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const savedMessage = await Message.create({
      userId,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Message saved",
      data: savedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};
