
const express = require('express');
const app = express();

var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());


const router = express.Router();
const player = require('../models/player');
const therapist = require('../models/User');
const enviroment = require('../models/enviroment');
//id set and get 
var idObject = ''; 

function idgetter(){
        return idObject;
    }
function idsetter(val) {
        idObject = val;
    }

router.get('/list', (req,res) => {
    var json = JSON.parse(req.user);
    console.log('this is therapistid', json['therapist_id']);
    player.findAll({ 
        raw : true, 
        where: {
            therapist_FK: json['therapist_id'],}
})
    .then( (players) => {
        var id = json.therapist_id; 
        console.log(players);
        res.render("list", {layout: "layout" , data:players , user: json, title: "list"});

    }).catch( err => console.log(err));
});

router.get('/chart/:id', async (req,res) => {

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
    res.render('chart' ,{layout: "layout", user: json, userdata: playerData, title: "Chart"});

});
  

});

router.get('/chart/:id/school', (req, res) => {
    console.log('we are in skool');

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
    res.render('chart' ,{layout: "layout", user: json, userdata: playerData, chosen:"yes", title: "Chart"});

});
  
});

router.get('/chart/:id/market', (req, res) => {
    console.log('we are in market');

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

router.get('/chart/:id/garden', (req, res) => {
    console.log('we are in garden');

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
    res.render('chart' ,{layout: "layout", user: json, userdata: playerData, chosen:"no",title: "Chart"});

});
  
});

router.get('/note/:id', (req,res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    console.log('id is', id);
    var sub = id.substring(1, 3);
    console.log(sub);
    
    player.findOne({
        where: {
            player_id: sub
        }
    })
    .then((result) => {
        console.log("this is res" , result);
        idsetter(sub);
        res.render('notes' , {layout: "layout" , user: json, data: result, title: " note "});
    })
    .catch((err) => {
        console.log(err);
    });

});

router.get('/:id/edit', (req,res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log('this is id', sub);
    console.log('this is id user', json['therapist_id']);
    
    player.findOne({
        where: {
            player_id: sub,
            therapist_FK: json['therapist_id']

        }
    })
    .then((result) => {
        console.log("this is res" , result);
        idsetter(sub);
        res.render('edit' ,{layout: "layout" , user: json, title: "Edit patient profile", data: result});
    })
    .catch((err) => {
        console.log(err);
    });

});

router.post('/:id/edit/submit', async (req, res) => {

    const input = { name, email, birth_date } = req.body;

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log("this is sec id ", sub);

    await player.update(
        input,
        {
            where: {
                player_id: sub
            }

        },
    )
    .then( (result) => {
        console.log('this is user', result);
        res.render('index', {layout: "layout", user: json, title: 'edit ', body:'done' });


    })
    .catch(err => {
        console.log(err);
    })
});

router.get('/addEnv/:id', (req,res) => {

    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);
    
    player.findOne({
        where: {
            player_id: sub
        }
    })
    .then((result) => {
        console.log(result);
        res.render('addEnv' ,{layout: "layout" , user: json, title: "Add Enviroment", data: result});
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post('/submit', async (req, res) => {
    const { env } = req.body;
    console.log('this is env', env);
    var json = JSON.parse(req.user);
    // var id = req.params.id;
    // //var sub = id.substring(1, 2);
    // console.log("this is sec id ", id);


    await enviroment.create({
        title: env,
        ishedden: 0, 
        progress: 1, 
        dialouge: '',
        player_FK: 20
    },
    {include: [player]})
    .then((result) => {
        console.log('this is user', result);
        res.render('list', {layout: "layout", user: json, title: 'edit ', body:'done' });

    })
    .catch(err => {
        console.log(err);
    });


});

router.get('/delete/:id', async (req, res) => {
    var json = JSON.parse(req.user);
    var id = req.params.id;
    var sub = id.substring(1, 3);
    console.log(sub);
    
    player.destroy({
        where: {
            player_id: sub,
        }
    })
    .then((result) => {
        player.findAll({ 
            raw : true, 
            where: {
                therapist_FK: json['therapist_id'],}
    })
            .then((data) => {
            res.render("list", {layout: "layout" , data:data , user: json, title: "list"});
         });

         }).catch((err) => {
        console.log(err);
    });

});

module.exports = router;