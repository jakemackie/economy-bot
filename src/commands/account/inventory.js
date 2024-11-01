const { ApplicationCommandOptionType } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "inventory",
  description: "Check your own or someone else's inventory.",
  testOnly: true,
  options: [
    {
      name: "user",
      description: "The user to check the inventory of.",
      type: ApplicationCommandOptionType.User,
    },
  ],

  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser("user") || interaction.user;

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

    if (!user.inventory) {
      return interaction.reply({
        content: `${user.displayName} has no items in their inventory.`,
        ephemeral: true,
      });
    }

    interaction.reply({
      content: `${user.displayName}'s inventory: ${user.inventory}`,
    });
  },
};
