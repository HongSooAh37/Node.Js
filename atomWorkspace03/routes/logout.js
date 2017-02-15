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
      //logout 설정
      router.post('/', function(req, res){
        req.session.destroy(function() {
          res.redirect('/home')
        });
      });

      return router;
}
