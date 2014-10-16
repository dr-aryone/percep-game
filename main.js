var http = require('http');
var express = require('express');
var app = express();
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/client'));
app.use(express.cookieParser());
app.use(app.router);

var statistics = require('./server_modules/statistics');
var db = require('./server_modules/models');

db.sequelize.sync();

app.post('/statistics', statistics.add);
app.get('/statistics', statistics.get);

var httpServer = http.createServer(app);

httpServer.listen(8080);
