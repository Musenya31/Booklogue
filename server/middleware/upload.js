const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' folder exists
const uploadFolder = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configure storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Upload instance
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
const filetypes = /pdf|epub|jpeg|jpg|png|gif/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and EPUB files are allowed'));
    }
  }
});

module.exports = upload;
