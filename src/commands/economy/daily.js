const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "daily",
  description: "Claim your daily reward",
  testOnly: true,
  callback: async (client, interaction) => {
    const user = await prisma.user.findUnique({
      where: {
        id: interaction.user.id,
      },
    });

    // Check if user has claimed their daily reward in the last 24 hours
    if (user.lastDaily != null) {
      const lastDaily = user.lastDaily.getTime() + 86400000;

      if (lastDaily > Date.now()) {
        return interaction.reply({
          content: `You can only claim your daily reward once every 24 hours. You can claim it again <t:${Math.floor(
            lastDaily / 1000
          )}:R>.`,
          ephemeral: true,
        });
      }
    }

    await prisma.user.update({
      where: {
        id: interaction.user.id,
      },
      data: {
        balance: user.balance + 100,
        lastDaily: new Date(),
      },
    });

    interaction.reply({
      content: `You have claimed your daily reward of $100!`,
    });
  },
};
