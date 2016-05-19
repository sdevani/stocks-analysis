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

tempHelper.run({
  // earlySell: true,
  // targetPrice: 3
});
