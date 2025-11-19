// Profile Page - GolkarGlass

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar logic (reuse from other pages)
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebarMenu.classList.add('open');
            sidebarOverlay.classList.add('open');
            sidebarToggle.classList.add('hide');
            document.body.classList.add('sidebar-open');
        });
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebarMenu.classList.remove('open');
            sidebarOverlay.classList.remove('open');
            sidebarToggle.classList.remove('hide');
            document.body.classList.remove('sidebar-open');
        });
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            sidebarMenu.classList.remove('open');
            sidebarOverlay.classList.remove('open');
            sidebarToggle.classList.remove('hide');
            document.body.classList.remove('sidebar-open');
        });
    }

    // Profile form logic
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Save info to localStorage (demo)
            const data = {
                fullName: form.fullName ? form.fullName.value : '',
                phone: form.phone ? form.phone.value : '',
                birthday: form.birthday ? form.birthday.value : ''
            };
            // Also get address fields from the address section
            const cityInput = document.getElementById('city');
            const postalInput = document.getElementById('postal');
            const addressInput = document.getElementById('address');
            if (cityInput) data.city = cityInput.value;
            if (postalInput) data.postal = postalInput.value;
            if (addressInput) data.address = addressInput.value;
            
            localStorage.setItem('profileInfo', JSON.stringify(data));
            showProfileNotification('اطلاعات با موفقیت ذخیره شد!', 'success');
        });
        // Load info if exists
        const saved = localStorage.getItem('profileInfo');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const input = document.getElementById(key);
                if (input) input.value = data[key];
            });
        }
    }
    // Logout button
    const logoutBtn = document.querySelector('.profile-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showProfileNotification('شما خارج شدید!', 'info');
            setTimeout(()=>window.location.href='../Login page/login.html', 1200);
        });
    }
    // View order buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showProfileModal('جزئیات سفارش', 'اطلاعات سفارش در اینجا نمایش داده می‌شود.');
        });
    });
});

function showProfileNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = 'profile-demo-notification ' + type;
    n.textContent = msg;
    const bgColor = type === 'success' ? '#27ae60' : '#d4af37';
    n.style.cssText = `position:fixed;top:140px;right:20px;background:linear-gradient(135deg, ${bgColor} 0%, ${type === 'success' ? '#229954' : '#b8941f'} 100%);color:#fff;padding:1rem 1.5rem;border-radius:12px;z-index:10000;box-shadow:0 8px 24px rgba(0,0,0,0.2);font-family:Vazirmatn,sans-serif;font-weight:600;max-width:320px;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);opacity:0;transform:translateX(20px);border:1px solid rgba(255,255,255,0.2);`;
    document.body.appendChild(n);
    // Trigger animation
    setTimeout(() => {
        n.style.opacity = '1';
        n.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(()=>{
        n.style.opacity='0';
        n.style.transform='translateX(20px)';
        setTimeout(()=>n.remove(),300);
    }, 3000);
}

function showProfileModal(title, content) {
    let modal = document.getElementById('profileModal');
    if (modal) {
        modal.remove();
    }
    modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);backdrop-filter:blur(5px);z-index:11000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s ease;';
    modal.innerHTML = `<div style="background:linear-gradient(135deg,#fff 0%,#f8f9fa 100%);border-radius:20px;max-width:500px;width:90vw;padding:2rem 1.8rem;box-shadow:0 20px 60px rgba(0,0,0,0.3);position:relative;text-align:center;transform:scale(0.9);transition:transform 0.3s ease;">
        <button onclick="document.getElementById('profileModal').remove()" style="position:absolute;top:15px;left:15px;background:none;border:none;font-size:1.8rem;color:#d4af37;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all 0.3s ease;" onmouseover="this.style.background='rgba(212,175,55,0.1)';this.style.transform='rotate(90deg)'" onmouseout="this.style.background='none';this.style.transform='rotate(0deg)'">&times;</button>
        <h2 style="font-family:'Noto Nastaliq Urdu',serif;color:#d4af37;margin-bottom:1.2rem;font-size:1.6rem;font-weight:700;">${title}</h2>
        <div style="color:#333;margin-bottom:1.5rem;line-height:1.8;font-size:1rem;">${content}</div>
    </div>`;
    document.body.appendChild(modal);
    // Trigger animation
    setTimeout(() => {
        modal.style.opacity = '1';
        const modalContent = modal.querySelector('div');
        if (modalContent) modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.opacity = '0';
            const modalContent = modal.querySelector('div');
            if (modalContent) modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Add avatar edit functionality
document.addEventListener('DOMContentLoaded', function() {
    const avatarEditBtn = document.querySelector('.profile-avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            showProfileNotification('امکان تغییر تصویر به زودی اضافه می‌شود', 'info');
        });
    }
});
