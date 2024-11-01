const { ApplicationCommandOptionType } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "balance",
  description: "Check your balance.",
  // deleted: true,
  // devOnly: true,
  testOnly: true,
  options: [
    {
      name: "user",
      description: "The user you want to check the balance of.",
      type: ApplicationCommandOptionType.User,
    },
  ],

  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser("user");

    if (targetUser) {
      const user = await prisma.user.findUnique({
        where: {
          id: targetUser.id,
        },
      });

      if (!user) {
        return interaction.reply({
          content: "User not found in database, have they registered?",
          ephemeral: true,
        });
      }

      return interaction.reply({
        content: `${user.displayName}'s balance is: :moneybag: $${user.balance}`,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: interaction.user.id,
      },
    });

    interaction.reply({
      content: `Your balance is: :moneybag: $${user.balance}`,
    });
  },
};
