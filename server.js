var express = require("express");
var hbs = require("hbs");
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('public'));
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({
    extended: false
}));

var Datastore = require('nedb');
app.db = new Datastore({
    filename: 'models/highScore.db',
    autoload: true,
});

var gameController  = require("./controllers/gameController");
app.use('/', gameController);

var port = 3000;
var host = 'localhost';

var server = app.listen(port, host, function(){
    console.log('Server is started.');
});