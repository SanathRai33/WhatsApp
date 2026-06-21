const cron = require("node-cron");

const { Message, ArchivedMessage } = require("../models");

const { Op } = require("sequelize");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running Archive Job...");

    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);

    const oldMessages = await Message.findAll({
      where: {
        createdAt: {
          [Op.lt]: yesterday,
        },
      },
    });

    if (oldMessages.length === 0) {
      return;
    }

    const archivedData = oldMessages.map((msg) => ({
      message: msg.message,

      userId: msg.userId,

      createdAt: msg.createdAt,
    }));

    await ArchivedMessage.bulkCreate(archivedData);

    await Message.destroy({
      where: {
        createdAt: {
          [Op.lt]: yesterday,
        },
      },
    });

    console.log(`${oldMessages.length} messages archived`);
  } catch (error) {
    console.log(error);
  }
});
