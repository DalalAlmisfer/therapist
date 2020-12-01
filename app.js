const path = require('path');
const fs = require('fs');
const http2 = require('http2');
const sql = require('mysql');
//const server = http2.createSecureServer()
const db = require('./config/database');
//import all needed 
const express = require('express');
const session = require('express-session');
const player = require('./models/player');
const flash = require('connect-flash');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
var engine = require('ejs-locals');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const User = require("./models/User");
const Sequelize = require('sequelize');
const SessionStore = require('express-session-sequelize')(session.Store);

const app = express();
const router = express.Router();

app.enable('trust proxy'); 

// var connectionpool = sql.createPool({
//     host: 'eu-cdbr-west-03.cleardb.net',
//     user: 'b630bdd6b6e1b9',
//     password: 'd159c434',
//     database: 'heroku_195f706910a16f0'
//   });
  

// var connection = sql.createConnection('mysql://b630bdd6b6e1b9:d159c434@eu-cdbr-west-03.cleardb.net/heroku_195f706910a16f0?reconnect=true');
// connection.connect();

//allow our application to use json
app.use(express.json());

//create session table 
const myDatabase = new Sequelize('heroku_195f706910a16f0', 'b630bdd6b6e1b9', 'd159c434', {
    host: 'eu-cdbr-west-03.cleardb.net',
    dialect: 'mysql',
    define: {
        timestamps: false,
        
    }
});

const sessionIntoDB = new SessionStore({
    db: myDatabase,
});

app.use(cookieParser("secret"));

//config flash and session 
  app.use(session({
      //secret should be a random string becouse it will be assosited with the session
    secret:'secret',
    cookie:{httpOnly:true/*, secure: true*/},
    resave: false,
    proxy: true,
    saveUninitialized: false,
    store: sessionIntoDB,

}));
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

//config passport 
app.use(flash());

//body parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//add middleware for flash msg
app.use( (req,res,next) => {
    res.locals.successMsg = req.flash('successMasg');
    res.locals.errorMasg = req.flash('errorMasg');
    res.locals.error = req.flash('error');

    if (req.user) {
        res.locals.user = req.user;
    }
    next();
});

//view engine
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('layout', 'layoutA', 'layout');
app.use(expressLayouts);


//routes 
app.use('/', require("./routes/index"));
app.use('/users', require("./routes/users"));
app.use('/home', require('./routes/home'));
app.use('/home', require('./routes/list'));
app.use('/list', require('./routes/list'));
app.use('/rest', require('./routes/rest'));
app.use('/usersAdmain', require("./routes/usersAdmain"));

// app.use(( req, res, nesxt ) => {
//     res.status(404);
//     res.render('not-found');
// });

// app.use(( req, res, nesxt ) => {
//     res.status(500);
//     res.render('not-found');
// });

app.listen( process.env.PORT || 8443, function() {
    console.log('listening on port 8444 ..');
});
