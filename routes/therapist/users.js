//express
const express = require("express");
const router = express.Router();
const User = require("/Users/almisfer/Downloads/project/therapist/models/User");
const app = express();
var bodyParser = require("body-parser");
const bycrypt = require("bcrypt");
const passport = require("passport");
const { check, validationResult, body } = require("express-validator");
const session = require("express-session");
const admain = require("/Users/almisfer/Downloads/project/therapist/models/admain");
const players = require("/Users/almisfer/Downloads/project/therapist/models/player");
var cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");
var Users = [];
//parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
  auth: {
    user: "aneesksuteam@gmail.com",
    pass: "0504258108",
  },
});

// router.get("/loginn", (req, res) => {
//   console.log("this is req.user" + req.user);
//   console.log(req.isAuthenticated());
//   res.render("loginn", { layout: "layoutA", user: req.user });
// });

router.get('/registerTherapist' , (req, res) => { 
  res.render('register');
})

//login form
router.get("/login", (req, res) => {
  res.render("login", { layout: "layoutA"});
});


router.get('/index', (req,res) => {
  var json = JSON.parse(req.user);
  console.log('this is therapistid', json['therapist_id']);

  players.findAll({ raw : true,
      where: {
          therapist_FK: json['therapist_id'],
     }
   })
  .then( (player) => {
      console.log(players);
          //Get total registered patients 
      players.count({
          where: {
              therapist_FK: json['therapist_id'],
          }
      }).then( (number) => {
      console.log('number_of_patients', number);
      res.render("index", {layout: "layout" , count:number, data:player , user: json, title: "Home"});
      }).catch((error) => console.log(error));

  }).catch( err => console.log(err));
});


router.post("/login",    passport.authenticate("local", {
  successRedirect: "/users/index",
  failureRedirect: "/users/login",
  failureFlash: true
})
  // if( !req.body.email || !req.body.password){
  //   res.render('login');
  // } else {
  //   Users.filter(function(user){
  //     if(user.email === req.body.email && user.password === req.body.password) {
  //       req.session.user = user;
  //       res.redirect("/users/index");
  //     }
  //   });
  //   res.redirect("/users/index");
  // }
  // }
);

// register form
router.get("/register", (req, res) => {
  res.render("register", { layout: "layoutA" });
});


router.post("/register", async (req, res, next) => {
  var newUser = {
    email: req.body.email,
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    birth_date: req.body.birth_date,
    password: req.body.password,
    Confirm_Password: req.body.Confirm_Password,
    phone_number: req.body.phone_number,
    gander: req.body.gander,
    major: req.body.major,
    job_title: req.body.job_title,
  };

  try {

    await User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (user) {
          //is the already user exist?
          console.log('email is already used');
          res.render("register", { layout: "layoutA" });
          next()
        } else {
          Users.push( newUser );
          User.create({
            email: req.body.email,
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            birth_date: req.body.birth_date,
            password: req.body.password,
            Confirm_Password: req.body.Confirm_Password,
            phone_number: req.body.phone_number,
            gander: req.body.gander,
            major: req.body.major,
            job_title: req.body.job_title,
            accepted: 0,
            admains_FK: 1,
          })
          .then((user) => {
              console.log("new account created");
              req.session.user = newUser;

              // req.flash(
              //   "successMasg",
              //   "your account has been created, please log in"
              // );

              // mail(email).then((res) => {
              // })
              // .catch((err) => {
              //     console.log('err from mail func', err);
              // });

              res.redirect("/users/login");

            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });


  } catch(err) {
    console.log(err, 'in adding user');
    res.status(500);
  }


      // async function mail(email, name) {
      //   // create a message for register request confirmation
      //   // send mail with defined transport object
      //   let info = await transporter.sendMail({
      //     from: 'aneesksuteam@gmail.com', // sender address
      //     to: email, // list of receivers
      //     subject: "Anees Team - Registration Request Is Received", // Subject line
      //     text: ` Hello, Dr. ${name}. We received Your Request Is Received, Please Wait For The Admain to Accept Your Request. You Will Recive An Email If Your Request Is Accepted.`, // plain text body
      //     html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      //     <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
      //     <head>
      //     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      //     <title> Confirmation Email  </title>
      //     <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          
      //     <style type="text/css">
      //     a[x-apple-data-detectors] {color: inherit !important;}
      //     </style>
          
      //     </head>
      //     <body style="margin: 0; padding: 0;">
      //     <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      //     <tr>
      //     <td style="padding: 20px 0 30px 0;">
          
      //     <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
      //     <tr>
      //     <td align="center" bgcolor="#0000" style="padding: 40px 0 30px 0;">
      //         <img src="/images/Anees logo.png" alt="logo" class="logo"/>
      //     </td>
      //     </tr>
      //     <tr>
      //     <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
      //     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
      //     <tr>
      //     <td style="color: #153643; font-family: Arial, sans-serif;">
      //     <h1 style="font-size: 24px; margin: 0;">
      //         Hello, Dr. ${name}.  </h1>
      //     </td>
      //     </tr>
      //     <tr>
      //     <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
      //     <p style="margin: 0;">
      //         We received Your Request Is Received, Please Wait For The Admain to Accept Your Request. You Will Recive An Email If Your Request Is Accepted.
      //     </p>
      //     </td>
      //     </tr>
          
      //     </td>
      //     </tr>
      //     </table>
      //     <tr>
      //         <td align="center" bgcolor="#0000" style="padding: 40px 0 30px 0; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
      //             <p style="margin: 0;">&reg; Anees 2020 <br/>
      //             <a href="#" style="color: #ffffff;">Unsubscribe</a> King Saud University. </p>
          
      //         </td>
      //     </tr>
      //     </td>
      //     </tr>
      //     </table>
          
          
      //     </body>
      //     </html>`, // html body
      //   });

      //   // transporter.sendMail(info, function(err, info){
      //   //     if(err) {
      //   //         console.log(err)
      //   //     } else {
      //   //         console.log('email sent');
      //   //     }
      //   // });

      //   //console.log("Message sent: %s", info.messageId);
      //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      //   // Preview only available when sending through an Ethereal account
      //   //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      //   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      // }
    
  });

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
