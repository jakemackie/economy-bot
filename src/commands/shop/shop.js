const { EmbedBuilder } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "shop",
  description: "View the items in the shop.",
  testOnly: true,

  callback: async (client, interaction) => {
    const shopEmbed = new EmbedBuilder().setTitle("Shop Items");
    const items = await prisma.item.findMany();

    items.sort((a, b) => a.category.localeCompare(b.category));

    let shop = [];
    for (let i = 0; i < items.length; i++) {
      shopEmbed.addFields({
        name: items[i].category,
        value: `${items[i].name} - **$${items[i].price}**\n-# ${items[i].description}`,
      });
    }

    interaction.reply({
      embeds: [shopEmbed],
    });
  },
};
