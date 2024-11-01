const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "work",
  description: "Go to your boring 9-5 and earn some money.",
  // deleted: true,
  // devOnly: true,
  testOnly: true,
  // ? option: Object[] - see docs for more info

  callback: async (client, interaction) => {
    const user = await prisma.user.findUnique({
      where: {
        id: interaction.user.id,
      },
    });

    // Check if user has worked in the last 24 hours
    if (user.lastWorked != null) {
      const canWorkAgain = user.lastWorked.getTime() + 86400000;

      if (canWorkAgain > Date.now()) {
        return interaction.reply({
          content: `You can only work once every 24 hours. You can work again <t:${Math.floor(
            canWorkAgain / 1000
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
        balance: user.balance + 75,
        lastWorked: new Date(),
      },
    });

    interaction.reply({
      content: "You went to work and earned :moneybag: $75.",
    });
  },
};
