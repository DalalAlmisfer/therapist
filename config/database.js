//import needed library
const Sequelize = require('sequelize');

//create connection with database
const sequelize = new Sequelize( process.env.DB_NAME , process.env.DB_USER, process.env.DB_PASS, {
    host: 'eu-cdbr-west-03.cleardb.net',
    dialect: 'mysql',
    define: {
        timestamps: false,
        
    }
});

//check the connection
sequelize
   .authenticate()
   .then( ()=> {
       console.log(' database connected');

   })
   .catch( (err)=> {
    console.log('not connected');
   });


module.exports = sequelize;
