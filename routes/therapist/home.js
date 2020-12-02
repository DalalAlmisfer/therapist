
const express = require('express');
const app = express();
const router = express.Router();

const { check, validationResult } = require('express-validator');

const db = require('../../config/database');

const page = require('../../models/contact_us');
const player = require('../../models/player');
const thearpists = require('../../models/User');
const enviroment = require('../../models/enviroment');
var body_parser = require('body-parser');
app.use(body_parser.json());
var urlencodedParser = body_parser.urlencoded({ extended: true });

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//------- Constact us --------
router.get('/contact', (req,res) => {
    res.render('contactUs', {layout: "layout" });
});

router.post('/contact', (req,res) => {
    const { phone_number, contact_email, contact_msg } = req.body;
    let errors = [];

    //Backend Validation 
    if(!contact_name) {
        errors.push({
            msg: 'Please insert your name'
        });
    }

    if(!contact_email) {
        errors.push({
            msg: 'Please insert your email'
        });
    }

    if(contact_msg.length < 0) {
        errors.push({
            msg: 'Please insert your message'
        });
    }

    if ( errors.length > 0) {
        console.log('error cc');
        res.render('contactUS', {errors:errors, layout: "layout" })

    } else {

    //Insert to database
    page.create({
        email: contact_email,
        phone_number: phone_number,
        msg: contact_msg
    })
    .then( (user) => {
          console.log('msg right');
          req.flash('successMasg', 'your msg is submitted');
          res.redirect('/');

    })
    .catch( err => {
        console.log(err);
        eq.flash('errorMasg', 'there an error');
        res.redirect('/pagesFunctions/contact');

    });
  }
});

// -------- Add Patient -------- 
router.get('/add', (req,res) => {
    res.render('addChild', {layout: "layout" } );
});

router.post('/add', urlencodedParser, (req,res) => {

  //  var json = JSON.parse(req.user);
 //   console.log('this is therapistid in add', json['therapist_id']);

    const  {first_name, last_name, child_birth, email, anxiety_type, env_title, gander, password} = req.body;

    let errors = [];

    //Backend Validation 
    if(!first_name || !last_name) {
        // errors.push({
        //     msg: 'Please insert  name'
        // });
    }

    if(!email) {
        // errors.push({
        //     msg: 'Please insert  email'
        // });
    }

    if(!child_birth) {
        // errors.push({
        //     msg: 'Please insert  date of birth'
        // });
    }

    if ( errors.length > 0) {
        console.log('error cc');
        res.render('addChild', {errors, layout: "layout" });

    } else {

    //Insert to database
    player.create({
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name,
        gander: gander,
        env_title: env_title,
        anxiety_type: anxiety_type,
        birth_date: child_birth,
        therapist_FK: 21,
        islogged_in:0,
    },
    {include: [thearpists]})
    .then( (user) => {
          console.log(' right');
          req.flash('successMasg', 'your msg is submitted');
          res.redirect('/users/index');

    })
    .catch( err => {
        console.log(err);
        eq.flash('errorMasg', 'there an error');
        res.redirect('/pagesFunctions/add', {errors:err});

    });
}

});

// ------- search ---------
router.get('/search', (res, req, next) => {
   const { search_value } = res.query;

   player.findAll({ raw : true,
        where: { name: { [Op.like]: '%'+ search_value +'%'}
       }
    })
    .then( (result) => {
        req.render('list', {layout: "layout" , data:result, title: "search"});
        console.log(result);
    })
    .catch( err => console.log(err));
});



module.exports = router;

