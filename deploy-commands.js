import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
config();
const { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } = process.env;

const commands = [
	new SlashCommandBuilder().setName('agenda').setDescription('Add townhall agenda questions / remarks').addStringOption(option =>
		option.setName('topic')
			.setDescription('Question/remark to add')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('townhall')
				.setDescription('Townhall number (i.e. TH1)')),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
