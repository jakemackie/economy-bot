const { ApplicationCommandOptionType } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "additem",
  description: "Manage items in the shop.",
  testOnly: true,
  options: [
    {
      name: "name",
      description: "The name of the item.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "description",
      description: "The description of the item.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "price",
      description: "The price of the item.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "category",
      description: "The category of the item.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const name = interaction.options.getString("name");
    const description = interaction.options.getString("description");
    const price = interaction.options.getInteger("price");
    const category = interaction.options.getString("category");

    await prisma.item.create({
      data: {
        name: name,
        description: description,
        price: price,
        category: category,
      },
    });

    interaction.reply({
      content: `Item ${name} has been added to the shop.`,
      ephemeral: true,
    });
  },
};
