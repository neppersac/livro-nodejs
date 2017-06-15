const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const consign = require('consign');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const error = require('./middlewares/error');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(expressSession({ resave: true, saveUninitialized: true, secret: 'ntalk' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

consign({})
  .include('models')
  .then('controllers')
  .then('routes')
  .then('events')
  .into(app, io)
;

app.use(error.notFound);
app.use(error.serverError);

server.listen(3000, () => {
  console.log('Ntalk no ar.');
});