const Discord = require('discord.js');
const em = require('./embeds');
module.exports.fetchStats = async function(pool, guildID) {
    try {
      const {rows} = await pool.query('SELECT * FROM "blueStats" WHERE "guildID" = $1', [guildID]);
      if (!rows[0]) {
        const cStats = await pool.query(
          'INSERT INTO "blueStats" ("guildID", "hunger", "affection", "hype", "timesDied", "doubleDrain", "dead", "channel") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
          [guildID, 100, 100, 100, 0, false, false,"none"]
        );
        return cStats.rows[0];
      } else {
        return rows[0];
      }
    } catch (err) {
      return console.log(err);
    }
  };

module.exports.updateStats = async function(pool, guildID, stat, amount, blue){
    try{
        const total = blue[`${stat}`] + amount;
        pool.query(`UPDATE "blueStats" SET "${stat}" = $1 WHERE "guildID" = $2`,[total, guildID])
    }catch(err){
        console.log(err);
    }
}

module.exports.fetchUserStats = async function(pool, userID, guildID) {
    try{
        const {rows} = await pool.query('SELECT * FROM "user" WHERE "guildID" = $1 AND "userID" = $2', [guildID, userID])
        if(!rows[0]){
            const cUser = await pool.query('INSERT INTO "user" ("userID", "guildID", "fed", "cheer", "pet", "fedLimit") VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [userID, guildID, 0,0,0,3])
            return cUser.rows[0];
        }else{
            return rows[0];
        }
    }catch(err){
        return console.log(err);
    }
}

module.exports.updateUserStats = async function(pool, guildID, stat, amount, user){
    try{
        const total = await user[`${stat}`] + amount;
        pool.query(`UPDATE "user" SET "${stat}" = $1 WHERE "guildID" = $2 AND "userID" = $3`,[total, guildID, user.userID])
    }catch(err){
        console.log(err);
    }
}

module.exports.drainHunger = async function(pool, client){
    const c = await pool.connect()
    try{
        await c.query('BEGIN')
        const getAllStats = await c.query('SELECT * FROM "blueStats"');
        let a;
        for(i = 0; i <= getAllStats.rows.length - 1; i++){
            if(getAllStats.rows[i].dead === true) return;
            if(getAllStats.rows[i].doubleDrain === true){
                a = getAllStats.rows[i].hunger - 2;
            }else{
                a = getAllStats.rows[i].hunger - 1;
            }
            if(a <= 0){
                let channel = await client.guilds.cache.get(getAllStats.rows[i].guildID).channels.cache.get(getAllStats.rows[i].channel);
                if(!channel)return;
                let dCount = getAllStats.rows[i].timesDied + 1;
                let updateHunger = [0, true, dCount, getAllStats.rows[i].guildID];
                c.query('UPDATE "blueStats" SET "hunger" = $1, "dead" = $2, "timesDied" = $3  WHERE "guildID" = $4', updateHunger)
                channel.send({embed: em.genEmbed("Oh no! Blue was too hungry and has fainted! They will revive in 15 minutes.", "https://cdn.discordapp.com/attachments/773932421996740648/774740822851715092/771556840081326091.png")}) //0%
                setTimeout(() => {
                    pool.query('UPDATE "blueStats" = SET "hunger" = $1, "affection" = $2, "hype" = $3, "dead" = $4 WHERE "guildID" = $5', [50, 50, 50, false, getAllStats.rows[i].guildID])
                    }, 900000);
            }else{
                let channel = await client.guilds.cache.get(getAllStats.rows[i].guildID).channels.cache.get(getAllStats.rows[i].channel);
                if(!channel)return;
                if(a === 50){
                    channel.send({embed: em.genEmbed("Feels their stomach growl. They are starting to get hungry!", "https://cdn.discordapp.com/attachments/773932421996740648/774740919882088498/771556839808172053.png")})
                }else if(a === 20){
                    channel.send({embed: em.genEmbed("Blue’s stomach aches as they search for food", "https://cdn.discordapp.com/attachments/773932421996740648/774740919882088498/771556839808172053.png")}) //20%
                }else if(a === 10){
                    channel.send({embed: em.genEmbed("Begins to feel sluggish and desperately wishes for a treat", "https://cdn.discordapp.com/attachments/773932421996740648/774740798159061072/771556839976468480.png")}) //10%
                }else if(a === 5){
                    channel.send({embed: em.genEmbed("Feels weak and hopes food will come soon", "https://cdn.discordapp.com/attachments/773932421996740648/774740822851715092/771556840081326091.png")}) //5%
                }
                let updateHunger = [a, getAllStats.rows[i].guildID];
                await c.query('UPDATE "blueStats" SET "hunger" = $1 WHERE "guildID" = $2', updateHunger);
            }
        }
        await c.query('COMMIT')
    } catch (e) {
        await c.query('ROLLBACK')
        throw e
    } finally {
        c.release()
    }
}

module.exports.drainAffection = async function(pool, client){
    const c = await pool.connect()
    try{
        await c.query('BEGIN')
        const getAllStats = await c.query('SELECT * FROM "blueStats"');
        for(i = 0; i <= getAllStats.rows.length - 1; i++){
            if(getAllStats.rows[i].dead === true) return;
            if(getAllStats.rows[i] === true){
                a = getAllStats.rows[i].affection - 2;
            }else{
                a = getAllStats.rows[i].affection - 1;
            }
            if(a <= 0){
                let updateAffection = [0, getAllStats.rows[i].guildID];
                c.query('UPDATE "blueStats" SET "affection" = $1 WHERE "guildID" = $2', updateAffection)
            }else if(a === 30){
                let channel = await client.guilds.cache.get(getAllStats.rows[i].guildID).channels.cache.get(getAllStats.rows[i].channel);
                channel.send({embed: em.genEmbed("Blue is feeling really lonely. Give him some pets to make him feel better", "https://cdn.discordapp.com/attachments/773932421996740648/774740798159061072/771556839976468480.png")})//affection
            }
            let updateAffection = [a, getAllStats.rows[i].guildID];
            await c.query('UPDATE "blueStats" SET "affection" = $1 WHERE "guildID" = $2', updateAffection);
        }
        await c.query('COMMIT')
    } catch (e) {
        await c.query('ROLLBACK')
        throw e
    } finally {
        c.release()
    }
}

module.exports.drainHype = async function(pool, client){
    try{
        const c = await pool.connect()
        await c.query('BEGIN')
        const getAllStats = await c.query('SELECT * FROM "blueStats"');
        for(i = 0; i <= getAllStats.rows.length - 1; i++){
            if(getAllStats.rows[i].dead === true) return;
            let a = getAllStats.rows[i].hype - 1;
            if(a === 35){
                console.log(getAllStats.rows[i]);
                await c.query('UPDATE "blueStats" SET "hype" = $1, "doubleDrain" = $2 WHERE "guildID" = $3', [a, true, getAllStats.rows[i].guildID])
                let channel = await client.guilds.cache.get(getAllStats.rows[i].guildID).channels.cache.get(getAllStats.rows[i].channel);
                channel.send({embed: em.genEmbed("Blue is feeling down, hunger and affection will now drain twice as fast", "https://media.discordapp.net/attachments/773932421996740648/774740798159061072/771556839976468480.png")})
            }if(a < 35){
                await c.query('UPDATE "blueStats" SET "hype" = $1, "doubleDrain" = $2 WHERE "guildID" = $3', [a, true, getAllStats.rows[i].guildID])
            }else{
                await c.query('UPDATE "blueStats" SET "hype" = $1, "doubleDrain" = $2 WHERE "guildID" = $3', [a, false, getAllStats.rows[i].guildID])
            }
        }
        await c.query('COMMIT')
        await c.release()
    } catch (e) {
        throw e;
    }
}

/*****
 * 
 * 
 * 
 * 
 * embeds
 * 
 * 
 * 
 */

module.exports.genEmbed = function (content, image) {
    var embed = {
        "description": content,
        "url": "https://store.teamliquid.com/products/blue-plush?variant=31508794343518",
        "color":661283,
        "thumbnail":{
            "url":image
        },
        "author":{
            "name": "Blue",
            "url": "https://store.teamliquid.com/products/blue-plush?variant=31508794343518",
            "icon_url":"https://cdn.discordapp.com/emojis/771556840332329010.png?v=1"
        }
    }
    return embed;
}

module.exports.cooldownWarning = function (cooldown, command){
    let embed = {
        "description": `Please wait ${cooldown} more minute(s) before reusing the \`${command}\` command.`,
        "url": "https://store.teamliquid.com/products/blue-plush?variant=31508794343518",
        "color":661283,
        "thumbnail":{
            "url": "https://images-ext-1.discordapp.net/external/PzF5kpxBHDebzTrd93scYBFV4YHDdot0mFSCSM5uRDg/%3Fv%3D1/https/cdn.discordapp.com/emojis/771556840332329010.png"
        },
        "author":{
            "name": "Blue",
            "url": "https://store.teamliquid.com/products/blue-plush?variant=31508794343518",
            "icon_url":"https://cdn.discordapp.com/emojis/771556840332329010.png?v=1"
        }
    }
    return embed;
}