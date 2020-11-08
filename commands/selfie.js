  module.exports = {
      name: 'selfie',
      description: ['Posts a random image of Blue'],
      aliases: ['selfie', 's'],
      usage: '!bselfie',
      cooldown: 10, //0
      guildOnly: true,
      category: 'fun', //general, leveling
      async execute(message, args, pool, blue) {
        const blueImage = ['https://pbs.twimg.com/media/ESiSP6yUEAEQOaX.jpg',
        'https://cdn.discordapp.com/attachments/773932421996740648/774891693442727946/2Q.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774891702758539284/Team_Liquid_Blue_Plushie_2000x.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774892202480238612/maxresdefault.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774891717417631754/Z.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774891758739652628/Team-Liquid-Blue.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774891870953406484/EPuFaRqUUAAZ5Bm.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774891934568284160/2Q.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774892008799600650/Team_Liquid_Blue_04_683x1024.png',
        'https://cdn.discordapp.com/attachments/773932421996740648/774892548916772874/EPK31xuVUAEqSMi.png',
        ]

        let randomNum = Math.floor(Math.random() * blueImage.length);
        sImage = blueImage[randomNum];
          try{
              message.channel.send(sImage)
          }catch(err){
              console.log(err);
          }
      },
  };