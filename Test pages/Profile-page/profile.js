// Profile JavaScript
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

    // User profile dropdown functionality
    const userProfileDropdown = document.querySelector('.user-profile-dropdown');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    
    if (userProfileDropdown && userDropdownMenu) {
        let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            userProfileDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdownMenu.classList.toggle('active');
                userProfileDropdown.classList.toggle('active');
            });
        } else {
            userProfileDropdown.addEventListener('mouseenter', function() {
                userDropdownMenu.classList.add('active');
                userProfileDropdown.classList.add('active');
            });
            
            userProfileDropdown.addEventListener('mouseleave', function() {
                userDropdownMenu.classList.remove('active');
                userProfileDropdown.classList.remove('active');
            });
        }
    }

    // Profile tab navigation
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profileTabs = document.querySelectorAll('.profile-tab');
    
    profileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items and tabs
            profileNavItems.forEach(navItem => navItem.classList.remove('active'));
            profileTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding tab
            const targetTab = this.getAttribute('data-tab');
            const targetTabElement = document.getElementById(targetTab);
            if (targetTabElement) {
                targetTabElement.classList.add('active');
            }
        });
    });

    // Avatar upload functionality
    const avatarInput = document.getElementById('avatarInput');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (avatarInput && profileAvatar) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profileAvatar.src = e.target.result;
                        showNotification('تصویر پروفایل با موفقیت تغییر یافت', 'success');
                        
                        // Save to localStorage
                        localStorage.setItem('userProfileAvatar', e.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    showNotification('لطفاً یک فایل تصویری انتخاب کنید', 'error');
                }
            }
        });
    }

    // Load saved avatar from localStorage
    const savedAvatar = localStorage.getItem('userProfileAvatar');
    if (savedAvatar && profileAvatar) {
        profileAvatar.src = savedAvatar;
    }

    // Personal info form handling
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        // Load saved data
        loadPersonalInfo();
        
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePersonalInfo();
        });
        
        // Reset button
        const resetBtn = personalInfoForm.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                loadPersonalInfo();
                showNotification('اطلاعات بازنشانی شد', 'info');
            });
        }
    }

    function loadPersonalInfo() {
        const savedInfo = localStorage.getItem('userPersonalInfo');
        if (savedInfo) {
            const info = JSON.parse(savedInfo);
            Object.keys(info).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = info[key];
                }
            });
        }
    }

    function savePersonalInfo() {
        const formData = new FormData(personalInfoForm);
        const personalInfo = {};
        
        for (let [key, value] of formData.entries()) {
            personalInfo[key] = value;
        }
        
        localStorage.setItem('userPersonalInfo', JSON.stringify(personalInfo));
        showNotification('اطلاعات شخصی با موفقیت ذخیره شد', 'success');
        
        // Update profile name display
        updateProfileName(personalInfo.firstName, personalInfo.lastName);
    }

    function updateProfileName(firstName, lastName) {
        const profileNameElements = document.querySelectorAll('.profile-name');
        profileNameElements.forEach(element => {
            element.textContent = `${firstName} ${lastName}`;
        });
        
        // Update header user name
        const headerUserName = document.querySelector('.user-name');
        if (headerUserName) {
            headerUserName.textContent = `${firstName} ${lastName}`;
        }
    }

    // Password change form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }

    function changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showNotification('رمز عبور جدید و تأیید آن مطابقت ندارند', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('رمز عبور جدید باید حداقل ۶ کاراکتر باشد', 'error');
            return;
        }
        
        // Here you would typically validate current password and update
        showNotification('رمز عبور با موفقیت تغییر یافت', 'success');
        passwordForm.reset();
    }

    // Two-factor authentication
    const enable2faBtn = document.querySelector('.enable-2fa-btn');
    if (enable2faBtn) {
        enable2faBtn.addEventListener('click', function() {
            const statusValue = document.querySelector('.status-value');
            if (statusValue.classList.contains('inactive')) {
                if (confirm('آیا می‌خواهید احراز هویت دو مرحله‌ای را فعال کنید؟')) {
                    statusValue.classList.remove('inactive');
                    statusValue.classList.add('active');
                    statusValue.textContent = 'فعال';
                    this.textContent = 'غیرفعال‌سازی';
                    showNotification('احراز هویت دو مرحله‌ای فعال شد', 'success');
                }
            } else {
                if (confirm('آیا می‌خواهید احراز هویت دو مرحله‌ای را غیرفعال کنید؟')) {
                    statusValue.classList.remove('active');
                    statusValue.classList.add('inactive');
                    statusValue.textContent = 'غیرفعال';
                    this.textContent = 'فعال‌سازی';
                    showNotification('احراز هویت دو مرحله‌ای غیرفعال شد', 'success');
                }
            }
        });
    }

    // Session termination
    const terminateSessionBtn = document.querySelector('.terminate-session-btn');
    if (terminateSessionBtn) {
        terminateSessionBtn.addEventListener('click', function() {
            if (confirm('آیا مطمئن هستید که می‌خواهید این نشست را پایان دهید؟')) {
                this.closest('.session-item').remove();
                showNotification('نشست با موفقیت پایان یافت', 'success');
            }
        });
    }

    // Addresses functionality
    const addAddressBtn = document.getElementById('addAddressBtn');
    const addressesList = document.getElementById('addressesList');
    
    if (addAddressBtn && addressesList) {
        // Load saved addresses
        loadAddresses();
        
        addAddressBtn.addEventListener('click', function() {
            showAddAddressModal();
        });
    }

    function loadAddresses() {
        const savedAddresses = localStorage.getItem('userAddresses');
        if (savedAddresses) {
            const addresses = JSON.parse(savedAddresses);
            renderAddresses(addresses);
        } else {
            // Load sample addresses
            const sampleAddresses = [
                {
                    id: 1,
                    title: 'خانه',
                    address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
                    city: 'تهران',
                    postalCode: '1234567890',
                    phone: '09123456789',
                    isDefault: true
                }
            ];
            renderAddresses(sampleAddresses);
            localStorage.setItem('userAddresses', JSON.stringify(sampleAddresses));
        }
    }

    function renderAddresses(addresses) {
        if (addresses.length === 0) {
            addressesList.innerHTML = '<p class="no-addresses">هنوز آدرسی ثبت نکرده‌اید</p>';
            return;
        }
        
        addressesList.innerHTML = addresses.map(address => `
            <div class="address-item" data-address-id="${address.id}">
                <div class="address-header">
                    <h4>${address.title}</h4>
                    ${address.isDefault ? '<span class="default-badge">پیش‌فرض</span>' : ''}
                </div>
                <div class="address-content">
                    <p>${address.address}</p>
                    <p>شهر: ${address.city}</p>
                    <p>کد پستی: ${address.postalCode}</p>
                    <p>تلفن: ${address.phone}</p>
                </div>
                <div class="address-actions">
                    <button class="edit-address-btn" onclick="editAddress(${address.id})">
                        <i class="fas fa-edit"></i>
                        ویرایش
                    </button>
                    <button class="delete-address-btn" onclick="deleteAddress(${address.id})">
                        <i class="fas fa-trash"></i>
                        حذف
                    </button>
                    ${!address.isDefault ? `<button class="set-default-btn" onclick="setDefaultAddress(${address.id})">
                        <i class="fas fa-star"></i>
                        پیش‌فرض
                    </button>` : ''}
                </div>
            </div>
        `).join('');
    }

    function showAddAddressModal() {
        const modal = document.createElement('div');
        modal.className = 'address-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>افزودن آدرس جدید</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form class="address-form">
                    <div class="form-group">
                        <label>عنوان آدرس</label>
                        <input type="text" name="title" placeholder="مثل: خانه، محل کار" required>
                    </div>
                    <div class="form-group">
                        <label>آدرس کامل</label>
                        <textarea name="address" placeholder="آدرس کامل را وارد کنید" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>شهر</label>
                            <input type="text" name="city" placeholder="نام شهر" required>
                        </div>
                        <div class="form-group">
                            <label>کد پستی</label>
                            <input type="text" name="postalCode" placeholder="کد پستی" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>شماره تلفن</label>
                        <input type="tel" name="phone" placeholder="شماره تلفن" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="save-btn">ذخیره آدرس</button>
                        <button type="button" class="cancel-btn">انصراف</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const addressForm = modal.querySelector('.address-form');
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        
        // Handle form submission
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveNewAddress(this);
            modal.remove();
        });
    }

    function saveNewAddress(form) {
        const formData = new FormData(form);
        const addressData = {
            id: Date.now(),
            title: formData.get('title'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            phone: formData.get('phone'),
            isDefault: false
        };
        
        const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        savedAddresses.push(addressData);
        localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));
        
        renderAddresses(savedAddresses);
        showNotification('آدرس جدید با موفقیت اضافه شد', 'success');
    }

    // Global address functions
    window.editAddress = function(id) {
        showNotification('این بخش در حال توسعه است', 'info');
    };

    window.deleteAddress = function(id) {
        if (confirm('آیا مطمئن هستید که می‌خواهید این آدرس را حذف کنید؟')) {
            const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
            const updatedAddresses = savedAddresses.filter(addr => addr.id !== id);
            localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
            renderAddresses(updatedAddresses);
            showNotification('آدرس با موفقیت حذف شد', 'success');
        }
    };

    window.setDefaultAddress = function(id) {
        const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        savedAddresses.forEach(addr => addr.isDefault = addr.id === id);
        localStorage.setItem('userAddresses', JSON.stringify(savedAddresses));
        renderAddresses(savedAddresses);
        showNotification('آدرس پیش‌فرض تغییر یافت', 'success');
    };

    // Preferences functionality
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', function() {
            savePreferences();
        });
    }

    function savePreferences() {
        const preferences = {
            emailNotifications: document.getElementById('emailNotifications').checked,
            smsNotifications: document.getElementById('smsNotifications').checked,
            browserNotifications: document.getElementById('browserNotifications').checked,
            language: document.getElementById('language').value,
            timezone: document.getElementById('timezone').value,
            publicProfile: document.getElementById('publicProfile').checked,
            shareStats: document.getElementById('shareStats').checked
        };
        
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        showNotification('ترجیحات با موفقیت ذخیره شد', 'success');
    }

    // Load saved preferences
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        Object.keys(preferences).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = preferences[key];
                } else {
                    element.value = preferences[key];
                }
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
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
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
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

    // Initialize profile
    updateCartBadge();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Update cart badge function
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}
