
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
const router = express.Router();
const player = require('../../models/player');
const therapist = require('../../models/User');


router.get('/patient/:id', (req, res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);
    res.render('rest', {layout:'layout', title: 'rest password', user:json, id: sub, user:'patient'});

});

router.post('/patient/:id', (req, res) => {
    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);

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
                     player_id: sub
                }
            }
            ).then((data) => {
                res.render('rest', {layout:'layout', title: 'rest password', user:json , id: sub, user:'therapist', msg: 'Password has been successfully updated'});
            }).catch((err) => {
                console.log(err);
            })

      }


});

//rest therapist password
router.get('/therapist/:id', (req, res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);
    res.render('rest', {layout:'layout', title: 'rest password', user:json , id: sub, user:'therapist'});

});

router.post('/therapist/:id', (req, res) => {
    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);

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