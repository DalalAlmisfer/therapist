const express = require("express");
const User = require("../models/User");
const players = require("../models/player");
const enviroment = require("../models/enviroment");
const router = express.Router();

router.get("/login", function (req, res, next) {
    var user_email = req.query;
    console.log(user_email.user);
    //res.send(user_id);

  players
    .findOne({
      where: {
        email: user_email.user,
      },
    })
    .then((result) => {
      console.log(result.player_id);
      res.send(`this is id ${result.player_id}`);
    })
    .catch((err) => {
      console.log(err);
      res.send(`this is user email: ${user_info.user}`);
    });

});

router.post("/login", (req, res) => {
    //grab the user info from the url 
    var user_info = req.query;

    console.log(user_info);
    res.send(user_info);


  //   //find the user email in players table
  //  players.findOne({
  //       where: {
  //           email: user_info.user,
  //         },
  //   })
  //   .then((user) => {

  //     //if the user exist
  //     if (user) {
  //       //update islogged_in feild in players table
  //       players.update({ islogged_in: 1 },
  //           {
  //             where: {
  //               email: user_info.user,
  //             },
  //           }
  //         )
  //         .then((result) => {
  //           console.log(result);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     } else {
  //       console.log("no update happend to the user");
  //     }

  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     //if the user dosent exit in players table print this
  //     res.send(`this is user email: ${user_info.user}`);

  //   });

  
});

module.exports = router;
