var csv = require('csv-parser');
var fs = require('fs');
var stripBomStream = require('strip-bom-stream');
var Promise = require('bluebird');
var sprom = require('sprom');

var stockTickers = require('./stockTickers.js');
var db = require('../db.js');

var tickers = stockTickers.stocks;
var Stock = db.Stock;

var addTickerData = function(ticker) {
  var fileName = "./fortune500StockReports/" + ticker + ".csv";

  var rows = [];
  var gatherRows = new Promise(function(resolve, reject) {
    fs.createReadStream(fileName)
      .pipe(stripBomStream())
      .pipe(csv())
      .on('data', function(data) {
        rows.push({
          ticker: ticker,
          open: data.Open,
          close: data.Close,
          low: data.Low,
          high: data.High,
          date: data.Date
        });
      }).on('finish', function() {
        resolve(rows);
      });
  });

  return gatherRows.then(function(rows) {
    return Stock.bulkCreate(rows);
  });
};

Stock.destroy({truncate: true}).then(function() {
  return Promise.all(tickers.map(addTickerData))
}).then(function() {
  console.log("Data Added");
});