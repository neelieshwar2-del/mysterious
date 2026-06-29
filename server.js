const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure public/images directory exists
const uploadDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit files to 5MB
});

// Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ imageUrl: 'images/' + req.file.filename });
  } else {
    res.status(400).json({ error: 'No file uploaded or file too large' });
  }
});

// Redirect clean routes to corresponding static HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

app.get('/rental', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rental.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Redirect legacy .html routes to clean routes (SEO best practices)
app.get('/index.html', (req, res) => {
  res.redirect(301, '/');
});

app.get('/products.html', (req, res) => {
  res.redirect(301, '/products');
});

app.get('/rental.html', (req, res) => {
  res.redirect(301, '/rental');
});

app.get('/contact.html', (req, res) => {
  res.redirect(301, '/contact');
});

// Serve assets (CSS, JS, Images) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html')); // Fallback to home or a custom 404 page
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
