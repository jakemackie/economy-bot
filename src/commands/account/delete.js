const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "delete",
  description: "Delete the account you've registered.",
  // deleted: true,
  // devOnly: true,
  testOnly: true,
  // ? option: Object[] - see docs for more info

  callback: async (client, interaction) => {
    const userIds = (await prisma.user.findMany({ select: { id: true } })).map(
      (user) => user.id
    );

    if (!userIds.includes(interaction.user.id)) {
      interaction.reply({
        content: "You aren't registered.",
      });
      return;
    }

    await prisma.user.delete({
      where: {
        id: interaction.user.id,
      },
    });

    interaction.reply({
      content: "You have deleted your account.",
    });
  },
};
