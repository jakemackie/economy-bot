const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Return a user's avatar",
  testOnly: true,
  options: [
    {
      name: "user",
      description: "The user to get the avatar of",
      type: ApplicationCommandOptionType.User,
    },
  ],

  callback: async (client, interaction) => {
    const user = interaction.options.getUser("user") || interaction.user;

    interaction.reply({
      content: user.displayAvatarURL({ dynamic: true }),
      ephemeral: true,
    });
  },
};
