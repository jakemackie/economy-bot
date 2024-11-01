const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "users",
  description: "See all registered users.",
  // deleted: true,
  // devOnly: true,
  testOnly: true,
  // ? option: Object[] - see docs for more info

  callback: async (client, interaction) => {
    const users = await prisma.user.findMany();
    const usersList = [];

    users.forEach((user) => {
      usersList.push(`\`\`\`${user.lastDaily}\`\`\``);
    });

    interaction.reply({
      content: `${usersList.join(" ")}`,
    });
  },
};
