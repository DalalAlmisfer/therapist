const express = require("express");
const User = require("../models/User");
const players = require("../models/player");
const enviroment = require("../models/enviroment");
const router = express.Router();


router.get('/login', (req,res) => {
    res.json({ message: "---" });
    res.send(req.body);
    
});

router.post('/login', (req,res) => {
    res.send(req.body.username); 
});


module.exports = router;