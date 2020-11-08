module.exports = {
	name: 'help',
	description: 'List all of my commands/info about a specific command.',
	aliases: ['commands'],
	usage: '',
	cooldown: 1,
	guildOnly: false,
	admin: false,
	async execute(message, args, pool, blue) {
		const embed = {
			"description":"Hi! I'm Blue from Team Liquid and everyone's favorite mascot! Below are a list of my commands which can be shown using **!bhelp**!",
			"color": 795198,
			"thumbnail": {
			  "url": "https://cdn.discordapp.com/attachments/773932421996740648/775060577034305557/771556839640662017.png"
			},
			"author": {
			  "name": "Help",
			  "url": "https://store.teamliquid.com/collections/accessories/products/blue-plush?variant=31508794343518",
			  "icon_url": "https://cdn.discordapp.com/attachments/773932421996740648/774748128481378334/771556840332329010.png"
			},
		"fields": [
			  {
				"name": "!bstart ",
				"value": "Start Blue Bot"
			  },
			  {
				"name": "!bstats",
				"value": "See how Blue is doing"
			  },
			  {
				"name": "!btreat",
				"value": "Give Blue a delicious treat"
			  },
			  {
				"name": "!bcheer ",
				"value": "Hype up Team Liquid with Blue"
			  },
			  {
				"name": "!bpet",
				"value": "Give Blue some affection and pets"
			  },
			  {
				"name": "!bselfie",
				"value": "Get a selfie from Blue"
			  }
			]
		  }
		message.channel.send({embed: embed})
	},
};