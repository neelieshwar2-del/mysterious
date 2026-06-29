// Pooja Store - Main JS Configuration & Interactive Features

const WHATSAPP_PHONE = '919908563384'; // Store Owner WhatsApp Number (with country code, no + or spaces)
// Cart State Management
let cart = [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCart();
  initBookingForm();
  updateActiveNavLink();
});

// 1. Mobile Menu Functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.close-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');

  if (menuToggle && mobileNav && overlay) {
    const toggleMenu = () => {
      mobileNav.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close mobile nav when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

// 2. Navigation Active State
function updateActiveNavLink() {
  const currentPath = window.location.pathname;
  let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  if (pageName === '') pageName = 'index.html';

  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href') || '';
    
    // Normalize both paths (strip slash and extension) to compare them fairly
    const normLink = linkPath.replace('.html', '').replace(/^\//, '') || 'index';
    const normPage = pageName.replace('.html', '').replace(/^\//, '') || 'index';
    
    if (normLink === normPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 3. Shopping Cart Functionality
function initCart() {
  // Load cart from LocalStorage
  const savedCart = localStorage.getItem('pooja_store_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }

  // Bind Cart Drawer Open / Close Events
  const cartTrigger = document.querySelector('.cart-trigger');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartClose = document.querySelector('.cart-close-btn');
  const cartDrawer = document.querySelector('.cart-drawer');

  if (cartTrigger && cartDrawer && cartOverlay) {
    const toggleCart = () => {
      cartDrawer.classList.toggle('active');
      cartOverlay.classList.toggle('active');
      document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : '';
      renderCart();
    };

    cartTrigger.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    if (cartClose) {
      cartClose.addEventListener('click', toggleCart);
    }
  }

  // Bind Add To Cart buttons
  bindAddToCartButtons();

  // Initial render
  updateCartBadge();
}

function bindAddToCartButtons() {
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const image = btn.getAttribute('data-image');

      addToCart(id, name, price, image);

      // Animate badge
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        badge.style.transform = 'scale(1.4)';
        setTimeout(() => {
          badge.style.transform = 'scale(1)';
        }, 300);
      }

      // Briefly change button text to indicate success
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Added to Cart';
      btn.style.backgroundColor = '#2e7d32';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    });
  });
}

function addToCart(id, name, price, image) {
  const existingIndex = cart.findIndex(item => item.id === id);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart();
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem('pooja_store_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  badges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

function renderCart() {
  const container = document.querySelector('.cart-items-container');
  const totalEl = document.querySelector('.cart-total-value');
  const checkoutBtn = document.querySelector('.cart-checkout-btn');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <span class="cart-empty-icon">🪔</span>
        <h3>Your Cart is Empty</h3>
        <p>Add traditional essentials to your cart and order them via WhatsApp.</p>
        <a href="products.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Browse Products</a>
      </div>
    `;
    if (totalEl) totalEl.textContent = '₹0';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  if (checkoutBtn) checkoutBtn.style.display = 'flex';

  let html = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    totalPrice += itemTotal;

    html += `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">₹${item.price} x ${item.qty} = ₹${itemTotal}</span>
          <div class="cart-item-qty-control">
            <button class="qty-btn minus-qty" onclick="changeQty('${item.id}', -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn plus-qty" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem('${item.id}')">✕</button>
      </div>
    `;
  });

  container.innerHTML = html;
  if (totalEl) totalEl.textContent = `₹${totalPrice}`;
}

// Global scope functions for onclick event handlers
window.changeQty = (id, change) => {
  const index = cart.findIndex(item => item.id === id);
  if (index > -1) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }
};

window.removeCartItem = (id) => {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
};

// Helper to save order to server database (so it displays in Admin panel for all devices)
async function saveOrderToStorage(orderData) {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    if (response.ok) {
      const savedOrder = await response.json();
      return savedOrder.id;
    }
  } catch (err) {
    console.error('Error saving order to server database:', err);
  }
  // Fallback to offline ID generation
  return 'VRB' + Date.now();
}

// Checkout Flow
window.checkoutWhatsApp = async () => {
  if (cart.length === 0) return;

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;
  });

  const orderId = await saveOrderToStorage({
    customerName: 'WhatsApp Customer',
    items: cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.qty
    })),
    totalAmount: total
  });

  let message = `Hello! I would like to order the following items from your Pooja Store:\n\n`;
  message += `*ORDER ID:* ${orderId}\n\n`;
  message += `*ORDER DETAILS:*\n`;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    message += `${index + 1}. *${item.name}* (Qty: ${item.qty}) - ₹${item.price} each [Total: ₹${itemTotal}]\n`;
  });

  message += `\n*TOTAL AMOUNT:* ₹${total}\n\n`;
  message += `Please confirm the order and share delivery details. Thank you!`;

  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');

  // Clear cart
  cart = [];
  saveCart();
  updateCartBadge();
  renderCart();
};

// Immediate Single Item WhatsApp Order Direct
window.orderDirect = async (name, price) => {
  let orderId = '';
  if (price > 0 && !name.includes('Inquiry') && !name.includes('Query')) {
    orderId = await saveOrderToStorage({
      customerName: 'Direct WhatsApp Customer',
      items: [{ name: name, price: price, quantity: 1 }],
      totalAmount: price
    });
  }

  let message = `Hello! I want to order the following item:\n\n`;
  if (orderId) {
    message += `*ORDER ID:* ${orderId}\n\n`;
  }
  message += `*Product:* ${name}\n`;
  if (price > 0) {
    message += `*Price:* ₹${price}\n`;
  }
  message += `\nPlease confirm availability. Thank you!`;

  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
};

// 4. Rental Booking Form
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (form) {
    // Set default date to tomorrow
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const date = document.getElementById('bookingDate').value;
      const duration = parseInt(document.getElementById('duration').value, 10);
      const address = document.getElementById('address').value.trim();

      if (!name || !phone || !date || !address) {
        alert('Please fill out all fields.');
        return;
      }

      const totalAmount = (299 * duration) + 500;
      const orderId = await saveOrderToStorage({
        customerName: name,
        mobileNumber: phone,
        address: address,
        items: [{ name: 'Vratam Peta Setup Kit', price: 299, quantity: duration }],
        totalAmount: totalAmount,
        paymentMethod: 'UPI/Cash'
      });

      let message = `Hello! I would like to book a *Vratam Peta Rental* package:\n\n`;
      message += `*ORDER ID:* ${orderId}\n\n`;
      message += `*BOOKING DETAILS:*\n`;
      message += `- *Name:* ${name}\n`;
      message += `- *Phone:* ${phone}\n`;
      message += `- *Booking Date:* ${date}\n`;
      message += `- *Duration:* ${duration} Day(s)\n`;
      message += `- *Delivery Address:* ${address}\n\n`;
      message += `Please confirm booking availability and details. Thank you!`;

      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

