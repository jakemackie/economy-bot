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

    await prisma.user.update({
      where: {
        id: interaction.user.id,
      },
      data: {
        balance: user.balance + 100,
      },
    });

    interaction.reply({
      content: "You went to work and earned :moneybag: $100.",
    });
  },
};
