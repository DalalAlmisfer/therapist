//import needed libraries
const express = require('express');
const router = express.Router();

//import models (database table)
const therapist = require('../../models/User');

//GET index page
router.get('/', (req,res) => {
    res.render('home', {chosen: 'nothing', layout: 'layoutA'});
});

//GET therapist profile page
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

//Edit therapist profile
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


module.exports = router;