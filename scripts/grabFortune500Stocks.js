var Download = require('download');

var stocks = require('./stockTickers.js').stocks;

var createUrl = function(code) {
  var url = "https://www.google.com/finance/historical?q=" + code +
    "&startdate=May+7%2C+1990&enddate=May+5%2C+2016&output=csv";
  return url;
};

stocks.forEach(function(stock) {
  (new Download({mode: 777})).get(createUrl(stock)).dest('./fortune500StockReports').rename(stock + ".csv").run();  
});
