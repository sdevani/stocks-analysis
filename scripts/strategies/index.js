var isSpinningTop = function(days, index) {
  // There is a spinningtop in the positive direction IF the bodySize is greater than upperShadow but the lowerShadow is 2x the bodysize
  // Checks if spinnging top exists the day before index
  if (index <= 0) { return false; }
  var day = days[index - 1];
  var bodySize = Math.abs(day.open - day.close);
  var upperShadowSize = day.high - (Math.max(day.open, day.close));
  var lowerShadowSize = Math.min(day.open, day.close) - day.low;
  return (bodySize < 0.5 * lowerShadowSize && bodySize > upperShadowSize);
};

var decreasedInPreviousDay = function(days, index) {
  // If compared to previous day, today it decreased by 0.5% or more.
  if (index <= 1) { return false; }
  return days[index - 2].close > days[index - 1].close * 1.005;
};

var buyStock = function(days, index, holdPeriod) {
  var funds = 10000;
  if (index + holdPeriod >= days.length) { return 0; }
  if (days[index].open <= 0.0001 || isNaN(days[index].open) || isNaN(days[index + holdPeriod].open )) { return 0; }
  var stockCount = funds / days[index].open;
  var profit = stockCount * days[index + holdPeriod].open - funds;
  return profit;
};

var genericSpinningTopStrategy = function(decreasePattern, holdPeriod) {
  return function(days) {
    var gains = {};
    // console.log(days[0].date, days[0].date.getFullYear());

    for (var i = 0; i < days.length; i++) {
      var year = days[i].date.getFullYear();
      if (!gains[year]) {
        gains[year] = { gains: 0, buyTriggers: 0, profitableDays: 0 };
      }
      if (isSpinningTop(days, i) && (!decreasePattern || decreasedInPreviousDay(days, i))) {
        gains[year].buyTriggers++;
        var profit = buyStock(days, i, holdPeriod);
        if (profit > 0) { gains[year].profitableDays++; }
        gains[year].gains += profit;
      }
    }

    return gains;
  };
};

var stringify = function(gains) {
  var res = "";
  for (var key in gains) {
    res += "\t" + key + ": " + gains[key];
  }
  return res;
};

var basicSpinningTopPrinter = function(name, results) {

  console.log("Strategy: " + name);
  console.log("Description: " + results[0].description)
  results.forEach(function(result) {
    console.log(result.ticker + "\t" + stringify(result.gains));
  });
}

var spinningTopPrinterByYear = function(name, results) {
  // results = [ {ticker: 'tm', gains: {2000: {gains: 5.25,...}}}]
  // collapse into results by year and print individual results
  var finalResults = {};
  console.log(results[0].strategyName, results[0].description);
  results.forEach(function(result) {
    console.log("Ticker:", result.ticker);
    var gains = result.gains;
    for (var year in gains) {
      console.log(gains);
      console.log(gains[year]);
      console.log(Object.keys(gains[year]));
      // console.log(year + ":\t" + stringify(gains[year]));
    }
  })

}


module.exports = {
  spinningTop1: {
    description: "If we have a spinningTop with the real body up high, we buy and sell next day.",
    strategyFunction: genericSpinningTopStrategy(false, 2),
    printResults: spinningTopPrinterByYear
  },

  spinningTop1AndDecreasePattern: {
    description: "If we have a spinningTop with the real body up high and a decrease pattern, we buy and sell in 1 day.",
    strategyFunction: genericSpinningTopStrategy(true, 2),
    printResults: spinningTopPrinterByYear
  }
};