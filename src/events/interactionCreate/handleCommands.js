const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { EmbedBuilder } = require("discord.js");
const prisma = require("../../../prisma/prisma.js");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (
      (commandObject.devOnly && !devs.includes(interaction.member.id)) ||
      (commandObject.testOnly && interaction.guild.id !== testServer)
    ) {
      interaction.reply({
        content: commandObject.devOnly
          ? "Only developers are allowed to run this command."
          : "This command cannot be ran here.",
      });
      return;
    }

    if (
      commandObject.permissionsRequired?.some(
        (permission) => !interaction.member.permissions.has(permission)
      )
    ) {
      interaction.reply({
        content: "Not enough permissions.",
      });
      return;
    }

    if (
      commandObject.botPermissions?.some(
        (permission) =>
          !interaction.guild.members.me.permissions.has(permission)
      )
    ) {
      interaction.reply({
        content: "I don't have enough permissions.",
      });
      return;
    }

    if (interaction.isAutocomplete()) {
      const focusedValue = interaction.options.getFocused();
      console.log(focusedValue);
    }

    const userIds = (await prisma.user.findMany({ select: { id: true } })).map(
      (user) => user.id
    );

    if (
      !userIds.includes(interaction.user.id) &&
      commandObject.name != "register"
    ) {
      const unregisteredEmbed = new EmbedBuilder()
        .setTitle("You are not registered!")
        .setDescription(
          `This bot stores data about its users to provide a better experience.
          To use it's full feature set, please run the \`/register\` command.`
        );
      await interaction.reply({
        embeds: [unregisteredEmbed],
      });
      return;
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
