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

      //book_detail/updateForm____get = 목록 상세보기&수정
      router.get('/booksUpdateForm/:url', function(req,res){
        var url = req.params.url
        var sql = 'SELECT books.*, bookskind.*, library.*'+
                  ' FROM books'+
                  ' LEFT JOIN bookskind'+
                  ' ON books.bookskindsnumber = bookskind.bookskindnumber'+
                  ' LEFT JOIN library'+
                  ' ON books.librarynumber = library.librarynumber'+
                  ' WHERE booksnumber = ?';
        conn.query(sql, [url], function(err,updateResult){
          if(err){
            //console.log("---booksUpdate---1 : "+err)
          }else{
            var sql = 'SELECT * FROM bookskind';
            conn.query(sql, function(err, updateKindResult){
              if(err){
                //console.log("---booksupdate---2 : "+err)
              }else{
                var sql = 'SELECT * FROM library';
                conn.query(sql, function(err, libraryResult){
                  if(err){
                    //console.log("---booksupdate---3 : "+err)
                  }else{
                      //★ select
                      res.render('booksUpdateForm', {upResult:updateResult, UKindResult:updateKindResult, ULibResult:libraryResult})
                  }
                })
              }
            })
          }
        })
      })

      //book_update = 수정____post :
      router.post('/booksUpdate', function(req, res){
        var libraryNumber = req.body.libraryNumber;
        var sql = 'SELECT localnumber FROM library WHERE librarynumber=?';
        var localNumber = '';
          conn.query(sql, [libraryNumber],function(err, localNumber){
            if(err){
              console.log("book_update_error :" + err)
            }else{
              console.log("test>localnumber: "+localNumber[0].localnumber)
              var statement = [
                req.body.booksKindsNumber, localNumber[0].localnumber, req.body.libraryNumber, req.body.booksName ,
                  req.body.booksMade, req.body.booksAuthor, req.body.booksLendingPossible, req.body.booksDamage, req.body.booksDamageDate, req.body.booksNumber
              ]
              var sql = 'UPDATE books SET '+
                        ' bookskindsnumber=?, localnumber=?, librarynumber=?,'+
                        ' booksname=?, booksmade=?, booksauthor=?, bookslendingpossible=?,'+
                        ' booksdamage=?, booksdamagedate=?'+
                        ' WHERE booksnumber=?';
              conn.query(sql, statement, function(err, result){
                if(err){
                    res.send('도서 수정 처리 error'+err)
                }else{
                    res.redirect('/books/booksList')
                }
              })
            }
          })
      })

      return router;
}
