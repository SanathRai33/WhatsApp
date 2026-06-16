const { Message } = require("../models");

const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const savedMessage = await Message.create({
      userId,
      message,
    });

    res.status(201).json({
      success: true,
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      attributes: [
        "id",
        "message",
        "userId",
        "createdAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
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