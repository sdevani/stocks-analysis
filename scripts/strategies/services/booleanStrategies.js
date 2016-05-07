var generateBooleanStrategy = function(booleanFunc, options) {
  var daysToHold = options.daysToHold || 1;
  var buyAt = options.buyAt || 'open';
  var sellAt = options.sellAt || 'close';

  var buySellStrategy = standardSell(daysToHold, buyAt, sellAt);
  if (options.sellEarly)  {
    buySellStrategy = earlySell(daysToHold, buyAt, sellAt, target);
  }

  var results = {
    buyTriggers: 0,
    profitableDays: 0,
    profits: 0,
    positiveProfits: 0,
    negativeProfits: 0
  };

  return function(stocks) {
    stocks.forEach(function(stock, stocks, i) {
      if (i + daysToHold + 1 >= stocks.length) { return; }
      if (booleanFunc(stock, stocks, i)) {
        var profit = buySellStrategy(stocks, i);
        addProfitToResult(results, profit);
      }
    });
    return results;
  }
};

var standardSell = function(daysToHold, buyAt, sellAt) {
  return function(stocks, i) {
    var stocksBought = 100/stocks[i + 1][buyAt];
    var profit = stocks[i + 1 + daysToHold][sellAt] * stocksBought - 100;
    return profit;
  };
};

var earlySell = function(daysToHold, buyAt, sellAt, target) {
  var backupSell = standardSell(daysToHold, buyAt, sellAt);
  return function(stocks, i) {
    var stocksBought = 100/stocks[i + 1][buyAt];
    var targetPrice = (100 + target)/stocksBought;
    var firstDay = i + 1;
    var lastDay = i + daysToHold + 1;
    if (sellAt === 'open') { lastDay--; }
    for (var day = firstDay; day <= lastDay; day++) {
      if (stocks[day].high > targetPrice) { return target; }
    }
    return backupSell(stocks, i);
  }
}

var addProfitToResult = function(results, profit) {
  if (isNaN(profit) || profit > 50 || profit < -50) { return results; }
  results.buyTriggers++;
  results.profits+= profit;
  if (profits > 0) {
    results.profitableDays++;
    results.positiveProfits+=profit;
  } else {
    results.negativeProfits+=profit;
  }
  return results;
};

module.exports = generateBooleanStrategy;