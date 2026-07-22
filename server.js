require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const QRCode = require('qrcode');

// â”€â”€â”€ WhatsApp Web Client (whatsapp-web.js) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let waClient = null;
let waReady = false;
let waQrDataUrl = null;
let waInitializing = false;

function initWhatsAppClient() {
  if (waInitializing || waReady) return;
  waInitializing = true;

  try {
    const { Client, LocalAuth } = require('whatsapp-web.js');

    // Use system-installed Chrome to avoid Puppeteer version conflicts
    const possibleChromePaths = [
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Users\\' + require('os').userInfo().username + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    ];
    const fs2 = require('fs');
    const chromePath = possibleChromePaths.find(p => fs2.existsSync(p));
    if (!chromePath) {
      console.error('[WhatsApp] Chrome not found. Please install Google Chrome.');
      waInitializing = false;
      return;
    }
    console.log('[WhatsApp] Using Chrome at:', chromePath);

    waClient = new Client({
      authStrategy: new LocalAuth({ dataPath: path.join(__dirname, '.whatsapp-session') }),
      puppeteer: {
        executablePath: chromePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      }
    });

    waClient.on('qr', async (qr) => {
      console.log('[WhatsApp] QR Code ready â€” scan it from the Admin panel.');
      try {
        waQrDataUrl = await QRCode.toDataURL(qr);
      } catch (e) {
        waQrDataUrl = null;
      }
      waReady = false;
    });

    waClient.on('ready', () => {
      console.log('[WhatsApp] âœ… Connected! Messages will now send automatically.');
      waReady = true;
      waQrDataUrl = null;
    });

    waClient.on('authenticated', () => {
      console.log('[WhatsApp] Authenticated successfully.');
    });

    waClient.on('auth_failure', (msg) => {
      console.error('[WhatsApp] Auth failure:', msg);
      waReady = false;
      waInitializing = false;
    });

    waClient.on('disconnected', (reason) => {
      console.warn('[WhatsApp] Disconnected:', reason);
      waReady = false;
      waQrDataUrl = null;
      waInitializing = false;
      // Auto-reconnect after 10 seconds
      setTimeout(initWhatsAppClient, 10000);
    });

    waClient.initialize();
    console.log('[WhatsApp] Initializing client...');
  } catch (err) {
    console.error('[WhatsApp] Failed to start client:', err.message);
    waInitializing = false;
  }
}

// Only start WhatsApp client when running locally (not on Vercel â€” no Chrome support)
if (!process.env.VERCEL) {
  initWhatsAppClient();
}
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// â”€â”€â”€ Cloudinary Image Storage (used when CLOUDINARY_CLOUD_NAME is set) â”€â”€â”€â”€â”€â”€â”€â”€
let cloudinaryConfigured = false;
try {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    cloudinaryConfigured = true;
    console.log('[Cloudinary] Configured for cloud image storage.');
  }
} catch (e) {
  console.warn('[Cloudinary] Not configured:', e.message);
}

// â”€â”€â”€ Multer: Cloudinary or local disk â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let upload;
if (cloudinaryConfigured) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const cloudinary = require('cloudinary').v2;
  const cloudStorage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'pooja-store', allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }
  });
  upload = multer({ storage: cloudStorage, limits: { fileSize: 5 * 1024 * 1024 } });
} else {
  // Local disk fallback
  const uploadDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
  });
  upload = multer({ storage: localStorage, limits: { fileSize: 5 * 1024 * 1024 } });
}

// Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or file too large' });
  // Cloudinary returns req.file.path (URL); local returns req.file.filename
  const imageUrl = cloudinaryConfigured
    ? req.file.path
    : 'images/' + req.file.filename;
  res.json({ imageUrl });
});

const ordersFilePath = path.join(__dirname, 'orders.json');

// â”€â”€â”€ MongoDB Setup (used when MONGODB_URI env var is set) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let mongoDb = null;
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  const { MongoClient } = require('mongodb');
  const mongoClient = new MongoClient(MONGODB_URI);
  mongoClient.connect()
    .then(() => {
      mongoDb = mongoClient.db('pooja_store');
      console.log('[MongoDB] Connected to Atlas database.');
    })
    .catch(err => console.error('[MongoDB] Connection failed:', err.message));
}

// Read all orders â€” MongoDB if available, else local file
async function readOrders() {
  if (mongoDb) {
    return await mongoDb.collection('orders').find({}).toArray();
  }
  // Local file fallback
  if (!fs.existsSync(ordersFilePath)) {
    const initial = getDefaultOrders();
    fs.writeFileSync(ordersFilePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(ordersFilePath, 'utf8') || '[]');
}

// Save (upsert) a single order â€” MongoDB if available, else rewrite file
async function saveOrder(order) {
  if (mongoDb) {
    await mongoDb.collection('orders').replaceOne({ id: order.id }, order, { upsert: true });
    return;
  }
  const orders = await readOrders();
  const idx = orders.findIndex(o => o.id === order.id);
  if (idx > -1) orders[idx] = order; else orders.push(order);
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}

// Legacy helpers kept for compatibility
function readOrdersFromFile() {
  if (!fs.existsSync(ordersFilePath)) {
    const initial = getDefaultOrders();
    fs.writeFileSync(ordersFilePath, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(ordersFilePath, 'utf8') || '[]');
}
function writeOrdersToFile(orders) {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}

// Default seed orders for first-time setup
function getDefaultOrders() {
  return [
    {
      id: 'VRB100001',
      customerName: 'Rajesh Patel',
      mobileNumber: '9845012345',
      address: '45, 2nd Main, Indiranagar, Bangalore',
      date: '2026-06-28 10:30 AM',
      items: [{ name: "Handcrafted Brass Diya", price: 249, quantity: 1 }],
      totalAmount: 249,
      paymentMethod: 'UPI',
      status: 'Pending',
      notificationHistory: []
    }
  ];
}


// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// POST new order
app.post('/api/orders', async (req, res) => {
  try {
    const orders = await readOrders();
    const orderData = req.body;

    let nextIdNum = 100013;
    if (orders.length > 0) {
      const ids = orders.map(o => { const m = o.id.match(/\d+/); return m ? parseInt(m[0], 10) : 100000; });
      nextIdNum = Math.max(...ids) + 1;
    }
    const now = new Date();
    const dateStr = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ' ' +
      (now.getHours() >= 12 ? 'PM' : 'AM');

    const newOrder = {
      id: `VRB${nextIdNum}`,
      customerName: orderData.customerName || 'WhatsApp Customer',
      mobileNumber: orderData.mobileNumber || 'Via WhatsApp',
      address: orderData.address || 'Provided via WhatsApp',
      date: dateStr,
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'UPI/Cash',
      status: 'Pending',
      notificationHistory: []
    };

    await saveOrder(newOrder);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT update existing order
app.put('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = req.body;
    await saveOrder(updatedOrder);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});


// GET WhatsApp connection status
app.get('/api/whatsapp-status', (req, res) => {
  res.json({
    ready: waReady,
    hasQr: !!waQrDataUrl,
    initializing: waInitializing
  });
});

// GET WhatsApp QR code (base64 image)
app.get('/api/whatsapp-qr', (req, res) => {
  if (waReady) {
    return res.json({ ready: true, qr: null });
  }
  if (!waQrDataUrl) {
    return res.json({ ready: false, qr: null, message: 'QR not generated yet. Please wait...' });
  }
  res.json({ ready: false, qr: waQrDataUrl });
});

// POST send WhatsApp message automatically via whatsapp-web.js
app.post('/api/send-whatsapp', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Missing phone number (to) or message.' });
  }

  let cleanPhone = to.replace(/\D/g, '');
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

  if (!waReady || !waClient) {
    return res.status(503).json({
      error: 'WhatsApp not connected. Please scan the QR code in the Admin panel â†’ WhatsApp Setup tab.'
    });
  }

  try {
    await waClient.sendMessage(`${cleanPhone}@c.us`, message);
    console.log(`[WhatsApp] âœ… Message sent to +${cleanPhone}`);
    res.json({ success: true, to: `+${cleanPhone}` });
  } catch (error) {
    console.error('[WhatsApp] Send error:', error.message);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
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

// Local development: start HTTP server
// Vercel serverless: export the app as a module
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
