const Discord = require("discord.js-selfbot-v13");
const client = new Discord.Client();

// ==============================
// || Default Bot Settings     ||
// ==============================

// REQUIREMENTS TO RUN THIS BOT:

// MESSAGE
// LOOP AMOUNT = DURATION DIVIDED BY 30 MINUTES {7 Days = 336, 30 Days = 1440, 180 Days = 8640}
// DEPLOY COMMAND
// LOG CHANNEL ID
// USER TOKEN AS BOT TOKEN BECAUSE THIS IS A S3LF-BOT 🐼
// ADVERT CHANNEL ID in channels.txt * Always add a debug channel ID to see how the advert looks.

// Define the embed content message as a constant
const msg = "https://discord.gg/pdCA7mhrAZ \nThis is new tech, do not underestimate the power of Panda AdBot. Join the train before its too late. \nSlots are limited.";

// Define the plain text message as a constant
const fullmsg = "__**Premium Advertisement**__ 📢 \nPanda AdBot is a discord bot that constantly sends advertisements to over 200k public discord servers every 15 minutes. Anyone can advertise anything using our bot.\n\n• Full throttle • No downtime • Maximum effect • \n \n**Join server to use Bot:** \nhttps://discord.gg/pdCA7mhrAZ \n \nArtwork: https://cdn.discordapp.com/attachments/1071206219005579306/1071537606971625494/ad_banner.jpeg";

// Run server
const http = require('http');

let messageTaskRunning = false;

// REQUIRED PARAMETERS ================>>>>>>>>>>>
const loopAmount = 17280; // 360 Days
const botDelay = randNum(900, 1800); // Delay of 15-30 minutes
const logChannel = "1071055923369484338";
const botToken = process.env['botToken']

// EMBED MESSAGE
const wembed = new Discord.WebEmbed({
  shorten: true,
  hidden: false
})
.setColor('#2E3136')
.setTitle('Premium Advertisement')
.setDescription('Panda AdBot is a discord bot that constantly sends advertisements to over 200k public discord servers every 15 minutes. Anyone can advertise anything using our bot.\n\n• Full throttle • No downtime • Maximum effect •')
.setProvider({name: 'Join server to use bot', url: 'https://panda-bot.netlify.app'})
.setImage('https://cdn.discordapp.com/attachments/1071206219005579306/1071537606971625494/ad_banner.jpeg');


const server = http.createServer((req, res) => {
  res.end('Hello, world!');
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});

// Bot start here
client.on("ready", () => {
  console.log("Connected!");
  // Capture console log messages and send them to the specified channel
  const originalLog = console.log;
  console.log = function(...args) {
    const channel = client.channels.cache.find(channel => channel.id === logChannel);
    channel.send(args[0]).then(() => {
      originalLog.apply(console, args);
    });
  }
   // Call the function to start sending messages
  scanChannels();
});

// auto reply DMs

client.on('messageCreate', message => {
  if (message.channel.type === 'DM' && message.author.id !== client.user.id && !message.author.bot) {
    message.reply('**DMs are not under our official administration.** \nPlease create a support ticket by clicking this link that will take you directly to our official server public relations system: https://discord.gg/bKjjnVvHnA');
  }
});

// Delay randomizer

function randNum(min, max) {  
  return Math.floor(
    Math.random() * (max - min + 1) + min
    )
  }
  
// Itterate among channels
function scanChannels() {
  const https = require('https');

  let rawUrl = 'https://raw.githubusercontent.com/motikolorado/channelIDs/main/channels.txt';

  https.get(rawUrl, async function(res) {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      let channelArray = data.split('\n');

      (function innerLoop(i) {
        if (i >= channelArray.length || !messageTaskRunning) return;
        if (!channelArray[i].startsWith('#')) {
          console.log(`Sending message to channel: ${channelArray[i]}`);
          sendMessageToChannel(channelArray[i]);
        }
        setTimeout(() => innerLoop(i + 1), 2000);
      })(0);
    });
    // Wait before sending the next message
            console.log(`Waiting for ${botDelay} seconds before sending the next message...`);
            if (!messageTaskRunning) return;
            
            setTimeout(() => loop(counter + 1), botDelay * 1000);
  }).on('error', err => {
    console.error(err);
  });
}

  
  // Message function
  
  function sendMessageToChannel(channelId) {
    const channel = client.channels.cache.find(channel => channel.id === channelId);
    if (!channel) {
      console.log(`Channel ${channelId} not found`);
      return;
    }
    if(!channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
      console.log(`Bot does not have permission to send messages in channel ${channelId}`);
      return;
    }
    if(!channel.permissionsFor(client.user).has("EMBED_LINKS")) {
      console.log(`Bot does not have permission to send Embed in channel ${channelId}`);
      channel.send(fullmsg).then(() => {
        console.log(`Invite sent to channel ${channelId}`);
      }).catch(err => {
        console.log(`Error sending message to channel ${channelId}: ${err}`);
      });
      return;
    }
    channel.send({ content: msg, embeds: [wembed]}).then(() => {
      console.log(`Message sent to channel ${channelId}`);
    }).catch(err => {
      console.log(`Error sending message to channel ${channelId}: ${err}`);
    });
  }
  
  // Function to kill the deployment
  function killDeployment() {
    messageTaskRunning = false;
    counter = 0;
  }
  
  // Commands
  
  client.on("messageCreate", (message) => {
    if (message.content.startsWith("/deploy")) {
      const args = message.content.split(" ");
      if (args[1] === "start") {
        if (messageTaskRunning) {
          message.channel.send("Ads are running currently, Please wait").then((msg) => {
            setTimeout(() => {
              msg.delete();
            }, 10000);
          });
          return;
        }
        message.channel.send("Ads Deployed").then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
          messageTaskRunning = true;
          (function loop(counter) {
            if (counter >= loopAmount) {
              console.log('Messages sent: ' + counter);
              messageTaskRunning = false;
              return;
            }
            
            console.log(`Initializing new message task`);
            
            
            // Read channels from channels file 
            
            scanChannels()

          })(0);
        });
      } else if (args[1] === "kill") {
        message.channel.send("Ads Stopped").then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
          killDeployment();
        });
      }
    }
  });
  
  client.login(botToken);