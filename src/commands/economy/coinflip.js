const { ApplicationCommandOptionType } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "coinflip",
  description: "Put up a bet and flip a coin.",
  // deleted: true,
  // devOnly: true,
  testOnly: true,
  options: [
    {
      name: "bet",
      description: "The amount you want to bet.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "side",
      description: "The side you want to bet on.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Heads",
          value: "heads",
        },
        {
          name: "Tails",
          value: "tails",
        },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const side = interaction.options.getString("side");
    const bet = interaction.options.getNumber("bet");

    if (bet < 1) {
      await interaction.reply({
        content: "So you want to bet less than a dollar? 🤔",
      });
      return;
    }

    await interaction.deferReply();

    const user = await prisma.user.findUnique({
      where: {
        id: interaction.user.id,
      },
    });

    if (user.balance < bet) {
      await interaction.editReply({
        content: "You don't have enough balance.",
      });
      return;
    }

    await interaction.editReply(`You bet :moneybag: $${bet} on ${side}...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const coin = Math.random() < 0.5 ? "heads" : "tails";

    if (side === coin) {
      await prisma.user.update({
        where: {
          id: interaction.user.id,
        },
        data: {
          balance: user.balance + bet,
        },
      });

      await interaction.editReply({
        content: `🎉 You won! The coin landed on ${coin}. You earned :moneybag: $${bet}!`,
      });
    } else {
      await prisma.user.update({
        where: {
          id: interaction.user.id,
        },
        data: {
          balance: user.balance - bet,
        },
      });

      await interaction.editReply({
        content: `😢 You lost! The coin landed on ${coin}. You lost :moneybag: $${bet}.`,
      });
    }
  },
};
