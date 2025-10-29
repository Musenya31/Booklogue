const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Multer middleware configured for uploads

// POST /api/upload
// Handles single file upload, saves to 'uploads' folder
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Respond with public URL of uploaded file
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

module.exports = router;
