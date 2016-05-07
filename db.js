var Sequelize = require('sequelize');

var sequelize = new Sequelize(
  'stock-analysis',
  '',
  '',
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  });

var Stock = sequelize.define('stock', {
  ticker: {
    type: Sequelize.STRING,
    field: 'ticker'
  },
  date: {
    type: Sequelize.DATEONLY,
    field: 'date'
  },
  open: {
    type: Sequelize.FLOAT,
    field: 'open'
  },
  close: {
    type: Sequelize.FLOAT,
    field: 'close'
  },
  high: {
    type: Sequelize.FLOAT,
    field: 'high'
  },
  low: {
    type: Sequelize.FLOAT,
    field: 'low'
  },
  hammer: {
    type: Sequelize.BOOLEAN,
    field: 'hammer'
  },
  decreaseHalfPercent: {
    type: Sequelize.BOOLEAN,
    field: 'decreaseHalfPercent'
  },
  tripleDecreases: {
    type: Sequelize.BOOLEAN,
    field: 'tripleDecreases'
  },
  smallBody: {
    type: Sequelize.BOOLEAN,
    field: 'smallBody'
  },
  oneDayDelta: {
    type: Sequelize.FLOAT,
    field: 'oneDayDelta'
  },
  oneWeekDelta: {
    type: Sequelize.FLOAT,
    field: 'oneWeekDelta'
  },
  oneMonthDelta: {
    type: Sequelize.FLOAT,
    field: 'oneMonthDelta'
  },
  oneQuarterDelta: {
    type: Sequelize.FLOAT,
    field: 'oneQuarterDelta'
  },
  oneYearDelta: {
    type: Sequelize.FLOAT,
    field: 'oneYearDelta'
  }
});

var StrategyResult = sequelize.define('strategyResult', {
  ticker: {
    type: Sequelize.STRING,
    field: 'ticker'
  },
  strategyName: {
    type: Sequelize.STRING,
    field: 'strategyName' 
  },
  gains: {
    type: Sequelize.HSTORE,
    field: 'gains'
  },
  description: {
    type: Sequelize.STRING,
    field: 'description'
  }
});

// Stock.sync({force: true}).then(function() {
//   console.log("Stock table created");
// });

// StrategyResult.sync({force: true}).then(function() {
//   console.log("StrategyResult table created");
// });

module.exports = {
  Stock: Stock,
  StrategyResult: StrategyResult
};