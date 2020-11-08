const db = require('./../functions/db')
module.exports = {
	name: 'start',
	description: 'Set the channel for the bot to post announcements in. This must be done to start it.',
	aliases: [],
	usage: '',
	cooldown: 1,
	guildOnly: false,
	admin: false,
	async execute(message, args, pool, blue) {
        if(message.member.hasPermission('ADMINISTRATOR')){
            message.channel.send({embed: {
                "description": "Please type the channel you would like Blue's announcements to go into!",
                "color": 795198,
                "thumbnail": {
                "url": "https://cdn.discordapp.com/attachments/773932421996740648/775066433889370112/771556839917092885.png"
                },
            
                "author": {
                "name": "Welcome to Blue Bot!",
                "url": "https://store.teamliquid.com/collections/accessories/products/blue-plush?variant=31508794343518",
                "icon_url": "https://cdn.discordapp.com/attachments/773932421996740648/774748128481378334/771556840332329010.png"
                }
            }}).then(() => {
                const filter  = m => m.author.id === message.author.id;
                message.channel.awaitMessages(filter, { max: 1, time: 40000, errors: ['time'] })
                    .then(collected => {
                        let chan = collected.first().mentions.channels.first();
                        if(!chan || !chan.id){
                            db.genEmbed("Sorry, no channel was found. Please try typing `!bstart` again!", "https://images-ext-1.discordapp.net/external/PzF5kpxBHDebzTrd93scYBFV4YHDdot0mFSCSM5uRDg/%3Fv%3D1/https/cdn.discordapp.com/emojis/771556840332329010.png")
                        }else{
                            pool.query(`UPDATE "blueStats" SET "channel" = $1 WHERE "guildID" = $2`,[chan.id, message.guild.id])
                            message.channel.send({embed: db.genEmbed(`Announce channel has been set to ${chan}. Blue will now be active!`, "https://images-ext-1.discordapp.net/external/PzF5kpxBHDebzTrd93scYBFV4YHDdot0mFSCSM5uRDg/%3Fv%3D1/https/cdn.discordapp.com/emojis/771556840332329010.png")})
    
                        }
                    })
                    .catch(collected => {
                        console.log(collected);
                        message.channel.send('Either you took too long or no channel was found.');
                    });
            });
          }else{
            return message.channel.send("Sorry only Admins can run this command.")
          }

	},
};