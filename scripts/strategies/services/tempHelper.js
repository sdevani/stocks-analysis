var db = require('../../../db.js');
var Stock = db.Stock;
var _ = require('underscore');

var DAYS_TO_HOLD = 1;
var MINIMUM_WIN = 2;

var results = {};

var strategyCount = 1;
var addStrategyToResult = function(strategyFunction) {
  var name = 'Strategy ' + String(strategyCount++);
  addNamedStrategyToResult(name, strategyFunction);
};

var createYearBasedStrategy = function(year, func) {
  return function(stock, stocks, i) {
    return stock.date.getFullYear() == year && func(stock, stocks, i);
  };
}

var generateStrategyPerYear = function(func) {
  for (var year = 2000; year < 2017; year++) {
    addStrategyToResult(createYearBasedStrategy(year, func));
  }
};

var addNamedStrategyToResult = function(name, strategyFunction) {
  results[name] = {
    buyTrigger: 0,
    profitableDays: 0,
    profits: 0,
    positiveSum: 0,
    negativeSum: 0,
    strategyFunction: strategyFunction
  };
};

var addResult = function(results, profit) {
  results.buyTrigger++;
  results.profits += profit;
  if (profit > 0) {
    results.profitableDays++;
    results.positiveSum += profit;
  } else {
    results.negativeSum += profit;
  }
};

var formatResults = function(results) {
  // # of triggers
  // % profitable
  // $/trigger
  if (!results) { return ""; }
  if (results.buyTrigger === 0) { return "Triggers: " + results.buyTrigger; }
  return "Triggers: " + results.buyTrigger +
    "\tProfitability %: " + (results.profitableDays / results.buyTrigger * 100.0) +
    "\tProfits/Day: " + results.profits/results.buyTrigger +
    "\tNegative/Day:" + results.negativeSum/results.buyTrigger + 
    "\tPositive/Day:" + results.positiveSum/results.buyTrigger;
};

var printResults = function(results) {
  for (var type in results) {
    console.log("STRATEGY: ", type);
    var typeResult = results[type];
    console.log(formatResults(typeResult));
    console.log("\n\n");
  }
};

var standardSell = function(daysToHold, buyAt, sellAt) {
  return function(stocks, i) {
    var stocksBought = 100/stocks[i + 1][buyAt];
    var profit = stocks[i + daysToHold][sellAt] * stocksBought - 100;
    return profit;
  };
};

var earlySell = function(daysToHold, buyAt, sellAt, target) {
  var backupSell = standardSell(daysToHold, buyAt, sellAt);
  return function(stocks, i) {
    var stocksBought = 100/stocks[i + 1][buyAt];
    var targetPrice = (100 + target)/stocksBought;
    var firstDay = i + 1;
    var lastDay = i + daysToHold;
    if (sellAt === 'open') { lastDay--; }
    for (var day = firstDay; day <= lastDay; day++) {
      if (stocks[day].high > targetPrice) { return target; }
    }
    return backupSell(stocks, i);
  }
}

var run = function() {
  var sellFunction = standardSell(DAYS_TO_HOLD, 'open', 'close');
  Stock.findAll({
    order: [['date', 'ASC']]
  }).then(function(stocks) {
    return _.groupBy(stocks, function(stock) { return stock.ticker; });
  }).then(function(stockByTicker) {
    for (var ticker in stockByTicker) {
      var stocks = stockByTicker[ticker];
      for (var i = 1; i < stocks.length - 1 - DAYS_TO_HOLD; i++) {
        var stock = stocks[i];
        var profit = sellFunction(stocks, i);
        if (isNaN(profit) || profit < -50 || profit > 50) { continue; }
        for (var strategy in results) {
          var strategyFunction = results[strategy].strategyFunction;
          if (strategyFunction(stock, stocks, i)) {
            addResult(results[strategy], profit);
          }
        }
      }
    }
  }).then(function() {
    printResults(results);
  });
}

module.exports = {
  run: run,
  addStrategyToResult: addStrategyToResult,
  addNamedStrategyToResult: addNamedStrategyToResult,
  generateStrategyPerYear: generateStrategyPerYear
};