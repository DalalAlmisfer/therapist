//import needed libraries
const express = require("express");
const session = require("express-session");
const app = express();
const router = express.Router();
const passport = require("passport");
const sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');

// validate
const { check, validationResult } = require('express-validator');


//model
const User = require("../../models/admain");

//parser
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//GET login admin page
router.get("/loginAdmain", (req, res) => {
  console.log(req.isAuthenticated);
  res.render("home", {chosen: "admin_login" , usertype: 'admin', layout: 'layoutA'});
});

//GET register admin page
// router.get('/registerAdmain', (req, res) => {
//   res.render('home', {chosen: 'admin_reg', usertype: 'admin', layout: 'layoutA'});
// })

//login admin
router.post('/loginAdmain',  (req, res) => {


  try{
     User.findOne({
      where: {
        email: req.body.email,        
      },
    }).then((user) => {
      if(user) {
        console.log('email is already used + ', req.body.password  );
        if( user.password == req.body.password ) {
          res.redirect('/usersAdmain/homeAdmain');
        } else {
          console.log('password is wrong');
          res.render("home", {chosen: "admin_login" , usertype: 'admin', layout: 'layoutA'});
        }

      } else {
        console.log('you are not authirazed to be admin');
        res.redirect('/usersAdmain/registerAdmain');
      }

    });

  } catch(err) {

    console.log(err);

  }

});

//register admin
// router.post('/registerAdmain',
//     [
//         check('email', 'Email is required')
//             .isEmail(),
//         check('password', 'Password is requried')
//             .isLength({ min: 8 })
//             .custom((val, { req, loc, path }) => {
//                 if (val !== req.body.Confirm_Password) {
//                     throw new Error("Passwords don't match");
//                 } else {
//                     return value;
//                 }
//             }),
//     ], (req, res) => {
//         var errors = validationResult(req).array();
//         if (errors) {
//             req.session.errors = errors;
//             req.session.success = false;
//             console.log(errors);
//             res.render('home', {chosen: 'admin_reg', usertype: 'admin', layout: 'layoutA', errors});
//         } else {

//           Admin.create({
//             email: req.body.email, 
//             password: req.body.passowrd,
//             conf_password: req.body.Confirm_Password
//           }).catch(err => console.log('err in creating admin', err));

//             req.session.success = true;
//             res.redirect('/usersAdmain/homeAdmain');
//         }
//     });

//GET admin dashboard
router.get('/homeAdmain', (req, res) => {
  res.render('homeAdmain', {layout: 'admainLayout'});

})

//logout admin
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/usersAdmain/loginAdmain");
});

module.exports = router;

