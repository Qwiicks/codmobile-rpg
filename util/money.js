const ms = require('ms')

const WORKS = {
  ONE: {
    name: '🥇NOVICE🥇',
    amount: '312',
    timeout: ms('15m')
  },
  TWO: {
    name: '🥇VÉTERAN🥇',
    amount: '625',
    timeout: ms('30m')
  },
  THREE: {
    name: '🥇ÉLITE🥇',
    amount: '1250',
    timeout: ms('3h')
  },
  FOUR: {
    name: '🥇PRO🥇',
    amount: '2500',
    timeout: ms('6h')
  },
  FIVE: {
    name: '🥇MAITRE🥇',
    amount: '5000',
    timeout: ms('12h')
  },
  SIX: {
    name: '🥇LÉGENDAIRE🥇',
    amount: '10000',
    timeout: ms('24h')
  }
};

const DAILY = {
  amount: '500',
  timeout: ms('1d')
};

const REP = {
  timeout: ms('1d')
}

exports.WORKS = WORKS;
exports.DAILY = DAILY;
exports.REP = REP;