const createError = require('http-errors');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const flash = require('connect-flash');
const sequelize = require('./models').sequelize;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
sequelize.sync();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(cookieParser('secret code'));
app.use(session({
  resave : false,
  saveUninitialized : false,
  cookie : {
    httpOnly : true,
  },
}), flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) =>{
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
