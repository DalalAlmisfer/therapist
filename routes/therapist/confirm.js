//import needed libraries
const express = require('express');
const app = express();
const router = express.Router();
//import models (database table)
const User = require("../../models/User");

router.get('/login', function (req, res)  {
    var id = req.query;
    console.log("this is id ", id.id);
    User.findOne({
        where: {
            therapist_id: 591,
        }
    }).then((user) => {
        console.log('user --------', user);
    }).catch(err=> console.log(err));
  
     User.update({status:1}, {
      where: {
        therapist_id: id.id,
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