var _ = require('underscore');

var db = require('../db.js');
var Stock = db.Stock;
var StrategyResult = db.StrategyResult;
var stockTickers = require('./stockTickers.js');
var tickers = stockTickers.stocks;
var strategies = require('./strategies/index.js');

var destroyOldResults = function() {
  return StrategyResult.destroy({truncate: true});  
};

var runAllStrategies = function() {
  var strategyResults = tickers.map(function(ticker) {
    return Stock.findAll({
      where: {
        ticker: ticker
      },
      order: [
        ['date', 'ASC']
      ]
    }).then(function(days) {
      return Promise.all(executeStrategies(ticker, days));
    });
  });
  return Promise.all(strategyResults);
};

var executeStrategies = function(ticker, days) {
  var results = [];
  for (var name in strategies) {
    var gains = strategies[name].strategyFunction(days);
    var result = StrategyResult.create({
      ticker: ticker,
      strategyName: name,
      gains: gains,
      description: strategies[name].description
    });
    results.push(result);
  }
  return results;
};

var printResults = function() {
  StrategyResult.findAll().then(function(results) {
    var groupedRes = _.groupBy(results, function(result) {
      return result.strategyName;
    });

    for (var name in groupedRes) {
      strategies[name].printResults(name, groupedRes[name]);
    }
  })
};

destroyOldResults().then(runAllStrategies).then(printResults);
