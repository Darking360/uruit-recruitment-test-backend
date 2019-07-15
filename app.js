var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gamesRouter = require('./routes/games');

// MongoDB configuration
const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development')
  mongoose.connect(`mongodb://${process.env.MONGO_DB_URI || 'mongo'}:27017`);
if (process.env.NODE_END === 'test')
  mongoose.connect(`mongodb://${process.env.MONGO_DB_URI || 'mongo'}:27017/test`);
if (process.env.NODE_ENV === 'production')
  mongoose.connect(`mongodb://${process.env.MONGO_DB_URI}:27017`);

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games', gamesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Log error
  console.error('Internal error :: ', err);

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

const { PORT = '3000' } = process.env;

app.listen(PORT, () => {
  console.log(`Magic happening on port :: ${PORT}`)
});

module.exports = app;