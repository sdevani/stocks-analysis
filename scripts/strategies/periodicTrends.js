var db = require('../../db.js');
var Stock = db.Stock;
var _ = require('underscore');
// for each type of period (daily, weekly, etc)
    // For every 0.5% increment
    // I would like to see ratio of profitable days, total profit/day, days that fall in the category

var types = ['oneDayDelta', 'oneWeekDelta', 'oneMonthDelta', 'oneQuarterDelta', 'oneYearDelta'];
var LOWEST_DROP = -20.0;
var HIGHEST_RISE = 20.0;
var INCREMENTS = 2.0;
var results = {};

for (var typeIndex in types) {
  var type = types[typeIndex];
  results[type] = [];
  var j = 0;
  for (var i = LOWEST_DROP; i <= HIGHEST_RISE; i+= INCREMENTS) {
    results[type][j] = {
      range: i,
      buyTrigger: 0,
      profitableDays: 0,
      profits: 0,
    };
    j++;
  }
}

var printResults = function(results) {
  for (var type in results) {
    console.log("TYPE: ", type);
    var typeResult = results[type];
    for (var i = 0; i < typeResult.length; i++) {
      console.log(formatResults(typeResult[i]));
    }
    console.log("\n\n");
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
    "\tProfits/Day: " + results.profits/results.buyTrigger;
}

var percentToIndex = function(percent) {
  // -10 and lower are 0;
  // -9.5 to 10 are 1;
  if (percent >= HIGHEST_RISE) { percent = HIGHEST_RISE - 0.5 * INCREMENTS; }
  if (percent <= LOWEST_DROP) { return 0; }
  var index = percent - LOWEST_DROP;
  index /= INCREMENTS;
  index = Math.ceil(index);
  return index;
};

// printResults(results);
var addProfitData = function(result, percentIncrease, profit) {
  // find index for percentIncrease
  // add buyTrigger, maybe add profitable day, add profit
  var index = percentToIndex(percentIncrease);
  result[index].buyTrigger++;
  result[index].profits += profit;
  if (profit > 0) { result[index].profitableDays++; }
}

Stock.findAll({
  order: [['date', 'ASC']]
}).then(function(stocks) {
  return _.groupBy(stocks, function(stock) { return stock.ticker; });
}).then(function(stockByTicker) {
  for (var ticker in stockByTicker) {
    var stocks = stockByTicker[ticker];
    for (var i = 1; i < stocks.length - 2; i++) {
      var stock = stocks[i];
      // var stockYear = stock.date.getFullYear();
      var stocksBought = 10000/(stocks[i+1].open);
      var profit = stocksBought * stocks[i + 1].close - 10000;
      if (isNaN(profit) || profit < -5000 || profit > 5000) { continue; }
      types.forEach(function(type) {
        addProfitData(results[type], stock[type], profit);
      });
    }
  }
}).then(function() {
  printResults(results);
});