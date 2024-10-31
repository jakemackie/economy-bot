const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "register",
  description: "Register an account using your public Discord profile data.",
  // deleted: true,
  devOnly: true,
  testOnly: true,
  // ? option: Object[] - see docs for more info

  callback: async (client, interaction) => {
    const userIds = (await prisma.user.findMany({ select: { id: true } })).map(
      (user) => user.id
    );

    if (userIds.includes(interaction.user.id)) {
      interaction.reply({
        content: "You are already registered.",
        ephemeral: true,
      });
      return;
    }

    await prisma.user.create({
      data: {
        id: interaction.user.id,
        username: interaction.user.username,
        displayName: interaction.user.username,
      },
    });

    interaction.reply({
      content: "You have successfully registered.",
      ephemeral: true,
    });
  },
};
