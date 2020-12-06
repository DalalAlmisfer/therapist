//express
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const app = express();
var bodyParser = require("body-parser");
const bycrypt = require("bcrypt");
const passport = require("passport");
const { check, validationResult, body } = require("express-validator");
const session = require("express-session");
const admain = require("../../models/admain");
const players = require("../../models/player");
var cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");
const enviroment = require("../../models/enviroment");
var user_id = 0;

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

router.get('/registerTherapist' , (req, res) => { 
  res.render('home', { chosen: 'therapist_reg', usertype: 'therapist', layout: 'layoutA' });
})

router.get("/login", (req, res) => {
  res.render("home", { chosen: 'therapist_login', usertype: 'therapist', layout: 'layoutA'});
});


router.get('/index',  async (req,res) => {

  try {
    var json = JSON.parse(req.user);
  } catch (err) {
    console.log('err is parsing json', err)
  }
  var parameters = [];

            //Get total registered patients 
          await players.count({
              where: {
                  therapist_FK:  json['therapist_id'],
              }
          }).then( (number) => {
          console.log('number_of_patients',number );
          parameters.push(number);
          }).catch((error) => console.log(error));
    
          await enviroment.count({
            where: {
              progress: 3
            }
          }).then((levels) => {
            console.log('number_of_patients_finished_game', levels);
            parameters.push(levels);
          }).catch(err => console.log(err));
    
           players.count({
            where: {
              islogged_in: 1
            }
          }).then((loggedin) => {
            console.log('number_of_patients_loggedin', loggedin);
            parameters.push(loggedin);    
          }).catch((err => console.log(err)));

    await players.findAll({ raw : true,
      where: {
          therapist_FK:  json['therapist_id'],
     }
   })
  .then( (player) => {

      console.log('------this parameters------', parameters);
      res.render('index', {layout: 'layout', title: 'Home', user: json, count: parameters, data:player});


  }).catch( err => console.log(err));
});


router.post("/login", 
  passport.authenticate("local", {
  successRedirect: "/users/index",
  failureRedirect: "/users/login",
  //failureFlash: true
}));


router.get("/register", (req, res) => {
  res.render('home', { chosen: 'therapist_reg', usertype: 'therapist', layout: 'layoutA' });
});


router.post("/register", async (req, res, next) => {
    const email = req.body.email;
    const first_name = req.body.first_name;
    const family_name = req.body.family_name;
    const birth_date = req.body.birth_date;
    const password = req.body.password;
    const Confirm_Password = req.body.Confirm_Password;
    const phone_number = req.body.phone_number;
    const gander = req.body.gander;
    const job_title = req.body.job_title;
  

  var err_email, err_first, err_last, err_phone_number, err_password, err_conf_password;
  var errors = [];
  var regexname = /^([a-zA-Z]{2,16})$/;
  var regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regexnum = /^[0-9][A-Za-z0-9 -]*$/;
  var regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if( !first_name.match(regexname)) {
    err_first = "please enter a valid name";
    errors.push("please enter a valid name");
  }

  if( !family_name.match(regexname)) {
    err_last = "please enter a valid family name";
    errors.push("please enter a valid family name");
  }

  if( !email.match(regexemail)) {
    err_email = "please enter a valid email";
    errors.push("please enter a valid email");

  } 

  if( !phone_number.match(regexnum)) {
    err_phone_number = "please enter a valid phone number";
    errors.push("please enter a valid phone number");
  }

  if( !password.match(regexpassword)) {
    err_password= "please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.";
    errors.push("please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.");
  
  }

  if( !Confirm_Password.match(regexpassword) || password != Confirm_Password) {
    err_conf_password= "doesn't match your password";
    errors.push("doesn't match your password");
  }


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
          res.render('home', { chosen: 'therapist_reg', usertype: 'therapist', layout: 'layoutA'});
          next()
        } else if ( errors.length != 0 ) {
          //( err_email.length != 0 || err_first.length != 0 || err_last.length != 0 || err_phone_number.length != 0 || err_password.length != 0 || err_conf_password.length != 0 )
          //res.render("register", { layout: "layoutA", err_email:err_email, err_first:err_first, err_last:err_last, err_phone_number:err_phone_number, err_password:err_password, err_conf_password:err_conf_password });
          res.render('home', { chosen: 'therapist_reg', usertype: 'therapist', layout: 'layoutA', errors:errors});
        } else {
          user_id++;

          User.create({
            therapist_id: user_id,
            email: req.body.email,
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            birth_date: req.body.birth_date,
            password: req.body.password,
            Confirm_Password: req.body.Confirm_Password,
            phone_number: req.body.phone_number,
            gander: req.body.gander,
            job_title: req.body.job_title,
            accepted: 0,
            admains_FK: 1,
          })
          .then((user) => {
              console.log("new account created");
              mail(email, first_name).then((res) => {
              })
              .catch((err) => {
                  console.log('err from mail func', err);
              });

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


      async function mail(email, name) {
        // create a message for register request confirmation
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'aneesksuteam@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Anees Team - Registration Request Is Received", // Subject line
          text: ` Hello, Dr. ${name}. We received Your Request Is Received, Please Wait For The Admain to Accept Your Request. You Will Recive An Email If Your Request Is Accepted.`, // plain text body
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
          <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title> Confirmation Email  </title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          
          <style type="text/css">
          a[x-apple-data-detectors] {color: inherit !important;}
          </style>
          
          </head>
          <body style="margin: 0; padding: 0;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
          <td style="padding: 20px 0 30px 0;">
          
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
          <tr>
          <td align="center" bgcolor="#0000" style="padding: 40px 0 30px 0;">
              <img src="/images/Anees logo.png" alt="logo" class="logo"/>
          </td>
          </tr>
          <tr>
          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
          <tr>
          <td style="color: #153643; font-family: Arial, sans-serif;">
          <h1 style="font-size: 24px; margin: 0;">
              Hello, Dr. ${name}.  </h1>
          </td>
          </tr>
          <tr>
          <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
          <p style="margin: 0;">
              We received Your Request Is Received, Please Wait For The Admain to Accept Your Request. You Will Recive An Email If Your Request Is Accepted.
          </p>
          </td>
          </tr>
          
          </td>
          </tr>
          </table>
          <tr>
              <td align="center" bgcolor="#0000" style="padding: 40px 0 30px 0; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                  <p style="margin: 0;">&reg; Anees 2020 <br/>
                  <a href="#" style="color: #ffffff;">Unsubscribe</a> King Saud University. </p>
          
              </td>
          </tr>
          </td>
          </tr>
          </table>
          
          
          </body>
          </html>`, // html body
        });
      }
    
  });

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
