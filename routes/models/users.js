const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Connect to MongoDB (replace 'your-database-url' with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/nodeApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     unique: true,
  },
  email: {
     type: String, 
     unique: true,
  },
  password: {
     type: String, 
  },
  posts: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Post',
     },
  ],
 });
 

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// Create a User model based on the schema
module.exports = mongoose.model('User', userSchema);
