var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
const dotenv = require('dotenv');
const config_result = dotenv.config();
if(config_result.error) { throw config_result.error }

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use('/apidoc', express.static('apidoc'));
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// application routes
app.use('/', indexRouter);
app.use(['/user', '/users'], usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if(err instanceof createError.HttpError) {
    res.locals.message = err.message;
    res.locals.status = err.statusCode;
    if(process.env.NODE_ENV === 'development') {
      res.locals.error = err;
    }
  }
  console.log(err);
  if(process.env.NODE_ENV === 'production' && !res.locals.message) {
    res.locals.message = 'ApplicationError';
    res.locals.status = 500;
  }
  if(res.locals.status) {
    res.status(res.locals.status || 500);
    const errObject = {error: res.locals.error, message: res.locals.message}
    return res.json(errObject);
  }
  next(err);
});

module.exports = app;