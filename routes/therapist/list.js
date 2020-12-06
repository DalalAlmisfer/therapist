//import needed libraries
const express = require('express');
const router = express.Router();
const app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');

//let express use cookie parser
app.use(cookieParser());

//import models (database table)
const player = require('../../models/player');
const therapist = require('../../models/User');
const enviroment = require('../../models/enviroment');



//GET list of patient list 
router.get('/list', (req,res) => {
   var json = JSON.parse(req.user);
    console.log('this is therapistid', json['therapist_id']);
    player.findAll({ 
        raw : true, 
        where: {
            therapist_FK: json['therapist_id'],}
})
    .then( (players) => {
        console.log(players);
        res.render("list", {layout: "layout" , data:players , user: json, title: "list"});

    }).catch( err => console.log(err));
});

//GET anxiety status analytics
router.get('/chart/:id', async (req,res) => {

    var json = JSON.parse(req.user);
    var id = (req.params.id).toString();
    var sub = id.substring(1, 3);

 player.findOne({
    where: {
        player_id: sub
    }
}).then((playerData) => {
    res.render('chart' ,{layout: "layout", user: json, userdata: playerData, title: "Chart"});

});
  

});

//GET anxiety status analytics for school
router.get('/chart/:id/school', (req, res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    var progress = "";

    enviroment.findOne({
        where: {
            player_FK: sub
        }
    }).then((data) => {
        progress = data;
    }).catch(err => console.log(err));

 player.findOne({
    where: {
        player_id: sub
    }
}).then((playerData) => {
    res.render('chart' ,{layout: "layout", user: json, userdata: playerData, progress:progress , chosen:"yes", title: "Chart"});

});
  
});

//GET anxiety status analytics for market
router.get('/chart/:id/market', (req, res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);

 player.findOne({
    where: {
        player_id: sub
    }
}).then((playerData) => {
    console.log('this is result sec' , playerData);
    res.render('chart' ,{layout: "layout", user: json, userdata: playerData, chosen:"no", title: "Chart"});

});
  
});

//GET anxiety status analytics for garden
router.get('/chart/:id/garden', (req, res) => {
    console.log('we are in garden');

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);


 player.findOne({
    where: {
        player_id: sub
    }
}).then((playerData) => {
    res.render('chart' ,{layout: "layout", user: json, userdata: playerData, chosen:"no",title: "Chart"});

});
  
});

//GET edit patient profile page
router.get('/:id/edit', (req,res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);

    
    player.findOne({
        where: {
            player_id: sub,
            therapist_FK: json['therapist_id']

        }
    })
    .then((result) => {
        res.render('edit' ,{layout: "layout" , user: json, title: "Edit patient profile", data: result});
    })
    .catch((err) => {
        console.log(err);
    });

});

//Submit edited data of patient's profile 
router.post('/:id/edit/submit', async (req, res) => {

    const input = { name, email, birth_date } = req.body;

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);

    await player.update(
        input,
        {
            where: {
                player_id: sub
            }

        },
    )
    .then( (result) => {
        res.render('index', {layout: "layout", user: json, title: 'edit ', body:'done' });


    })
    .catch(err => {
        console.log(err);
    })
});

//DELETE patient
router.get('/delete/:id', async (req, res) => {
    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);
    
    player.destroy({
        where: {
            player_id: sub,
        },
    },
    {include: [therapist]})
    .then((result) => {
        player.findAll({ 
            raw : true, 
            where: {
                therapist_FK: json['therapist_id'],}
    }).then((data) => {
            res.render("list", {layout: "layout" , data:data , user: json, title: "list"});
         });

    }).catch((err) => {
        console.log(err);
    });

});

module.exports = router;