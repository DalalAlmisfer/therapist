//express
const express = require("express");
const session = require("express-session");
const app = express();
const router = express.Router();

//passport.js
const passport = require("passport");
const bycrypt = require("bcrypt");

// validate
const { check, validationResult } = require('express-validator');


//model
const User = require("../models/admain");

//parser
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//login form
router.get("/login", (req, res) => {
  console.log(req.isAuthenticated);
  res.render("login", {layout: "authLayout" });
});


router.post('/login', function(req, res, next) {
  passport.authenticate('local', 
  { session : false , 
    //successRedirect: "/",
    //failureRedirect: "/users/login",
    failureFlash: true
  },
    function(error, user, info) {
    if (error) return next(error);
    if (! user) {
      var infoString = JSON.stringify(info).toString();
      var myJSON ='';
      
      if( infoString ){
         myJSON = "Enter both email and password";
      } else {
        myJSON = "Either password or email is wrong";
      }
     
      res.render('login', {myJSON: myJSON});
      console.log(info);
      //return res.status(400).json(info);
    } else {
      res.redirect('/');
    }
   
  })(req, res, next);
});

router.post('/register',
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
            res.render('register',  {layout: "authLayout", errors});
        } else {
            req.session.success = true;
            res.redirect('/users/login');
        }
    });

    // register form
router.get("/register", (req, res) => {
  res.render("register", {layout: "authLayout"});
});


//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
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