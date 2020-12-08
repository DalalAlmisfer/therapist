const express = require("express");
const User = require("../models/User");
const players = require("../models/player");
const enviroment = require("../models/enviroment");
const router = express.Router();

router.get("/login", function (req, res, next) {
    var user_email = req.query;
    console.log(user_email);
    //res.send(user_id);

  players
    .findOne({
      where: {
        email: user_email.email,
      },
    })
    .then((result) => {
      console.log(result.player_id);
      res.send(`this is id ${result.player_id}`);
    })
    .catch((err) => {
      console.log(err);
      res.send("err");
    });

});

router.post("/login", (req, res) => {
    var user_email = req.query;
    console.log(user_email);

  players
    .findOne({
        where: {
            email: user_email.email,
          },
    })
    .then((user) => {
      if (user) {
        players
          .update(
            { islogged_in: 1 },
            {
              where: {
                email: user_email.email,
              },
            }
          )
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("the user dosent exit");
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("err");
    });
});

module.exports = router;
