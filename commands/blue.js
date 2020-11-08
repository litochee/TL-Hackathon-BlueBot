module.exports = {
    name: 'stats',
    description: ['Check blue\'s stats!'],
    aliases: ['blue', 'stat'],
    usage: '',
    cooldown: 5,
    guildOnly: true,
    category: 'setup', //general, leveling
    async execute(message, args, pool, blue) {
        try{
            let embed = {
                "description": `**Hunger:** ${blue.hunger}\n**Affection:** ${blue.affection}\n**Hype:**  ${blue.hype}`,
                "color": 795198,
            
                "thumbnail": {
                  "url": "https://cdn.discordapp.com/emojis/771556840332329010.png?v=1"
                },
            
                "author": {
                  "name": "Blue",
                  "url": "https://store.teamliquid.com/collections/accessories/products/blue-plush?variant=31508794343518",
                  "icon_url": "https://cdn.discordapp.com/attachments/773932421996740648/774748128481378334/771556840332329010.png"
                }
            
              }
              return message.channel.send({embed: embed});
        }catch(err){
            console.log(err);
        }
    },
};