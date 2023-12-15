//index.js
var express = require('express');
const say = require('say');
const User = require('./models/users'); // Adjust the path accordingly  
const Post = require('./models/postModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
passport.use(new LocalStrategy( User.authenticate()));
const upload = require('./models/multer'); 
const userRouter = express.Router(); 
const userController = require('../controllers/userController');
 
userRouter.use((req, res, next) => { 
  res.locals.pageClass = ''; 
  if (req.url !== '/index') { 
     res.locals.pageClass = 'sub_page'; 
  } 
  next();  
 }); 

 
userRouter.get('/', userController.index);
userRouter.get('/about', userController.about);
userRouter.get('/class', userController.classView);
userRouter.get('/blog', userController.blog);  
 
 
 
userRouter.post('/saynpm', function(req, res, next) {
  say.speak(req.body.text, 'Good News', 1.0, (err) => {
    if (err) {
      return console.error(err)
    }
    console.log('Text has been spoken.')  
    
  });
  res.redirect('/');
});


userRouter.get('/register', function(req, res, next) {
  res.render('register',{ messages: req.flash() });
});

userRouter.post('/register', function(req, res, next) {
  const { username, email, password } = req.body;
  const newUser = new User({
    username: req.body.username,
    email: req.body.email
  });

  User.register(newUser, req.body.password)
    .then(function(registeredUser) {
      passport.authenticate("local")(req, res, function() {
        req.flash('success', 'You registered successfully');
        res.redirect('/allusers');
      });
    })
    .catch(function(error) {
      req.flash('error', 'Error registering user');
      console.error(error);
      res.status(500).send('Error registering user');
    });
});




userRouter .get('/login', function(req, res, next) {
  // console.log(req.flash('error'));  
  res.render('login', {   messages : req.flash()  });
});

userRouter .post('/login', passport.authenticate('local', {
  successRedirect: '/allusers',
  failureRedirect: '/login',
  failureFlash: true, 
}));
// finduser
userRouter .get('/allusers', isLoggedIn ,async function(req, res, next) {
  try { 
    const allUsers = await User.find(); 
    const crntUser = await User.findOne({
      email: req.session.passport.user
    });
 console.log(crntUser);
    if (allUsers.length > 0) {  
      res.render('allusers', { users: allUsers , currentUser: req.user,crntUser , messages: req.flash()  });
      // res.status(200).json(allUsers);
    } else { 
      console.log('No users found');
      res.status(404).send('No users found');
    }
  } catch (error) { 
    console.error(error);
    res.status(500).send('Error retrieving users');
  }
});


// Delete route
userRouter .post('/delete/:id', async function(req, res, next) {
  const userId = req.params.id;

  try {
    // Find the user by ID and remove it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      console.log('User deleted:', deletedUser);
      res.redirect('/allusers');
    } else {
      // User not found
      console.log('User not found');
      res.status(404).send('User not found');
    }
  } catch (error) {
    // Handle the error (e.g., database error)
    console.error(error);
    res.status(500).send('Error deleting user');
  }
});

userRouter .get('/logout', isLoggedIn, function(req, res,next) {
  req.logout(function(err){
    if(err){ return next(err);}
    req.flash('success', 'Logged out successfully');
    res.redirect('/login');
  } );  
});


userRouter .get('/createpost',isLoggedIn, function(req, res, next) {
  // console.log(req.flash('error'));  
  res.render('createpost', {   messages : req.flash()  });
});
// create post

userRouter .post('/create_post', isLoggedIn ,upload.single('file'), async (req, res) => {
  try {
     // Create the post with the provided details
     const post = new Post({
       title: req.body.title,
       content: req.body.content,
       filePath: req.file.filename,
       user: req.user._id,
     });
  
     await post.save(); 
     const user = await User.findById(req.user._id);
     user.posts.push(post._id); 
     await user.save();
 
     res.redirect('/allposts');
  } catch (error) {
     console.error(error);
     res.status(500).send('Error creating post');
  }
 });


 //GET route to show all posts for a specific user
userRouter .get('/allposts', isLoggedIn , async (req, res) => {
  try {
    const userId = req.user._id; 
    // Fetch the user and populate their posts
    const user = await User.findById(userId).populate('posts');
 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    } 
    res.render('allposts', { posts: user.posts , user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Middleware to check if a user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
module.exports = { 
  userRouter,
};