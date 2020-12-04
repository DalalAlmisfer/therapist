const express = require("express");
const app = express();
const router = express.Router();

const player = require("../../models/player");
const enviroment = require("../../models/enviroment");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.get("/addEnv/:id", (req, res) => {
  var json = JSON.parse(req.user);
  var id = req.params.id;
  var sub = id.substring(1, 3);
  console.log(sub);

  player
    .findOne({
      where: {
        player_id: sub,
      },
    })
    .then((result) => {
      console.log(result);
      res.render("addEnv", {
        layout: "layout",
        user: json,
        title: "Add Enviroment",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/:id/submit", async (req, res) => {
  const { Enviroment } = req.body;
  console.log("this is env", Enviroment);
  var json = JSON.parse(req.user);
  var id = req.params.id;
  var sub = id.substring(1, 3);
  var subint = parseInt(sub);
  console.log("this is sec id ", id);

  player.findOne({
      where: {
        player_id: subint,
      },
    }).then((data) => {
        console.log('this is ', data.env_title);
  if ( data.env_title == "school" || data.env_title == "market" || data.env_title == "garden") {

    enviroment.update(
        {
          title: Enviroment,
        },
        {
          where: {
            player_FK: subint,
          },
        }
      ).catch((err) => console.log(err));
    } else {
        enviroment.create({
        title: Enviroment,
        ishedden: 0,
        progress: 0,
        Anees_dialogue: 0,
        therapist_dialogue: 0,
        player_FK: subint,
      },
      { include: [player] }
      ).then((result) => {
          console.log("this is user", result);
          res.render("list", {layout: "layout",user: json,title: "edit ",body: "done",});
      }).catch((err) => {
          console.log(err);
        });
    }

     player.update(
        { request_sent: 1, env_title: Enviroment },
        {
          where: {
            player_id: subint,
          },
        }
      ).catch((err) => console.log("err in updating", err));


});


});

module.exports = router;
