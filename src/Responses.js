class defaultResponses{
	constructor(telegraf){
		telegraf.on('new_chat_members', (ctx) => {
			if(ctx.botInfo.id===ctx.update.message.new_chat_member.id){
				ctx.reply('Thanks for adding me to this group');
			}	
		})

		return telegraf;
	}
}

// Define responses here
class myResponses{
	constructor(telegraf, jmongo, client){
		// Default responses, comment out if not needed
		telegraf = new defaultResponses(telegraf);

		// Dynamic commands
		const fs = require('fs');
		const files_commands = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

		const commands = [];
		files_commands.forEach(element => {
			const command = require('./commands/'+element);
			telegraf.command(command.name, (ctx) => {
				// If access is not private then just execute, else check if the user is an admin
				command.access != 'private' ? command.execute(ctx, { jmongo, client }) : 
				jmongo.load('admins', { id: ctx.from.id }).then((result) => {
					// If admin not found, reply. Else execute
					result === null ? ctx.reply('You must be an admin to execute this command') : command.execute(ctx, { jmongo, client });
				})
			})
			if(command.public===true){ commands.push({ command: command.name, description: command.description }) };
		});
		telegraf.telegram.setMyCommands(commands);

		// Dynamic callback_queries
		const files_callback_queries = fs.readdirSync('./src/callback_queries').filter(file => file.endsWith('.js'));
		files_callback_queries.forEach(element => {
			const callback_query = require('./callback_queries/'+element);
			telegraf.action(callback_query.name, (ctx) => {
				callback_query.execute(ctx);
			})
		});

		return telegraf;
	}
}

class Responses{
	constructor(telegraf, jmongo, client){
		telegraf = new myResponses(telegraf, jmongo, client);
		
		return telegraf;
	}
}

module.exports = Responses;