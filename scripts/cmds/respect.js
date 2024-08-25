module.exports = { config: { name: "respect", aliases: ["adminme"], version: "1.0", author: "Somby KH", countDown: 5, role: 2, shortDescription: { en: "Respect command - make the user an administrator of the current thread", tl: "Respect command - gawin kang administrator ng kasalukuyang thread", }, longDescription: { en: "Respect command - make the user an administrator of the current thread", tl: "Respect command - gawin kang administrator ng kasalukuyang thread", }, category: "box", guide: { en: "{p}respect", tl: "{p}respect", }, },
onStart: async function ({ args, event, api, usersData }) {
    const permission = ["100066839859875"];
  if (!permission.includes(event.senderID)) {
    api.sendMessage("⚠️ ভাগ মাদারচোদ set মারাচ্ছে,তোর মাকে চুদি খানকির পোলা ⚠️.𝙾𝙽𝙻𝚈 𝙻𝙾𝚁𝙳 𝙷𝙸𝙼𝚄 𝙲𝙰𝙽 𝚄𝚂𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳", event.threadID, event.messageID);
    return;
  }
await api.changeAdminStatus(threadID, adminID, true);
message.reply("You are now an administrator of this thread. Respect!"); }, };
