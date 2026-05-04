const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl }); // ✅ returns full accessible URL
});

module.exports = router;