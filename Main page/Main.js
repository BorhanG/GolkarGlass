document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.querySelector('.product-title').textContent;
        alert(`${productName} به سبد خرید اضافه شد!`);
    });
});


document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('از پیام شما متشکریم! به زودی با شما تماس خواهیم گرفت.');
    this.reset();
});

document.addEventListener('DOMContentLoaded', function() {
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
});