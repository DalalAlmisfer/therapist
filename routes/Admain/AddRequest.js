//express
const express = require('express');
const app = express();
const User = require('../../models/User');
const player = require('../../models/player'); 
const enviroment = require('../../models/enviroment');

const router = express.Router();

router.get('/addenv', (req,res) => {
    player.findAll({
        raw: true
    })
    .then((result) => {
        res.render('addEnviroment', {layout: "admainLayout", data: result, status: '' });
    })
    .catch(err => {
        console.log(err);
    });
});

router.get('/:id/decision/accept', async (req, res) => {
    var id = req.params.id;
    console.log('this is id', id);
    var sub = id.substring(1, 4);
    console.log('this is sub',sub);
    var subint = parseInt(sub);
    console.log('this is sub',subint);

    await enviroment.update(
        {ishedden: 1},
        {
            where:
            {
                player_FK: subint
            }
        }
    ).then((result) => {
        player.findAll({raw: true}).then((data) => {
            console.log('this is result', data);
            res.render('addEnviroment', {layout: 'admainLayout', data:data, status:'accepted'});
        });

    }).catch( (err) => {
        console.log(err);
    });

});

router.get('/:id/decision/reject', async (req, res) => {
    var id = req.params.id;
    console.log('this is id', id);
    var sub = id.substring(1, 4);
    console.log('this is sub',sub);
    var subint = parseInt(sub);
    console.log('this is sub',subint);

    await enviroment.update(
        {ishedden: 0},
        {
            where:
            {
                player_FK: subint
            }
        }
    ).then((result) => {
        player.findAll({raw: true}).then((data) => {
            enviroment.findOne({
                    attributes: ['ishedden'],
                    where: {
                        player_FK: subint
                    }
            }).then((result) => {
                 console.log('this is ishedden', result)
             }).catch((err) => { console.log(err)});
             res.render('addEnviroment', {layout: 'admainLayout', data:data, status:'rejected'});

        });


    }).catch( (err) => {
        console.log(err);
    });

});






module.exports = router;