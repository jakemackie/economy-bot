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
    if (user.lastWorkedAt > new Date(Date.now() - 86400000)) {
      return interaction.reply({
        content: "You can only work once every 24 hours.",
        ephemeral: true,
      });
    }

    await prisma.user.update({
      where: {
        id: interaction.user.id,
      },
      data: {
        balance: user.balance + 75,
        lastWorkedAt: new Date(),
      },
    });

    interaction.reply({
      content: "You went to work and earned :moneybag: $75.",
    });
  },
};
