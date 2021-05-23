const {MESSAGES} = require('../../util/constants');
const {MessageEmbed} = require('discord.js');

const db = require('quick.db');
const ms = require('ms');

const {prefix} = require('../../config/bot.json');
const {moneyemote} = require('../../config/bot.json');

module.exports.run = async (client, message, args) => {

  const works = await db.fetch(`works_${message.author.id}`);
  const worktime = await db.fetch(`work_${message.author.id}`)

  const Worktimeout = works === 'ONE' ? ms('15m') : works === 'TWO' ? ms('30m') : works === 'THREE' ? ms('3h') : works === 'FOUR' ? ms('6h') : works === 'FIVE' ? ms('12h') : works === 'SIX' ? ms('24h') : '0';
  const Workamount = works === 'ONE' ? '312' : works === 'TWO' ? '625' : works === 'THREE' ? '1250' : works === 'FOUR' ? '2500' : works === 'FIVE' ? '5000' : works === 'SIX' ? '10000' : '0';

  const errorWorkEmbed = new MessageEmbed()
    .setColor('#c43131')
    .setAuthor(`💢 Erreur !`)
    .addField(`Tu n'as pas de grade !`, `La liste des grades est disponible en faisant \`${prefix}works\` ! Merci de rejoindre un métier pour pouvoir utiliser la commande \`${prefix}work\` !`, false)
    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, format:'png'}))
    .setTimestamp();
  
  if (works == null) return message.channel.send(errorWorkEmbed)
  
  if (works !== null && Worktimeout - (Date.now() - worktime) > 0) {
    
    const time = Worktimeout - (Date.now() - worktime);

    const errorWork = new MessageEmbed()
      .setColor('#3d93d9')
      .setAuthor(`🛷 Le temps n'est pas encore écoulé...`)
      .addField(`Tu ne peux pas encore récupérer ton salaire !`, `Reviens dans **${ms(time)}** 🕔 !`, false)
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setTimestamp();

    return message.channel.send(errorWork);

  } else {

    db.add(`money_${message.author.id}`, Workamount);
    db.set(`work_${message.author.id}`, Date.now());

    const workEmbed = new MessageEmbed()
      .setColor('#3d93d9')
      .setAuthor(`🛷 Travail effectué !`)
      .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setTimestamp();

    if (works === 'ONE') workEmbed.addField(`Bien joué 🥇NOVICE🥇 !`, `Tu récupères le gain du match a mort par équipe. Tu remportes **${Workamount}** ${moneyemote} !`);
    if (works === 'TWO') workEmbed.addField(`Bien joué 🥇VÉTERAN🥇 !`, `Tu récupères le gain de la ligne de front. Tu remportes **${Workamount}** ${moneyemote} !`)
    if (works === 'THREE') workEmbed.addField(`Bien joué 🥇ÉLITE🥇 !`, `Tu récupères le gain de la domination. Tu remportes **${Workamount}** ${moneyemote} !`)
    if (works === 'FOUR') workEmbed.addField(`Bien joué 🥇PRO🥇 !`, `Tu récupères le gain de la mêlée génerale. Tu remportes **${Workamount}** ${moneyemote} !`)
    if (works === 'FIVE') workEmbed.addField(`Bien joué 🥇MAITRE🥇 !`, `Tu as détourné la nucléaire. Tu remportes**${Workamount}** ${moneyemote} !`)
	if (works === 'SIX') workEmbed.addField(`Bien joué 🥇LÉGENDAIRE🥇`, `Tu as déclanché la nucléaire. Tu remportes **${Workamount}** ${moneyemote} !`)

    return message.channel.send(workEmbed);

  };
};

module.exports.help = MESSAGES.COMMANDS.MONEY.WORK;