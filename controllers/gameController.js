/**
 * Created by zolta on 2017. 02. 07..
 */
var express = require("express");

var router = express.Router();

router.get('/', function(req, res){
    res.render('index');
});

module.exports = router;