//express
const { render } = require('ejs');
const express = require('express');
const app = express();
const router = express.Router();
const { isAuthenticated } = require('../config/auth');

//Models 
const player = require('../models/player');
const therapist = require('../models/User');


router.get('/', (req,res) => {
    res.render('home');
    // var json = JSON.parse(req.user);
    // console.log('this is therapistid', json['therapist_id']);

    // player.findAll({ raw : true,
    //     where: {
    //         therapist_FK: json['therapist_id'],
    //    }
    //  })
    // .then( (players) => {
    //     console.log(players);
    //         //Get total registered patients 
    //     player.count({
    //         where: {
    //             therapist_FK: json['therapist_id'],
    //         }
    //     }).then( (number) => {
    //     console.log('number_of_patients', number);
    //     res.render("index", {layout: "layout" , count:number, data:players , user: json, title: "Home"});
    //     }).catch((error) => console.log(error));

    // }).catch( err => console.log(err));

});

// router.get('/home', isAuthenticated, (req,res) => {
//     // if a callback is specified, the rendered HTML string has to be sent explicitly
//      res.render('index', function (err, html) {
//      res.send(html);
//   });
// });
// router.post('/profile', (req,res) => {
// });

router.get('/index', (req,res) => {
    var json = JSON.parse(req.user);
    console.log('this is therapistid', json['therapist_id']);

    player.findAll({ raw : true,
        where: {
            therapist_FK: json['therapist_id'],
       }
     })
    .then( (players) => {
        console.log(players);
            //Get total registered patients 
        player.count({
            where: {
                therapist_FK: json['therapist_id'],
            }
        }).then( (number) => {
        console.log('number_of_patients', number);
        res.render("index", {layout: "layout" , count:number, data:players , user: json, title: "Home"});
        }).catch((error) => console.log(error));

    }).catch( err => console.log(err));
})

router.get('/profile', async (req,res) => {
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
            console.log(result);
            res.render('profile', {layout: "layout", user: result, title: 'profile '});
        })
        .catch( err => {
            console.log(err);
    
        });
    

});

router.post('/profile', async (req, res) => {

    var json = JSON.parse(req.user);
    const input = { name, email, phone_number, address } = req.body;

    await therapist.update(
        address, 
        {
            where: {
                tharapist_id: json.therapist_id
            }

        },
    )
    .then( (result) => {
        console.log(result);
        res.render('index', {layout: "layout", user: json, title: 'edit ', body:'done' });
    })
    .catch( err => {
        console.log(err);

    });

});


router.get('/home/add', (req,res) => {
    var json = JSON.parse(req.user);
    res.render('addChild', {layout: "layout", user: json, title: "Add patient"});
});


router.get('/home/contact', (req,res) => {
    var json = JSON.parse(req.user);
    res.render('contactUs', {layout: "layout", user: json, title: 'contact us'});
});

router.get('/home/aboutUs', (req, res) => {
    var json = JSON.parse(req.user);
    res.render('aboutUs', {layout: "layout", user: json, title: 'about us'});

})

module.exports = router;