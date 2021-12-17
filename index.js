// ----------------------------------------------------------------------------------//
// Mira
// Mirage Discord Bot (( BETA v0.1.0 ))
// Fiig | November 14, 2021 | Updated:
// ----------------------------------------------------------------------------------//

import { Client, Intents } from 'discord.js';
import { Client as NotionClient } from '@notionhq/client';
import { config } from 'dotenv';
config();
const { DISCORD_TOKEN, WELCOME, INTRO, NOTION_AGENDA_DB } = process.env;
const notion = new NotionClient({ auth: process.env.NOTION_API_KEY });

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.once('ready', () => {
  console.log('Mira bot started.');
});

// TODO: add reaction remove too
client.on('messageReactionAdd', async (reaction, user) => {
  try {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      await reaction.fetch();
    }

    const { id: userId } = user;
    const { message, _emoji } = reaction;
    const { channelId } = message;

    // Handle role assignment
    if (channelId === WELCOME) {
      const member = message.guild.members.cache.find(
        (member) => member.id === userId
      );

      const adopter = message.guild.roles.cache.find(
        (role) => role.name === 'adopter'
      );
      const artist = message.guild.roles.cache.find(
        (role) => role.name === 'artist'
      );
      const collector = message.guild.roles.cache.find(
        (role) => role.name === 'collector'
      );
      const designer = message.guild.roles.cache.find(
        (role) => role.name === 'designer'
      );
      const developer = message.guild.roles.cache.find(
        (role) => role.name === 'developer'
      );

      switch (_emoji.name) {
        case '🤳':
          member.roles.add(adopter.id);
          break;
        case '🎨':
          member.roles.add(artist.id);
          break;
        case '🖼️':
          member.roles.add(collector.id);
          break;
        case '✍️':
          member.roles.add(designer.id);
          break;
        case '💻':
          member.roles.add(developer.id);
          break;
        default:
          console.log(`No role added for the reaction.`);
      }

      const channel = client.channels.cache.get(INTRO);
      const formattedMessage = `Welcome ${member.user} ${_emoji.name}!\nPlease introduce yourself here:`;
      channel.send(formattedMessage);
    }
  } catch (error) {
    console.error('Something went wrong when fetching the message:', error);
    return;
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  try {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
      await reaction.fetch();
    }

    const { id: userId } = user;
    const { message, _emoji } = reaction;
    const { channelId } = message;

    // Handle role removal
    if (channelId === WELCOME) {
      const member = message.guild.members.cache.find(
        (member) => member.id === userId
      );

      const adopter = message.guild.roles.cache.find(
        (role) => role.name === 'adopter'
      );
      const artist = message.guild.roles.cache.find(
        (role) => role.name === 'artist'
      );
      const collector = message.guild.roles.cache.find(
        (role) => role.name === 'collector'
      );
      const designer = message.guild.roles.cache.find(
        (role) => role.name === 'designer'
      );
      const developer = message.guild.roles.cache.find(
        (role) => role.name === 'developer'
      );

      switch (_emoji.name) {
        case '🤳':
          member.roles.remove(adopter.id);
          break;
        case '🎨':
          member.roles.remove(artist.id);
          break;
        case '🖼️':
          member.roles.remove(collector.id);
          break;
        case '✍️':
          member.roles.remove(designer.id);
          break;
        case '💻':
          member.roles.remove(developer.id);
          break;
        default:
          console.log(`No role added for the reaction.`);
      }
    }
  } catch (error) {
    console.error('Something went wrong when fetching the message:', error);
    return;
  }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

  // Handle agenda command
	if (commandName === 'agenda') {
    const topic = interaction.options.getString('topic');
    const townhall = interaction.options.getString('townhall');
    const username = interaction.user.username;
    
    (async () => {
      const response = await notion.pages.create({
        parent: {
          database_id: NOTION_AGENDA_DB,
        },
        properties: {
          'Topic Description': {
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: topic,
                },
              },
            ],
          },
          // Maybe connect discord user to people on Notion?
          Contributor: {
            'rich_text': [
              {
                type: 'text',
                text: {
                  content: username,
                },
              }
            ],
          },
          // TODO: add which TH by querying options and selecting latest possibly?
          // Unsure why its a multi-select but atm can just add one TH.
          // TODO: to make it work with multiple THs, maybe comma seperate and then split?
          TH: {
            "multi_select": [
              {
                "name": townhall,
              }
            ]
          }
        },
      });
      
		  await interaction.reply(`Your agenda item has been added! ${response.url}`);
    })();
	}
});

client.login(DISCORD_TOKEN);
