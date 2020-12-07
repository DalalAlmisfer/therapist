const express = require("express");
const User = require("../models/User");
const players = require("../models/player");
const enviroment = require("../models/enviroment");
const router = express.Router();

router.get("/login/:username", (req, res) => {
  console.log(req.params.username);
  var id = req.params.username;
  var leng = id.length;
  //res.send(`this is id ${id}`);
  var sub = id.substring(1, leng);
  //res.send(`this is id ${sub}`);

  players
    .findOne({
      where: {
        email: sub,
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

router.post("/login/:username", (req, res) => {
    console.log(req.params.username);
    var id = req.params.username;
    var leng = id.length;
  var sub = id.substring(1, leng);

  players
    .findOne({
        where: {
            email: sub,
          },
    })
    .then((user) => {
      if (user) {
        players
          .update(
            { islogged_in: 1 },
            {
              where: {
                email: sub,
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
