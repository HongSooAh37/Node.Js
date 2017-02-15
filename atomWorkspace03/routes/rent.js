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

      // rent=rental_ADD___get : 대출 등록
      router.get('/booksRentalAdd', function(req,res){
        res.render('booksRentalAdd');
      });

      //rent=rental_List___get : 대출중인 List
      router.get('/booksRentalList', function(req, res){
        var sql ="SELECT bookrent.*, books.booksname, books.booksauthor, books.booksmade"+
                 " FROM bookrent"+
                 " LEFT JOIN books"+
                 " ON bookrent.booksnumber = books.booksnumber"+
                 " WHERE bookrent.bookslendingpossible='n'";
        conn.query(sql,function(err,rentalList){
          if(err){
            //console.log("rental_list error: "+err)
          }else{
            //console.log("test rentalList:"+rentalList)
            res.render('booksRentalList', {tresult:rentalList});
          }
        });
      });

      //rent=Disposable_List___get : 대출가능 List
      router.get('/booksDisposable', function(req ,res){
        var sql = "SELECT * FROM books WHERE bookslendingpossible='y'";
        conn.query(sql, function(err, disposalResult){
          if(err){
            console.log(err);
          }else{
            res.render('booksDisposable', {dresult:disposalResult});
          }
        });
      });

      //rent=booksReturn___get :도서_대출_반납처리[상세보기]
      router.get('/booksRentalCheck/:url', function(req, res){
        var url = req.params.url;
        console.log("test:"+url);
        var sql = "SELECT * FROM bookrent WHERE booksrentnumber=?";
        conn.query(sql, [url] ,function(err,rentListResult){
          if(err){
            console.log(err);
            res.send("반납 error" + err);
          }else{
            console.log("test:"+rentListResult);
            res.render('booksRentalCheck',{rentalcheckResult:rentListResult});
          }
        });
      });
//------------------------------------------ post -------------------------------------------//

      //book=rental_INSERT___post : 대여 등록
      router.post('/booksRentalAdd', function(req, res){
        var statement =[
          req.body.membersNumber, req.body.booksNumber, req.body.booksRentStartDate,
          req.body.booksRentEndDate, req.body.booksRentPay,"n","n"
        ];
        var sql ='INSERT INTO bookrent'+
                 '(membersnumber,booksnumber,booksrentstartdate,booksrentenddate,booksrentpay,booksdamage,bookslendingpossible)'+
                 ' VALUES'+
                 '(?,?,?,?,?,?,?)';
        conn.query(sql,statement,function(err,result){
          if(err){
            console.log("---books_rental_insert :"+err);
            res.send('대여 error!');
          }else{
            sql = 'UPDATE books SET'+
                  ' bookslendingpossible=?'+
                  ' WHERE booksnumber=?'
            conn.query(sql, ['n', req.body.booksNumber], function(err, result){
              if(err){
                  console.log("---books update error : "+err)
                  res.send('대여 error3')
              }else{
                sql = 'SELECT firstrent FROM books WHERE booksnumber=?';
                conn.query(sql,[req.body.booksNumber] ,function(err,result){
                  if(result[0].firstrent === null){
                      sql ='UPDATE books SET'+
                           ' firstrent=?'+
                           ' WHERE booksnumber=?';
                            conn.query(sql, [req.body.booksRentStartDate, req.body.booksNumber], function(err, result){
                              res.redirect('/rent/booksRentalList');
                           });
                          }else{
                              res.redirect('/rent/booksRentalList');
                          }
                        });
                    }
                  })
            }
        });
      });

      //books=retal_return____post : 반납
      router.post('/booksRentalreturn', function(req, res){
        console.log(req.body.booksRentNumber);
        var statement = [
          req.body.booksRentEndDate ,req.body.booksRentPay,
          req.body.booksDamage, "y",  req.body.totalRentDay, req.body.booksRentNumber
        ];
        var sql = "UPDATE bookrent SET"
                  +" booksrentenddate=?, booksrentpay=?, booksdamage=?, bookslendingpossible=?, totalrentday=?"
                  +" WHERE booksrentnumber=?";
        conn.query(sql, statement, function(err, result){
          if(err){
            console.log("반납1 : "+err);
          }else{
            sql = "SELECT bookslendingcount,bookslendingday FROM books WHERE booksnumber=?";
            conn.query(sql,[req.body.booksNumber],function(err, result){
              if(err){
                  console.log("반납2 :"+err);

              }else if(req.body.booksDamage=='y'){ // 책이 파손 될 경우
                sql = "UPDATE books SET"+
                      " bookslendingcount=? ,bookslendingday=? ,booksdamage=? ,booksdamagedate=?, bookslendingpossible=?"+
                      " WHERE booksnumber=?";
                var totalCount = result[0].bookslendingcount + 1;
                var totalRentalDay = result[0].bookslendingday + parseInt(req.body.totalRentDay);
                statement = [
                              totalCount,totalRentalDay,'y',
                              req.body.booksRentEndDate,'n',req.body.booksNumber
                            ];
                conn.query(sql, statement, function(err, result2){
                  if(err){
                    console.log("반납3"+err);
                  }else{
                    res.redirect('/rent/booksRentalList');
                  }
              });
            }else if(req.body.booksDamage =='n'){ // 책이 정상 일 경우
              var sql = "UPDATE books SET"+
                        " bookslendingpossible=?, bookslendingcount=?, bookslendingday=?"+
                        " WHERE booksnumber=?";
              var totalCount = result[0].bookslendingcount + 1;
              var totalRentalDay = result[0].bookslendingday + parseInt(req.body.totalRentDay);
              statement =['y', totalCount, totalRentalDay, req.body.booksNumber];
              conn.query(sql, statement, function(err, result){
                if(err){
                  res.send("반납 처리 실패"+err)
                }else{
                  res.redirect('/rent/booksRentalList')
                }
              })
            }

          });
          }
        });
      });


      return router;
};
