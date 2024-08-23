const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "";

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // original author Kshitiz
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╔══════════════╗\n 𝐇𝐈 𝐍𝐀 𝐓𝐀 ❤️🪽 \n╚══════════════╝`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭────────────⭓\n│『 ${category.toUpperCase()} 』\n╰────────⭓\n  `;
          const names = categories[category].commands.sort();
          msg += names.join(" ✧ ");
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝗖𝗨𝗥𝗥𝗘𝗡𝗧𝗟𝗬, 𝗧𝗛𝗜𝗦 𝗕𝗢𝗧 𝗛𝗔𝗩𝗘 ${totalCommands} 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗖𝗔𝗡 𝗕𝗘 𝗨𝗦𝗘𝗗. 𝗦𝗢𝗢𝗡 𝗠𝗢𝗥𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗪𝗜𝗟𝗟 𝗕𝗘 𝗔𝗗𝗗𝗘𝗗\n`;
      msg += `𝗧𝗛𝗔𝗡𝗞'𝗦 𝗙𝗢𝗥 𝗨𝗦𝗘𝗜𝗡𝗚 𝗛𝗜𝗠𝗨'𝗦 𝗕𝗢𝗧\n`;

      const helpListImages = [
        "https://cdn.fbsbx.com/v/t59.2708-21/455000713_2830476190440786_7583617146890715507_n.gif?_nc_cat=103&ccb=1-7&_nc_sid=cf94fc&_nc_eui2=AeGsIQTwsXMRIOsIvzcefAt60klg4mutWsnSSWDia61ayQr21URdQCShhw7Q46Zs0FL8YBmTI0vRAvNLqWrot-RN&_nc_ohc=WjArEp2r9c4Q7kNvgG4g38B&_nc_ht=cdn.fbsbx.com&oh=03_Q7cD1QHxSBBkL4snnbRswJ_Njf43cIAxopG55hxrrwbVvK-J9A&oe=66C6D3EB",
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription
          ? configCommand.longDescription.en || "No description"
          : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── NAME ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ Other names in your group: Do not have
  │ Version: ${configCommand.version || "1.0"}
  │ Role: ${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: ${author}
  ├── Usage
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is a or b or c
  ╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
