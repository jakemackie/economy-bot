const { ApplicationCommandOptionType } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "give",
  description: "Give money to another user",
  options: [
    {
      name: "user",
      description: "User to give money to",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "amount",
      description: "Amount to give",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const targetUser = interaction.options.getUser("user");
    const amount = interaction.options.getNumber("amount");

    if (amount < 1) {
      await interaction.reply({
        content: "You can't give less than a dollar.",
      });
      return;
    }

    if (targetUser.id === interaction.user.id) {
      await interaction.reply({
        content: "You can't give money to yourself.",
      });
      return;
    }

    await interaction.deferReply();

    const user = await prisma.user.findUnique({
      where: {
        id: interaction.user.id,
      },
    });

    if (user.balance < amount) {
      await interaction.editReply({
        content: "You don't have enough balance.",
      });
      return;
    }

    const target = await prisma.user.findUnique({
      where: {
        id: targetUser.id,
      },
    });

    if (!target) {
      return await interaction.editReply({
        content: "User not found in database, have they registered?",
      });
    }

    await prisma.user.update({
      where: {
        id: interaction.user.id,
      },
      data: {
        balance: user.balance - amount,
      },
    });

    await prisma.user.update({
      where: {
        id: targetUser.id,
      },
      data: {
        balance: target.balance + amount,
      },
    });

    await interaction.editReply({
      content: `You gave $${amount} to ${target.username}.`,
    });
  },
};
