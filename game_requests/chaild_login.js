const express = require('express');
const app = express();
const User = require('../../models/User');
const player = require('../../models/player'); 
const enviroment = require('../../models/enviroment');

const router = express.Router();

router.get('/login', (req, res) => {
    
    
});

router.post('/login', (req, res) => {
    const email = req.body;
    const pass = req.body;

    console.log('this is email and ps', email , pass);
});



module.exports = router;