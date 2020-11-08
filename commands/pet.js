const db = require('./../functions/db')
module.exports = {
    name: 'pet',
    description: ['Give Blue a pet! (Gains +5 affection Infinite uses but 5 minute cool down)'],
    aliases: ['pet', 'p'],
    usage: '!bpet',
    cooldown: 300000, //300000
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
                const happy = ['Neighs and nuzzles your hand', 
                'Gallops into your open arms for a hug',
                'Happily stomps foot as you scratch his side',
                'Pushes nose into your outstretched hand',
                'Whinnies happily as you stroke his mane'];
                const unhappy = ['Looks off into the distance dejectedly but accepts your affection', 
                'Sluggishly walks over to you to receive some scratches',
                'Allows you to pet their mane but seems sad'];
                //end sentences
                //these are the images
                const happyImage = ['https://cdn.discordapp.com/emojis/771556840172552193.png?v=1','https://cdn.discordapp.com/attachments/773932421996740648/774740867298623528/771556839917355038.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740884478492703/771556840080146432.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740847249063936/771556840046723102.png']
                const unhappyImage = ['https://cdn.discordapp.com/attachments/773932421996740648/774740919882088498/771556839808172053.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740798159061072/771556839976468480.png', 'https://cdn.discordapp.com/attachments/773932421996740648/774740822851715092/771556840081326091.png']
                //end images
                let chance = 100; //chance of command working
                let sMessage; //Message for output
                let sImage; //image for output
                if(blue.affection <= 50 && blue.affection >= 40){ //if less than 50 affection 60% chance
                    chance = 60;
                }else if(blue.affection <= 39 && blue.affection >= 25){ //45% chance
                    chance = 45;
                }else if(blue.affection <= 24 && blue.affection >= 10){ //30% chance
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
                    if(blue.affection + 5 > 100){
                        pool.query('UPDATE "blueStats" SET "affection" = $1 WHERE "guildID" = $2',[100, message.guild.id])
                    }else{
                        db.updateStats(pool, message.guild.id, "affection", 5, blue);
                    }
                    db.updateUserStats(pool, message.guild.id, "pet", 1, user);
                    return message.channel.send({embed: db.genEmbed(`You reach out and give your favorite mascot Blue some affection. Refreshes in 5 Minutes. \`\`\`${sMessage}\`\`\``, sImage)}) //im eating
                }else{
                    return message.channel.send({embed: db.genEmbed("Blue feels neglected and doesn't want to be pet right now", )}) //nah
                }
        }
        }catch(err){
            console.log(err);
        }
    },
};