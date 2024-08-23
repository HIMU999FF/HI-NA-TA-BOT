const { getStreamFromURL } = require("fb-watchman");
module.exports = {
  config: {
    name: "admininfo",
    version: 2.0,
    author: "OtinXSandip",
    longDescription: "0info about bot and owner",
    category: "ai",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const imgURL = "https://i.imgur.com/ESkGzAy.gif";
    const attachment = await global.utils.getStreamFromURL(imgURL);

    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;

    const ment = [{ id: id, tag: name }];
    const a = "𝐇𝐈 𝐍𝐀 𝐓𝐀 ❤️🪽";
    const b = " . ";
    const c = "𝙇𝙊𝙍𝘿 𝙃𝙄𝙈𝙐";
const e = "𝙈𝘼𝙇𝙀";
    const d = "m.me/61551690584864";
const f = "ψΦυπ ΉιΜυ ヽ・　T.T";
const g = "𝙂𝙁 𝘿𝙀𝙉 🙂💔";

    message.reply({ 
      body: `${name}, here is the information 🌝
🌸 Bot's Name: ${a}
🌸 Bot's prefix: ${b}  
🌸 Owner: ${c}
🌸 Gender: ${e}
🌸 Messenger: ${d}
🌸 facebook: ${f}
🌸 Relationship: ${g}`,
mentions: ment,
      attachment: attachment });
  }
};
