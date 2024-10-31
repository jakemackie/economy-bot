const { ApplicationCommandOptionType } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "set",
  description: "Set the balance of a user.",
  // deleted: true,
  devOnly: true,
  testOnly: true,
  options: [
    {
      name: "user",
      description: "The user you want to set the balance of.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "balance",
      description: "The balance you want to set.",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: "shift",
      description: "The last time the user worked.",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Reset",
          value: "reset",
        },
      ],
      required: false,
    },
  ],

  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser("user");
    const balance = interaction.options.getInteger("balance");
    const lastWorkedAt = interaction.options.getString("shift");

    if (targetUser && balance != null) {
      await prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          balance: balance,
        },
      });

      return interaction.reply({
        content: `Successfully set the balance of ${targetUser.tag} to :moneybag: $${balance}.`,
      });
    }

    if (targetUser && lastWorkedAt === "reset") {
      await prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          lastWorkedAt: null,
        },
      });

      return interaction.reply({
        content: `Successfully reset the last worked at time of ${targetUser.tag}.`,
      });
    }
  },
};
