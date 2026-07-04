// Pooja Store - Main JS Configuration & Interactive Features

const WHATSAPP_PHONE = '919908563384'; // Store Owner WhatsApp Number (with country code, no + or spaces)
// Cart State Management
let cart = [];
let isLoggedIn = false;

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCart();
  initBookingForm();
  updateActiveNavLink();
  checkAuthState();
});

async function checkAuthState() {
  if (typeof supabaseClient === 'undefined') return;
  const { data: { session } } = await supabaseClient.auth.getSession();
  isLoggedIn = !!session;
  const authBtn = document.getElementById('navAuthBtn');
  const mobileAuthLink = document.getElementById('mobileAuthLink');
  const cartTrigger = document.querySelector('.cart-trigger');
  const navLinks = document.querySelector('.nav-links');
  
  if (session) {
    if (authBtn) {
      // Remove settings button from header actions in laptop view
      authBtn.style.display = 'none';
    }
    if (mobileAuthLink) {
      // Show Settings option in the mobile sidebar when logged in
      mobileAuthLink.style.display = 'block';
      mobileAuthLink.innerHTML = `Settings`;
      mobileAuthLink.href = 'dashboard.html';
    }
    if (cartTrigger) {
      cartTrigger.style.display = 'flex';
    }
    
    // Add Settings link to desktop navbar menu if not already present
    if (navLinks && !document.getElementById('navSettingsLink')) {
      const li = document.createElement('li');
      li.id = 'navSettingsLink';
      const isActive = window.location.pathname.includes('dashboard.html');
      li.innerHTML = `<a href="dashboard.html" ${isActive ? 'class="active"' : ''}>Settings</a>`;
      navLinks.appendChild(li);
    }
  } else {
    if (authBtn) {
      authBtn.style.display = 'inline-flex';
      authBtn.textContent = 'Sign In';
      authBtn.href = 'login.html';
      authBtn.className = 'btn btn-secondary btn-sm';
      authBtn.style.borderRadius = 'var(--radius-full)';
      authBtn.style.padding = '0.4rem 1rem';
    }
    if (mobileAuthLink) {
      mobileAuthLink.style.display = 'block';
      mobileAuthLink.innerHTML = `Sign In`;
      mobileAuthLink.href = 'login.html';
    }
    if (cartTrigger) {
      cartTrigger.style.display = 'none';
    }
    
    // Remove Settings link from desktop navbar menu
    const settingsLink = document.getElementById('navSettingsLink');
    if (settingsLink) {
      settingsLink.remove();
    }
  }
}

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
      
      if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
      }

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

// Helper to save order to Supabase cloud database (works across all devices)
async function saveOrderToStorage(orderData) {
  try {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getDate()).padStart(2, '0') + ' ' + 
                    String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm;

    // Get the logged-in user's ID to link order to their account
    let userId = null;
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        userId = session.user.id;
      }
    } catch (e) {
      console.log('Could not get user ID for order:', e);
    }

    const insertData = {
      customer_name: orderData.customerName || 'WhatsApp Customer',
      mobile_number: orderData.mobileNumber || 'Via WhatsApp',
      address: orderData.address || 'Provided via WhatsApp',
      order_date: dateStr,
      items: orderData.items || [],
      total_amount: orderData.totalAmount || 0,
      payment_method: orderData.paymentMethod || 'UPI/Cash',
      status: orderData.status || 'Pending',
      notification_history: []
    };

    // Add user_id if logged in
    if (userId) {
      insertData.user_id = userId;
    }

    const { data, error } = await supabaseClient
      .from('orders')
      .insert(insertData)
      .select();

    if (!error && data && data.length > 0) {
      return data[0].id;
    }
    console.error('Supabase insert error:', error);
  } catch (err) {
    console.error('Error saving order to Supabase:', err);
  }
  // Fallback to offline ID generation
  return 'VRB' + Date.now();
}

// Customer Details - fetches directly from profile, no popup
async function showCustomerDetailsModal(callback) {
  // Check if user is logged in
  if (typeof supabaseClient === 'undefined') {
    alert('Please sign in to place an order.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session || !session.user) {
      alert('Please sign in to place an order.');
      window.location.href = 'login.html';
      return;
    }

    const name = session.user.user_metadata?.full_name || '';
    const phone = session.user.user_metadata?.phone || '';

    if (name && phone) {
      // Profile is complete — proceed directly without any popup
      callback({ name, phone, address: 'Provided via Profile' });
    } else {
      // Profile is incomplete — show modal to collect missing details
      const existing = document.getElementById('collectDetailsModal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'collectDetailsModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000;backdrop-filter:blur(4px);';
      modal.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:28px 24px;width:90%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.3);font-family:'Outfit',sans-serif;">
          <h3 style="margin:0 0 6px;font-size:1.25rem;color:#1a1a2e;font-weight:700;">📋 Complete Your Details</h3>
          <p style="margin:0 0 18px;font-size:0.85rem;color:#666;">Please provide your mobile number to complete your order. This will be saved to your profile.</p>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:0.8rem;font-weight:600;color:#333;margin-bottom:4px;">Full Name *</label>
            <input type="text" id="custName" value="${name}" placeholder="Enter your full name" required
              style="width:100%;padding:10px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:0.9rem;font-family:inherit;box-sizing:border-box;outline:none;transition:border 0.2s;"
              onfocus="this.style.borderColor='#e8630a'" onblur="this.style.borderColor='#ddd'">
          </div>
          <div style="margin-bottom:18px;">
            <label style="display:block;font-size:0.8rem;font-weight:600;color:#333;margin-bottom:4px;">Phone Number *</label>
            <input type="tel" id="custPhone" value="${phone}" placeholder="Enter 10-digit mobile number" required
              style="width:100%;padding:10px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:0.9rem;font-family:inherit;box-sizing:border-box;outline:none;transition:border 0.2s;"
              onfocus="this.style.borderColor='#e8630a'" onblur="this.style.borderColor='#ddd'">
          </div>
          <div id="custError" style="color:#e53e3e;font-size:0.8rem;margin-bottom:10px;display:none;"></div>
          <div style="display:flex;gap:10px;">
            <button id="custCancel" style="flex:1;padding:10px;border:1.5px solid #ddd;border-radius:8px;background:#fff;color:#555;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:inherit;">Cancel</button>
            <button id="custSubmit" style="flex:1;padding:10px;border:none;border-radius:8px;background:linear-gradient(135deg,#e8630a,#ff8c42);color:#fff;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:inherit;">Save & Order</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Focus on first empty field
      setTimeout(() => {
        if (!name) document.getElementById('custName').focus();
        else if (!phone) document.getElementById('custPhone').focus();
      }, 100);

      document.getElementById('custCancel').onclick = () => modal.remove();
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      document.getElementById('custSubmit').onclick = async () => {
        const inputName = document.getElementById('custName').value.trim();
        const inputPhone = document.getElementById('custPhone').value.trim();
        const errorEl = document.getElementById('custError');
        const submitBtn = document.getElementById('custSubmit');

        if (!inputName || !inputPhone) {
          errorEl.textContent = 'Please fill in all fields.';
          errorEl.style.display = 'block';
          return;
        }
        if (!/^\d{10}$/.test(inputPhone)) {
          errorEl.textContent = 'Please enter a valid 10-digit phone number.';
          errorEl.style.display = 'block';
          return;
        }

        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        try {
          // Save details to Supabase account
          const { error } = await supabaseClient.auth.updateUser({
            data: {
              full_name: inputName,
              phone: inputPhone
            }
          });

          if (error) throw error;

          modal.remove();
          callback({ name: inputName, phone: inputPhone, address: 'Provided via Profile' });
        } catch (err) {
          console.error('Error saving profile details:', err);
          errorEl.textContent = err.message || 'Failed to save profile. Please try again.';
          errorEl.style.display = 'block';
          submitBtn.textContent = 'Save & Order';
          submitBtn.disabled = false;
        }
      };
    }
  } catch (e) {
    console.error('Error fetching session:', e);
    alert('Please sign in to place an order.');
    window.location.href = 'login.html';
  }
}

// Simple toast notification
function showToast(message) {
  const existing = document.getElementById('appToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'appToast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: #1a1a2e; color: #fff; padding: 14px 24px; border-radius: 12px;
    font-size: 0.9rem; font-family: 'Outfit', sans-serif; z-index: 99999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3); max-width: 90%; text-align: center;
    animation: toastIn 0.3s ease-out;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Confirmation overlay helper for WhatsApp redirects
function showWhatsAppConfirmationModal(orderId, isRental = false, onConfirm = null) {
  const existing = document.getElementById('whatsappConfirmModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'whatsappConfirmModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:20000;backdrop-filter:blur(4px);';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:32px 24px;width:90%;max-width:400px;box-shadow:0 24px 64px rgba(0,0,0,0.3);font-family:'Outfit',sans-serif;text-align:center;">
      <div style="font-size:3rem;margin-bottom:12px;">💬</div>
      <h3 style="margin:0 0 10px;font-size:1.3rem;color:#1a1a2e;font-weight:700;">Sent the message?</h3>
      <p style="margin:0 0 24px;font-size:0.88rem;line-height:1.5;color:#555;">We opened WhatsApp for you. Please click <strong>"Yes, I Sent It"</strong> below ONLY after you successfully send the message to complete your order.</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button id="confirmWhatsAppSent" style="padding:12px;border:none;border-radius:8px;background:linear-gradient(135deg,#e8630a,#ff8c42);color:#fff;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 12px rgba(232,99,10,0.25);">Yes, I Sent It</button>
        <button id="cancelWhatsAppOrder" style="padding:10px;border:1.5px solid #eee;border-radius:8px;background:#fff;color:#777;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:inherit;transition:background 0.2s;" onmouseover="this.style.background='#fafafa'" onmouseout="this.style.background='#fff'">No, Cancel Order</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('confirmWhatsAppSent').onclick = async () => {
    try {
      showToast('Processing order...');
      const { error } = await supabaseClient
        .from('orders')
        .update({ status: 'Pending' })
        .eq('id', orderId);

      if (error) throw error;
      
      showToast('Order placed successfully!');
      if (onConfirm) onConfirm();
    } catch (e) {
      console.error('Error confirming order:', e);
      showToast('Order confirmed locally.');
      if (onConfirm) onConfirm();
    } finally {
      modal.remove();
    }
  };

  document.getElementById('cancelWhatsAppOrder').onclick = async () => {
    if (confirm("Are you sure you want to cancel this order request? Your cart will be preserved.")) {
      try {
        showToast('Cancelling order...');
        await supabaseClient
          .from('orders')
          .delete()
          .eq('id', orderId);
        
        showToast('Order request cancelled.');
      } catch (e) {
        console.error('Error deleting draft order:', e);
      } finally {
        modal.remove();
      }
    }
  };
}

// Checkout Flow
window.checkoutWhatsApp = () => {
  if (cart.length === 0) return;

  showCustomerDetailsModal(async (customer) => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.qty;
    });

    const orderId = await saveOrderToStorage({
      customerName: customer.name,
      mobileNumber: customer.phone,
      address: customer.address,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.qty
      })),
      totalAmount: total,
      status: 'Draft'
    });

    let message = `Hello! I would like to order the following items from your Pooja Store:\n\n`;
    message += `*ORDER ID:* ${orderId}\n\n`;
    message += `*CUSTOMER DETAILS:*\n`;
    message += `- *Name:* ${customer.name}\n`;
    message += `- *Phone:* ${customer.phone}\n\n`;
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

    // Show confirmation modal
    showWhatsAppConfirmationModal(orderId, false, () => {
      // Clear cart ONLY when successfully confirmed
      cart = [];
      saveCart();
      updateCartBadge();
      renderCart();
    });
  });
};

// Immediate Single Item WhatsApp Order Direct
window.orderDirect = (name, price) => {
  if (price > 0 && !name.includes('Inquiry') && !name.includes('Query')) {
    showCustomerDetailsModal(async (customer) => {
      const orderId = await saveOrderToStorage({
        customerName: customer.name,
        mobileNumber: customer.phone,
        address: customer.address,
        items: [{ name: name, price: price, quantity: 1 }],
        totalAmount: price,
        status: 'Draft'
      });

      let message = `Hello! I want to order the following item:\n\n`;
      message += `*ORDER ID:* ${orderId}\n\n`;
      message += `*CUSTOMER DETAILS:*\n`;
      message += `- *Name:* ${customer.name}\n`;
      message += `- *Phone:* ${customer.phone}\n\n`;
      message += `*Product:* ${name}\n`;
      message += `*Price:* ₹${price}\n`;
      message += `\nPlease confirm availability. Thank you!`;

      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');

      // Show confirmation modal
      showWhatsAppConfirmationModal(orderId, false);
    });
  } else {
    // For inquiries (no price), just open WhatsApp directly
    let message = `Hello! I want to inquire about: ${name}\n\nPlease share details. Thank you!`;
    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  }
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
        paymentMethod: 'UPI/Cash',
        status: 'Draft'
      });

      let message = `Hello! I would like to book a *Vratam Peta Rental* package:\n\n`;
      message += `*ORDER ID:* ${orderId}\n\n`;
      message += `*BOOKING DETAILS:*\n`;
      message += `- *Name:* ${name}\n`;
      message += `- *Phone:* ${phone}\n`;
      message += `- *Booking Date:* ${date}\n`;
      message += `- *Duration:* ${duration} Day(s)\n\n`;
      message += `Please confirm booking availability and details. Thank you!`;

      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');

      // Show confirmation modal
      showWhatsAppConfirmationModal(orderId, true, () => {
        // Reset form upon successful verification
        form.reset();
      });
    });
  }
}

