//import needed libraries
const express = require('express');
const app = express();
const router = express.Router();
//import models (database table)
const User = require("../../models/User");

router.get('/:id', async function (req, res)  {
    var id = req.params.id;
    var leng = id.length;
    var sub = id.substring(1, leng);
    console.log('here confirm', sub);
  
    User.update({status:1}, {
      where: {
        therapist_id: sub,
      }
    }).then((result) => {
      res.render("home", {
        chosen: "therapist_login",
        usertype: "therapist",
        layout: "layoutA",
        msg: "confirmation is success, you can login"
      });
    }).catch(err => console.log(err));
  
  });



module.exports = router;