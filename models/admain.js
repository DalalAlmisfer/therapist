const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const therapists = require('../models/User'); 



const admains = sequelize.define('admains', {
    // Model attributes are defined here

    admains_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true

    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
      }

});

admains.hasMany(therapists, {foreignKey: 'admains_FK', sourceKey: 'admains_id'});
therapists.belongsTo(admains, {
foreignKey: 'admains_FK',
targetKey: 'admains_id',
});

module.exports = admains;