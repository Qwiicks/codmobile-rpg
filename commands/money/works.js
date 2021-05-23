const {MESSAGES} = require('../../util/constants');
const {MessageEmbed} = require('discord.js');

const db = require('quick.db');
const ms = require('ms');

const {prefix, moneyemote} = require('../../config/bot.json');

const {WORKS} = require('../../util/money');

module.exports.run = async (client, message, args) => {

  const works = await db.fetch(`works_${message.author.id}`);
  const worktime = await db.fetch(`work_${message.author.id}`)

  const Worktimeout = works === 'ONE' ? ms('15m') : works === 'TWO' ? ms('30m') : works === 'THREE' ? ms('3h') : works === 'FOUR' ? ms('6h') : works === 'FIVE' ? ms('12h') : works === 'SIX' ? ms('24h') : '0';

  const worksarg = {
    '🥇': 'ONE',
    '🥇': 'ONE',
    '1': 'ONE',

    '🥇': 'TWO',
    '2': 'TWO',

    '🥇': 'THREE',
    '3': 'THREE',

    '🥇️': 'FOUR',
    '4': 'FOUR',
	
	'🥇': 'FIVE',
    '5': 'FIVE',
	
	'🥇': 'SIX',
    '6': 'SIX',
  };

  const nameworksarg = {
    'ONE': WORKS.ONE.name,
    'TWO': WORKS.TWO.name,
    'THREE': WORKS.THREE.name,
    'FOUR': WORKS.FOUR.name,
    'FIVE': WORKS.FIVE.name,
	'SIX': WORKS.SIX.name,
  };

  const worksEmbed = new MessageEmbed()
    .setColor('#3d93d9')
    .setAuthor(`🚢 Liste des grades à pourvoir`)
    .setDescription(`Un grade te permet de gagner de l'argent après une certaine durée. La liste des grades est inscrite ci-dessous. Tape \`${prefix}works <nombre>\` pour choisir un grade !`)
    .addFields(
      {name: `> 1 - ${WORKS.ONE.name}`, value: `Gain : ${WORKS.ONE.amount} ${moneyemote}\nDélai : ${ms(WORKS.ONE.timeout)} 🕔`, inline: true},
      {name: `> 2 - ${WORKS.TWO.name}`, value: `Gain : ${WORKS.TWO.amount} ${moneyemote}\nDélai : ${ms(WORKS.TWO.timeout)} 🕔`, inline: true},
      {name: `> 3 - ${WORKS.THREE.name}`, value: `Gain : ${WORKS.THREE.amount} ${moneyemote}\nDélai : ${ms(WORKS.THREE.timeout)} 🕔`, inline: true},
      {name: `> 4 - ${WORKS.FOUR.name}`, value: `Gain : ${WORKS.FOUR.amount} ${moneyemote}\nDélai : ${ms(WORKS.FOUR.timeout)} 🕔`, inline: true},
	  {name: `> 5 - ${WORKS.FIVE.name}`, value: `Gain : ${WORKS.FIVE.amount} ${moneyemote}\nDélai : ${ms(WORKS.FIVE.timeout)} 🕔`, inline: true},
	  {name: `> 6 - ${WORKS.SIX.name}`, value: `Gain : ${WORKS.SIX.amount} ${moneyemote}\nDélai : ${ms(WORKS.SIX.timeout)} 🕔`, inline: true},
	  
    )
    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
    .setTimestamp();

  const errorWorksEmbed = new MessageEmbed()
    .setColor('#c43131')
    .setAuthor(`💢 Erreur !`)
    .addField(`Le grade \`${args.join(' ')}\` n'existe pas !`, `La liste des grades est disponible en faisant \`${prefix}works\` ! Vérifie bien l'orthographe du grade !`, false)
    .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
    .setTimestamp();

  if (args[0] && works !== null && Worktimeout - (Date.now() - worktime) > 0) {
  
    const time = Worktimeout - (Date.now() - worktime);

    const errorChangeWorkEmbed = new MessageEmbed()
      .setColor('#c43131')
      .setAuthor(`💢 Erreur !`)
      .addField(`Tu ne peux pas changer de grade !`, `Tu as déjà pris un salaire ! Il faut que tu attendes encore **${ms(time)}** pour pouvoir changer de grade !`, false)
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setTimestamp();

    return message.channel.send(errorChangeWorkEmbed);
    
  } else if (args[0] && Worktimeout - (Date.now() - worktime) <= 0 || works == null) {

    if (worksarg[args.join(' ')] === undefined) return message.channel.send(errorWorksEmbed);

    db.set(`works_${message.author.id}`, worksarg[args.join(' ')]);

    const worksNewEmbed = new MessageEmbed()
      .setColor('#3d93d9')
      .setAuthor(`🚢 grade assingné !`)
      .setThumbnail(message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .addField(`Tu as reçu un nouveau grade !`, `Tu deviens officiellement **${nameworksarg[worksarg[args.join(' ')]]}** ! Tu peux dès à présent utiliser la commande \`${prefix}work\` !`, false)
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 4096, format: 'png'}))
      .setTimestamp();

    return message.channel.send(worksNewEmbed);

  } else if (!args[0]) return message.channel.send(worksEmbed);
  
};

module.exports.help = MESSAGES.COMMANDS.MONEY.WORKS;