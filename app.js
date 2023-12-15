//app.js
var createError = require('http-errors');
var express = require('express'); 
var path = require('path'); 
var cookieParser = require('cookie-parser');  
var logger = require('morgan');   
const session = require('express-session');
const flash = require('connect-flash');  
const passport = require('passport');  
var {  userRouter }  = require('./routes/index');
var { adminRouter }  = require('./routes/admin');
const userModel  = require('./routes/models/users');
var cors=require('cors');

var app = express(); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');   
app.use(cors());  
app.use(session({ secret: 'lalalalala', resave: false, saveUninitialized: false , cookie: { maxAge: 60 * 60 * 1000 } }));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());  
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(express.json());  
app.use(express.urlencoded({ extended: true } ));




app.use(logger('dev'));   
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/admin', adminRouter); 
app.use('/', userRouter);

 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
