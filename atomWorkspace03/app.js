var express = require('express'),
    engine = require('ejs-locals'),
    bodyParser = require('body-parser'),
    mysql = require('mysql'),
    session = require('express-session'),
    locals = require('locals');

var app = express();

var conn = mysql.createConnection({
  host : '127.0.0.1',
  user : 'dev24id',
  password : 'dev24pw',
  database : 'library'
});

app.use(session({
  secret:'@#@$MYSIGN#@$#$',
  resave: false,
  saveUninitialixed : true
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname +'/views');

app.use(function(req, res, next){
  res.locals.user = req.session.level;
  next();
});

app.set('view engine', 'ejs');
app.engine('ejs', engine);

conn.connect();

//-------------------[router] login/Logout 설정---------------------------
var login = require('./routes/login')();
app.use('/login', login)

var logout = require('./routes/logout')();
app.use('/logout', logout)

//-------------------[router] Home_요청---------------------------
var home = require('./routes/home')();
app.use('/home', home)

//-------------------[router] human 설정---------------------------
var human = require('./routes/human')();
app.use('/human', human)

//-------------------[router] books 설정---------------------------
var books = require('./routes/books')();
app.use('/books', books)

//-------------------[router] rent 설정---------------------------
var rent = require('./routes/rent')();
app.use('/rent', rent)

//-------------------[router] update 설정---------------------------
var update = require('./routes/update')();
app.use('/update', update)

//------------------- server 설정---------------------------
var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
  });
