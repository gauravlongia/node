//index.js
var express = require('express'); 
const userRouter = express.Router(); 
const userController = require('../controllers/userController');
 
// Assign each route to its respective controller function
userRouter.get('/', userController.index);
userRouter.get('/affiliate-disclaimer', userController.affiliatedisclaimer);
userRouter.get('/newsblogspage', userController.aicarousels);

userRouter.get('/blog/:slug',userController.slug);
userRouter.get('/blogs', userController.blogs);   
userRouter.get('/contact', userController.contact);  
userRouter.get('/index', userController.index);  
userRouter.get('/news', userController.news);  
userRouter.get('/pixop', userController.pixop);  
userRouter.get('/plugins', userController.plugins);  
userRouter.get('/privacy-policy', userController.privacypolicy);  
userRouter.get('/resource', userController.resource);  
userRouter.get('/terms-and-conditions', userController.termsandconditions);  

module.exports = userRouter;
 