const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require("../models/User");



passport.use( new localStrategy(
    {
    usernameField: 'email',
    },
    (email, password, done) => {
        User.findOne({
            where: {
                email: email
            }
        })
        .then( user => {
            if (!user){
                console.log('user not found');
                return done(null, false, {message: 'user is not registred'}); 
            } else {
                console.log('user is found');

                if(user.accepted == 0) {
                    console.log('not authorized yet');
                    return done(null, false, {
                        message: 'not authorized yet'
                    }); 
                } 
                
                if (user.password == password) {
                    console.log('correct password');
                    return done(null, user);
                } else {
                    console.log('incorrect password');
                    return done(null, false, {
                        message: 'wrong password'
                    }); 
                }
            }
        
        }

    )
        .catch( (err) => {
            return done(null, false, {
                message: err
            });
        });
    }
));




passport.serializeUser(function(user, done) {
    console.log(" serl started");
    var data = JSON.stringify(user);

    if ( user === 'string'  ){
        console.log('is  string');
    }

    done(null,  data);
  });
  

  passport.deserializeUser(function(id, done) {
    console.log('this is deserializeUser1 ' + id);
    done(null, id);
  });
