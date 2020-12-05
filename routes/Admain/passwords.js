//express
const express = require('express');
const app = express();
const User = require('../../models/admain');


const router = express.Router();

router.get('/forgot/therapist', (req, res) => {
    res.render('restpassword' , {layout: "layoutA" , user:'therapist'});
});

router.get('/forgot/admin', (req, res) => {
    res.render('restpassword' , {layout: "layoutA" , user:'admin'});
});

router.post('/forgot/therapist', (req, res) => {
    res.render('restpassword' , {layout: "layoutA" , user:'therapist'});
});

router.post('/forgot/admin', (req, res) => {
    res.render('restpassword' , {layout: "layoutA" , user:'admin'});
});




module.exports = router;