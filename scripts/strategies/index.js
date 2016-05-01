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
    var profits = 0;
    var buyTriggers = 0;
    var profitableDays = 0;

    for (var i = 0; i < days.length; i++) {
      if (isSpinningTop(days, i) && (!decreasePattern || decreasedInPreviousDay(days, i))) {
        buyTriggers++;
        var profit = buyStock(days, i, holdPeriod);
        if (profit > 0) { profitableDays++; }
        profits += profit;
      }
    }

    return {
      gains: profits,
      profitableDays: profitableDays,
      buyTriggers: buyTriggers
    };
  };
}

module.exports = {
  spinningTop1: {
    description: "If we have a spinningTop with the real body up high, we buy and sell next day.",
    strategyFunction: genericSpinningTopStrategy(false, 1)
  },

  spinningTop2: {
    description: "If we have a spinningTop with the real body up high, we buy and sell in 5 days.",
    strategyFunction: genericSpinningTopStrategy(false, 5)
  },

  spinningTop1AndDecreasePattern: {
    description: "If we have a spinningTop with the real body up high and a decrease pattern, we buy and sell in 1 day.",
    strategyFunction: genericSpinningTopStrategy(true, 1)
  },

  spinningTop2AndDecreasePattern: {
    description: "If we have a spinningTop with the real body up high and a decrease pattern, we buy and sell in 1 day.",
    strategyFunction: genericSpinningTopStrategy(true, 5)
  }
};