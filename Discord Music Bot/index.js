// DisTube example bot, definitions, properties and events details in the Documentation page.
const Discord = require('discord.js'),
    DisTube = require('distube'),
    client = new Discord.Client(),
    config = {
        prefix: "!",
        token: process.env.TOKEN || "Your Discord Token"
    }
const keepAlive = require('./server.js')
const express = require("express")().get("/", (req,res)=> res.send("Bot Activo")).listen(3000);

// Create a new DisTube
const distube = new DisTube(client, 
    {
        emitNewSongOnly: true,
        leaveOnEmpty: true,
        leaveOnStop: false,
        leaveOnFinish: false
    });

client.on('ready', () => {
    function presence(){
      client.user.setPresence({
        status: 'on',
        activity: {
          name: 'Deus Music',
          type: 'LISTENING'

        }
      })
    }
    presence();
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    distube.autoplay = false;

    if (command == "play" || command == "p" || command == "P")
        distube.play(message, args.join(" "));

    if (command == "skip" || command == "fs")
        distube.skip(message);

    if (command == "shuffle")
        distube.shuffle(message);

    if (command == "queue") {
        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }
});

// Queue status template
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// DisTube event listeners, more in the documentation page
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    .on("initQueue", (queue) => {
        queue.autoplay = false;
        queue.volume = 100;
    })

client.login("ODg4ODY3NTczMTY3NDI3NjQ1.YUY8bw.0EKINNnxPsN9jdr-szv-b0c85e4")