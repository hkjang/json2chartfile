var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const ChartJs = require('node-chartjs')
const cjs = new ChartJs(800, 600)
const opn = require('opn')
const util = require('util')

app.post('/chart', function (req, res) {
 console.log(req.body);
var labels = req.body.results[0].data.map(function(e) {
   return e.period;
});
var data = req.body.results[0].data.map(function(e) {
   return e.ratio;
});

const lineConfig = {
    type: 'line',
   data: {
      labels: labels,
      datasets: [{
         label: req.body.label +  '네이버트렌드',
         data: data,
         backgroundColor: 'rgba(0, 119, 204, 0.3)'
      }]
    }
}

cjs.makeChart(lineConfig)
.then(res => {
  cjs.drawChart()

  cjs.toFile('/data/html/line.png')
    .then(_ => {
      opn('line.png')
    })
})

res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
          res.end('done');
       

});


app.listen(3002, function () {
  console.log('http://127.0.0.1:3002/chart app listening on port 3002!');
});

