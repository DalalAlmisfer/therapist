//express
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const app = express();
var bodyParser = require("body-parser");
const bycrypt = require("bcrypt");
const passport = require("passport");
const { check, validationResult, body } = require("express-validator");
const session = require("express-session");
const admain = require("../models/admain");
const players = require("../models/player");
const nodemailer = require("nodemailer");

//parser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
  auth: {
    user: "aneesksuteam@gmail.com",
    pass: "0504258108",
  },
});

router.get("/loginn", (req, res) => {
  console.log("this is req.user" + req.user);
  console.log(req.isAuthenticated());
  res.render("loginn", { layout: "layoutA", user: req.user });
});

//login form
router.get("/login", (req, res) => {
  console.log("this is req.user" + req.user);
  console.log(req.isAuthenticated());
  res.render("login", { layout: "layoutA", user: req.user });
});

router.post("/login",
  passport.authenticate("local", {
    //successRedirect: '/',
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/");
  }
);

// register form
router.get("/register", (req, res) => {
  res.render("register", { layout: "layoutA" });
});

router.post(
  "/register",
  async (req, res) => {
    var errors = validationResult(req);
    //var err = JSON.parse(validationResult(req));
    console.log("this is err", errors);
    if (!errors.isEmpty()) {
      res.render("register", { layout: "layoutA", errors: errors });
    } else {
      const {
        email,
        first_name,
        family_name,
        birth_date,
        password,
        Confirm_Password,
        address,
        phone_number,
        gander,
        major,
        job_title,
      } = req.body;
      console.log("this is job_title", job_title);

      let errors = "";
      var int = parseInt(phone_number);

      console.log('this is', gander);
      await User.findOne({
        where: {
          email: email,
        },
      })
        .then((user) => {
          if (user) {
            //is the already user exist?
            console.log('email is already used');
            // errors.push({
            //   msg: "email is already used",
            // });
            res.render("register", { layout: "layoutA" });
          } else {
            User.create({
              email: email,
              first_name: first_name,
              family_name: family_name,
              address: address,
              phone_number: phone_number,
              major: major,
              job_title: job_title,
              gander: 'gander',
              birth_date: birth_date,
              password: password,
              Confirm_Password: Confirm_Password,
              admains_FK: 1,
            })
              .then((user) => {
                console.log("new account created");
                req.flash(
                  "successMasg",
                  "your account has been created, please log in"
                );

                mail(email).then((res) => {
                })
                .catch((err) => {
                    console.log('err from mail func', err);
                });

                res.redirect("/users/login");

              })
              .catch((err) => {
                console.log(err);
                req.flash("errorMasg", "there an error");
                res.redirect("/users/register");
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });

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

        // transporter.sendMail(info, function(err, info){
        //     if(err) {
        //         console.log(err)
        //     } else {
        //         console.log('email sent');
        //     }
        // });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
    }
  }
);

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
