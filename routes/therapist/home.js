//import needed libraries
const express = require('express');
const app = express();
const router = express.Router();
const body_parser = require('body-parser');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//import models (database table)
const page = require('../../models/contact_us');
const player = require('../../models/player');
const thearpists = require('../../models/User');
const enviroment = require('../../models/enviroment');

//let express use json
app.use(body_parser.json());
var urlencodedParser = body_parser.urlencoded({ extended: true });

//paitent id 
var user_id = 0;

function ensureAuthenticated(req, res, next) {
    if (req.user) {
      return next();
    } else{
      // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
      res.redirect('/');
    }
  }

//GET about us page
 router.get('/aboutUs', ensureAuthenticated, (req, res) => {
     var json = JSON.parse(req.user);
     res.render('aboutUs', {layout: "layout", user: json, title: 'about us'});
 
 });

//------- Constact us --------
router.get('/contact', (req,res) => {
    var json = JSON.parse(req.user);
    res.render('contactUs', {layout: "layout", user: json, title: 'contact us'});
});

router.post('/contact', (req,res) => {
    const { contact_email, contact_msg } = req.body;
    let errors = [];

    var regexemail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


  if( !contact_email.match(regexemail)) {
    errors.push("please enter a valid email");

  } 

 
    if ( errors.length > 0) {
        console.log('error cc');

    } else {

    //Insert to database
    page.create({
        email: contact_email,
        msg: contact_msg
    })
    .then( (user) => {
          console.log('msg right');
          res.render('contactUS', {layout: "layout", msg:"message sent!", title: 'contact us'})

    })
    .catch( err => {
        console.log(err);
        res.render('contactUS', {msg:"message sent!", layout: "layout", title: 'contact us'})
    });
  }
});

// -------- Add Patient -------- 
router.get('/add', ensureAuthenticated, (req,res) => {
    var json = JSON.parse(req.user);
     res.render('addChild', {layout: "layout", user: json, title: "Add patient"});
    });

router.post('/add', urlencodedParser, ensureAuthenticated, (req,res) => {

   var json = JSON.parse(req.user);
   console.log('this is therapistid in add', json['therapist_id']);

    const  {first_name, last_name, child_birth, email, anxiety_type, env_title, gander, password} = req.body;

    let errors = [];
    let already ="";
    

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
        res.render('addChild', { layout: "layout", errors:errors, user:json, title: 'add' });
    
    } else {
        player.findOne({
            where: {
                email: email
            }
        }).then((user) => {
            if(user) {
                already = "the patient's email already added"
                res.render('addChild', { layout: "layout", already:already, user:json, title: 'add' });
 
            } else {
                player.create({

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
                      res.redirect('/users/index');
            
                })
                .catch( err => {
                    console.log(err);
                    res.redirect('/home/add', {errors:err});
            
                });
            }
        }).catch(err => console.log(err));

}

});

// ------- search ---------
router.get('/search', ensureAuthenticated, (res, req, next) => {
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

