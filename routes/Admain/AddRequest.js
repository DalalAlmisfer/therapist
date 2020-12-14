//express
const express = require('express');
const app = express();
const User = require('../../models/User');
const player = require('../../models/player'); 
const enviroment = require('../../models/enviroment');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.admin == 'auth') {
      return next();
    } else{
      // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
      res.redirect('/');
    }
  }

router.get('/addenv', ensureAuthenticated, (req,res) => {
    player.findAll({
        raw: true, 
        where: {
            request_sent: 1
        }
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
    var leng = id.length
    var sub = id.substring(1, leng);
    var subint = parseInt(sub);

    await player.update(
        {accepted_env: 1},
        {
            where: 
            {
                player_id: subint

            }
        }
    ).catch(err => console.log('err is updaing env', err));

    await enviroment.update(
        {ishedden: 2},
        {
            where:
            {
                player_FK: subint
            }
        }
    ).then((result) => {

        player.findAll({raw: true,
        where: {
            request_sent: 1
        }}).then((data) => {
            res.render('addEnviroment', {layout: 'admainLayout', data:data });

        });

    }).catch( (err) => {
        console.log(err);
    });

});

router.get('/:id/decision/terminate', async (req, res) => {
    var id = req.params.id;
    var leng = id.length
    var sub = id.substring(1, leng);
    var subint = parseInt(sub);


    await enviroment.destroy({
            where: 
            {
                player_FK: subint

            }
        }).catch(err => console.log('err is updaing env', err));

    await player.update(
        {
            accepted_env: 0,
            request_sent:0,
            env_title: '',
        },
        {
            where:
            {
                player_id: subint
            }
        }
    ).then((result) => {

        player.findAll({raw: true}).then((data) => {
             res.render('addEnviroment', {layout: 'admainLayout', data:data });

        });
    }).catch( (err) => {
        console.log(err);
    });

});






module.exports = router;