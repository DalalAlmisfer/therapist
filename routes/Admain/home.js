//express
const express = require("express");
const app = express();
const router = express.Router();
const User = require("../../models/admain");

router.get('/home', (req, res) => {
    res.render('homeAdmain', {layout: 'admainLayout'});
})



module.exports = router;
