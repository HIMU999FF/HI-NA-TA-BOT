const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sdxl",
    aliases: [],
    author: "Redwan",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image using the SDXL API.",
    longDescription: "Generates an image using the provided prompt with the SDXL API.",
    category: "fun",
    guide: "{p}sdxl <prompt>"
  },
  onStart: async function ({ message, args, api, event }) {
    
    const obfuscatedAuthor = String.fromCharCode(82, 101, 100, 119, 97, 110);
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ | 𝚈𝙾𝚄 𝙽𝙴𝙴𝙳 𝚃𝙾 𝙿𝚁𝙾𝚅𝙸𝙳𝙴 𝙰 𝙿𝚁𝙾𝙼𝙿𝚃.", event.threadID);
    }

    api.sendMessage("𝙿𝙻𝙴𝙰𝚂𝙴 𝚆𝙰𝙸𝚃, 𝚆𝙴'𝚁𝙴 𝙼𝙰𝙺𝙸𝙽𝙶 𝚈𝙾𝚄𝚁 𝙿𝙸𝙲𝚃𝚄𝚁𝙴...", event.threadID, event.messageID);

    try {
      const apiUrl = `https://redwans-free-sdxl.onrender.com/api/sdxl?prompt=${encodeURIComponent(prompt)}&apikey=redwan`;
      console.log(`Requesting URL: ${apiUrl}`); 

      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      console.log("API response received"); 

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      const imagePath = path.join(cacheDir, `${Date.now()}_sdxl_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));
      console.log(`Image saved at: ${imagePath}`); 

      const imageStream = fs.createReadStream(imagePath);
      api.sendMessage({
        body: `𝙷𝙴𝚁𝙴 𝙸𝚂 𝚈𝙾𝚄𝚁 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳 𝙸𝙼𝙰𝙶𝙴 𝙵𝙾𝚁 𝚃𝙷𝙴 𝙿𝚁𝙾𝙼𝙿𝚃: "${prompt}"`,
        attachment: imageStream
      }, event.threadID);
      console.log("Image sent");
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response ? error.response.data : error.message;
      api.sendMessage(`❌ | An error occurred: ${errorMessage}`, event.threadID);
    }
  }
};
