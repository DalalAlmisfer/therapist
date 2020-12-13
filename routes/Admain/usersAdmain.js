//import needed libraries
const express = require("express");
const session = require("express-session");
const app = express();
const router = express.Router();
const passport = require("passport");
const sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const nodemailer = require("nodemailer");


// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "aneesksuteam@gmail.com",
    pass: "0504258108",
  },
});

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
        var str = "token";
        var hash = crypto.createHash("sha256").update( str, "binary").digest("base64");
        User.create({
          token: hash
          }).catch(err => console.log('err in creating admin', err));
          link = `https://dashbaordanees.herokuapp.com/admin/home?id=${hash}`;
          mail(req.body.email, link).catch((err) => {
            console.log("err from mail func", err);
          });
          res.render("home", {chosen: "admin_login" , usertype: 'admin', layout: 'layoutA'});
              } else {
        console.log('you are not authirazed to be admin');
        res.redirect('/usersAdmain/registerAdmain');
      }

    });

  } catch(err) {

    console.log(err);

  }

  async function mail(email, link) {
    // create a message for register request confirmation
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "aneesksuteam@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Anees Team - confirmation", // Subject line
      text: ` . We received Your Request Is Received, Please Wait For The Admain to Accept Your Request. You Will Recive An Email If Your Request Is Accepted.`, // plain text body
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
               </h1>
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

