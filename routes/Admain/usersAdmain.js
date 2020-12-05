//express
const express = require("express");
const session = require("express-session");
const app = express();
const router = express.Router();

//passport.js
const passport = require("passport");
const bycrypt = require("bcrypt");
const sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');

// validate
const { check, validationResult } = require('express-validator');


//model
const User = require("../../models/admain");

//parser
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//login form
router.get("/loginAdmain", (req, res) => {
  console.log(req.isAuthenticated);
  res.render("home", {chosen: "admin_login" , usertype: 'admin', layout: 'layoutA'});
});

router.get('/registerAdmain', (req, res) => {
  res.render('home', {chosen: 'admin_reg', usertype: 'admin', layout: 'layoutA'});
})
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
        console.log('you are not registered');
        res.redirect('/usersAdmain/registerAdmain');
      }

    });

  } catch(err) {

    console.log(err);

  }
  // Admin.findAll().then((data) => {

  // }).catch(err) 

  // if ( req.body.email === 'aneesksuteam@gmail.com' && req.body.password === '12341234') {
  //   res.redirect('/usersAdmain/homeAdmain');
  // } else {
  //   res.render('/loginAdmain');
  // }

});


router.post('/registerAdmain',
    [
        check('email', 'Email is required')
            .isEmail(),
        check('password', 'Password is requried')
            .isLength({ min: 8 })
            .custom((val, { req, loc, path }) => {
                if (val !== req.body.Confirm_Password) {
                    throw new Error("Passwords don't match");
                } else {
                    return value;
                }
            }),
    ], (req, res) => {
        var errors = validationResult(req).array();
        if (errors) {
            req.session.errors = errors;
            req.session.success = false;
            console.log(errors);
            res.render('home', {chosen: 'admin_reg', usertype: 'admin', layout: 'layoutA', errors});
        } else {

          Admin.create({
            email: req.body.email, 
            password: req.body.passowrd,
            conf_password: req.body.Confirm_Password
          }).catch(err => console.log('err in creating admin', err));

            req.session.success = true;
            res.redirect('/usersAdmain/homeAdmain');
        }
    });

router.get('/homeAdmain', (req, res) => {
  res.render('homeAdmain', {layout: 'admainLayout'});

})

    // register form
// router.get("/registerAdmain", (req, res) => {
//   res.render("registerAdmain");
// });


//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/loginAdmain");
});

module.exports = router;



// router.post("/register", urlencodedParser, (req, res) => {
  
//   const { email, password, Confirm_Password } = req.body;

//   //validation
//   let errors = [];
//   let error1 = "";
//   let error2 = "";
//   let error3 = "";
//   if (!email || !password || !Confirm_Password) {
//     error1 = "please enter all feilds";
//   }


//   if (password != Confirm_Password) {
//     error2 = "password doesn't match";
//   }

//   if (password.length < 8) {
//     error3 = "password must be 8 character long";
//   }

//   if (error1.length > 1 && error2.length > 1 && error3.length > 1) {
//     res.render("register", error1, error2, error3);
//   } else {
//     console.log("yyyyyyeeeess");
//     User.findOne({
//       where: {
//         email: email,
//       },
//     })
//       .then((user) => {
//         if (user) {
//           //is the already user exist?
//           errors.push({
//             msg: "email is already used",
//           });
//           res.render("register", { errors });
//         } else {
//           //create new account

//           const newUser = new User({
//             email,
//             password,
//           });

//           //Encrypt password
//           bycrypt.genSalt(10, (err, salt) => {
//             bycrypt.hash(password, salt, (err, hash) => {
//               if (err) throw err;
//               newUser.password = hash;
//             });

//             newUser
//               .save()
//               .then((user) => {
//                 console.log("new account created");
//                 req.flash(
//                   "successMasg",
//                   "your account has been created, please log in"
//                 );
//                 res.redirect("/users/login");
//               })
//               .catch((err) => {
//                 console.log(err);
//                 req.flash("errorMasg", "there an error");
//                 res.redirect("/users/register");
//               });
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// });