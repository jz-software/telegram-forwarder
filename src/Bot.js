class Bot{
	constructor(){
		// Dotenv
		require('dotenv').config();

		// Telegraf
		this.Telegraf = require('telegraf');
		this.telegraf = new this.Telegraf(process.env.TOKEN);

		// Command parts
		this.commandParts = require('telegraf-command-parts');
		this.telegraf.use(this.commandParts());

		// Dynamic scenes
		const fs = require('fs');
		const scenesFiles = fs.readdirSync('./src/scenes').filter(file => file.endsWith('.js'));
		const scenes = scenesFiles.map(function(filename) {
			return require('./scenes/'+filename);
		})
		
		const session = require('telegraf/session');
		const Stage = require('telegraf/stage');
		const stage = new Stage(scenes);	

		this.telegraf.use(session());
		this.telegraf.use(stage.middleware());

		// JMongo
		const JMongo = require('jmongo');
		const jmongo = new JMongo(process.env.DB_URL, process.env.DB_NAME);

		fs.readFile('./src/db/schema.sql', 'utf8', function (err,data) { 
			if (err) throw err;
			const db = require('./db');
			db.query(data);
		});

		// Client
		const Client = require('./Client');
		const client = new Client();

		// Responses
		this.Responses = require('./Responses');
		this.telegraf = new this.Responses(this.telegraf, jmongo, client);
	}
}

module.exports = Bot;