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

// Stock.sync().then(function() {
//   console.log("Stock table created");
// });

// StrategyResult.sync({force: true}).then(function() {
//   console.log("StrategyResult table created");
// });

module.exports = {
  Stock: Stock,
  StrategyResult: StrategyResult
};