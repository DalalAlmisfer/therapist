const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const players = require('../models/player');

const User = sequelize.define('therapists', {
        // Model attributes are defined here
        therapist_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          defaultValue: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: false
         },  
         first_name: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: false
        }, 
        family_name: {
          type: Sequelize.STRING,
          //allowNull: false,
          defaultValue: true
        },
        address: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: false
          },
          phone_number: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: true
          },
          major: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: true
          },
          job_title: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: true
          },
          gender: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: true
          },
          birth_date: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: true
          },
          password: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: false,
            
          },
          conf_password: {
            type: Sequelize.STRING,
            //allowNull: false,
            defaultValue: false

        },
        accepted: {
          type: Sequelize.TINYINT,
          defaultValue: false
        },
        admains_FK: 
        {type: Sequelize.INTEGER}

});

//assosiation 
User.hasMany(players, {foreignKey: 'therapist_FK', sourceKey: 'therapist_id'});
players.belongsTo(User, {
  foreignKey: 'therapist_FK',
  targetKey: 'therapist_id'
});

  module.exports = User;
  
