var isSpinningTop = function(day) {
  // There is a spinningtop in the positive direction IF the bodySize is greater than upperShadow but the lowerShadow is 2x the bodysize
  var bodySize = Math.abs(day.open - day.close);
  var upperShadowSize = day.high - (Math.max(day.open, day.close));
  var lowerShadowSize = Math.min(day.open, day.close) - day.low;
  return (bodySize < 0.5 * lowerShadowSize && bodySize > upperShadowSize);
}

module.exports = {
  spinningTop1: {
    description: "If we have a spinningTop with the real body up high, we buy and sell next day.",
    strategyFunction: function(days) {
      var profits = 0;
      var buyTriggers = 0;
      var profitableDays = 0;
      for (var i = 0; i < days.length; i++) {
        if (i < 1 || i > days.length - 2 ) { continue; } // need 1 day before and 1 day after to do this

        if (isSpinningTop(days[i - 1])) {
          if (days[i].open < 0.001) { continue }
          buyTriggers++;
          var stocks = 10000 / (days[i].open);
          var profit = stocks * (days[i + 1].open) - 10000
          profits += profit;
          if (profits > 0) { profitableDays++; }
        }
      }
      return {
        gains: profits,
        profitableDays: profitableDays,
        buyTriggers: buyTriggers
      };
    }
  },

  spinningTop2: {
    description: "If we have a spinningTop with the real body up high, we buy and sell in 5 days.",
    strategyFunction: function(days) {
      var profits = 0;
      var buyTriggers = 0;
      var profitableDays = 0;
      for (var i = 0; i < days.length; i++) {
        if (i < 1 || i > days.length - 6 ) { continue; } // need 1 day before and 1 day after to do this

        if (isSpinningTop(days[i - 1])) {
          if (days[i].open < 0.001) { continue }
          buyTriggers++;
          var stocks = 10000 / (days[i].open);
          var profit = stocks * (days[i + 5].open) - 10000
          profits += profit;
          if (profits > 0) { profitableDays++; }
        }
      }
      return {
        gains: profits,
        profitableDays: profitableDays,
        buyTriggers: buyTriggers
      };
    }
  },

  spinningTop1AndDecreasePattern: {
    description: "If we have a spinningTop with the real body up high and a decrease pattern, we buy and sell in 1 day.",
    strategyFunction: function(days) {
      var profits = 0;
      var buyTriggers = 0;
      var profitableDays = 0;
      for (var i = 0; i < days.length; i++) {
        if (i < 2 || i > days.length - 2 ) { continue; } // need 1 day before and 1 day after to do this

        if (isSpinningTop(days[i - 1]) && days[i - 2].close > (days[i-1].close * 1.005)) {
          if (days[i].open < 0.001) { continue }
          buyTriggers++;
          var stocks = 10000 / (days[i].open);
          var profit = stocks * (days[i + 1].open) - 10000
          profits += profit;
          if (profits > 0) { profitableDays++; }
        }
      }
      return {
        gains: profits,
        profitableDays: profitableDays,
        buyTriggers: buyTriggers
      };
    }
  },

  spinningTop2AndDecreasePattern: {
    description: "If we have a spinningTop with the real body up high and a decrease pattern, we buy and sell in 1 day.",
    strategyFunction: function(days) {
      var profits = 0;
      var buyTriggers = 0;
      var profitableDays = 0;
      for (var i = 0; i < days.length; i++) {
        if (i < 2 || i > days.length - 6 ) { continue; } // need 1 day before and 1 day after to do this

        if (isSpinningTop(days[i - 1]) && days[i - 2].close > (days[i-1].close * 1.005)) {
          if (days[i].open < 0.001) { continue }
          buyTriggers++;
          var stocks = 10000 / (days[i].open);
          var profit = stocks * (days[i + 6].open) - 10000
          profits += profit;
          if (profits > 0) { profitableDays++; }
        }
      }
      return {
        gains: profits,
        profitableDays: profitableDays,
        buyTriggers: buyTriggers
      };
    }
  }
};