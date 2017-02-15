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

      //human=memberAddForm___get
      router.get('/memberInsertForm', function(req, res){
        var sql = "SELECT * FROM library";
        conn.query(sql, function(err, result){
            res.render('memberInsertForm',{result:result});
        });
      });

      //human=adminAddForm___get
      router.get('/adminInsertForm', function(req, res){
        var sql = 'SELECT * FROM library';
        conn.query(sql, function(err, result){
            res.render('adminInsertForm',{result:result});
        });
      });

      //human=(member/admin)Add___post
      router.post('/:id', function(req, res){
        var libraryNumber = req.body.libraryNumber;
        var sql = 'SELECT localnumber FROM library WHERE librarynumber=?';
        var localNumber = '';
        conn.query(sql, [libraryNumber],function(err, localNumber){
          if(err){
            res.send(err);
          }else{
            console.log(localNumber[0].localnumber);
            var id = req.params.id;

          // admin Add
          }if(id=='admin'){
            var statement = [
              req.body.adminId, req.body.libraryNumber, localNumber[0].localnumber, req.body.adminPw,
              req.body.adminName, req.body.adminRrn, req.body.adminAddr, req.body.adminTel];
            var sql = 'INSERT INTO admin'
                      +'(adminid,librarynumber,localnumber,adminpw,adminname,adminrrn,adminaddr,admintel)'
                      +'VALUES(?,?,?,?,?,?,?,?)';
                                // => : function 쓰는방법  function(err, result) = (err, result) =>
            conn.query(sql,statement,function(err,result){
              if(err){
                res.send(err);
              }else{
                res.redirect('/home');
              };
            });

          // member Add
          }else if(id=='member'){
            var statement = [
              localNumber[0].localnumber,  req.body.libraryNumber,  req.body.membersName,  req.body.membersTel,
              req.body.membersAddr,  req.body.membersRrn,  req.body.membersVip
            ]
            var sql ='INSERT INTO members'
                    +'(localnumber,librarynumber,membersname,memberstel,membersaddr,membersrrn,membersvip)'
                    +' VALUES'
                    +'(?,?,?,?,?,?,?)';
            conn.query(sql, statement, function(err, result){
              res.redirect('/home');
            });
          };
        });
      });


      return router;
}
