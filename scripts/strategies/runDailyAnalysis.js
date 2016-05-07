var db = require('../../db.js');
var stockTickers = require('../stockTickers.js');
var Stock = db.Stock;
var tickers = stockTickers.stocks;
var Promise = require('bluebird');

var SMALL_BODY_PERCENTAGE = 0.0025;
var DECREASE_PERCENTAGE = 0.01;

var stocksPerTicker = tickers.map(function(ticker) {
  return Stock.findAll({
    where: { ticker: ticker },
    order: [
      ['date', 'ASC']
    ]
  });
});

var saveNewStockData = Promise.all(stocksPerTicker).mapSeries(function(stocks) {
  // console.log(Object.keys(stocks));
  var saveStocks = stocks.map(function(stock, i, stocks) {
    addHammerData(stock, stocks, i);
    addDecreaseData(stock, stocks, i);
    addTripleDecreaseData(stock, stocks, i);
    addSmallBodyData(stock, stocks, i);
    addDeltas(stock, stocks, i);
    return stock.save();
  });

  return Promise.all(saveStocks);
});

Promise.all(saveNewStockData).then(function() {
  console.log("Added analysis");
});

var isSpinningTop = function(day) {
  // There is a spinningtop in the positive direction IF the bodySize is greater than upperShadow but the lowerShadow is 2x the bodysize
  // Checks if spinnging top exists the day before index
  var bodySize = Math.abs(day.open - day.close);
  var upperShadowSize = day.high - (Math.max(day.open, day.close));
  var lowerShadowSize = Math.min(day.open, day.close) - day.low;
  return (bodySize < 0.5 * lowerShadowSize && bodySize > upperShadowSize);
};

var addHammerData = function(stock, stocks, i) {
  stock.hammer = isSpinningTop(stock);
};

var decreasedInPreviousDay = function(days, index) {
  // If compared to previous day, today it decreased by 0.5% or more.
  if (index <= 1) { return false; }
  return days[index - 1].close > days[index].close * (1 + DECREASE_PERCENTAGE);
};

var addDecreaseData = function(stock, stocks, i) {
  stock.decreaseHalfPercent = decreasedInPreviousDay(stocks, i);
};

var addTripleDecreaseData = function(stock, stocks, i) {
  stock.tripleDecreases = decreasedInPreviousDay(stocks, i) &&
    decreasedInPreviousDay(stocks, i - 1 ) &&
    decreasedInPreviousDay(stocks, i - 2);
};

var addSmallBodyData = function(stock, stocks, i) {
  stock.smallBody = Math.abs(stock.open - stock.close) < (SMALL_BODY_PERCENTAGE * stock.close);
};

var addDeltas = function(stock, stocks, i) {
  addTimeDelta(stock,stocks,i, 1, 'oneDayDelta');
  addTimeDelta(stock,stocks,i, 5, 'oneWeekDelta');
  addTimeDelta(stock,stocks,i, 20, 'oneMonthDelta');
  addTimeDelta(stock,stocks,i, 60, 'oneQuarterDelta');
  addTimeDelta(stock,stocks,i, 200, 'oneYearDelta');
};

var addTimeDelta = function(stock, stocks, i, days, key) {
  if (i < days) {
    stock[key] = 0.0;
  } else {
    stock[key] = (stock.close - stocks[i - days].close) / (stocks[i - days].close) * 100.0;
  }
}