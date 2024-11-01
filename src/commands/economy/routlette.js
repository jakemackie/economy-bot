const { ApplicationCommandOptionType } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "roulette",
  description: "Put up a bet and spin the roulette wheel.",
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
      name: "color",
      description: "The color you want to bet on.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Red",
          value: "red",
        },
        {
          name: "Black",
          value: "black",
        },
        {
          name: "Green",
          value: "green",
        },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const bet = interaction.options.getNumber("bet");
    const color = interaction.options.getString("color");

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

    await interaction.editReply(`The roulette wheel is spinning...`);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const colors = {
      red: 0.4865,
      black: 0.4865,
      green: 0.027,
    };

    const probabilities = {
      red: colors.red,
      black: colors.red + colors.black,
      green: 1,
    };

    const rouletteBall = Math.random();
    let rouletteColor;

    if (rouletteBall < probabilities.red) {
      rouletteColor = "red";
    } else if (rouletteBall < probabilities.black) {
      rouletteColor = "black";
    } else {
      rouletteColor = "green";
    }

    if (rouletteColor === color) {
      await prisma.user.update({
        where: {
          id: interaction.user.id,
        },
        data: {
          balance: {
            increment: bet,
          },
        },
      });

      await interaction.editReply(
        `The roulette ball landed on ${rouletteColor}! You won $${winnings}.`
      );
    } else {
      await prisma.user.update({
        where: {
          id: interaction.user.id,
        },
        data: {
          balance: {
            decrement: bet,
          },
        },
      });

      await interaction.editReply(
        `The roulette ball landed on ${rouletteColor}! You lost $${bet}.`
      );
    }
  },
};
