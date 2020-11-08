const db = require('./../functions/db')
module.exports = {
    name: 'cheer',
    description: ['Hype Blue up! (Gains +5 Hype Infinite uses but 10 minute cool down)'],
    aliases: ['cheer', 'c'],
    usage: '!bcheer',
    cooldown: 600000, //900000
    guildOnly: true,
    category: 'fun', //general, leveling
    async execute(message, args, pool, blue) {
        try{
            const user = await db.fetchUserStats(pool, message.author.id, message.guild.id);
            if(!user) return;
            if(blue.channel === "none"){
                return message.channel.send({embed: db.genEmbed("Announce channel has not been set, please type `!start` to setup the announce channel.", "https://cdn.discordapp.com/emojis/771556840332329010.png?v=1")})
            }else if(blue.channel === "dead"){
                return message.channel.send({embed: db.genEmbed("Blue has fainted from hunger! Please wait 15 minutes for them to revive!", "https://cdn.discordapp.com/emojis/771556840332329010.png?v=1")})
            }else{
                //these are the sentences
                const happy = ['Prances happily as you cheer for their favorite team, Team Liquid!', 
                'Leaps excitedly as you tweet #TLWIN',
                'Neighs in joy as you show them your Team Liquid jersey',
                'Snorts in approval as you cuddle your Blue plushie',
                'Knickers while watching TL stomp on the rift with you'];
                const unhappy = ['Looks forlorn but perks up slightly when noticing your cheers for Team Liquid', 
                'Appears slightly sad but appears to get a mood boost from your hype for Team Liquid',
                'Looks over at you and seems appreciative of your enthusiasm'];
                //end sentences
                //these are the images
                const happyImage = ['https://cdn.discordapp.com/emojis/771556840172552193.png?v=1','https://cdn.discordapp.com/attachments/773932421996740648/774740867298623528/771556839917355038.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740884478492703/771556840080146432.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740847249063936/771556840046723102.png']
                const unhappyImage = ['https://cdn.discordapp.com/attachments/773932421996740648/774740919882088498/771556839808172053.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740798159061072/771556839976468480.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740822851715092/771556840081326091.png']
                //end images
                let chance = 100; //chance of command working
                let sMessage; //Message for output
                let sImage; //image for output
                if(blue.affection <= 50 && blue.affection >= 40){ //if less than 50 affection 50% chance
                    chance = 60;
                }else if(blue.affection <= 39 && blue.affection >= 25){ //30% chance
                    chance = 45;
                }else if(blue.affection <= 24 && blue.affection >= 10){ //15% chance
                    chance = 30;
                }
                if(blue.hype <= 50){ //Checking blue's hype
                    let randomUnhappyFeed = Math.floor(Math.random() * unhappy.length); //randomize message number
                    let randomUnhappyImage = Math.floor(Math.random() * unhappyImage.length);//randomize image number
                    sMessage = unhappy[randomUnhappyFeed]; //randomize sentence
                    sImage = unhappyImage[randomUnhappyImage];; //randomize image

                }else{
                    let randomHappyFeed = Math.floor(Math.random() * happy.length); //randomize message number
                    let randomHappyImage = Math.floor(Math.random() * happyImage.length);//randomize image number
                    sMessage = happy[randomHappyFeed]; //randomize sentence
                    sImage = happyImage[randomHappyImage]; //randomize image
                }
                let sChance = Math.floor(Math.random() * 100);//RNG chance 1-100
                if(sChance <= chance){ //checks if it's lower than chance
                    if(blue.hype + 5 > 100){
                        pool.query('UPDATE "blueStats" SET "hype" = $1 WHERE "guildID" = $2',[100, message.guild.id])
                    }else{
                        db.updateStats(pool, message.guild.id, "hype", 5, blue);
                    }
                    db.updateUserStats(pool, message.guild.id, "cheer", 1, user);
                    return message.channel.send({embed: db.genEmbed(`You cheer for your favorite team, Team Liquid with your pal Blue! Cooldown: 10 minutes\`\`\`${sMessage}\`\`\``, sImage)}) //im eating
                }else{
                    return message.channel.send({embed: db.genEmbed("Blue does not feel up to accepting your cheer right now.", "https://cdn.discordapp.com/attachments/773932421996740648/774740919882088498/771556839808172053.png")}) //nah
                }
            }
        }catch(err){
            console.log(err);
        }
    },
};