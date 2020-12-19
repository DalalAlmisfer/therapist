//express
const express = require("express");
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const crypto =  require('crypto');

const app = express();

//import models (database table)
const User = require("../../models/User");
const admain = require("../../models/admain");
const players = require("../../models/player");
const enviroment = require("../../models/enviroment");

//therapist id
var user_id = 0;

//parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "Your secret key" }));

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

function ensureAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  } else{
    // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
    res.redirect('/users/login');
  }
}

//GET register/login for therapist
router.get("/registerTherapist", (req, res) => {
  res.render("home", {
    chosen: "therapist_reg",
    usertype: "therapist",
    layout: "layoutA",
  });
});

//GET therapist login page
router.get("/login", (req, res) => {
  res.render("home", {
    chosen: "therapist_login",
    usertype: "therapist",
    layout: "layoutA",
  });
});

//GET dashboard home
router.get("/index",  ensureAuthenticated , async (req, res) => {
  try {
    var json = JSON.parse(req.user);
    console.log(json);
  } catch (err) {
    console.log("err is parsing json", err);
  }
  var parameters = [];

  //Get total registered patients
  await players
    .count({
      include: [User],
      where: {
        therapist_FK: json["therapist_id"],
      },
    })
    .then((number) => {
      parameters.push(number);
    })
    .catch((error) => console.log(error));


  players
    .count({
      where: {
        islogged_in: 1,
        therapist_FK: json["therapist_id"]
      },
    })
    .then((loggedin) => {
      parameters.push(loggedin);
    })
    .catch((err) => console.log(err));

  await players
    .findAll({
      raw: true,
      where: {
        therapist_FK: json["therapist_id"],
      },
    })
    .then((player) => {

      console.log(parameters);

      res.render("index", {
        layout: "layout",
        title: "Home",
        user: json,
        count: parameters,
        data: player,
      });
    })
    .catch((err) => console.log(err));
});

//login therapist
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/index",
    failureRedirect: "/users/login",
    //failureFlash: true
  })(req, res, next);
});

//GET therapist register page
router.get("/register", (req, res) => {
  res.render("home", {
    chosen: "therapist_reg",
    usertype: "therapist",
    layout: "layoutA",
  });
});


//register new therapist
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

  var errors = [];
  var link="";
  var err_email,
    err_first,
    err_last,
    err_phone_number,
    err_password,
    err_conf_password,
    err_gander,
    err_job;
  var regexname = /^([a-zA-Z]{2,16})$/;
  var regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regexnum = /^[0-9][A-Za-z0-9 -]*$/;
  var regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (!first_name.match(regexname)) {
    err_first = "please enter a valid name";
    errors.push("please enter a valid name");
  }

  if (!family_name.match(regexname)) {
    err_last = "please enter a valid family name";
    errors.push("please enter a valid family name");
  }

  if (!email.match(regexemail)) {
    err_email = "please enter a valid email";
    errors.push("please enter a valid email");
  }

  if (!phone_number.match(regexnum)) {
    err_phone_number = "please enter a valid phone number";
    errors.push("please enter a valid phone number");
  }

  if (!password.match(regexpassword)) {
    err_password =
      "please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.";
    errors.push(
      "please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters."
    );
  }

  if (!Confirm_Password.match(regexpassword) || password != Confirm_Password) {
    err_conf_password = "doesn't match your password";
    errors.push("doesn't match your password");
  }

  if (gander == "select") {
    err_gander = "please select your gander";
    errors.push("please select your gander");
  }

  if (job_title == "select") {
    err_job = "please select your job title";
    errors.push("please select your job title");
  }

  try {
    await User.findOne({
      where: {
        email: email,
      },
    })
      .then((user) => {
        if (user) {
          //is the already user exist?
          res.render("home", {
            chosen: "therapist_reg",
            usertype: "therapist",
            layout: "layoutA",
          });
          next();
        } else if (errors.length != 0) {
          res.render("home", {
            chosen: "therapist_reg",
            usertype: "therapist",
            layout: "layoutA",
            err_email: err_email,
            err_first: err_first,
            err_last: err_last,
            err_phone_number: err_phone_number,
            err_password: err_password,
            err_conf_password: err_conf_password,
            err_job: err_job,
            err_gander: err_gander,
          });
        } else {
          var str = "token";
          var hash = crypto.createHash("sha1").update( str, "binary").digest("base64");

          User.create({
            email: email,
            first_name: first_name,
            family_name: family_name,
            birth_date: birth_date,
            password: password,
            phone_number: phone_number,
            gander: gander,
            job_title: job_title,
            status: 0,
            token: hash,
            admains_FK: 1,
          })
            .then((user) => {

             
              // var hash = crypto.createHash('sha256', user.therapist_id);
              // hash.update(user.therapist_id).digest('hex');
              console.log('this is token', str , 'this is hash', hash)
              link = `https://dashbaordanees.herokuapp.com/confirm/login?id=${hash}`;
              mail(email, first_name, link).catch((err) => {
                console.log("err from mail func", err);
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
  } catch (err) {
    console.log(err, "in adding user");
    res.status(500);
  }

  async function mail(email, name, link) {
    // create a message for register request confirmation
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "aneesksuteam@gmail.com", // sender address
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
            <a href='${link}'> ${link} </a> 

<p> 
            
            
            ${link}
            </p>
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



//therapist logou
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
