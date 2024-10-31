const { EmbedBuilder } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "leaderboard",
  description: "See where you rank on the leaderboard.",
  // deleted: true,
  // devOnly: true,
  testOnly: true,
  // ? option: Object[] - see docs for more info

  callback: async (client, interaction) => {
    const users = await prisma.user.findMany();

    const usersByBalance = users.sort((a, b) => b.balance - a.balance);

    leaderboardEmbed = new EmbedBuilder().setTitle("Leaderboard").addFields({
      name: "Top Balances",
      value: `${usersByBalance
        .map(
          (user, index) =>
            `${index + 1}. ${user.username} - **$${user.balance}**`
        )
        .join("\n")}`,
    });

    interaction.reply({
      embeds: [leaderboardEmbed],
    });
  },
};
