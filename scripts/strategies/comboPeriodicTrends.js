var tempHelper = require('./services/tempHelper.js');

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
tempHelper.addStrategyToResult(standardStrategy);

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

tempHelper.run();
