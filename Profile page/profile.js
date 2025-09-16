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
                fullName: form.fullName.value,
                phone: form.phone.value,
                city: form.city.value,
                address: form.address.value,
                postal: form.postal.value,
                birthday: form.birthday.value
            };
            localStorage.setItem('profileInfo', JSON.stringify(data));
            showProfileNotification('اطلاعات با موفقیت ذخیره شد!', 'success');
        });
        // Load info if exists
        const saved = localStorage.getItem('profileInfo');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                if (form[key]) form[key].value = data[key];
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
    n.style.cssText = 'position:fixed;top:120px;right:20px;background:#d4af37;color:#fff;padding:1rem 1.5rem;border-radius:10px;z-index:10000;box-shadow:0 5px 15px rgba(0,0,0,0.2);font-family:Vazirmatn,sans-serif;font-weight:500;max-width:300px;transition:opacity 0.3s;opacity:1;';
    document.body.appendChild(n);
    setTimeout(()=>{n.style.opacity=0;setTimeout(()=>n.remove(),300);},2000);
}

function showProfileModal(title, content) {
    let modal = document.getElementById('profileModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profileModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:11000;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `<div style="background:#fff;border-radius:16px;max-width:400px;width:90vw;padding:2rem 1.5rem;box-shadow:0 8px 32px #0002;position:relative;text-align:center;">
            <button onclick=\"document.getElementById('profileModal').remove()\" style=\"position:absolute;top:10px;left:10px;background:none;border:none;font-size:1.5rem;color:#d4af37;cursor:pointer;\">&times;</button>
            <h2 style=\"color:#d4af37;margin-bottom:1rem;\">${title}</h2>
            <div style=\"margin-bottom:1rem;\">${content}</div>
        </div>`;
        document.body.appendChild(modal);
    }
}
