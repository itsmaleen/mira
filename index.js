// ----------------------------------------------------------------------------------//
// Mira
// Mirage Discord Bot (( BETA v0.1.0 ))
// Fiig | November 14, 2021 | Updated:
// ----------------------------------------------------------------------------------//

import { Client, Intents } from 'discord.js';
const { DISCORD_TOKEN, WELCOME, INTRO } = process.env;

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

client.login(DISCORD_TOKEN);
