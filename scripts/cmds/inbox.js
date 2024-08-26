module.exports = {
  config: {
    name: "inbox",
    aliases: ["inboxme", "in"],
    version: "1.0",
    author: "anchestor",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: ""
    },
    category: "fun",
    guide: {
      en: ""
    }
  },
  langs: {
    en: {
      gg: ""
    },
    id: {
      gg: ""
    }
  },
  onStart: async function({ api, event, args, message }) {
    try {
      const query = encodeURIComponent(args.join(' '));
      message.reply("☑ |✦ 𝙷𝚘𝚘 𝙸𝚗𝚋𝚘𝚌 𝚌𝚑𝚎𝚌𝚔 𝚍𝚎", event.threadID);
      api.sendMessage("👀 |✦ 𝚔𝚒𝚛𝚎 𝚊𝚋𝚊𝚕 😂😂", event.senderID);
    } catch (error) {
      console.error("Error bro: " + error);
    }
  }
};
