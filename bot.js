
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.login(config.token);


client.on('ready', (evt) => {
	console.log(evt);
	console.log(
		"Bot successfully logged in.");
});


client.on('voiceStateUpdate', (exitEvent, joinEvent) => {

	let channelJoined = joinEvent.channel;
	let channelExited = exitEvent.channel;
	
	let joinedRoles = new Set();

	if (channelJoined) {
		
		let channelName = channelJoined.name;
		
		if (!(channelName in config.rooms)) {
			return;
		}

		let roleNames = config.rooms[channelName];
		let roles = joinEvent.guild.roles.cache.filter(r => roleNames.includes(r.name));
		
		roles.forEach((role) => {
			joinEvent.member.roles.add(role);
			joinedRoles.add(role);
		});
		
		console.log(joinEvent.member.user.username + " joined " + channelJoined.name);
	}

	if (channelExited) {

		let channelName = channelExited.name;
		
		if (!(channelName in config.rooms)) {
			return;
		}
			
		let roleNames = config.rooms[channelName];
		let roles = exitEvent.guild.roles.cache.filter(r => roleNames.includes(r.name));
		
		roles.forEach((role) => {
			if (!joinedRoles.has(role)) {
				exitEvent.member.roles.remove(role);	
			}
		});
	} 
});
