// postModel.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodeApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const PostSchema = new mongoose.Schema({
 title: {
    type: String,
    required: true,
 },
 content: {
    type: String,
    required: true,
 },
 filePath: {
    type: String,
    required: true,
 },
 user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
 },
});

module.exports = mongoose.model('Post', PostSchema);