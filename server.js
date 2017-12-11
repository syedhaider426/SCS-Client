require('rootpath')();
var express = require('express'),
    app = express(),
    messenger = express(),
    Usersession = require('express-session'),
    bodyParser = require('body-parser'),
    expressJwt = require('express-jwt'),
    socketJwt = require('socketio-jwt'),
    config = require('config.json'),
    http = require('http'),
    mongoose = require('mongoose'),
    ctrlr = require('./index.controller.js')
    io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

var chat = io.on('connection', function (socket) {
        ctrlr.respond(chat, socket);
});

/*io.on('connection', function (socket) {
    console.log('User Connected.');
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});*/

// start server
server.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + server.address().port);
});
/*
mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://127.0.0.1:27017', { useMongoClient: true });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var routes = require('./api/routes/routes');
  routes(app);*/
