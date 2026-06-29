// Admin Dashboard Logic

const DEFAULT_ITEMS = [
  { id: 'brass-diya-pair', name: 'Handcrafted Brass Diya (Pair)', category: 'brass-items', mrp: 399, price: 249, image: 'images/brass-diya.png', type: 'sale' },
  { id: 'brass-pooja-bell', name: 'Ornate Brass Pooja Handbell', category: 'brass-items', mrp: 299, price: 179, image: 'images/brass-diya.png', type: 'sale' },
  { id: 'brass-aarti-plate', name: 'Engraved Brass Aarti Plate', category: 'brass-items', mrp: 449, price: 299, image: 'images/brass-diya.png', type: 'sale' },
  { id: 'copper-kalash-pooja', name: 'Pure Copper Pooja Kalash', category: 'copper-items', mrp: 499, price: 349, image: 'images/copper-kalash.png', type: 'sale' },
  { id: 'copper-panchapatra-pali', name: 'Copper Panchapatra & Pali Set', category: 'copper-items', mrp: 299, price: 199, image: 'images/copper-kalash.png', type: 'sale' },
  { id: 'copper-pooja-lota', name: 'Traditional Copper Pooja Lota', category: 'copper-items', mrp: 399, price: 279, image: 'images/copper-kalash.png', type: 'sale' },
  { id: 'ganesha-gold-frame', name: 'Lord Ganesha Gold-Plated Frame', category: 'photo-frames', mrp: 299, price: 199, image: 'images/photo-frame.png', type: 'sale' },
  { id: 'lakshmi-gold-frame', name: 'Goddess Lakshmi Gold-Plated Frame', category: 'photo-frames', mrp: 299, price: 199, image: 'images/photo-frame.png', type: 'sale' },
  { id: 'radha-krishna-frame', name: 'Radha Krishna Wooden Altar Frame', category: 'photo-frames', mrp: 349, price: 249, image: 'images/photo-frame.png', type: 'sale' },
  { id: 'daily-pooja-kit', name: 'Daily Pooja Essentials Kit', category: 'daily-essentials', mrp: 249, price: 149, image: 'images/pooja-kit.png', type: 'sale' },
  { id: 'premium-sandalwood-paste', name: 'Premium Sandalwood Paste (Chandanam)', category: 'daily-essentials', mrp: 149, price: 99, image: 'images/pooja-kit.png', type: 'sale' },
  { id: 'organic-camphor-tablets', name: 'Organic Camphor Tablets (100g)', category: 'daily-essentials', mrp: 119, price: 79, image: 'images/pooja-kit.png', type: 'sale' },
  { id: 'vratam-peta-kit', name: 'Vratam Peta Setup Kit', category: 'rentals', price: 299, deposit: 500, description: 'Traditional wooden peta setup, backdrop frames, brass lamps, copper kalash and complete aarti accessories.', image: 'images/vratam-peta.png', type: 'rental' }
];

const DEFAULT_ORDERS = [
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
    notificationHistory: [
      {
        type: 'DELIVERED',
        sentTime: '2026-06-22 06:00 PM',
        status: 'Sent',
        mobile: '9845099887',
        message: '🙏 Thank You\n\nYour order has been successfully delivered.\n\nOrder ID:\nVRB100012\n\nItems:\n- Daily Pooja Essentials Kit x 4\n\nThank you for shopping with Veerabhadra Pooja Store.\n\nWe hope to serve you again.\n\nPlease share your valuable feedback.'
      }
    ]
  }
];

let items = [];
let orders = [];

// Orders filter, search and pagination state
let activeOrderFilter = 'all';
let currentOrderPage = 1;
let ordersPerPage = 10;
let orderSearchQuery = {
  id: '',
  name: '',
  mobile: ''
};

// Pending status change target
let orderStatusChangeTarget = {
  orderId: '',
  newStatus: ''
};

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  initData();
  checkAuth();
  setupEventListeners();
  initUploadZone();
});

// Load items and orders from LocalStorage or pre-populate with defaults
async function initData() {
  const stored = localStorage.getItem('pooja_store_items');
  if (stored) {
    try {
      items = JSON.parse(stored);
    } catch (e) {
      items = [...DEFAULT_ITEMS];
      saveData();
    }
  } else {
    items = [...DEFAULT_ITEMS];
    saveData();
  }

  try {
    const response = await fetch('/api/orders');
    if (response.ok) {
      orders = await response.json();
    } else {
      orders = [];
    }
  } catch (err) {
    console.error('Error fetching orders from server:', err);
    orders = [];
  }
  
  // Render views after asynchronous retrieval
  renderOrders();
  renderDashboard();
}

function saveData() {
  localStorage.setItem('pooja_store_items', JSON.stringify(items));
}

async function saveOrdersToServer(order) {
  try {
    await fetch(`/api/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
  } catch (err) {
    console.error('Error saving order status update to server:', err);
  }
}

// Authentication Handlers
function checkAuth() {
  const isAuthenticated = sessionStorage.getItem('pooja_admin_auth') === 'true';
  const loginSection = document.getElementById('loginSection');
  const dashboardSection = document.getElementById('dashboardLayout');

  if (isAuthenticated) {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'flex';
    switchTab('dashboard');
  } else {
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('loginError');

  // Static login credentials
  if (email === 'admin@poojastore.com' && password === 'admin123') {
    sessionStorage.setItem('pooja_admin_auth', 'true');
    errorEl.style.display = 'none';
    checkAuth();
    showToast('Login successful!');
  } else {
    errorEl.textContent = 'Invalid email or password.';
    errorEl.style.display = 'block';
  }
}

function handleLogout() {
  sessionStorage.removeItem('pooja_admin_auth');
  showToast('Logged out successfully.');
  checkAuth();
}

// Sidebar Menu Navigation
function switchTab(tabId) {
  // Hide all sections
  document.querySelectorAll('.panel-section').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active sidebar link classes
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    item.classList.remove('active');
  });

  // Activate chosen section & sidebar menu highlight
  const targetSection = document.getElementById(tabId + 'Section');
  if (targetSection) targetSection.classList.add('active');

  const menuLink = document.querySelector(`.menu-item a[onclick*="switchTab('${tabId}')"]`);
  if (menuLink) {
    menuLink.parentElement.classList.add('active');
  }

  // Update Main Header Title
  const headerTitle = document.getElementById('headerTitle');
  if (headerTitle) {
    if (tabId === 'dashboard') headerTitle.textContent = 'Dashboard Overview';
    else if (tabId === 'products') headerTitle.textContent = 'Product Inventory';
    else if (tabId === 'rentals') headerTitle.textContent = 'Rental Inventory';
    else if (tabId === 'orders') headerTitle.textContent = 'Order Management';
    else if (tabId === 'add-item') {
      const isEditing = document.getElementById('itemId').value !== '';
      headerTitle.textContent = isEditing ? 'Edit Item Details' : 'Add New Inventory Item';
    }
  }

  // Close Mobile Menu on Click
  closeMobileMenu();

  // Route specific rendering updates
  if (tabId === 'dashboard') renderDashboard();
  else if (tabId === 'products') renderProducts();
  else if (tabId === 'rentals') renderRentals();
  else if (tabId === 'orders') renderOrders();
}

// Bind Element Event Listeners
function setupEventListeners() {
  // Login Form submit
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Form conditional fields based on Sale/Rental selection
  const typeSelect = document.getElementById('itemType');
  if (typeSelect) {
    typeSelect.addEventListener('change', toggleFormFields);
  }

  // Item form submit
  const itemForm = document.getElementById('itemForm');
  if (itemForm) itemForm.addEventListener('submit', handleFormSubmit);

  // Mobile Menu toggle interactions
  const menuBtn = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (menuBtn && sidebar && overlay) {
    const toggleMenu = () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    };

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
}

// Toggle sale/rental form fields
function toggleFormFields() {
  const type = document.getElementById('itemType').value;
  const saleFields = document.getElementById('salePriceFields');
  const rentalFields = document.getElementById('rentalPriceFields');

  if (type === 'rental') {
    saleFields.style.display = 'none';
    rentalFields.style.display = 'block';
    document.getElementById('itemMrp').required = false;
    document.getElementById('itemPrice').required = false;
    document.getElementById('rentalPrice').required = true;
  } else {
    saleFields.style.display = 'block';
    rentalFields.style.display = 'none';
    document.getElementById('itemMrp').required = true;
    document.getElementById('itemPrice').required = true;
    document.getElementById('rentalPrice').required = false;
  }
}

// Toast Alert display helper
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = '⚡ ' + message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// 1. Render Dashboard tab
function renderDashboard() {
  const totalProducts = items.filter(i => i.type === 'sale').length;
  const totalRentals = items.filter(i => i.type === 'rental').length;
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  document.getElementById('totalProductsCount').textContent = totalProducts;
  document.getElementById('totalRentalsCount').textContent = totalRentals;
  
  const totalOrdersCountEl = document.getElementById('totalOrdersCount');
  if (totalOrdersCountEl) {
    totalOrdersCountEl.textContent = activeOrdersCount;
  }

  const recentListContainer = document.getElementById('recentActivityList');
  if (!recentListContainer) return;

  // Show last 4 items (reverse order of array)
  const recentItems = [...items].slice(-4).reverse();
  
  if (recentItems.length === 0) {
    recentListContainer.innerHTML = '<p style="text-align:center; padding:1.5rem; color:var(--color-text-muted);">No items in inventory.</p>';
    return;
  }

  recentListContainer.innerHTML = recentItems.map(item => `
    <div class="recent-item-row">
      <div class="recent-item-info">
        <img src="${item.image || 'images/brass-diya.png'}" alt="" class="recent-item-img">
        <div class="recent-item-details">
          <div class="name">${item.name}</div>
          <div class="meta">${item.type === 'rental' ? 'Rental Setup' : 'For Sale'} • ${item.category || 'Pooja Essentials'}</div>
        </div>
      </div>
      <div class="recent-item-price">
        ₹${item.type === 'rental' ? item.price + '/day' : item.price}
      </div>
    </div>
  `).join('');
}

// 2. Render Products list tab
function renderProducts() {
  const tableBody = document.getElementById('productsTableBody');
  if (!tableBody) return;

  const products = items.filter(i => i.type === 'sale');

  if (products.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No products found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = products.map(p => {
    const saveAmt = Math.max(0, p.mrp - p.price);
    const categoryName = p.category ? p.category.replace('-', ' ') : 'Pooja items';
    return `
      <tr>
        <td>
          <div class="item-cell-info">
            <img src="${p.image || 'images/brass-diya.png'}" alt="" class="item-cell-img">
            <span class="item-cell-name">${p.name}</span>
          </div>
        </td>
        <td><span class="badge-category">${categoryName}</span></td>
        <td>
          <div class="price-box">
            <span class="price-selling">₹${p.price}</span>
            <span class="price-mrp">₹${p.mrp}</span>
          </div>
        </td>
        <td>
          <span class="price-save">Save ₹${saveAmt}</span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="action-btn action-btn-edit" onclick="editItem('${p.id}')" title="Edit Product">✏️</button>
            <button class="action-btn action-btn-delete" onclick="deleteItem('${p.id}')" title="Delete Product">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Render Rentals list tab
function renderRentals() {
  const tableBody = document.getElementById('rentalsTableBody');
  if (!tableBody) return;

  const rentals = items.filter(i => i.type === 'rental');

  if (rentals.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No rentals found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = rentals.map(r => `
    <tr>
      <td>
        <div class="item-cell-info">
          <img src="${r.image || 'images/vratam-peta.png'}" alt="" class="item-cell-img">
          <span class="item-cell-name">${r.name}</span>
        </div>
      </td>
      <td>
        <div class="price-box">
          <span class="price-selling">₹${r.price} / day</span>
          ${r.deposit ? `<span style="font-size:0.8rem;color:var(--color-text-muted)">Deposit: ₹${r.deposit}</span>` : ''}
        </div>
      </td>
      <td>
        <span style="font-size:0.875rem; color:var(--color-text-muted); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
          ${r.description || 'No description provided.'}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="action-btn action-btn-edit" onclick="editItem('${r.id}')" title="Edit Rental">✏️</button>
          <button class="action-btn action-btn-delete" onclick="deleteItem('${r.id}')" title="Delete Rental">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Form CRUD Operations
function clearForm() {
  document.getElementById('itemId').value = '';
  document.getElementById('itemName').value = '';
  document.getElementById('itemCategory').value = 'brass-items';
  document.getElementById('itemMrp').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('rentalPrice').value = '';
  document.getElementById('rentalDeposit').value = '';
  document.getElementById('itemDescription').value = '';
  document.getElementById('itemImageUrl').value = '';
  
  const fileInput = document.getElementById('itemImageFile');
  if (fileInput) fileInput.value = '';
  
  hidePreview();

  document.getElementById('itemType').value = 'sale';
  
  // Default forms layout
  document.getElementById('formSubmitBtn').textContent = 'Add Inventory Item';
  toggleFormFields();
}

function openAddForm() {
  clearForm();
  switchTab('add-item');
}

function editItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  clearForm();
  
  document.getElementById('itemId').value = item.id;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCategory').value = item.category || 'brass-items';
  document.getElementById('itemImageUrl').value = item.image || '';
  document.getElementById('itemType').value = item.type;
  document.getElementById('itemDescription').value = item.description || '';

  if (item.image) {
    const filename = item.image.substring(item.image.lastIndexOf('/') + 1) || 'image';
    showPreview(item.image, filename, 'Saved Image');
  } else {
    hidePreview();
  }

  if (item.type === 'rental') {
    document.getElementById('rentalPrice').value = item.price;
    document.getElementById('rentalDeposit').value = item.deposit || '';
  } else {
    document.getElementById('itemMrp').value = item.mrp;
    document.getElementById('itemPrice').value = item.price;
  }

  document.getElementById('formSubmitBtn').textContent = 'Update Item Details';
  toggleFormFields();
  switchTab('add-item');
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('itemId').value;
  const name = document.getElementById('itemName').value.trim();
  const category = document.getElementById('itemCategory').value;
  const fileInput = document.getElementById('itemImageFile');
  let imageUrl = document.getElementById('itemImageUrl').value.trim();
  const type = document.getElementById('itemType').value;
  const description = document.getElementById('itemDescription').value.trim();

  // Handle file upload from PC
  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    showToast('Uploading image to server...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        imageUrl = result.imageUrl; // Saved server URL (e.g. 'images/123456.png')
        showToast('Image uploaded successfully!');
      } else {
        showToast('Image upload failed. Using fallback.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Error uploading image file.');
    }
  }

  let price, mrp, deposit;

  if (type === 'rental') {
    price = parseFloat(document.getElementById('rentalPrice').value);
    const depVal = document.getElementById('rentalDeposit').value.trim();
    deposit = depVal ? parseFloat(depVal) : null;
    mrp = null;
  } else {
    mrp = parseFloat(document.getElementById('itemMrp').value);
    price = parseFloat(document.getElementById('itemPrice').value);
    deposit = null;
  }

  // Construct item record
  const itemData = {
    id: id || 'item-' + Date.now(),
    name,
    category,
    image: imageUrl || (type === 'rental' ? 'images/vratam-peta.png' : 'images/brass-diya.png'),
    type,
    price,
    mrp,
    deposit,
    description
  };

  if (id) {
    // Edit flow
    const index = items.findIndex(i => i.id === id);
    if (index > -1) {
      items[index] = itemData;
      showToast('Item updated successfully!');
    }
  } else {
    // Create flow
    items.push(itemData);
    showToast('New item added to inventory!');
  }

  saveData();
  clearForm();
  switchTab(type === 'rental' ? 'rentals' : 'products');
}

function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  const confirmed = confirm(`Are you sure you want to delete "${item.name}"?`);
  if (!confirmed) return;

  items = items.filter(i => i.id !== id);
  saveData();
  showToast('Item removed from inventory.');

  if (item.type === 'rental') {
    renderRentals();
  } else {
    renderProducts();
  }
}

// Expose functions globally for layout onclick bindings
window.switchTab = switchTab;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.openAddForm = openAddForm;
window.handleLogout = handleLogout;

// Modern Drag-and-Drop Image Upload Zone Logic
function initUploadZone() {
  const dropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('itemImageFile');
  const urlInput = document.getElementById('itemImageUrl');
  const removeBtn = document.getElementById('removePreviewBtn');

  if (!dropzone || !fileInput || !urlInput) return;

  // Click on dropzone triggers hidden file input
  dropzone.addEventListener('click', (e) => {
    if (e.target.closest('#removePreviewBtn')) {
      return;
    }
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });

  // Drag over/enter visual effects
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  // Drop handler
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file (PNG, JPG, JPEG).');
        return;
      }
      
      // Update file input files programmatically
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;

      // Clear url input since local file is selected
      urlInput.value = '';

      // Preview setup
      const reader = new FileReader();
      reader.onload = (e) => {
        const sizeKB = Math.round(file.size / 1024);
        const sizeStr = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';
        showPreview(e.target.result, file.name, sizeStr);
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove preview button handler
  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hidePreview();
      urlInput.value = '';
    });
  }

  // Handle manual URL input for preview
  urlInput.addEventListener('input', () => {
    const url = urlInput.value.trim();
    if (url) {
      fileInput.value = ''; // Reset file input
      const filename = url.substring(url.lastIndexOf('/') + 1) || 'image';
      showPreview(url, filename, 'Remote URL');
    } else {
      hidePreview();
    }
  });
}

function showPreview(src, name, sizeInfo) {
  const preview = document.getElementById('dropzonePreview');
  const prompt = document.querySelector('.dropzone-prompt');
  const previewImg = document.getElementById('previewImage');
  const previewName = document.getElementById('previewName');
  const previewSize = document.getElementById('previewSize');

  if (previewImg) previewImg.src = src;
  if (previewName) previewName.textContent = name;
  if (previewSize) previewSize.textContent = sizeInfo || '';
  
  if (preview) preview.style.display = 'flex';
  if (prompt) prompt.style.display = 'none';
}

function hidePreview() {
  const preview = document.getElementById('dropzonePreview');
  const prompt = document.querySelector('.dropzone-prompt');
  const previewImg = document.getElementById('previewImage');
  const fileInput = document.getElementById('itemImageFile');

  if (preview) preview.style.display = 'none';
  if (prompt) prompt.style.display = 'block';
  if (previewImg) previewImg.src = '';
  if (fileInput) fileInput.value = '';
}

/* ========================================================
   ORDER MANAGEMENT SYSTEM LOGIC
   ======================================================== */

// Notification Service
const NotificationService = {
  generateMessage(order, status) {
    const customerName = order.customerName;
    const orderId = order.id;
    const productList = order.items.map(it => `- ${it.name} x ${it.quantity}`).join('\n');
    
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return `🙏 Veerabhadra Pooja Store\n\nHello ${customerName},\n\nYour order has been confirmed.\n\nOrder ID:\n${orderId}\n\nItems:\n${productList}\n\nWe are preparing your order.\n\nThank you.`;
        
      case 'PACKED':
        return `📦 Veerabhadra Pooja Store\n\nHello ${customerName},\n\nYour order has been packed successfully.\n\nOrder ID:\n${orderId}\n\nItems:\n${productList}\n\nYour order is ready for pickup.\n\nPlease visit our store during business hours.\n\nThank you.`;
        
      case 'READY FOR PICKUP':
        return `📍 Veerabhadra Pooja Store\n\nYour order is now ready for pickup.\n\nOrder ID:\n${orderId}\n\nItems:\n${productList}\n\nPlease collect your order from the store.\n\nThank you.`;
        
      case 'DELIVERED':
        return `🙏 Thank You\n\nYour order has been successfully delivered.\n\nOrder ID:\n${orderId}\n\nItems:\n${productList}\n\nThank you for shopping with Veerabhadra Pooja Store.\n\nWe hope to serve you again.\n\nPlease share your valuable feedback.`;
        
      default:
        return null;
    }
  }
};

function triggerNotificationIfApplicable(order, status) {
  const message = NotificationService.generateMessage(order, status);
  if (!message) return false;

  const now = new Date();
  const dateStr = now.getFullYear() + '-' + 
                  String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(now.getDate()).padStart(2, '0') + ' ' + 
                  String(now.getHours()).padStart(2, '0') + ':' + 
                  String(now.getMinutes()).padStart(2, '0') + ' ' + 
                  (now.getHours() >= 12 ? 'PM' : 'AM');
                  
  const logEntry = {
    type: status.toUpperCase(),
    sentTime: dateStr,
    status: 'Sent',
    mobile: order.mobileNumber,
    message: message
  };
  
  if (!order.notificationHistory) {
    order.notificationHistory = [];
  }
  
  order.notificationHistory.push(logEntry);
  
  console.log(`[Notification Subsystem] Dispatching WhatsApp Notification for ${order.id}:`);
  console.log(`To: ${order.mobileNumber}`);
  console.log(`Message:\n${message}`);
  
  return true;
}

// Set active order status filter
function setOrderFilter(status) {
  activeOrderFilter = status;
  currentOrderPage = 1;
  
  const chips = document.querySelectorAll('#orderStatusChips .filter-chip');
  chips.forEach(chip => {
    if (chip.getAttribute('onclick').includes(`'${status}'`)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  
  renderOrders();
}

// Handle key-in search fields
function handleOrderSearch() {
  orderSearchQuery.id = document.getElementById('searchOrderId').value.trim().toLowerCase();
  orderSearchQuery.name = document.getElementById('searchCustomerName').value.trim().toLowerCase();
  orderSearchQuery.mobile = document.getElementById('searchMobile').value.trim().toLowerCase();
  currentOrderPage = 1;
  renderOrders();
}

// Handle orders page size drop-down
function handleOrdersPerPageChange() {
  const selectEl = document.getElementById('ordersPerPage');
  if (selectEl) {
    ordersPerPage = parseInt(selectEl.value, 10);
  }
  currentOrderPage = 1;
  renderOrders();
}

// Change order list page
function changeOrderPage(direction) {
  currentOrderPage += direction;
  renderOrders();
}

// Render Orders history table
function renderOrders() {
  const tableBody = document.getElementById('ordersTableBody');
  if (!tableBody) return;

  let filtered = orders.filter(order => {
    if (activeOrderFilter !== 'all' && order.status !== activeOrderFilter) {
      return false;
    }
    if (orderSearchQuery.id && !order.id.toLowerCase().includes(orderSearchQuery.id)) {
      return false;
    }
    if (orderSearchQuery.name && !order.customerName.toLowerCase().includes(orderSearchQuery.name)) {
      return false;
    }
    if (orderSearchQuery.mobile && !order.mobileNumber.toLowerCase().includes(orderSearchQuery.mobile)) {
      return false;
    }
    return true;
  });

  // Sort orders descending (VRB100012, VRB100011, etc.)
  filtered.sort((a, b) => {
    const numA = parseInt(a.id.replace('VRB', ''), 10) || 0;
    const numB = parseInt(b.id.replace('VRB', ''), 10) || 0;
    return numB - numA;
  });

  const totalOrders = filtered.length;
  const maxPage = Math.max(1, Math.ceil(totalOrders / ordersPerPage));
  if (currentOrderPage > maxPage) {
    currentOrderPage = maxPage;
  }
  if (currentOrderPage < 1) {
    currentOrderPage = 1;
  }

  const startIndex = (currentOrderPage - 1) * ordersPerPage;
  const endIndex = Math.min(startIndex + ordersPerPage, totalOrders);

  // Update pagination indicators in UI
  const pagStartEl = document.getElementById('paginationStart');
  const pagEndEl = document.getElementById('paginationEnd');
  const pagTotalEl = document.getElementById('paginationTotal');
  const curPageNumEl = document.getElementById('currentPageNum');
  
  if (pagStartEl) pagStartEl.textContent = totalOrders === 0 ? 0 : startIndex + 1;
  if (pagEndEl) pagEndEl.textContent = endIndex;
  if (pagTotalEl) pagTotalEl.textContent = totalOrders;
  if (curPageNumEl) curPageNumEl.textContent = currentOrderPage;

  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  if (prevBtn) prevBtn.disabled = currentOrderPage === 1;
  if (nextBtn) nextBtn.disabled = currentOrderPage === maxPage;

  if (totalOrders === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No matching orders found.</td></tr>`;
    return;
  }

  const pageOrders = filtered.slice(startIndex, endIndex);

  tableBody.innerHTML = pageOrders.map(order => {
    const itemsSummary = order.items.map(it => `${it.name} (x${it.quantity})`).join(', ');
    const statusClass = getStatusBadgeClass(order.status);
    const hasNotification = order.notificationHistory && order.notificationHistory.length > 0;
    const notificationBadge = hasNotification 
      ? `<span class="badge-notification badge-notification-sent">Sent (${order.notificationHistory[order.notificationHistory.length - 1].type})</span>`
      : `<span class="badge-notification badge-notification-none">None</span>`;

    return `
      <tr>
        <td style="font-weight: 700; color: var(--color-primary); font-size: 0.9rem;">${order.id}</td>
        <td style="font-weight: 600;">${order.customerName}</td>
        <td>${order.mobileNumber}</td>
        <td>
          <span style="font-size:0.875rem; color:var(--color-text-dark); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis;" title="${itemsSummary}">
            ${itemsSummary}
          </span>
        </td>
        <td style="font-weight: 700; color: var(--color-text-dark);">₹${order.totalAmount}</td>
        <td style="font-size: 0.85rem; color: var(--color-text-muted); white-space: nowrap;">${order.date}</td>
        <td><span class="badge-category">${order.paymentMethod}</span></td>
        <td>
          <span class="badge-status ${statusClass}">${order.status}</span>
        </td>
        <td>${notificationBadge}</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn action-btn-edit" onclick="viewOrderDetails('${order.id}')" title="View Order Details">👁️</button>
            <select class="table-status-select" onchange="promptStatusChange('${order.id}', this.value); this.value='';" title="Edit Status">
              <option value="" disabled selected>Status...</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Preparing">Preparing</option>
              <option value="Packed">Packed</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending': return 'badge-status-pending';
    case 'Confirmed': return 'badge-status-confirmed';
    case 'Preparing': return 'badge-status-preparing';
    case 'Packed': return 'badge-status-packed';
    case 'Ready for Pickup': return 'badge-status-pickup';
    case 'Delivered': return 'badge-status-delivered';
    case 'Cancelled': return 'badge-status-cancelled';
    default: return 'badge-status-pending';
  }
}

// Details Modal populate & open
function viewOrderDetails(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  populateDetailsModal(order);

  const modal = document.getElementById('orderDetailsModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function populateDetailsModal(order) {
  document.getElementById('modalOrderId').textContent = `Order Details: ${order.id}`;
  document.getElementById('modalCustName').textContent = order.customerName;
  document.getElementById('modalCustMobile').textContent = order.mobileNumber;
  document.getElementById('modalCustAddress').textContent = order.address;
  document.getElementById('modalPaymentMethod').textContent = order.paymentMethod;
  document.getElementById('modalOrderDate').textContent = order.date;
  
  const statusSelect = document.getElementById('modalStatusSelect');
  if (statusSelect) {
    statusSelect.value = order.status;
  }

  const itemsContainer = document.getElementById('modalReceiptItems');
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(it => `
      <tr>
        <td>${it.name}</td>
        <td style="text-align: right;">₹${it.price}</td>
        <td style="text-align: center;">${it.quantity}</td>
        <td style="text-align: right; font-weight: 600;">₹${it.price * it.quantity}</td>
      </tr>
    `).join('');
  }
  
  document.getElementById('modalReceiptTotal').textContent = `₹${order.totalAmount}`;

  const logContainer = document.getElementById('modalNotificationLog');
  if (logContainer) {
    if (!order.notificationHistory || order.notificationHistory.length === 0) {
      logContainer.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1rem; color:var(--color-text-muted);">No notifications sent for this order.</td></tr>`;
    } else {
      logContainer.innerHTML = [...order.notificationHistory].reverse().map(log => {
        return `
          <tr>
            <td><strong style="color:var(--color-primary); font-size:0.75rem;">${log.type}</strong></td>
            <td style="white-space:nowrap;">${log.sentTime}</td>
            <td>${log.mobile}</td>
            <td><span class="badge-notification badge-notification-sent">${log.status}</span></td>
            <td>
              <pre style="max-width:250px; font-size:0.725rem; color:var(--color-text-muted); font-family:inherit; white-space:pre-wrap; border:1px solid var(--color-border); padding:0.4rem; border-radius:4px; max-height:80px; overflow-y:auto; background:#fafafa; margin:0;">${log.message}</pre>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderDetailsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Trigger status update from inside details modal
function triggerStatusUpdateFromModal() {
  const select = document.getElementById('modalStatusSelect');
  if (!select) return;
  
  const title = document.getElementById('modalOrderId').textContent;
  const match = title.match(/VRB\d+/);
  if (!match) return;
  const orderId = match[0];
  const newStatus = select.value;
  
  promptStatusChange(orderId, newStatus);
}

// Status update confirmation flow
function promptStatusChange(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  if (order.status === newStatus) {
    showToast(`Status is already "${newStatus}".`);
    return;
  }

  orderStatusChangeTarget.orderId = orderId;
  orderStatusChangeTarget.newStatus = newStatus;

  const previewEl = document.getElementById('confirmStatusChangePreview');
  if (previewEl) {
    previewEl.textContent = `${orderId}: "${order.status}" ➔ "${newStatus}"`;
  }

  const confirmModal = document.getElementById('statusConfirmationModal');
  if (confirmModal) {
    confirmModal.style.display = 'flex';
  }
}

function closeConfirmationModal() {
  const confirmModal = document.getElementById('statusConfirmationModal');
  if (confirmModal) {
    confirmModal.style.display = 'none';
  }
  orderStatusChangeTarget = { orderId: '', newStatus: '' };
}

async function confirmStatusUpdate() {
  const { orderId, newStatus } = orderStatusChangeTarget;
  if (!orderId || !newStatus) return;

  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return;

  const order = orders[orderIndex];
  order.status = newStatus;
  
  triggerNotificationIfApplicable(order, newStatus);
  
  closeConfirmationModal();
  
  // Asynchronously save update to server
  await saveOrdersToServer(order);
  
  renderOrders();
  renderDashboard();
  
  const detailsModal = document.getElementById('orderDetailsModal');
  if (detailsModal && detailsModal.style.display === 'flex') {
    const modalOrderIdEl = document.getElementById('modalOrderId');
    if (modalOrderIdEl && modalOrderIdEl.textContent.includes(orderId)) {
      populateDetailsModal(order);
    }
  }

  showToast(`Order ${orderId} updated to "${newStatus}"!`);
}

// Bind to window context
window.setOrderFilter = setOrderFilter;
window.handleOrderSearch = handleOrderSearch;
window.handleOrdersPerPageChange = handleOrdersPerPageChange;
window.changeOrderPage = changeOrderPage;
window.viewOrderDetails = viewOrderDetails;
window.closeOrderModal = closeOrderModal;
window.promptStatusChange = promptStatusChange;
window.closeConfirmationModal = closeConfirmationModal;
window.confirmStatusUpdate = confirmStatusUpdate;
window.triggerStatusUpdateFromModal = triggerStatusUpdateFromModal;
window.renderOrders = renderOrders;

