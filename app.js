const express=require('express');
const expresslayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
//for session and flash message
const flash =require('connect-flash');
const session=require('express-session');
const passport = require('passport');

const app=express();

//passport configuring
require('./config/passport')(passport);

//DB config
const db=require('./config/keys').MongoURI;

//Connect to mongo
mongoose.connect(db,{ useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology:true,
useFindAndModify:false
})
.then(()=> console.log('MongoDB connected...'))
.catch(err => console.log(err));


//EJS
app.use(expresslayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false}));

//Express-sessin middleware go and search express-session and after that go to it's 
//github page and pick from there
app.use(session({
    secret: 'kya aapke toothpaste me namak hai ',
    resave: true,
    saveUninitialized: true
  }));

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());


  //connect flash
  app.use(flash());

  //global variable to change the color of flash message just like green color for success and yello for failure like that
  app.use((req,res,next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  });


//Routes
app.use('/',require('./Routes/index'));
app.use('/users',require('./Routes/users'));

const PORT =process.env.PORT||5000;

app.listen(PORT, console.log(`server running on port ${PORT} `));