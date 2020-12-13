//import all needed 
const path = require('path');
const express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
var engine = require('ejs-locals');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const Sequelize = require('sequelize');
const SessionStore = require('express-session-sequelize')(session.Store);
var http = require('http');
var io = require('socket.io');
http = require('http'),
server = http.createServer(function (req, res) {
   res.writeHead(200,{'content-type':'text/plain'});
    res.write("Sever On");
    res.end();
});

const app = express();

app.enable('trust proxy'); 
app.use(express.json());
app.use(cookieParser("secret"));


//create session table 
const myDatabase = require('./config/database');
const sessionIntoDB = new SessionStore({
    db: myDatabase,
});


//get sessions and store it in database
app.use(session({
      //secret should be a random string becouse it will be assosited with the session
    secret:'secret',
    cookie:{httpOnly:true/*, secure: true*/},
    resave: false,
    proxy: true,
    saveUninitialized: false,
    store: sessionIntoDB,

}));


//config passport 
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());


//body parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//view engine
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('layout', 'layoutA', 'layout', 'admainLayout');
app.use(expressLayouts);


//therapist dashboard routing
app.use('/', require("./routes/therapist/index"));
app.use('/users', require("./routes/therapist/users"));
app.use('/home', require('./routes/therapist/home'));
app.use('/home', require('./routes/therapist/list'));
app.use('/list', require('./routes/therapist/list'));
app.use('/rest', require('./routes/therapist/rest'));
app.use('/AdminRequest', require('./routes/therapist/AdminRequests'));
app.use('/confirm', require('./routes/therapist/confirm'));
//admin dashboard routing
app.use('/usersAdmain', require("./routes/Admain/usersAdmain"));
app.use('/passwords', require("./routes/Admain/passwords"));
app.use('/registerRequest', require("./routes/Admain/registerRequest"));
app.use('/AddRequest', require("./routes/Admain/AddRequest"));


//Let express listen to the server port or to the localhost
app.listen( process.env.PORT || 8443, function() {
    console.log('listening on port 8444 ..');
});

