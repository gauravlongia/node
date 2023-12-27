const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify upload directory for different types of images
    if (file.fieldname === 'image' || file.fieldname === 'authorimage') {
      cb(null, 'public/uploads/blogs');
    } else {
      cb({ message: 'Invalid field' }, null);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename for each uploaded file
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;
