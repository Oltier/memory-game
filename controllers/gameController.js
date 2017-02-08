/**
 * Created by zolta on 2017. 02. 07..
 */
var express = require("express");

var router = express.Router();

router.get('/', function(req, res){
    res.render('index');
});

router.post('/', function(req,res) {
   var tries = parseInt(req.body.tries);
   var name = req.body.name;
   var size = parseInt(req.body.size);
   var doc = {
       size: size,
       name: name,
       tries: tries
   };
    console.log("Received data");
   req.app.db.insert(doc, function (err, doc) {
       if(err) console.log("Error inserting: " + err);
       req.app.db.find({size: size}, {_id: 0}).sort({tries: 1}).limit(10).exec(function(err, docs) {
           res.json(docs);
       })
   })
});

module.exports = router;