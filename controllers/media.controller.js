const { uploadFile } =
  require("../services/s3.service");

const uploadMedia =
  async (req, res) => {

    try {

      const file = req.file;

      const fileUrl =
        await uploadFile(file);

      const io =
        req.app.get("io");

      io.emit("new-media", {
        senderId:
          req.body.userId,

        mediaUrl:
          fileUrl,

        fileType:
          file.mimetype,
      });

      res.status(200).json({
        success: true,
        url: fileUrl,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }

  };

module.exports = {
  uploadMedia,
};