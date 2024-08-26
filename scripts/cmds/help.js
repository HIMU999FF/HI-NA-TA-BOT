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
    author: "Redwan", //
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
        "https://cdn.fbsbx.com/v/t59.2708-21/457138388_2109192002796381_1366198046820783446_n.gif?_nc_cat=107&ccb=1-7&_nc_sid=cf94fc&_nc_ohc=KmCDxFiSDHgQ7kNvgHNYTuF&_nc_ht=cdn.fbsbx.com&oh=03_Q7cD1QHw37l1VSA-yniWQZ3gm2KracqGHOo25Npz5FDtPkuhmA&oe=66CD8824",
        "https://cdn.fbsbx.com/v/t59.2708-21/454943164_378768954990996_7123603931943236176_n.gif?_nc_cat=105&ccb=1-7&_nc_sid=cf94fc&_nc_ohc=UYNTM3kB_YcQ7kNvgFme3J_&_nc_ht=cdn.fbsbx.com&oh=03_Q7cD1QHEe6vC0znCaB9VFOYcgAdmrmdS8rwiBPuLmjcprssbLA&oe=66CD78D5"
        "https://cdn.fbsbx.com/v/t59.2708-21/456974986_1975198256259984_4646494319331856442_n.gif?_nc_cat=107&ccb=1-7&_nc_sid=cf94fc&_nc_ohc=Xv2DTCj80AYQ7kNvgH0TdK6&_nc_ht=cdn.fbsbx.com&oh=03_Q7cD1QHfHsCdXHqz6YQWSrKQO-i4o2g4_RTND5ACLfn8mnr2kA&oe=66CD8E18"
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
