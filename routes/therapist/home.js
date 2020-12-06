
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
var user_id = 0;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//------- Constact us --------
router.get('/contact', (req,res) => {
    res.render('contactUs', {layout: "layout" });
});

router.post('/contact', (req,res) => {
    const { contact_email, contact_msg } = req.body;
    let errors = [];

    var regexname = /^([a-zA-Z]{2,80})$/;
    var regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var regexnum = /^[0-9][A-Za-z0-9 -]*$/;


  if( !contact_email.match(regexemail)) {
    errors.push("please enter a valid email");

  } 

  if( !contact_msg.match(regexname)) {
    errors.push("please enter a valid message");

  }

    if ( errors.length > 0) {
        console.log('error cc');
        res.render('contactUS', {errors:errors, layout: "layout", title: 'contact us'})

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
          res.redirect('/users/index');

    })
    .catch( err => {
        console.log(err);
       // eq.flash('errorMasg', 'there an error');
       // res.redirect('/pagesFunctions/contact');

    });
  }
});

// -------- Add Patient -------- 
router.get('/add', (req,res) => {
    res.render('addChild', {layout: "layout" } );
});

router.post('/add', urlencodedParser, (req,res) => {

   var json = JSON.parse(req.user);
   console.log('this is therapistid in add', json['therapist_id']);

    const  {first_name, last_name, child_birth, email, anxiety_type, env_title, gander, password} = req.body;

    let errors = [];
    

    var regexname = /^([a-zA-Z]{2,16})$/;
    var regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if( !first_name.match(regexname)) {
        errors.push("please enter a valid name");
      }
    
    if( !last_name.match(regexname)) {
        errors.push("please enter a valid family name");
      }

    if( !email.match(regexemail)) {
        errors.push("please enter a valid email");
    } 

    if( !password.match(regexpassword)) {
        errors.push("please enter a 8 long password with uppercase and lowercase Letters, numbers, special characters.");
    }



    if ( errors.length > 0) {
        res.render('addChild', { layout: "layout", errors:errors, title: 'add' });
    
    } else {
        user_id++;
    player.create({
        player_id: user_id,
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name,
        gander: gander,
        env_title: '',
        anxiety_type: anxiety_type,
        birth_date: child_birth,
        therapist_FK: json['therapist_id'],
        islogged_in:0,
        request_sent: 0,
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
   console.log(search_value);

   player.findAll(
       { raw : true,
        where: { 
            first_name: { [Op.like]: '%'+ search_value +'%'},
       }
    })
    .then( (result) => {
        console.log(result);
        req.render('list', {layout: "layout" , data:result, found: 'no',title: "search"});
    })
    .catch( err => console.log(err));
});



module.exports = router;

