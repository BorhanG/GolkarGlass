(function(){
  // --- Ensure footer css ---
  try{
    if(!document.querySelector('link[href$="/shared/footer.css"],link[href*="shared/footer.css"]')){
      var fcss = document.createElement('link');
      fcss.rel='stylesheet';
      fcss.href='../shared/footer.css';
      document.head.appendChild(fcss);
    }
  }catch(e){console.error('footer.css load',e)}

  // --- Footer injection ---
  function appendFooter(){
    try{
      // If the page already has ANY footer element (local footer), don't inject.
      if (document.querySelector('footer')) return;
      // Allow pages to opt out of footer injection by setting data-no-footer on <body>
      if (document.body && document.body.hasAttribute && document.body.hasAttribute('data-no-footer')) return;
      var footer = document.createElement('footer');
      footer.className = 'footer';
      footer.innerHTML = '\n    <p>&copy; ۲۰۲۵ گلکارگلس. تمامی حقوق محفوظ است. دست\u200cساز با عشق در تهران.</p>\n' +
        '    <div class="social-links">\n' +
        '      <a href="#"><i class="fab fa-instagram"></i></a>\n' +
        '      <a href="#"><i class="fab fa-facebook"></i></a>\n' +
        '      <a href="#"><i class="fab fa-telegram"></i></a>\n' +
        '    </div>';
      document.body.appendChild(footer);
    }catch(e){ console.error('footer init error', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', appendFooter);
  } else {
    appendFooter();
  }
})();
