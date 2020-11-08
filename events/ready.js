exports.run = async (pool, client) =>{
    client.user.setActivity("!bhelp | #TLWIN");
    setTimeout(() => {
        pool.query('UPDATE "blueStats" SET "hunger" = $1, "affection" = $2, "hype" = $3, "dead" = $4 WHERE "dead" = $5', [50, 50, 50, false, true])
    }, 300000);       
}