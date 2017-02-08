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

      //books=booksAddForm___get
      router.get('/booksInsertForm', function(req, res){
        var sql = 'SELECT * FROM library';
        conn.query(sql, function(err, result){
          var sql = 'SELECT * FROM bookskind';
          conn.query(sql, function(err, kindresult){
            res.render('booksInsertForm',{result:result, kresult:kindresult});
          });
        });
      });

      //books=booksList___get
      router.get('/booksList', function(req, res){
        var sql ='SELECT * FROM books'
        conn.query(sql,function(err,listResult){
          if(err){
            console.log(err)
          }else{
            res.render('booksList',{lresult:listResult})
          }
        })
      })

      //books=booksList___post
      router.post('/booksInsert',function(req,res){
        var libraryNumber = req.body.libraryNumber;
        var sql = 'SELECT localnumber FROM library WHERE librarynumber=?';
        var localNumber = '';
        conn.query(sql, [libraryNumber],function(err, localNumber){
          if(err){
            res.send(err);
          }else{
            var statement = [
              req.body.booksKindsNumber ,localNumber[0].localnumber, req.body.libraryNumber, req.body.booksName,
              req.body.booksMade, req.body.booksAuthor, req.body.booksLendingPossible, req.body.booksDamage
            ]
            var sql ='INSERT INTO books'
                    + '(bookskindsnumber,localnumber,librarynumber,booksname,booksmade,booksauthor,bookslendingpossible,booksdamage)'
                    + ' VALUES'
                    + '(?,?,?,?,?,?,?,?)';
            conn.query(sql, statement, function(err, result){
              res.redirect('/home');
              })
          };
        });
      });



      return router;
}
