const express = require("express");
const User = require("../models/User");
const players = require("../models/player");
const enviroment = require("../models/enviroment");
const router = express.Router();

router.get("/login/:id", (req, res) => {
  console.log(req.params.id);
  var id = req.params.id;
  var sub = id.substring(1, 3);

  players
    .findOne({
      where: {
        player_id: sub,
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

router.post("/login/:id", (req, res) => {
  var id = req.params.id;
  var sub = id.substring(1, 3);

  players
    .findOne({
      where: {
        player_id: sub,
      },
    })
    .then((user) => {
      if (user) {
        players
          .update(
            { islogged_in: 1 },
            {
              where: {
                player_id: sub,
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
