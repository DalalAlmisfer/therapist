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

                // mail(email).then((res) => {
                // })
                // .catch((err) => {
                //     console.log('err from mail func', err);
                // });

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
    }
  }
);

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
