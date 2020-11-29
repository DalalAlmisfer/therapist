const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const notes = sequelize.define('notes', {

    note_id: {
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
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: false,
        allowNull: false,
    }, 
    content: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false,

    },
    therapist_FK: {
        type: Sequelize.INTEGER
    },
    player_FK: {
        type: Sequelize.INTEGER
    }

});



module.exports = notes;