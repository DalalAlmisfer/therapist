//express
const express = require("express");
const app = express();
const router = express.Router();
const User = require("../../models/admain");
const page = require('../../models/contact_us');

router.get('/home', (req, res) => {
    res.redirect('/registerRequest/addtherapist');

})

router.get('/contactus', (req, res) => {
    res.render('contact_us_admin');
})

router.post('/contactus', (req, res) => {
    const { email, msg } = req.body;
    let errors = [];

    var regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


  if( !email.match(regexemail)) {
    errors.push("please enter a valid email");

  } 

 
    if ( errors.length > 0) {
        console.log('error cc');
        res.render('contact_us_admin', {errors:errors})

    } else {

    //Insert to database
    page.create({
        email: email,
        msg: msg
    })
    .then( (user) => {
          console.log('msg right');
          res.render('contact_us_admin', {success:'yes'})

    })
    .catch( err => {
        console.log(err);
         res.redirect('/home/contactus');

    });
  }
})



module.exports = router;
