const { Message } = require("../models");

const { uploadToS3 } = require("../services/s3.service");

const uploadMedia = async (req, res) => {
  try {
    const { userId, groupId } = req.body;

    const file = req.file;

    const url = await uploadToS3(file);

    let type = "file";

    if (file.mimetype.startsWith("image")) {
      type = "image";
    }

    if (file.mimetype.startsWith("video")) {
      type = "video";
    }

    const mediaMessage = await Message.create({
      userId,
      groupId,
      messageType: type,
      fileUrl: url,
    });

    const io = req.app.get("io");

    io.to(`group_${groupId}`).emit("receive_group_media", {
      id: mediaMessage.id,

      senderId: userId,

      fileUrl: url,

      messageType: type,

      createdAt: mediaMessage.createdAt,
    });

    res.status(200).json({
      success: true,
      url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadMedia,
};
