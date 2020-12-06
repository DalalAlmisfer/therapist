const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const enviroments = require('../models/enviroment');

const player = sequelize.define('players', {

    player_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: false
    },
    first_name: {
        type: Sequelize.TEXT,
        defaultValue: false,
    },
    last_name: {
        type: Sequelize.TEXT,
        defaultValue: false,
    },
    email: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false,
    },
    gander: {
        type: Sequelize.STRING,
        defaultValue: false,
    },
    birth_date: {
        type: Sequelize.DATEONLY,
        defaultValue: false,
    },
    env_title: {
        type: Sequelize.STRING,
        defaultValue: false,
    },
    anxiety_type: {
        type: Sequelize.STRING,
        defaultValue: false,
    },
    accepted_env: {
         type: Sequelize.INTEGER,
        },
    request_sent: {
        type: Sequelize.INTEGER,
        },
    therapist_FK: { 
        type: Sequelize.INTEGER,
    },
   islogged_in: {
       type: Sequelize.TINYINT,
       defaultValue: false,
   }
});


//assosiation 
player.hasMany(enviroments, {foreignKey: 'player_FK', sourceKey: 'player_id'});
enviroments.belongsTo(player, {
  foreignKey: 'player_FK',
  targetKey: 'player_id',
  onDelete: 'cascade'
});

module.exports = player;