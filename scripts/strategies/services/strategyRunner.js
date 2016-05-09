var db = require('../../../db.js');
var Stock = db.Stock;
var _ = require('underscore');

var StrategyRunner = function() {
  this.strategies = {};
  this.counter = 0;
};

StrategyRunner.prototype.addStrategy = function(strategyFunction, printer, name) {
  name = name || ("Strategy " + String(this.counter));
  this.strategies[name] = {
    strategyFunction: strategyFunction,
    printer: printer,
    name: name
  };
};

StrategyRunner.prototype.run = function() {
  Stock.findAll({
    order: [['date', 'ASC']]
  }).then(function(stocks) {
    return _.groupBy(stocks, function(stock) { return stock.ticker; });
  }).then(function(stockByTicker) {
    for (var ticker in stockByTicker) {
      for (var name in this.strategies) {
        this.strategies[name].strategyFunction(stockByTicker[ticker]);
      }
    }
  }).then(function() {
    for (var name in this.strategies) {
      var strategy = this.strategies[name];
      var results = strategy.strategyFunction([])
      strategy.printer(name, results);
    }
  });
};

module.exports = StrategyRunner;