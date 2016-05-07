var db = require('../../db.js');
var stockTickers = require('../stockTickers.js');
var Stock = db.Stock;
var tickers = stockTickers.stocks;
var Promise = require('bluebird');
var _ = require('underscore');

var createResultsObject = function() {
  var results = {
    hammerOnly: {},
    hammerAndDecrease: {},
    decreaseOnly: {},
    tripleDecreaseOnly: {},
    hammerAndTripleDecrease: {},
    tripleDecreaseAndSmallBody: {},
    decreaseAndSmallBody: {}
  };
  for (var strategy in results) {
    results[strategy].buyTriggers = 0;
    results[strategy].profits = 0;
    results[strategy].profitableDays = 0;
    results[strategy].negativeSum = 0;
    results[strategy].positiveSum = 0;
  }
  return results;
};

var results = {};

Stock.findAll({
  order: [['date', 'ASC']]
}).then(function(stocks) {
  return _.groupBy(stocks, function(stock) { return stock.ticker; });
}).then(function(stockByTicker) {
  for (var ticker in stockByTicker) {
    var stocks = stockByTicker[ticker];
    for (var i = 1; i < stocks.length - 2; i++) {
      var stock = stocks[i];
      var stockYear = stock.date.getFullYear();
      var stocksBought = 10000/(stocks[i+1].open);
      var profit = stocksBought * stocks[i + 1].close - 10000;
      if (isNaN(profit) || profit < -5000 || profit > 5000) { continue; }
      if (!results[stockYear]) { results[stockYear] = createResultsObject() };
      if (!results['total']) { results['total'] = createResultsObject() };
      addResults(results[stockYear], stock, profit, stocks, i);
      addResults(results['total'], stock, profit, stocks, i);
    }
  }
}).then(function() { printResults(results) });

var addResults = function(results, stock, profit, stocks, i) {
  if (stock.hammer) { addSingleResult(results.hammerOnly, profit); }
  if (stock.hammer && stocks[i-1].decreaseHalfPercent) { addSingleResult(results.hammerAndDecrease, profit); }
  if (stock.hammer && stocks[i-1].tripleDecreases) { addSingleResult(results.hammerAndTripleDecrease, profit); }
  if (stock.decreaseHalfPercent) { addSingleResult(results.decreaseOnly, profit); }
  if (stock.tripleDecreases) { addSingleResult(results.tripleDecreaseOnly, profit); }
  if (stocks[i-1].decreaseHalfPercent && stock.smallBody) { addSingleResult(results.decreaseAndSmallBody, profit); }
  if (stocks[i-1].tripleDecreases && stock.smallBody) { addSingleResult(results.tripleDecreaseAndSmallBody, profit); }
};

var addSingleResult = function(result, profit) {
  result.profits += profit;
  result.buyTriggers++;
  if (profit > 0) {
    result.profitableDays++;
    result.positiveSum += profit;
  } else {
    result.negativeSum -= profit;
  }
};

var stringify = function(gains) {
  var res = "";
  for (var key in gains) {
    res += "\t" + key + ": " + gains[key];
  }
  return res;
};

var printResults = function(results) {
  for (var year in results) {
    console.log("RESULTS FOR YEAR:", year);
    var annualResults = results[year];
    for (var strat in annualResults) {
      console.log("Strategy: " + strat);
      console.log(stringify(annualResults[strat]));
    }
    console.log("\n\n\n");
  }
}