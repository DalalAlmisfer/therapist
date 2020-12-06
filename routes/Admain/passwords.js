//express
const express = require('express');
const app = express();
const User = require('../../models/admain');
const therapist = require('../../models/User');
const router = express.Router();



router.get('/forgot/therapist', (req, res) => {
    res.render('restpassword' , {layout: "layoutA" , user:'therapist'});
});

router.get('/forgot/admin', (req, res) => {
    res.render('restpassword' , {layout: "layoutA" , user:'admin'});
});

router.post('/forgot/therapist', (req, res) => {

    var regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    var errors = [];
    var password = req.body.password;
    var conf_passwprd = req.body.conf_password;
    var email = req.body.email;


    if( !password.match(regexpassword)) {
        errors.push("please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.");
      
      }
    
      if( !conf_passwprd.match(regexpassword)) {
        errors.push("doesn't match your password or invalid password");
      }

      if ( errors.length > 0 ) {
        res.render('restpassword', {layout:'layoutA', title: ' ', user:'therapist', errors:errors});
      } else {
        therapist.update({password: req.body.password},
            {
                where: {
                    email: email
                }
            }
            ).then((data) => {
                res.render("home", { chosen: 'therapist_login', usertype: 'therapist', layout: 'layoutA', msg: 'Password has been successfully updated'});
            });

      }

});

router.post('/forgot/admin', (req, res) => {

    var regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    var errors = [];
    var password = req.body.password;
    var conf_passwprd = req.body.conf_password;
    var email = req.body.email;


    if( !password.match(regexpassword)) {
        errors.push("please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.");
      
      }
    
      if( !conf_passwprd.match(regexpassword)) {
        errors.push("doesn't match your password or invalid password");
      }

      if ( errors.length > 0 ) {
        res.render('restpassword', {layout:'layout', title: 'rest password', user:'admin', errors:errors});
      } else {
        therapist.update({password: req.body.password},
            {
                where: {
                    email: email
                }
            }
            ).then((data) => {
                res.render('home', {layout:'layoutA', usertype:'admin', chosen: 'admin_login', msg: 'Password has been successfully updated'});
            })

      }
});




module.exports = router;