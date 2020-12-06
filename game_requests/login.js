const express = require("express");
const User = require("../models/User");
const players = require("../models/player");
const enviroment = require("../models/enviroment");
const router = express.Router();


router.get('/login', (req,res) => {
    players.findOne({
        where: {
            player_id: 1
        }
    }).then((result) => {
        console.log(result.player_id);
        res.send(`this is id ${result.player_id}`); 
    }).catch((err) => {
        console.log(err);
    });
   
    
});

router.post('/login', (req,res) => {
    res.send(req.body.username); 
});


module.exports = router;