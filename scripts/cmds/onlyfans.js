const axios = require("axios");
const fs = require("fs");
const path = require("path");


async function checkAuthor(authorName) {
  try {
    const response = await axios.get('https://author-check.vercel.app/name');
    const apiAuthor = response.data.name;
    return apiAuthor === authorName;
  } catch (error) {
    console.error("Error checking author:", error);
    return false;
  }
}

module.exports = {
  config: {
    name: "onlyfans",
    aliases: ["onlyfan"],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Get OnlyFans video",
    longDescription: "Fetches a random video from OnlyFans",
    category: "social",
    guide: "{p}onlyfans"
  },

  onStart: async function ({ api, event, args, message }) {
  
    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      await message.reply("Author changer alert! This command belongs to Vex_Kshitiz.");
      return;
    }

    const apiUrl = "https://only-fans-iota.vercel.app/kshitiz";

    try {
      const response = await axios.get(apiUrl);
      const { videoUrl, title } = response.data;

 
      const tempVideoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);
      const writer = fs.createWriteStream(tempVideoPath);
      const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
      videoResponse.data.pipe(writer);

      writer.on("finish", () => {
        const stream = fs.createReadStream(tempVideoPath);

        message.reply({
          body: ``,
          attachment: stream,
        });
      });

    } catch (error) {
      console.error("Error fetching OnlyFans video:", error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
  };
