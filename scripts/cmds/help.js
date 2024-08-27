const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🤡| Cloud ]";

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "Redwan bokachoda", //
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

      msg += `╔══════════════╗\n  𝐇𝐈 𝐍𝐀 𝐓𝐀 ❤️🪽 ✿︎\n╚══════════════╝`;

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
      msg += `𝙲𝚄𝚁𝚁𝙴𝙽𝚃𝙻𝚈, 𝚃𝙷𝙸𝚂 𝙱𝙾𝚃 𝙷𝙰𝚅𝙴  ${totalCommands} 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝚃𝙷𝙰𝚃 𝙲𝙰𝙽 𝙱𝙴 𝚄𝚂𝙴𝙳. 𝚂𝙾𝙾𝙽 𝙼𝙾𝚁𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝚆𝙸𝙻𝙻 𝙱𝙴 𝙰𝙳𝙳𝙴𝙳...`;
      msg += `𝚃𝙷𝙰𝙽𝙺𝚂 𝙵𝙾𝚁 𝚄𝚂𝙸𝙽𝙶 𝙷𝙸𝙼𝚄'𝚂 𝙱𝙾𝚃`;

      const helpListImages = [
        "https://i.ibb.co/L9LzpTt/image.gif"
        "https://i.ibb.co/wBC6cq8/image.gif"
        "https://i.ibb.co/jgWY8nG/image.gif"
        "https://i.ibb.co/3cfZwZm/image.gif"
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

        const response = `╭── 𝙽𝙰𝙼𝙴 ────⭓
  │ ${configCommand.name}
  ├── 𝙸𝙽𝙵𝙾
  │ 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽: ${longDescription}
  │ 𝙾𝚃𝙷𝙴𝚁 𝙽𝙰𝙼𝙴𝚂: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ 𝙾𝚃𝙷𝙴𝚁 𝙽𝙰𝙼𝙴𝚂 𝙸𝙽 𝚈𝙾𝚄𝚁 𝙶𝚁𝙾𝚄𝙿: Do not have
  │ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽: ${configCommand.version || "1.0"}
  │ 𝚁𝙾𝙻𝙴: ${roleText}
  │ 𝚃𝙸𝙼𝙴 𝙿𝙴𝚁 𝙲𝙾𝙼𝙼𝙰𝙽𝙳: ${configCommand.countDown || 1}s
  │ 𝙰𝚄𝚃𝙷𝙾𝚁: ${author}
  ├── 𝚄𝚂𝙰𝙶𝙴
  │ ${usage}
  ├── 𝙽𝙾𝚃𝙴𝚂
  │ 𝚃𝙷𝙴 𝙲𝙾𝙽𝚃𝙴𝙽𝚃 𝙸𝙽𝚂𝙸𝙳𝙴 <XXXXX> 𝙲𝙰𝙽 𝙱𝙴 𝙲𝙷𝙰𝙽𝙶𝙴𝙳
  │ 𝚃𝙷𝙴 𝙲𝙾𝙽𝚃𝙴𝙽𝚃 𝙸𝙽𝚂𝙸𝙳𝙴 [𝙰|𝙱|𝙲] 𝙸𝚂 𝙰./.𝙱/.𝙲
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
