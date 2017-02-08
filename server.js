var express = require("express");
var hbs = require("hbs");

var app = express();

app.use(express.static('public'));
app.set("views", "./views");
app.set("view engine", "hbs");

var Datastore = require('nedb');
app.db = new Datastore({filename: 'models/highScores.db', autoload: true});

var gameController  = require("./controllers/gameController");
app.use('/', gameController);

var port = 3000;
var host = 'localhost';

var server = app.listen(port, host, function(){
    console.log('Server is started.');
});