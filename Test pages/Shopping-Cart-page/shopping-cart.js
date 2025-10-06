// Shopping Cart JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.querySelector('.sidebar-close');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // User profile dropdown functionality
    const userProfileDropdown = document.querySelector('.user-profile-dropdown');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    
    if (userProfileDropdown && userDropdownMenu) {
        let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            // Touch device behavior (click to toggle)
            userProfileDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdownMenu.classList.toggle('active');
                userProfileDropdown.classList.toggle('active');
            });
            
            document.addEventListener('click', function(e) {
                if (!userProfileDropdown.contains(e.target)) {
                    userDropdownMenu.classList.remove('active');
                    userProfileDropdown.classList.remove('active');
                }
            });
        } else {
            // Desktop hover behavior
            userProfileDropdown.addEventListener('mouseenter', function() {
                userDropdownMenu.classList.add('active');
                userProfileDropdown.classList.add('active');
            });
            
            userProfileDropdown.addEventListener('mouseleave', function() {
                userDropdownMenu.classList.remove('active');
                userProfileDropdown.classList.remove('active');
            });
        }
        
        // Handle dropdown item clicks
        const dropdownItems = userDropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.classList.contains('logout-item')) {
                    e.preventDefault();
                    if (confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟')) {
                        console.log('User logged out');
                        // Add logout logic here
                        alert('شما با موفقیت از حساب کاربری خود خارج شدید');
                    }
                } else {
                    console.log('Navigating to:', this.getAttribute('href'));
                }
            });
        });
    }

    // Sidebar user item functionality
    const sidebarUserItems = document.querySelectorAll('.sidebar-user-item');
    sidebarUserItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log('Sidebar user item clicked');
        });
    });

    // Cart functionality
    let cartItems = [];
    
    // Load cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            renderCartItems();
            updateCartSummary();
        } else {
            // Load sample cart items if no saved cart
            loadSampleCartItems();
        }
    }

    // Load sample cart items
    function loadSampleCartItems() {
        cartItems = [
            {
                id: 1,
                name: 'گلدان کریستال ایرانی',
                price: 450000,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                quantity: 1
            },
            {
                id: 2,
                name: 'لیوان‌های شراب لوکس',
                price: 280000,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                quantity: 2
            },
            {
                id: 3,
                name: 'مجموعه کاسه تزئینی',
                price: 320000,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                quantity: 1
            }
        ];
        renderCartItems();
        updateCartSummary();
        saveCartToStorage();
    }

    // Render cart items
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        
        if (cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            return;
        }
        
        cartItemsContainer.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        
        cartItemsContainer.innerHTML = cartItems.map((item, index) => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn minus" onclick="decreaseQuantity(${index})">-</button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn plus" onclick="increaseQuantity(${index})">+</button>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="remove-btn" onclick="removeCartItem(${index})">
                        <i class="fas fa-trash"></i>
                        حذف
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Update cart summary
    function updateCartSummary() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 500000 ? 0 : 50000; // Free shipping over 500,000
        const discount = subtotal > 1000000 ? Math.floor(subtotal * 0.1) : 0; // 10% discount over 1,000,000
        const total = subtotal + shipping - discount;
        
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('subtotal').textContent = formatPrice(subtotal);
        document.getElementById('shipping').textContent = shipping === 0 ? 'رایگان' : formatPrice(shipping);
        document.getElementById('discount').textContent = discount > 0 ? `-${formatPrice(discount)}` : '-0 تومان';
        document.getElementById('totalAmount').textContent = formatPrice(total);
        
        // Update cart badge in header
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
    }

    // Format price function
    function formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    // Increase quantity
    window.increaseQuantity = function(index) {
        cartItems[index].quantity++;
        renderCartItems();
        updateCartSummary();
        saveCartToStorage();
        showNotification(`تعداد ${cartItems[index].name} افزایش یافت`, 'success');
    }

    // Decrease quantity
    window.decreaseQuantity = function(index) {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
            renderCartItems();
            updateCartSummary();
            saveCartToStorage();
            showNotification(`تعداد ${cartItems[index].name} کاهش یافت`, 'info');
        } else {
            showNotification('حداقل تعداد محصول ۱ است', 'error');
        }
    }

    // Remove cart item
    window.removeCartItem = function(index) {
        const itemName = cartItems[index].name;
        if (confirm(`آیا مطمئن هستید که می‌خواهید ${itemName} را حذف کنید؟`)) {
            cartItems.splice(index, 1);
            renderCartItems();
            updateCartSummary();
            saveCartToStorage();
            showNotification(`${itemName} از سبد خرید حذف شد`, 'success');
        }
    }

    // Clear cart
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('آیا مطمئن هستید که می‌خواهید تمام سبد خرید را پاک کنید؟')) {
                cartItems = [];
                renderCartItems();
                updateCartSummary();
                saveCartToStorage();
                showNotification('سبد خرید پاک شد', 'success');
            }
        });
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }

    // Checkout functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartItems.length === 0) {
                showNotification('سبد خرید شما خالی است!', 'error');
                return;
            }
            
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = total > 500000 ? 0 : 50000;
            const discount = total > 1000000 ? Math.floor(total * 0.1) : 0;
            const finalTotal = total + shipping - discount;
            
            showNotification(`در حال انتقال به صفحه پرداخت... مبلغ قابل پرداخت: ${formatPrice(finalTotal)}`, 'info');
            
            // Here you would typically redirect to checkout page
            setTimeout(() => {
                alert('این بخش در حال توسعه است. لطفاً بعداً مراجعه کنید.');
            }, 2000);
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Vazirmatn', sans-serif;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            sidebar.classList.remove('active');
            userDropdownMenu.classList.remove('active');
            userProfileDropdown.classList.remove('active');
        }
    });

    // Touch gesture support for sidebar
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && touchStartX < 100) {
                // Swipe left from left edge - open sidebar
                sidebar.classList.add('active');
            } else if (diff < 0 && sidebar.classList.contains('active')) {
                // Swipe right - close sidebar
                sidebar.classList.remove('active');
            }
        }
    }

    // Initialize cart
    loadCartFromStorage();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
