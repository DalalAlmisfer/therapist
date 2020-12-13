//import needed libraries
const express = require('express');
const app = express();
const router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');

//let express use cookie parser
app.use(cookieParser());

//import models (database table)
const player = require('../../models/player');
const therapist = require('../../models/User');

//GET patient rest patient page
router.get('/patient/:id', (req, res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 4);
    res.render('rest', {layout:'layout', title: 'rest password', user:json, id: sub, user:'patient'});

});

//Submit new password after resting patient password
router.post('/patient', function(req, res) {
    var json = JSON.parse(req.user);
    var id = req.query;
    console.log('this is id', id);
    //var sub = id.substring(1, 3);

    var regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    var errors = [];
    var password = req.body.password;
    var conf_passwprd = req.body.conf_password

    if( !password.match(regexpassword)) {
        errors.push("please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.");
      
      }
    
      if( !conf_passwprd.match(regexpassword)) {
        errors.push("doesn't match your password or invalid password");
      }

      if ( errors.length > 0 ) {
        res.render('rest', {layout:'layout', title: 'rest password', user:json , id: sub, user:'therapist', errors:errors});
      } else {
        player.update({password: req.body.password},
            {
                where: {
                     player_id: id.id
                }
            }
            ).then((data) => {
                res.render('rest', {layout:'layout', title: 'rest password', user:json , id: id.id, user:'therapist', msg: 'Password has been successfully updated'});
            }).catch((err) => {
                console.log(err);
            })

      }


});

//GET therapist rest patient page
router.get('/therapist/:id', (req, res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 4);
    res.render('rest', {layout:'layout', title: 'rest password', user:json , id: sub, user:'therapist'});

});

//Submit new password after resting therapist password
router.post('/therapist/:id', (req, res) => {
    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 4);

    var regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    var errors = [];
    var password = req.body.password;
    var conf_passwprd = req.body.conf_password

    if( !password.match(regexpassword)) {
        errors.push("please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.");
      
      }
    
      if( !conf_passwprd.match(regexpassword)) {
        errors.push("doesn't match your password or invalid password");
      }

      if ( errors.length > 0 ) {
        res.render('rest', {layout:'layout', title: 'rest password', user:json , id: sub, user:'therapist', errors:errors});
      } else {
        therapist.update({password: req.body.password},
            {
                where: {
                    therapist_id: sub
                }
            }
            ).then((data) => {
                res.render('rest', {layout:'layout', title: 'rest password', user:json , id: sub, user:'therapist', msg: 'Password has been successfully updated'});
            })

      }
});

module.exports = router;