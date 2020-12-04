const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const enviroment = sequelize.define('enviroments', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: false

    }, 
    title: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false,
    },
    ishedden: {
        type: Sequelize.TINYINT,
        defaultValue: false,
        allowNull: false,
    }, 
    progress: {
        type: Sequelize.INTEGER,
        defaultValue: false,
        allowNull: false,

    },
    Anees_dialogue: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false,
    },
    therapist_dialogue: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false,
    },
    player_FK: {
        type: Sequelize.INTEGER
    }

});



module.exports = enviroment;