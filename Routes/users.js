const express=require('express');
const router =express.Router();
const bcrypt= require('bcryptjs');
const passport = require('passport');

//User model
const User=require('../models/User');
//login page
router.get('/login',(req,res)=> res.render('login'));

//register page
router.get('/register',(req,res)=> res.render('register'));


//Register Handle
router.post('/register',(req,res)=>{
    const{ name,email,password,password2}=req.body;
    let errors=[];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'please fill in all fields'});
    }

    //check password match or not
    if(password !== password2){
        errors.push({ msg: 'Password do not match'});
    }

    //check pass length
    if(password.length < 8){
        errors.push({ msg: 'Password length should be atleast 8'});
    }

    if(errors.length > 0){

        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //validation passed
       User.findOne({ email: email})
       .then(user =>{
           if(user){
               //user exist
               errors.push({ msg: 'Email is already registered'});
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            });
           }else{
             const newUser=new User({
                 name,
                 email,
                 password
             });

             //hash password
              bcrypt.genSalt(10,(err,salt)=>
              bcrypt.hash(newUser.password,salt,(err,hash) => {
                  if(err) throw err;
                  //set password to hashed
                  newUser.password=hash;
                  //saving user
                  newUser.save()
                  .then(user =>{
                      req.flash('success_msg','you are now registered and can log in');

                      res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              }))
           }
       });
    }

});

//Login handle
router.post('/login',(req,res,next) => {
passport.authenticate('local',{
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
})(req,res,next);
});

//logout handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg','Logged out Successfully');
    res.redirect('/users/login');
});

module.exports=router;