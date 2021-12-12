import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
const { DISCORD_TOKEN, CLIENT_ID } = process.env;

const commands = [
	new SlashCommandBuilder().setName('agenda').setDescription('Add townhall agenda questions / remarks').addStringOption(option =>
		option.setName('topic')
			.setDescription('Question/remark to add')
			.setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
