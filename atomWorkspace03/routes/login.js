module.exports = function(){
  var express = require('express'),
      mysql = require('mysql'),
      router = express.Router();

      var conn = mysql.createConnection({
        host : '127.0.0.1',
        user : 'dev24id',
        password : 'dev24pw',
        database : 'library'
      });

      router.post('/', function(req, res){
        var id = req.body.id;
        var pw = req.body.pw;
        var sql = 'SELECT * FROM admin WHERE adminid=?';
        conn.query(sql, [id], function(err, result){
          console.log(result[0].adminpw);
          if(err){
            res.send('로그인체크에러!'+err);
          }else if(result[0].adminpw){
              if(result[0].adminpw == pw){
                req.session.level = 'admin';
                res.redirect('/home');
              }else{
                res.send('비밀번호가 일치하지않습니다.<br/><br/><a href="/home">HOME</a>')
              }
          }else{
            res.send('아이디가 일치하지않습니다.<br/><br/><a href="/home">HOME</a>');
          }
        });
      });

      return router;
}
