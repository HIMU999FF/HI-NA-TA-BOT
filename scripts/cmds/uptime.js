const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up"],
    version: "1.0",
    author: "Rafi",
    role: 0,
    category: "System",
    guide: {
      en: "Use {pn}info"
    }
  },
  onStart: async function ({ message }) {
    const startTime = new Date(); // Bot start time
    const uptime = process.uptime();
    const formattedUptime = formatMilliseconds(uptime * 1000);

    const pingTime = await getPingTime();
    const systemInfo = getSystemInfo();
    const networkInfo = getNetworkInfo();
    const diskInfo = await getDiskInfo();

    const response = `𝐒𝐭𝐚𝐭𝐮𝐬 & 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧\n`
      + '----------------------\n'
      + `⚙  𝐒𝐲𝐬𝐭𝐞𝐦 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:\n`
      + `  𝐎𝐒: ${systemInfo.os}\n`
      + `  𝐊𝐞𝐫𝐧𝐞𝐥 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${systemInfo.kernelVersion}\n`
      + `  𝐇𝐨𝐬𝐭𝐧𝐚𝐦𝐞: ${systemInfo.hostname}\n`
      + `  𝐀𝐫𝐜𝐡: ${systemInfo.arch}\n`
      + `  𝐂𝐏𝐔: ${systemInfo.cpu}\n`
      + `  𝐋𝐨𝐚𝐝 𝐀𝐯𝐠: ${systemInfo.loadAvg}%\n`
      + '----------------------\n'
      + `🌐 𝐍𝐞𝐭𝐰𝐨𝐫𝐤 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:\n`
      + `  𝐈𝐏𝐕𝟒: ${networkInfo.ipv4Addresses}\n`
      + `  𝐈𝐏𝐕𝟔: ${networkInfo.ipv6Addresses}\n`
      + `  𝐌𝐚𝐜 𝐀𝐝𝐝𝐫𝐞𝐬𝐬: ${networkInfo.macAddresses}\n`
      + `  𝐏𝐢𝐧𝐠: ${pingTime}ms\n`
      + '----------------------\n'
      + `💾 𝐒𝐭𝐨𝐫𝐚𝐠𝐞 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:\n`
      + `  𝐓𝐨𝐭𝐚𝐥 𝐃𝐢𝐬𝐤 𝐒𝐩𝐚𝐜𝐞: ${diskInfo.totalDisk}\n`
      + `  𝐅𝐫𝐞𝐞 𝐃𝐢𝐬𝐤 𝐒𝐩𝐚𝐜𝐞: ${diskInfo.freeDisk}\n`
      + `  𝐔𝐬𝐞𝐝 𝐃𝐢𝐬𝐤 𝐒𝐩𝐚𝐜𝐞: ${diskInfo.usedDisk}\n`
      + '----------------------\n'
      + `🧠 𝐌𝐞𝐦𝐨𝐫𝐲 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:\n`
      + `  𝐓𝐨𝐭𝐚𝐥 𝐌𝐞𝐦𝐨𝐫𝐲: ${systemInfo.totalMemory}\n`
      + `  𝐅𝐫𝐞𝐞 𝐌𝐞𝐦𝐨𝐫𝐲: ${systemInfo.freeMemory}\n`
      + `  𝐔𝐬𝐞𝐝 𝐌𝐞𝐦𝐨𝐫𝐲: ${systemInfo.usedMemory}\n`
      + '----------------------\n'
      + `🤖 𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞: ${systemInfo.botUptime}\n`
      + `⚙ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐔𝐩𝐭𝐢𝐦𝐞: ${systemInfo.systemUptime}\n`
      + `📊 𝐏𝐫𝐨𝐜𝐞𝐬𝐬 𝐌𝐞𝐦𝐨𝐫𝐲 𝐔𝐬𝐚𝐠𝐞: ${systemInfo.processMemory}\n`
      + '----------------------';

    message.reply(response);
  }
};

async function getPingTime() {
  const command = process.platform === 'win32' ? 'ping -n 1 8.8.8.8' : 'ping -c 1 8.8.8.8';
  try {
    const { stdout } = await exec(command);
    const match = stdout.match(/time=(\d+(\.\d+)?)\s?ms/);
    if (match) {
      return parseFloat(match[1]);
    } else {
      return 'N/A';
    }
  } catch (error) {
    console.error('Error fetching ping:', error);
    return 'N/A';
  }
}

async function getDiskInfo() {
  const { stdout } = await exec('df -k /');
  const lines = stdout.split('\n');
  const [_, total, used, available] = lines[1].split(/\s+/).filter(Boolean);
  return {
    totalDisk: prettyBytes(parseInt(total) * 1024),
    freeDisk: prettyBytes(parseInt(available) * 1024),
    usedDisk: prettyBytes(parseInt(used) * 1024)
  };
}

function getNetworkInfo() {
  const networkInterfaces = os.networkInterfaces();
  let ipv4Addresses = [];
  let ipv6Addresses = [];
  let macAddresses = [];

  Object.keys(networkInterfaces).forEach((key) => {
    networkInterfaces[key].forEach((iface) => {
      if (iface.family === 'IPv4') {
        ipv4Addresses.push(iface.address);
      } else if (iface.family === 'IPv6') {
        ipv6Addresses.push(iface.address);
      }
      if (iface.mac && iface.mac !== '00:00:00:00:00:00') {
        macAddresses.push(iface.mac);
      }
    });
  });

  return {
    ipv4Addresses: ipv4Addresses.join(', '),
    ipv6Addresses: ipv6Addresses.join(', '),
    macAddresses: macAddresses.join(', ')
  };
}

function getSystemInfo() {
  return {
    kernelVersion: os.release(),
    os: `${os.type()} ${os.release()}`,
    hostname: os.hostname(),
    arch: os.arch(),
    cpu: `${os.cpus()[0].model} (${os.cpus().length} cores)`,
    loadAvg: os.loadavg()[0], // 1-minute load average
    botStartTime: new Date().toLocaleString(),
    botUptime: formatMilliseconds(process.uptime() * 1000),
    systemUptime: formatUptime(os.uptime()),
    processMemory: prettyBytes(process.memoryUsage().rss),
    totalMemory: prettyBytes(os.totalmem()),
    freeMemory: prettyBytes(os.freemem()),
    usedMemory: prettyBytes(os.totalmem() - os.freemem())
  };
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemaining = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${secondsRemaining}s`;
}

function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
}

function prettyBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
    }
