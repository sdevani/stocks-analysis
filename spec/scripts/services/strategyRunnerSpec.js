var StrategyRunner = require('../../../scripts/strategies/services/strategyRunner.js');

describe("Strategies", function() {
  var strategyRunner = new StrategyRunner();
  beforeEach(function() {
    // Seed database
    // remove all stocks
    // add the following stocks
    var stocksToAdd = [
      {ticker: 'a', date: new Date("May 05, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'a', date: new Date("May 04, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'b', date: new Date("May 06, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'a', date: new Date("May 06, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'b', date: new Date("May 05, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'b', date: new Date("May 04, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'c', date: new Date("May 05, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'c', date: new Date("May 06, 1990"), open: 5, close, 10, high, 15, low, 2},
      {ticker: 'd', date: new Date("May 05, 1990"), open: 5, close, 10, high, 15, low, 2},
    ]
  });

  describe("Adding a single strategy", function() {
    var strategyFunction1, strategyFunction2;
    beforeEach(function() {
      var result1 = 0, result2 = 0;
      strategyFunction1 = function(stocks) { result1 += 1; return result1; };
      strategyFunction2 = function(stocks) { result2 += 2; return result2; };
    });

    expect("Strategy function to be called with each stock ticker", function() {
      strategyRunner.addStrategy(strategyFunction1);
      // expect strategyFunction1 to be called 4 times with each type of array
      strategyRunner.run();
    });

    expect("Printer to be called with the name and result of last return value", function() {

    });
  });

  describe("Adding multiple strategies", function() {
    expect("All strategy functions to be called with each stock ticker", function() {

    });

    expect("Respective printer functions to be called with proper results", function() {

    });
  });
});