const Discord = require('discord.js');
const cooldown = new Discord.Collection();
const config = require('./../config.json');
const db = require('./../functions/db')
exports.run = async (pool, client, message, args) =>{
    try{
        if (message.author.bot) return; //if the author is a bot
        if(message.channel.type === 'text'){ //normal channl
            if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) {message.reply({embed: gen.pingEmbed(config.prefix)})}
            if(message.content.startsWith(config.prefix)){ // if prefix
                //*******************PREFIX START (Commands)*****************************/
                let blue = await db.fetchStats(pool, message.guild.id);
                const args = message.content.slice(config.prefix.length).split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) return;
                if (command.args && !args.length){
					let reply = `You didn't provide any arguments, ${message.author}!`;
					if (command.usage) {
						reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
					}
					return message.channel.send(reply);
                }
                if(!cooldown.has(command.name)) {
                    cooldown.set(command.name, new Discord.Collection());
                }
                const now = Date.now();
                const timestamps = cooldown.get(command.name);
                const cooldownAmount = (command.cooldown || 3);
                if (timestamps.has(message.author.id)){
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

					if (now < expirationTime) {
                        const a = (expirationTime - now) / 1000;
                        const timeLeft = a / 60;
                        
                        return message.reply({embed: db.cooldownWarning(timeLeft.toFixed(1), command.name.toLowerCase())})
						//return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
					}
                }
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                command.execute(message, args, pool, blue);
                
                //********************PREFIX END (COMMAND)*********************//
            }
        }else{
            return;
        }
    }catch(err){
        console.log(err);
    }
}