const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const db = require('./functions/db');
const { Pool } = require('pg');

const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.db,
    password: config.dbPass,
    port: config.dbPort,
    max: 10
});

const client = new Discord.Client({
    "messageCacheMaxSize": 5,
	"messageCacheLifetime": 30,
	"messageCacheSweepInterval": 60
})

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));

//checking files for commands
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name.toLowerCase(), command);
}
//checking files events (message, stateReady)
fs.readdir('./events/', (err, files) =>{
    if(err) return console.error(err);
    files.forEach(file=>{
       let eventFunction = require(`./events/${file}`);
       let eventName = file.split('.')[0];
       client.on(eventName, (...args) => eventFunction.run(pool, client, ...args))
    })
})

client.login(config.token);

//
client.setInterval(db.drainHype.bind(null,pool, client), 900000); //draining hype 900000
client.setInterval(db.drainAffection.bind(null,pool, client), 1200000); //draining affection 1200000
client.setInterval(db.drainHunger.bind(null,pool, client), 3600000); //draining hunger 3600000