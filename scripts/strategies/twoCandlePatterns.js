// bullish counterattack
// bullish piercing
// bullish engulfing

var decreasingPattern = function(stocks, i) {
  if (stock[i - 1].oneWeekDelta >= -3) { return false; }
  if (stock[i - 1].oneDayDelta >= -1) { return false; }
  for (var index = i - 5; i <= index - 1; index++) {
    if (stocks[index].oneDayDelta >= 0.25) { return false; }
  }
};

var isCloseTo = function(first, second) {
  Math.abs((first.close - second.close)/first.close) <= 0.002
}

var counterattack = function(stock, stocks, i) {
  return decreasingPattern(stocks, i) &&        // general trend is decreasing
    stock.close > stock.open * 1.005 &&          // the day's trend in increasing
    isCloseTo(stock.close, stock[i-1].close);   // the close of today is close to close of yesterday
};

var isInMiddleOf = function(price, stock) {
  var lower = Math.min(stock.open, stock.close);
  var higher = Math.max(stock.open, stock.close);
  var bodySize = higher - lower;
  return (price > (lower + (bodySize / 4))) &&
          (price < (higher - (bodySize / 4)));
};

var piercing = function(stock, stocks, i) {
  return decreasingPattern(stocks, i) &&    // general trend is decreasing
    stock.close > stock.open * 1.005 &&     // the day's trend is increasing
    isInMiddleOf(stock.close, stocks[i-1]); // stock closes in middle of next day
};

var isEngulfing = function(stock1, stock2) {
  var lower1 = Math.min(stock1.open, stock1.close);
  var lower2 = Math.min(stock2.open, stock2.close);
  var higher1 = Math.max(stock1.open, stock1.close);
  var higher2 = Math.max(stock2.open, stock2.close);

  return lower1 < lower2 && higher1 > higher2;
};

var engulfing = function(stock, stocks, i) {
  return decreasingPattern(stocks, i) &&    // general trend is decreasing
    stock.close > stock.open * 1.005 &&     // the day's trend is increasing
    isEngulfing(stock, stocks[i - 1]);      // stock closes in middle of next day
};