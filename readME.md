# loginSystem Using Passport 

This is _loginSystem_ using passport validation and also preety good iinterface if you want to create LoginSystem than don't waste your time for making *LoginSystem* simpli clone it but **note that** there is no cofiguration code into this repository so make it by yourSelf ,So here is some **information** reagarding this ,you just need to go through it. :rocket:


## configuration information :
 ## Make `auth.js` file

 ```javascript
module.exports={
ensureAuthenticated: function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg','Please log in to view this resource');
    res.redirect('/users/login');
}
}
 ```

 ## Also make `keys.js` :
 ```javascript
module.exports={
    MongoURI: "..here_is your_MONGODB_databse_link.."
}
 ```

 ## Last One `passport.js`:
 ```javascript
const LocalStrategy=require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

// User Model

const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'},(email, password, done) => {
            //match user
            User.findOne({ email: email})
            .then(user => {
                if(!user){
                 return done(null, false, { message: 'That email is not registered'});
                }
              //Matching password
              bcrypt.compare(password, user.password, (err, isMatch) => {
                  if(err) throw err;

                  if(isMatch){
                      return done(null,user);
                  }else{
                      return done(null, false, { message: 'password incorrect'});
                  }
              });
                
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });  
}
 ```

 - ALL DONE

 # result :
 >home page


 ![register page](/images/regiister.png) 

 > register page

 ![register page](/images/register.png)

 >login page

 ![login page](/images/login.png)

 ***
 ---