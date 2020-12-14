//import needed libraries
const express = require('express');
const router = express.Router();

//import models (database table)
const therapist = require('../../models/User');

function ensureAuthenticated(req, res, next) {
    if (req.user) {
      return next();
    } else{
      // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
      res.redirect('/');
    }
  }

//GET index page
router.get('/', (req,res) => {
    res.render('home', {chosen: 'nothing', layout: 'layoutA'});
});

//GET therapist profile page
router.get('/profile', ensureAuthenticated,  async (req,res) => {
        //console.log('this profile' + req.user);
        var json = JSON.parse(req.user);

        console.log('this is josn:', json);

        await therapist.findOne(
            {
                where: {
                    therapist_id: json.therapist_id
                }
    
            },
        )
        .then( (result) => {
            console.log('this is res:', result);
            //res.send(`this is res: ${json.therapist_id}`)
            res.render('profile', {layout: "layout", user: result, title: 'profile'});
        })
        .catch( err => {
            console.log(err);
    
        });
    

});

//Edit therapist profile
router.post('/profile', ensureAuthenticated, async (req, res) => {

    var json = JSON.parse(req.user);
    const { first_name, family_name, job_title, gander, birth_date, email, phone_number } = req.body;

    await therapist.update(
       { first_name: first_name,
        family_name:family_name, 
        job_title: job_title, 
        gander:gander, 
        birth_date: birth_date, 
        email: email, 
        phone_number: phone_number
    }, 
        {
            where: {
                therapist_id: json.therapist_id
            }

        },
    )
    .then( (result) => {
         therapist.findOne(
            {
                where: {
                    therapist_id: json.therapist_id
                }
    
            },
        )
        .then( (result) => {
            console.log('this after unpdate', result);
            //res.send(`this is res: ${json.therapist_id}`)
            res.render('profile', {layout: "layout", user: result, title: 'profile', confirm:'The change was successful!'});
        })
        .catch( err => {
            console.log(err);
    
        });
    })
    .catch( err => {
        console.log(err);

    });

});


module.exports = router;