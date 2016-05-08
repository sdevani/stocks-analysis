var db = require('../../../db.js');
var Stock = db.Stock;
var _ = require('underscore');

var strategies = {};
var counter = 0;

var addStrategy = function(strategyFunction, printer, name) {
  name = name || ("Strategy " + String(counter));
  strategies[name] = {
    strategyFunction: strategyFunction,
    printer: printer,
    name: name
  };
};

var run = function() {
  Stock.findAll({
    order: [['date', 'ASC']]
  }).then(function(stocks) {
    return _.groupBy(stocks, function(stock) { return stock.ticker; });
  }).then(function(stockByTicker) {
    for (var ticker in stockByTicker) {
      for (var name in strategies) {
        strategies[name].strategyFunction(stockByTicker[ticker]);
      }
    }
  }).then(function() {
    for (var name in strategies) {
      var strategy = strategies[name];
      var results = strategy.strategyFunction([])
      strategy.printer(name, results);
    }
  });
};

module.exports = {
  addStrategy: addStrategy,
  run: run
};