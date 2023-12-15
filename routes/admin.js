//  admin.js
var express = require('express');    
const adminRouter = express.Router(); 
const adminController = require('../controllers/adminController'); 
 
  
adminRouter.get('/settings', adminController.getSettings);
// adminRouter.post('/', adminController.createSetting);
adminRouter.post('/settings', adminController.updateSetting);
 
module.exports = {
  adminRouter, 
};