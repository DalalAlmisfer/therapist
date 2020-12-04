const Sequelize  = require('sequelize');

const sequelize = require('../config/database');

const therapists = require('../models/User'); 

const DataTypes = require('sequelize/lib/data-types');



const admains = sequelize.define('admains', {
    // Model attributes are defined here

    admains_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true

    },
    name:{
      type: DataTypes.STRING,
      allowNull: false

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      conf_password: {
        type: DataTypes.STRING,
        allowNull: false
      }, 

});

admains.hasMany(therapists, {foreignKey: 'admains_FK', sourceKey: 'admains_id'});
therapists.belongsTo(admains, {
foreignKey: 'admains_FK',
targetKey: 'admains_id',
});

module.exports = admains;