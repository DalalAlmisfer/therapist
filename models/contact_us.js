const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const information = sequelize.define('contact_us', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        defaultValue: false
    },
    email: {
        type: Sequelize.STRING,
        defaultValue: false,
        allowNull: false,
    },
    msg: {
        type: Sequelize.TEXT,
        defaultValue: false,
        allowNull: false,
    }

});

module.exports = information;
  