const prisma = require("../../../prisma/prisma.js");

module.exports = {
  name: "users",
  description: "See all registered users.",
  testOnly: true,

  callback: async (client, interaction) => {
    const users = await prisma.user.findMany();
    const usersList = [];

    users.forEach((user) => {
      usersList.push(
        `ID: ${user.id}
Username: ${user.username}
Display Name: ${user.displayName}
Balance: ${user.balance}
Last Worked: ${
          user.lastWorked ? new Date(user.lastWorked).toLocaleString() : "Never"
        }
Last Daily: ${
          user.lastDaily ? new Date(user.lastDaily).toLocaleString() : "Never"
        }
-----------------`
      );
    });

    if (usersList.length === 0) {
      return interaction.reply({
        content: "No registered users found.",
        ephemeral: true,
      });
    }

    interaction.reply({
      content: `**Registered Users:**\n\`\`\`${usersList.join("\n")}\`\`\``,
      ephemeral: true,
    });
  },
};
