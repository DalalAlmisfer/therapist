//import needed libraries
const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const app = express();
const router = express.Router();
//import models (database table)
const User = require("../../models/User");

router.get('/login', function (req, res)  {
    var id = req.query.id;
    
    console.log("this is id ", id);
    // var str = id.id;
    // var j = JSON.stringify(str)
    // console.log("this is str----- ", j);

    User.findOne({
        where: {
            token: id,
        }
    }).then((user) => {
        console.log('user --------', user);
    }).catch(err=> console.log(err));
  
     User.update(
         {status:1}, {
      where: {
        token: id,
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