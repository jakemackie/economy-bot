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
      name: "daily",
      description: "The last time the user claimed their daily reward.",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Reset",
          value: "reset",
        },
      ],
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
    {
      name: "everything",
      description: "Reset everything for the user.",
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: "Reset",
          value: "reset",
        },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser("user");
    const balance = interaction.options.getInteger("balance");
    const lastDaily = interaction.options.getString("daily");
    const lastWorked = interaction.options.getString("shift");
    const everything = interaction.options.getString("everything");

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

    if (targetUser && lastWorked === "reset") {
      await prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          lastWorked: null,
        },
      });

      return interaction.reply({
        content: `Successfully reset the last worked at time of ${targetUser.tag}.`,
      });
    }

    if (targetUser && lastDaily === "reset") {
      await prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          lastDaily: null,
        },
      });

      return interaction.reply({
        content: `Successfully reset the last daily reward of ${targetUser.tag}.`,
      });
    }

    if (targetUser && everything === "reset") {
      await prisma.user.update({
        where: {
          id: targetUser.id,
        },
        data: {
          balance: 0,
          lastDaily: null,
          lastWorked: null,
        },
      });

      return interaction.reply({
        content: `Successfully reset everything for ${targetUser.tag}.`,
      });
    }
  },
};
