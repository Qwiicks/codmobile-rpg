const {MESSAGES} = require('../../util/constants');
const {MessageEmbed} = require('discord.js');

const db = require('quick.db');
const ms = require('ms');

const {repemote} = require('../../config/bot.json');

const {REP} = require('../../util/money');

module.exports.run = async (client, message, args) => {

  const errorMention = new MessageEmbed()
    .setColor('#c43131')
    .setAuthor(`💢 Erreur !`)
    .addField(`Je n'ai pas pu bien exécuter la commande \`rep\` !`, `Merci de mentionner un soldats du serveur, autre que vous !`, false)
    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
    .setTimestamp();

  if (args[0].replace('<@!', '').replace('>', '') !== message.mentions.users.first().id) return message.channel.send(errorMention);
  if (args[0].replace('<@!', '').replace('>', '') == message.author.id) return message.channel.send(errorMention);

  const rep = await db.fetch(`rep_${message.author.id}`);
  
  if (rep !== null && REP.timeout - (Date.now() - rep) > 0) {
    
    const time = REP.timeout - (Date.now() - rep);

    const errorRep = new MessageEmbed()
      .setColor('#3d93d9')
      .setAuthor(`🔫 La guerre est pas encore terminé...`)
      .addField(`Tu as déjà donné ta médaille aujourd'hui !`, `Reviens dans **${ms(time)}** 🕔 !`, false)
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setTimestamp();

    return message.channel.send(errorRep);

  } else {

    db.add(`reputation_${message.mentions.users.first().id}`, "1");
    db.set(`rep_${message.author.id}`, Date.now());

    const embed = new MessageEmbed()
      .setColor('#3d93d9')
      .setAuthor(`🔫 médaille donné !`, message.mentions.users.first().displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setThumbnail(message.mentions.users.first().displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .addField(`${message.author.username} vient de donner une médaille à ${message.mentions.users.first().username} !`, `${message.mentions.users.first()} a maintenant **${db.fetch(`reputation_${message.mentions.users.first().id}`)}** ${repemote} !`, false)
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setTimestamp();

    const DMembed = new MessageEmbed()
      .setColor('#3d93d9')
      .setAuthor(`🔫 Tu as reçu un point de réputation !`, message.guild.iconURL({dynamic: true, size: 4096, format: 'png'}))
      .setDescription(`*${message.guild.name}*`)
      .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .addField(`${message.author.username} vient de te donner une médaille !`, `Tu as actuellement **${db.fetch(`reputation_${message.mentions.users.first().id}`)}** ${repemote}.`)
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setTimestamp();
  
    message.guild.member(message.mentions.users.first()).send(DMembed);
    return message.channel.send(embed);

  };
};

module.exports.help = MESSAGES.COMMANDS.MONEY.REPUTATION;