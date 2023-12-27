//  admin.js
var express = require('express');  
const upload = require('../helpers/multer');  
const aRouter = express.Router(); 
const adminController = require('../controllers/adminController'); 
const { isAuthenticated } = require('../Middlewares/auth');
const validationRule= require('../helpers/validation-rules'); 
  
 
aRouter.get('/', adminController.dashboard);

 
aRouter.get('/category' , adminController.categoryaddview);
aRouter.post('/category' , adminController.categoryadd);
aRouter.get('/categoryall' , adminController.categoryall);
aRouter.get('/categoryEdt/:id', adminController.editCategory);
aRouter.get('/categoryDlt/:id', adminController.deleteCategory);
aRouter.post('/updatecategory'  , adminController.updateCategory);
 
aRouter.get('/subcategory/:id?', adminController.editOrShowsubcategory); 
aRouter.post('/subcategory' , adminController.addOrUpdateSubcategory);
aRouter.get('/subcategoryall' , adminController.subcategoryall); 
aRouter.get('/subcategoryDlt/:id', adminController.deletesubcategory); 

aRouter.get('/blog/:id?', adminController.editOrShowblog); 
aRouter.post('/blog' , upload.fields([{ name: 'image' }, { name: 'authorimage' }]) , adminController.addOrUpdateblog);
aRouter.get('/blogall' , adminController.blogall); 
aRouter.get('/blogDlt/:id', adminController.deleteblog); 

aRouter.route('/settings')
.post( adminController.updateSetting)
.get( adminController.getSettings); 

aRouter.route('/login')
.get(adminController.login)
.post( adminController.loginpost)
 
aRouter.route('/slider')
.get(adminController.homesliderget)
.post( adminController.homesliderpost)
aRouter.get('/slider/delete/:index',adminController.deletesliderheadiing);

aRouter.route('/updatehomeabout')
.get(adminController.homeaboutview)
.post(upload.single('image'), adminController.homeaboutsave)

aRouter.get('/logout', adminController.logout); 


module.exports = {
  aRouter, 
};