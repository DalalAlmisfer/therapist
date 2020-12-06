//import needed library
const Sequelize = require('sequelize');

//create connection with database
const sequelize = new Sequelize('heroku_195f706910a16f0', 'b630bdd6b6e1b9', 'd159c434', {
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
