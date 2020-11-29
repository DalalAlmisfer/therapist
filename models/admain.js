const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const therapists = require('../models/User'); 


const User = sequelize.define('admains', {
    // Model attributes are defined here

    admains_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true

    },
    name:{
      type: Sequelize.STRING,
      allowNull: false

    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      conf_password: {
        type: Sequelize.STRING,
        allowNull: false
      }, 

});

User.hasMany(therapists, {foreignKey: 'admains_FK', sourceKey: 'admains_id'});
therapists.belongsTo(User, {
foreignKey: 'admains_FK',
targetKey: 'admains_id'
});