var db = require('../../db.js');
var Stock = db.Stock;
var _ = require('underscore');

var DAYS_TO_HOLD = 5;
var MINIMUM_WIN = 2;


var results = {};
var strategyCount = 1;
var addStrategyToResult = function(strategyFunction) {
  var name = 'Strategy ' + String(strategyCount++);
  addNamedStrategyToResult(name, strategyFunction);
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

var standardStrategy = function(stock, stocks, i) {
  var yearlyDelta = 10;
  var quarterlyDelta = 3;
  var weeklyDelta = -3;
  var dailyDeltaSize = 0.25;
  return stock.oneYearDelta >= yearlyDelta &&
    stock.oneQuarterDelta >= quarterlyDelta &&
    stock.oneWeekDelta < weeklyDelta &&
    Math.abs(stock.oneDayDelta + dailyDeltaSize) < dailyDeltaSize
    && stock.date.getFullYear() != 2003;
};
addStrategyToResult(standardStrategy);

var highToLowStrategy = function() {
  return function(stock, stocks, i) {
    return stock.oneYearDelta >= 10 &&
          stock.oneQuarterDelta >= 5 &&
          stock.oneMonthDelta <= -2 &&
          stock.oneWeekDelta >= 0
      // && stock.date.getFullYear() != 2003;
  };
}

var categoryStrategy = function(year, quarter, month, week, day) {
  return function(stock, stocks, i) {
    return year * stock.oneYearDelta > 0 &&
           quarter * stock.oneQuarterDelta > 0 &&
           month * stock.oneMonthDelta > 0 &&
           week * stock.oneWeekDelta > 0 &&
           day * stock.oneDayDelta > 0;
  }
};

// day value at 2 (18, 20, 28)
// week value at 3 (4, 11, 22, 28, )
// month value at

// generateStrategyPerYear(categoryStrategy(-1, -1, 1, -1, -1));

// addStrategyToResult(categoryStrategy(1, 1, 1, 1, 1));
// addStrategyToResult(categoryStrategy(1, 1, 1, 1, -1));
// addStrategyToResult(categoryStrategy(1, 1, 1, -1, 1));
// addStrategyToResult(categoryStrategy(1, 1, 1, -1, -1));
// addStrategyToResult(categoryStrategy(1, 1, -1, 1, 1));
// addStrategyToResult(categoryStrategy(1, 1, -1, 1, -1));
// addStrategyToResult(categoryStrategy(1, 1, -1, -1, 1));
// addStrategyToResult(categoryStrategy(1, 1, -1, -1, -1));
// addStrategyToResult(categoryStrategy(1, -1, 1, 1, 1));
// addStrategyToResult(categoryStrategy(1, -1, 1, 1, -1));
// addStrategyToResult(categoryStrategy(1, -1, 1, -1, 1));
// addStrategyToResult(categoryStrategy(1, -1, 1, -1, -1));
// addStrategyToResult(categoryStrategy(1, -1, -1, 1, 1));
// addStrategyToResult(categoryStrategy(1, -1, -1, 1, -1));
// addStrategyToResult(categoryStrategy(1, -1, -1, -1, 1));
// addStrategyToResult(categoryStrategy(1, -1, -1, -1, -1));
// addStrategyToResult(categoryStrategy(-1, 1, 1, 1, 1));
// addStrategyToResult(categoryStrategy(-1, 1, 1, 1, -1)); // this 18
// addStrategyToResult(categoryStrategy(-1, 1, 1, -1, 1));
// addStrategyToResult(categoryStrategy(-1, 1, 1, -1, -1)); // this 20
// addStrategyToResult(categoryStrategy(-1, 1, -1, 1, 1));
// addStrategyToResult(categoryStrategy(-1, 1, -1, 1, -1));
// addStrategyToResult(categoryStrategy(-1, 1, -1, -1, 1));
// addStrategyToResult(categoryStrategy(-1, 1, -1, -1, -1));
// addStrategyToResult(categoryStrategy(-1, -1, 1, 1, 1));
// addStrategyToResult(categoryStrategy(-1, -1, 1, 1, -1));
// addStrategyToResult(categoryStrategy(-1, -1, 1, -1, 1));
// addStrategyToResult(categoryStrategy(-1, -1, 1, -1, -1)); // this 28
// addStrategyToResult(categoryStrategy(-1, -1, -1, 1, 1));
// addStrategyToResult(categoryStrategy(-1, -1, -1, 1, -1));
// addStrategyToResult(categoryStrategy(-1, -1, -1, -1, 1));
// addStrategyToResult(categoryStrategy(-1, -1, -1, -1, -1));


// generateStrategyPerYear(highToLowStrategy(10, 3, -4, 0.25));
// addStrategyToResult(highToLowStrategy());

// generateStrategyPerYear(standardStrategy);

// addStrategyToResult(function(stock, stocks, i) {
//   return stock.oneYearDelta >= 10;
// });

// addStrategyToResult(function(stock, stocks, i) {
//   return stock.oneYearDelta >= 10 && stock.oneQuarterDelta > 5;
// });

// addStrategyToResult(function(stock, stocks, i) {
//   return stock.oneYearDelta >= 10 && stock.oneQuarterDelta > 5 && stock.oneWeekDelta < -3;
// });

// addStrategyToResult(function(stock, stocks, i) {
//   return stock.oneYearDelta >= 10 && stock.oneQuarterDelta > 5 && stock.oneWeekDelta < -3 && stock.oneDayDelta > 1;
// });

// addStrategyToResult(function(stock, stocks, i) {
//   return stock.oneQuarterDelta > 5 && stock.oneWeekDelta < -3 && stock.oneDayDelta > 1;
// });

// addStrategyToResult(function(stock, stocks, i) {
//   return stock.oneWeekDelta < -3 && stock.oneDayDelta > 1;
// });

Stock.findAll({
  order: [['date', 'ASC']]
}).then(function(stocks) {
  return _.groupBy(stocks, function(stock) { return stock.ticker; });
}).then(function(stockByTicker) {
  for (var ticker in stockByTicker) {
    var stocks = stockByTicker[ticker];
    for (var i = 1; i < stocks.length - 1 - DAYS_TO_HOLD; i++) {
      var stock = stocks[i];
      // var stockYear = stock.date.getFullYear();
      var stocksBought = 10000/(stocks[i+1].open);
      var profit = stocksBought * stocks[i+DAYS_TO_HOLD].close - 10000;
      if (isNaN(profit) || profit < -5000 || profit > 5000) { continue; }
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

var addResult = function(results, profit) {
  results.buyTrigger++;
  results.profits += profit;
  if (profit > 0) {
    results.profitableDays++;
    results.positiveSum += profit;
  } else {
    results.negativeSum += profit;
  }
}

var printResults = function(results) {
  for (var type in results) {
    console.log("STRATEGY: ", type);
    var typeResult = results[type];
    console.log(formatResults(typeResult));
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
    "\tProfits/Day: " + results.profits/results.buyTrigger +
    "\tNegative/Day:" + results.negativeSum/results.buyTrigger + 
    "\tPositive/Day:" + results.positiveSum/results.buyTrigger;
}