module.exports = function(){
  var express = require('express'),
      mysql = require('mysql'),
      router = express.Router();

      var conn = mysql.createConnection({
        host : '127.0.0.1',
        user : 'dev24id',
        password : 'dev24pw',
        database : 'dev24db'
      });

      router.get('/', function(req, res){
        res.render('index');
      });

      return router;
}
