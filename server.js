require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const QRCode = require('qrcode');

// ─── WhatsApp Web Client (whatsapp-web.js) ────────────────────────────────────
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
      console.log('[WhatsApp] QR Code ready — scan it from the Admin panel.');
      try {
        waQrDataUrl = await QRCode.toDataURL(qr);
      } catch (e) {
        waQrDataUrl = null;
      }
      waReady = false;
    });

    waClient.on('ready', () => {
      console.log('[WhatsApp] ✅ Connected! Messages will now send automatically.');
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

// Start WhatsApp client on server boot
initWhatsAppClient();
// ──────────────────────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());
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

const ordersFilePath = path.join(__dirname, 'orders.json');

// Helper to read orders from shared orders.json database file
function readOrdersFromFile() {
  if (!fs.existsSync(ordersFilePath)) {
    const initialOrders = [
      {
        id: 'VRB100001',
        customerName: 'Rajesh Patel',
        mobileNumber: '9845012345',
        address: '45, 2nd Main, Indiranagar, Bangalore - 560038',
        date: '2026-06-28 10:30 AM',
        items: [
          { name: 'Handcrafted Brass Diya (Pair)', price: 249, quantity: 1 },
          { name: 'Daily Pooja Essentials Kit', price: 149, quantity: 2 }
        ],
        totalAmount: 547,
        paymentMethod: 'UPI',
        status: 'Pending',
        notificationHistory: []
      },
      {
        id: 'VRB100002',
        customerName: 'Lakshmi Narasimhan',
        mobileNumber: '9731234567',
        address: 'Flat 302, Sai Residency, Malleshwaram, Bangalore - 560003',
        date: '2026-06-28 11:15 AM',
        items: [
          { name: 'Ornate Brass Pooja Handbell', price: 179, quantity: 1 },
          { name: 'Goddess Lakshmi Gold-Plated Frame', price: 199, quantity: 1 }
        ],
        totalAmount: 378,
        paymentMethod: 'Cash',
        status: 'Confirmed',
        notificationHistory: [
          {
            type: 'CONFIRMED',
            sentTime: '2026-06-28 11:20 AM',
            status: 'Sent',
            mobile: '9731234567',
            message: '🙏 Veerabhadra Pooja Store\n\nHello Lakshmi Narasimhan,\n\nYour order has been confirmed.\n\nOrder ID:\nVRB100002\n\nItems:\n- Ornate Brass Pooja Handbell x 1\n- Goddess Lakshmi Gold-Plated Frame x 1\n\nWe are preparing your order.\n\nThank you.'
          }
        ]
      },
      {
        id: 'VRB100003',
        customerName: 'Amit Sharma',
        mobileNumber: '8123456789',
        address: '78/A, 10th Cross, Jayanagar, Bangalore - 560041',
        date: '2026-06-27 03:45 PM',
        items: [
          { name: 'Vratam Peta Setup Kit', price: 299, quantity: 1 }
        ],
        totalAmount: 799,
        paymentMethod: 'Card',
        status: 'Preparing',
        notificationHistory: [
          {
            type: 'CONFIRMED',
            sentTime: '2026-06-27 03:50 PM',
            status: 'Sent',
            mobile: '8123456789',
            message: '🙏 Veerabhadra Pooja Store\n\nHello Amit Sharma,\n\nYour order has been confirmed.\n\nOrder ID:\nVRB100003\n\nItems:\n- Vratam Peta Setup Kit x 1\n\nWe are preparing your order.\n\nThank you.'
          }
        ]
      },
      {
        id: 'VRB100004',
        customerName: 'Priya Sridhar',
        mobileNumber: '9008012345',
        address: '12, Temple Street, Basavanagudi, Bangalore - 560004',
        date: '2026-06-27 09:00 AM',
        items: [
          { name: 'Pure Copper Pooja Kalash', price: 349, quantity: 1 },
          { name: 'Traditional Copper Pooja Lota', price: 279, quantity: 1 },
          { name: 'Premium Sandalwood Paste', price: 99, quantity: 3 }
        ],
        totalAmount: 925,
        paymentMethod: 'UPI',
        status: 'Packed',
        notificationHistory: [
          {
            type: 'CONFIRMED',
            sentTime: '2026-06-27 09:10 AM',
            status: 'Sent',
            mobile: '9008012345',
            message: '🙏 Veerabhadra Pooja Store\n\nHello Priya Sridhar,\n\nYour order has been confirmed.\n\nOrder ID:\nVRB100004\n\nItems:\n- Pure Copper Pooja Kalash x 1\n- Traditional Copper Pooja Lota x 1\n- Premium Sandalwood Paste x 3\n\nWe are preparing your order.\n\nThank you.'
          },
          {
            type: 'PACKED',
            sentTime: '2026-06-27 11:30 AM',
            status: 'Sent',
            mobile: '9008012345',
            message: '📦 Veerabhadra Pooja Store\n\nHello Priya Sridhar,\n\nYour order has been packed successfully.\n\nOrder ID:\nVRB100004\n\nItems:\n- Pure Copper Pooja Kalash x 1\n- Traditional Copper Pooja Lota x 1\n- Premium Sandalwood Paste x 3\n\nYour order is ready for pickup.\n\nPlease visit our store during business hours.\n\nThank you.'
          }
        ]
      },
      {
        id: 'VRB100005',
        customerName: 'Venkat Rao',
        mobileNumber: '9448098765',
        address: '204, Vaikunta Apartments, Rajajinagar, Bangalore - 560010',
        date: '2026-06-26 05:20 PM',
        items: [
          { name: 'Lord Ganesha Gold-Plated Frame', price: 199, quantity: 2 }
        ],
        totalAmount: 398,
        paymentMethod: 'UPI',
        status: 'Ready for Pickup',
        notificationHistory: [
          {
            type: 'CONFIRMED',
            sentTime: '2026-06-26 05:30 PM',
            status: 'Sent',
            mobile: '9448098765',
            message: '🙏 Veerabhadra Pooja Store\n\nHello Venkat Rao,\n\nYour order has been confirmed.\n\nOrder ID:\nVRB100005\n\nItems:\n- Lord Ganesha Gold-Plated Frame x 2\n\nWe are preparing your order.\n\nThank you.'
          },
          {
            type: 'PACKED',
            sentTime: '2026-06-26 06:15 PM',
            status: 'Sent',
            mobile: '9448098765',
            message: '📦 Veerabhadra Pooja Store\n\nHello Venkat Rao,\n\nYour order has been packed successfully.\n\nOrder ID:\nVRB100005\n\nItems:\n- Lord Ganesha Gold-Plated Frame x 2\n\nYour order is ready for pickup.\n\nPlease visit our store during business hours.\n\nThank you.'
          },
          {
            type: 'READY FOR PICKUP',
            sentTime: '2026-06-27 10:00 AM',
            status: 'Sent',
            mobile: '9448098765',
            message: '📍 Veerabhadra Pooja Store\n\nYour order is now ready for pickup.\n\nOrder ID:\nVRB100005\n\nItems:\n- Lord Ganesha Gold-Plated Frame x 2\n\nPlease collect your order from the store.\n\nThank you.'
          }
        ]
      },
      {
        id: 'VRB100006',
        customerName: 'Sunitha Hegde',
        mobileNumber: '9880123456',
        address: '56, Coconut Grove Road, Koramangala, Bangalore - 560034',
        date: '2026-06-25 11:00 AM',
        items: [
          { name: 'Daily Pooja Essentials Kit', price: 149, quantity: 1 },
          { name: 'Organic Camphor Tablets (100g)', price: 79, quantity: 2 }
        ],
        totalAmount: 307,
        paymentMethod: 'UPI',
        status: 'Delivered',
        notificationHistory: [
          {
            type: 'CONFIRMED',
            sentTime: '2026-06-25 11:15 AM',
            status: 'Sent',
            mobile: '9880123456',
            message: '🙏 Veerabhadra Pooja Store\n\nHello Sunitha Hegde,\n\nYour order has been confirmed.\n\nOrder ID:\nVRB100006\n\nItems:\n- Daily Pooja Essentials Kit x 1\n- Organic Camphor Tablets (100g) x 2\n\nWe are preparing your order.\n\nThank you.'
          },
          {
            type: 'PACKED',
            sentTime: '2026-06-25 01:30 PM',
            status: 'Sent',
            mobile: '9880123456',
            message: '📦 Veerabhadra Pooja Store\n\nHello Sunitha Hegde,\n\nYour order has been packed successfully.\n\nOrder ID:\nVRB100006\n\nItems:\n- Daily Pooja Essentials Kit x 1\n- Organic Camphor Tablets (100g) x 2\n\nYour order is ready for pickup.\n\nPlease visit our store during business hours.\n\nThank you.'
          },
          {
            type: 'READY FOR PICKUP',
            sentTime: '2026-06-25 03:00 PM',
            status: 'Sent',
            mobile: '9880123456',
            message: '📍 Veerabhadra Pooja Store\n\nYour order is now ready for pickup.\n\nOrder ID:\nVRB100006\n\nItems:\n- Daily Pooja Essentials Kit x 1\n- Organic Camphor Tablets (100g) x 2\n\nPlease collect your order from the store.\n\nThank you.'
          },
          {
            type: 'DELIVERED',
            sentTime: '2026-06-25 04:30 PM',
            status: 'Sent',
            mobile: '9880123456',
            message: '🙏 Thank You\n\nYour order has been successfully delivered.\n\nOrder ID:\nVRB100006\n\nItems:\n- Daily Pooja Essentials Kit x 1\n- Organic Camphor Tablets (100g) x 2\n\nThank you for shopping with Veerabhadra Pooja Store.\n\nWe hope to serve you again.\n\nPlease share your valuable feedback.'
          }
        ]
      },
      {
        id: 'VRB100007',
        customerName: 'Vikram Singh',
        mobileNumber: '7022099887',
        address: 'Flat 101, Prestige Heights, Whitefield, Bangalore - 560066',
        date: '2026-06-25 02:30 PM',
        items: [
          { name: 'Engraved Brass Aarti Plate', price: 299, quantity: 1 }
        ],
        totalAmount: 299,
        paymentMethod: 'Card',
        status: 'Cancelled',
        notificationHistory: []
      },
      {
        id: 'VRB100008',
        customerName: 'Ananth Prasad',
        mobileNumber: '9663123456',
        address: '15, Sri Rama Temple St, Banashankari, Bangalore - 560085',
        date: '2026-06-24 09:15 AM',
        items: [
          { name: 'Pure Copper Pooja Kalash', price: 349, quantity: 2 }
        ],
        totalAmount: 698,
        paymentMethod: 'UPI',
        status: 'Delivered',
        notificationHistory: [
          {
            type: 'DELIVERED',
            sentTime: '2026-06-24 05:00 PM',
            status: 'Sent',
            mobile: '9663123456',
            message: '🙏 Thank You\n\nYour order has been successfully delivered.\n\nOrder ID:\nVRB100008\n\nItems:\n- Pure Copper Pooja Kalash x 2\n\nThank you for shopping with Veerabhadra Pooja Store.\n\nWe hope to serve you again.\n\nPlease share your valuable feedback.'
          }
        ]
      },
      {
        id: 'VRB100009',
        customerName: 'Deepa Rao',
        mobileNumber: '8971098765',
        address: '89, 4th Block, HSR Layout, Bangalore - 560102',
        date: '2026-06-24 11:45 AM',
        items: [
          { name: 'Premium Sandalwood Paste (Chandanam)', price: 99, quantity: 5 }
        ],
        totalAmount: 495,
        paymentMethod: 'UPI',
        status: 'Delivered',
        notificationHistory: [
          {
            type: 'DELIVERED',
            sentTime: '2026-06-24 03:00 PM',
            status: 'Sent',
            mobile: '8971098765',
            message: '🙏 Thank You\n\nYour order has been successfully delivered.\n\nOrder ID:\nVRB100009\n\nItems:\n- Premium Sandalwood Paste (Chandanam) x 5\n\nThank you for shopping with Veerabhadra Pooja Store.\n\nWe hope to serve you again.\n\nPlease share your valuable feedback.'
          }
        ]
      },
      {
        id: 'VRB100010',
        customerName: 'Kiran Gowda',
        mobileNumber: '9844112233',
        address: '10, 1st Cross, Vijayanagar, Bangalore - 560040',
        date: '2026-06-23 04:30 PM',
        items: [
          { name: 'Traditional Copper Pooja Lota', price: 279, quantity: 1 },
          { name: 'Organic Camphor Tablets (100g)', price: 79, quantity: 3 }
        ],
        totalAmount: 516,
        paymentMethod: 'Cash',
        status: 'Cancelled',
        notificationHistory: []
      },
      {
        id: 'VRB100011',
        customerName: 'Sujatha Iyer',
        mobileNumber: '9900223344',
        address: '77, Margosa Road, Malleshwaram, Bangalore - 560003',
        date: '2026-06-23 10:00 AM',
        items: [
          { name: 'Lord Ganesha Gold-Plated Frame', price: 199, quantity: 1 },
          { name: 'Goddess Lakshmi Gold-Plated Frame', price: 199, quantity: 1 }
        ],
        totalAmount: 398,
        paymentMethod: 'UPI',
        status: 'Delivered',
        notificationHistory: [
          {
            type: 'DELIVERED',
            sentTime: '2026-06-23 04:00 PM',
            status: 'Sent',
            mobile: '9900223344',
            message: '🙏 Thank You\n\nYour order has been successfully delivered.\n\nOrder ID:\nVRB100011\n\nItems:\n- Lord Ganesha Gold-Plated Frame x 1\n- Goddess Lakshmi Gold-Plated Frame x 1\n\nThank you for shopping with Veerabhadra Pooja Store.\n\nWe hope to serve you again.\n\nPlease share your valuable feedback.'
          }
        ]
      },
      {
        id: 'VRB100012',
        customerName: 'Prashanth Bhat',
        mobileNumber: '9845099887',
        address: 'Flat A102, Shanthi Niketan, Vidyaranyapura, Bangalore - 560097',
        date: '2026-06-22 02:15 PM',
        items: [
          { name: 'Daily Pooja Essentials Kit', price: 149, quantity: 4 }
        ],
        totalAmount: 596,
        paymentMethod: 'UPI',
        status: 'Delivered',
        notificationHistory: []
      }
    ];
    fs.writeFileSync(ordersFilePath, JSON.stringify(initialOrders, null, 2));
    return initialOrders;
  }
  const data = fs.readFileSync(ordersFilePath, 'utf8');
  return JSON.parse(data || '[]');
}

function writeOrdersToFile(orders) {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}

// GET all orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = readOrdersFromFile();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders database' });
  }
});

// POST new order
app.post('/api/orders', (req, res) => {
  try {
    const orders = readOrdersFromFile();
    const orderData = req.body;

    let nextIdNum = 100013;
    if (orders.length > 0) {
      const ids = orders.map(o => {
        const match = o.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 100000;
      });
      nextIdNum = Math.max(...ids) + 1;
    }
    const orderId = `VRB${nextIdNum}`;

    const now = new Date();
    const dateStr = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getDate()).padStart(2, '0') + ' ' + 
                    String(now.getHours()).padStart(2, '0') + ':' + 
                    String(now.getMinutes()).padStart(2, '0') + ' ' + 
                    (now.getHours() >= 12 ? 'PM' : 'AM');

    const newOrder = {
      id: orderId,
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

    orders.push(newOrder);
    writeOrdersToFile(orders);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to write order' });
  }
});

// PUT update existing order
app.put('/api/orders/:id', (req, res) => {
  try {
    const orders = readOrdersFromFile();
    const orderId = req.params.id;
    const updatedOrder = req.body;

    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders[index] = updatedOrder;
      writeOrdersToFile(orders);
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
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
      error: 'WhatsApp not connected. Please scan the QR code in the Admin panel → WhatsApp Setup tab.'
    });
  }

  try {
    await waClient.sendMessage(`${cleanPhone}@c.us`, message);
    console.log(`[WhatsApp] ✅ Message sent to +${cleanPhone}`);
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
