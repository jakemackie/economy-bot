const { testServer } = require("../../../config.json");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      console.log(`Checking command: ${name}`);

      const existingCommand = await applicationCommands.cache.find(
        (command) => command.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command: ${name}`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`Edited command: ${name}`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(`Skipping deleted command: ${name}`);
          continue;
        }

        console.log(`Registering command: ${name}`);

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`Registered command: ${name}`);
      }
    }
  } catch (error) {}
};
