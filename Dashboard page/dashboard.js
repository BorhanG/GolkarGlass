// Dashboard JavaScript - Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        sidebarMenu.classList.add('open');
        sidebarOverlay.classList.add('open');
        if (sidebarToggle) sidebarToggle.classList.add('hide');
    }

    function closeSidebar() {
        sidebarMenu.classList.remove('open');
        sidebarOverlay.classList.remove('open');
        if (sidebarToggle) sidebarToggle.classList.remove('hide');
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', openSidebar);
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // User Profile Dropdown Functionality
    const userProfileDropdown = document.querySelector('.user-profile-dropdown');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    
    if (userProfileDropdown && userDropdownMenu) {
        let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            // Touch device behavior
            userProfileDropdown.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (userProfileDropdown.classList.contains('active')) {
                    userProfileDropdown.classList.remove('active');
                    userDropdownMenu.style.opacity = '0';
                    userDropdownMenu.style.visibility = 'hidden';
                    userDropdownMenu.style.transform = 'translate(-50%, -50%) scale(0.9)';
                } else {
                    userProfileDropdown.classList.add('active');
                    userDropdownMenu.style.opacity = '1';
                    userDropdownMenu.style.visibility = 'visible';
                    userDropdownMenu.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!userProfileDropdown.contains(e.target)) {
                    userProfileDropdown.classList.remove('active');
                    userDropdownMenu.style.opacity = '0';
                    userDropdownMenu.style.visibility = 'hidden';
                    userDropdownMenu.style.transform = 'translate(-50%, -50%) scale(0.9)';
                }
            });
        } else {
            // Desktop hover behavior
            userProfileDropdown.addEventListener('mouseenter', function() {
                userDropdownMenu.style.opacity = '1';
                userDropdownMenu.style.visibility = 'visible';
                userDropdownMenu.style.transform = 'translateY(0) scale(1)';
            });
            
            // Hide dropdown when mouse leaves
            userProfileDropdown.addEventListener('mouseleave', function() {
                userDropdownMenu.style.opacity = '0';
                userDropdownMenu.style.visibility = 'hidden';
                userDropdownMenu.style.transform = 'translateY(-15px) scale(0.95)';
            });
        }
        
        // Handle dropdown item clicks
        const dropdownItems = userDropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.querySelector('span').textContent;
                
                // Handle different actions
                switch(action) {
                    case 'داشبورد':
                        console.log('Already on Dashboard');
                        break;
                    case 'سبد خرید':
                        console.log('Navigating to Shopping Cart...');
                        // Add navigation logic here
                        break;
                    case 'علاقه‌مندی‌ها':
                        console.log('Navigating to Wishlist...');
                        // Add navigation logic here
                        break;
                    case 'سفارشات من':
                        console.log('Navigating to My Orders...');
                        // Add navigation logic here
                        break;
                    case 'پروفایل':
                        console.log('Navigating to Profile...');
                        // Add navigation logic here
                        break;
                    case 'تنظیمات':
                        console.log('Navigating to Settings...');
                        // Add navigation logic here
                        break;
                    case 'خروج':
                        console.log('Logging out...');
                        if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
                            window.location.href = '/Login page/login.html';
                        }
                        break;
                }
            });
        });
    }

    // Sidebar user menu functionality
    const sidebarUserItems = document.querySelectorAll('.sidebar-user-item');
    sidebarUserItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;
            
            // Handle different actions (same as dropdown)
            switch(action) {
                case 'داشبورد':
                    console.log('Already on Dashboard');
                    break;
                case 'سبد خرید':
                    console.log('Navigating to Shopping Cart...');
                    break;
                case 'علاقه‌مندی‌ها':
                    console.log('Navigating to Wishlist...');
                    break;
                case 'سفارشات من':
                    console.log('Navigating to My Orders...');
                    break;
                case 'پروفایل':
                    console.log('Navigating to Profile...');
                    break;
                case 'تنظیمات':
                    console.log('Navigating to Settings...');
                    break;
                case 'خروج':
                    console.log('Logging out...');
                    if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
                        window.location.href = '/Login page/login.html';
                    }
                    break;
            }
        });
    });

    // Cart functionality
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        const minusBtn = item.querySelector('.minus');
        const plusBtn = item.querySelector('.plus');
        const qtyNumber = item.querySelector('.qty-number');
        const removeBtn = item.querySelector('.remove-btn');
        
        if (minusBtn && plusBtn && qtyNumber) {
                    minusBtn.addEventListener('click', function() {
            let currentQty = parseInt(qtyNumber.textContent);
            if (currentQty > 1) {
                qtyNumber.textContent = currentQty - 1;
                const result = updateCartTotal();
                saveCartToStorage();
                showNotification(`تعداد ${item.querySelector('.cart-item-title').textContent} به ${currentQty - 1} کاهش یافت`, 'info');
            } else {
                // If quantity is 1, show warning
                showNotification('حداقل تعداد محصول ۱ است', 'error');
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let currentQty = parseInt(qtyNumber.textContent);
            qtyNumber.textContent = currentQty + 1;
            const result = updateCartTotal();
            saveCartToStorage();
            showNotification(`تعداد ${item.querySelector('.cart-item-title').textContent} به ${currentQty + 1} افزایش یافت`, 'info');
        });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                const productName = item.querySelector('.cart-item-title').textContent;
                if (confirm(`آیا مطمئن هستید که می‌خواهید ${productName} را حذف کنید؟`)) {
                    item.style.animation = 'slideOut 0.3s ease forwards';
                    setTimeout(() => {
                        item.remove();
                        const result = updateCartTotal();
                        saveCartToStorage();
                        showNotification(`${productName} از سبد خرید حذف شد`, 'success');
                    }, 300);
                }
            });
        }
    });

    // Wishlist functionality
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    wishlistItems.forEach(item => {
        const addToCartBtn = item.querySelector('.add-to-cart-btn');
        const removeWishlistBtn = item.querySelector('.remove-wishlist-btn');
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productName = item.querySelector('.wishlist-item-title').textContent;
                const productPrice = item.querySelector('.wishlist-item-price').textContent;
                const productImage = item.querySelector('.wishlist-item-image img').src;
                
                // Add item to cart
                addItemToCart(productName, productPrice, productImage);
                
                // Remove from wishlist
                item.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    item.remove();
                    showNotification(`${productName} به سبد خرید اضافه شد!`, 'success');
                }, 300);
            });
        }
        
        if (removeWishlistBtn) {
            removeWishlistBtn.addEventListener('click', function() {
                const productName = item.querySelector('.wishlist-item-title').textContent;
                if (confirm(`آیا مطمئن هستید که می‌خواهید ${productName} را از علاقه‌مندی‌ها حذف کنید؟`)) {
                    item.style.animation = 'slideOut 0.3s ease forwards';
                    setTimeout(() => {
                        item.remove();
                        showNotification(`${productName} از علاقه‌مندی‌ها حذف شد`, 'success');
                    }, 300);
                }
            });
        }
    });

    // Order actions functionality
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.title;
            const orderRow = this.closest('tr');
            const orderNumber = orderRow.querySelector('td:first-child').textContent;
            
            switch(action) {
                case 'مشاهده':
                    console.log(`Viewing order ${orderNumber}`);
                    // Add view order logic here
                    break;
                case 'سفارش مجدد':
                    console.log(`Reordering ${orderNumber}`);
                    if (confirm('آیا مطمئن هستید که می‌خواهید این سفارش را تکرار کنید؟')) {
                        alert('سفارش به سبد خرید اضافه شد!');
                    }
                    break;
                case 'پیگیری':
                    console.log(`Tracking order ${orderNumber}`);
                    alert('پیگیری سفارش در حال بارگذاری...');
                    break;
                case 'لغو':
                    console.log(`Cancelling order ${orderNumber}`);
                    if (confirm('آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟')) {
                        alert('سفارش لغو شد!');
                    }
                    break;
            }
        });
    });

    // Quick actions functionality
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;
            
            switch(action) {
                case 'جستجوی محصولات':
                    console.log('Opening product search...');
                    // Add search functionality here
                    break;
                case 'هدیه':
                    console.log('Opening gift section...');
                    // Add gift functionality here
                    break;
                case 'پشتیبانی':
                    console.log('Opening support...');
                    // Add support functionality here
                    break;
                case 'راهنما':
                    console.log('Opening help...');
                    // Add help functionality here
                    break;
            }
        });
    });

    // Checkout button functionality
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cartItems = document.querySelectorAll('.cart-item');
            if (cartItems.length === 0) {
                showNotification('سبد خرید شما خالی است!', 'error');
                return;
            }
            
            const result = updateCartTotal();
            if (result.total > 0) {
                console.log('Proceeding to checkout...');
                showNotification(`در حال انتقال به صفحه پرداخت برای مبلغ ${result.total.toLocaleString()} تومان...`, 'success');
                // Add checkout logic here
                // For now, just show a success message
                setTimeout(() => {
                    alert('در حال انتقال به صفحه پرداخت...');
                }, 2000);
            }
        });
    }

    // View all buttons functionality
    const viewAllBtns = document.querySelectorAll('.view-all-btn');
    viewAllBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.closest('.dashboard-section');
            const sectionTitle = section.querySelector('.section-title').textContent;
            console.log(`Viewing all ${sectionTitle}...`);
            // Add view all logic here
        });
    });

    // Add item to cart function
    function addItemToCart(productName, productPrice, productImage) {
        const cartItemsContainer = document.querySelector('.cart-items');
        
        // Check if cart is empty and show empty message
        if (cartItemsContainer.querySelector('.empty-cart-message')) {
            cartItemsContainer.innerHTML = '';
        }
        
        // Create new cart item
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${productImage}" alt="${productName}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${productName}</h4>
                <p class="cart-item-price">${productPrice}</p>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus">-</button>
                    <span class="qty-number">1</span>
                    <button class="qty-btn plus">+</button>
                </div>
            </div>
            <button class="remove-btn" title="حذف">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Add event listeners to new cart item
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const qtyNumber = cartItem.querySelector('.qty-number');
        const removeBtn = cartItem.querySelector('.remove-btn');
        
        minusBtn.addEventListener('click', function() {
            let currentQty = parseInt(qtyNumber.textContent);
            if (currentQty > 1) {
                qtyNumber.textContent = currentQty - 1;
                const result = updateCartTotal();
                showNotification(`تعداد ${productName} به ${currentQty - 1} کاهش یافت`, 'info');
            } else {
                showNotification('حداقل تعداد محصول ۱ است', 'error');
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let currentQty = parseInt(qtyNumber.textContent);
            qtyNumber.textContent = currentQty + 1;
            const result = updateCartTotal();
            showNotification(`تعداد ${productName} به ${currentQty + 1} افزایش یافت`, 'info');
        });
        
        removeBtn.addEventListener('click', function() {
            if (confirm(`آیا مطمئن هستید که می‌خواهید ${productName} را حذف کنید؟`)) {
                cartItem.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    cartItem.remove();
                    const result = updateCartTotal();
                    showNotification(`${productName} از سبد خرید حذف شد`, 'success');
                }, 300);
            }
        });
        
        // Add item to cart with animation
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(100%)';
        cartItemsContainer.appendChild(cartItem);
        
        // Animate item entry
        setTimeout(() => {
            cartItem.style.transition = 'all 0.3s ease';
            cartItem.style.opacity = '1';
            cartItem.style.transform = 'translateX(0)';
        }, 100);
        
        // Update cart total and save to storage
        updateCartTotal();
        saveCartToStorage();
    }

    // Format price function
    function formatPrice(price) {
        return price.toLocaleString('fa-IR') + ' تومان';
    }

    // Parse price function
    function parsePrice(priceText) {
        // Remove all non-numeric characters and convert to number
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        return isNaN(price) ? 0 : price;
    }

    // Update cart total function
    function updateCartTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        let total = 0;
        let totalItems = 0;
        
        cartItems.forEach(item => {
            const priceText = item.querySelector('.cart-item-price').textContent;
            const qty = parseInt(item.querySelector('.qty-number').textContent);
            // Extract price by removing non-numeric characters and converting to number
            const price = parsePrice(priceText);
            total += price * qty;
            totalItems += qty;
        });
        
        // Update cart total display
        const totalAmount = document.querySelector('.total-amount');
        if (totalAmount) {
            totalAmount.textContent = formatPrice(total);
        }
        
        // Update cart stats card
        const cartStatsCard = document.querySelector('.cart-icon').closest('.stat-card');
        if (cartStatsCard) {
            const cartNumber = cartStatsCard.querySelector('.stat-number');
            if (cartNumber) {
                cartNumber.textContent = totalItems;
            }
        }
        
        // Update cart badge in header dropdown (if exists)
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }
        
        // Show notification if cart is empty
        if (totalItems === 0) {
            const cartItemsContainer = document.querySelector('.cart-items');
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = '<div class="empty-cart-message">سبد خرید شما خالی است</div>';
            }
        }

        // Show/hide cart action buttons based on cart state
        const clearCartBtn = document.querySelector('.clear-cart-btn');
        const exportCartBtn = document.querySelector('.export-cart-btn');
        const cartInfoBtn = document.querySelector('.cart-info-btn');
        
        if (clearCartBtn) {
            if (totalItems > 0) {
                clearCartBtn.style.display = 'inline-block';
            } else {
                clearCartBtn.style.display = 'none';
            }
        }
        
        if (exportCartBtn) {
            if (totalItems > 0) {
                exportCartBtn.style.display = 'inline-block';
            } else {
                exportCartBtn.style.display = 'none';
            }
        }
        
        if (cartInfoBtn) {
            if (totalItems > 0) {
                cartInfoBtn.style.display = 'inline-block';
            } else {
                cartInfoBtn.style.display = 'none';
            }
        }
        
        return { total, totalItems };
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        const cartItems = document.querySelectorAll('.cart-item');
        const cartData = [];
        
        cartItems.forEach(item => {
            cartData.push({
                name: item.querySelector('.cart-item-title').textContent,
                price: item.querySelector('.cart-item-price').textContent,
                image: item.querySelector('.cart-item-image img').src,
                quantity: parseInt(item.querySelector('.qty-number').textContent)
            });
        });
        
        localStorage.setItem('dashboardCart', JSON.stringify(cartData));
    }

    // Load cart from localStorage
    function loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('dashboardCart');
            if (cartData) {
                const items = JSON.parse(cartData);
                const cartItemsContainer = document.querySelector('.cart-items');
                
                if (Array.isArray(items) && items.length > 0) {
                    cartItemsContainer.innerHTML = '';
                    items.forEach(item => {
                        // Validate item data
                        if (item.name && item.price && item.image && item.quantity) {
                            addItemToCart(item.name, item.price, item.image);
                            // Set the correct quantity
                            const lastCartItem = cartItemsContainer.lastElementChild;
                            if (lastCartItem) {
                                const qtyNumber = lastCartItem.querySelector('.qty-number');
                                if (qtyNumber) {
                                    qtyNumber.textContent = item.quantity;
                                }
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            showNotification('خطا در بارگذاری سبد خرید', 'error');
            // Clear corrupted data
            localStorage.removeItem('dashboardCart');
        }
    }

    // Clear cart function
    function clearCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">سبد خرید شما خالی است</div>';
            updateCartTotal();
            saveCartToStorage();
            showNotification('سبد خرید پاک شد', 'success');
        }
    }

    // Add clear cart button functionality
    const clearCartBtn = document.createElement('button');
    clearCartBtn.className = 'clear-cart-btn';
    clearCartBtn.innerHTML = '<i class="fas fa-trash-alt"></i> پاک کردن سبد';
    clearCartBtn.style.cssText = `
        background: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-left: 1rem;
        transition: all 0.3s ease;
    `;
    
    clearCartBtn.addEventListener('mouseenter', function() {
        this.style.background = '#c0392b';
        this.style.transform = 'scale(1.05)';
    });
    
    clearCartBtn.addEventListener('mouseleave', function() {
        this.style.background = '#e74c3c';
        this.style.transform = 'scale(1)';
    });
    
    clearCartBtn.addEventListener('click', function() {
        if (confirm('آیا مطمئن هستید که می‌خواهید تمام سبد خرید را پاک کنید؟')) {
            clearCart();
        }
    });

    // Insert clear cart button into cart actions
    const cartActions = document.querySelector('.cart-actions');
    if (cartActions) {
        cartActions.appendChild(clearCartBtn);
    }

    // Export cart data function
    function exportCartData() {
        const cartItems = document.querySelectorAll('.cart-item');
        const cartData = [];
        
        cartItems.forEach(item => {
            cartData.push({
                name: item.querySelector('.cart-item-title').textContent,
                price: item.querySelector('.cart-item-price').textContent,
                quantity: parseInt(item.querySelector('.qty-number').textContent)
            });
        });
        
        const dataStr = JSON.stringify(cartData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cart-data.json';
        link.click();
        URL.revokeObjectURL(url);
        
        showNotification('اطلاعات سبد خرید دانلود شد', 'success');
    }

    // Add export cart button
    const exportCartBtn = document.createElement('button');
    exportCartBtn.className = 'export-cart-btn';
    exportCartBtn.innerHTML = '<i class="fas fa-download"></i> دانلود سبد';
    exportCartBtn.style.cssText = `
        background: #3498db;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        font-family: 'Vazirmatn', sans-serif;
    `;
    
    exportCartBtn.addEventListener('mouseenter', function() {
        this.style.background = '#2980b9';
        this.style.transform = 'scale(1.05)';
    });
    
    exportCartBtn.addEventListener('mouseleave', function() {
        this.style.background = '#3498db';
        this.style.transform = 'scale(1)';
    });
    
    exportCartBtn.addEventListener('click', exportCartData);

    // Insert export cart button into cart actions
    if (cartActions) {
        cartActions.appendChild(exportCartBtn);
    }

    // Show cart summary info function
    function showCartSummary() {
        const result = updateCartTotal();
        if (result.totalItems > 0) {
            showNotification(`سبد خرید شما شامل ${result.totalItems} محصول به ارزش ${formatPrice(result.total)} است`, 'info');
        }
    }

    // Add cart summary info button
    const cartInfoBtn = document.createElement('button');
    cartInfoBtn.className = 'cart-info-btn';
    cartInfoBtn.innerHTML = '<i class="fas fa-info-circle"></i> اطلاعات سبد';
    cartInfoBtn.style.cssText = `
        background: #27ae60;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        font-family: 'Vazirmatn', sans-serif;
    `;
    
    cartInfoBtn.addEventListener('mouseenter', function() {
        this.style.background = '#229954';
        this.style.transform = 'scale(1.05)';
    });
    
    cartInfoBtn.addEventListener('mouseleave', function() {
        this.style.background = '#27ae60';
        this.style.transform = 'scale(1)';
    });
    
    cartInfoBtn.addEventListener('click', showCartSummary);

    // Insert cart info button into cart actions
    if (cartActions) {
        cartActions.appendChild(cartInfoBtn);
    }

    // Initialize cart total and load from storage
    updateCartTotal();
    loadCartFromStorage();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animations for stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add hover effects for table rows
    const tableRows = document.querySelectorAll('.orders-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Add confirmation for logout
    const logoutItems = document.querySelectorAll('.logout-item');
    logoutItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
                // Add logout logic here
                window.location.href = '/Login page/login.html';
            }
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Add touch gesture support for mobile
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
            if (diff > 0) {
                // Swipe left - open sidebar
                if (window.innerWidth <= 992) {
                    openSidebar();
                }
            } else {
                // Swipe right - close sidebar
                if (window.innerWidth <= 992) {
                    closeSidebar();
                }
            }
        }
    }

    // Add auto-refresh for stats (optional)
    setInterval(() => {
        // Update stats every 30 seconds
        console.log('Refreshing dashboard stats...');
        // Add stats refresh logic here
    }, 30000);

    // Add notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Example notifications
    setTimeout(() => {
        showNotification('داشبورد شما با موفقیت بارگذاری شد!', 'success');
    }, 1000);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .notification {
            font-family: 'Vazirmatn', sans-serif;
            font-weight: 500;
        }
        
        .stat-card {
            transition: all 0.3s ease;
        }
        
        .orders-table tbody tr {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
