const Sequelize = require('sequelize');

const sequelize = new Sequelize('anees_DB', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
        
    }
});


sequelize
   .authenticate()
   .then( ()=> {
       console.log(' database connected');

   })
   .catch( (err)=> {
    console.log('not connected');
   });

   module.exports = sequelize;
