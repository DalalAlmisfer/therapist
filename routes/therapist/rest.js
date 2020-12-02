
const express = require('express');
const app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());


const router = express.Router();
const player = require('/Users/almisfer/Downloads/project/therapist/models/player');
const therapist = require('/Users/almisfer/Downloads/project/therapist/models/User');

router.get('/forget', (req, res) => {
    res.render( 'restpassword' , {layout: "layoutA" });

});

router.post('/forget', (req, res) => {
    console.log('here is post');
    var resault = 'yes';
    res.render( 'login' , {layout: "layoutA", success: resault});


});

//rest patient password
router.get('/patient', (req, res) => {

});

router.post('/patient', (req, res) => {

});

//rest therapist password
router.get('/therapist', (req, res) => {

});

router.post('/therapist', (req, res) => {

});

module.exports = router;