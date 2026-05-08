/* ============================================================
   PRAKASH MODEL SCHOOL – assets/js/main.js
   Shared JavaScript for all sub-pages
   ============================================================ */

/* ===== SCROLL PROGRESS BAR ===== */
(function(){
  var bar = document.getElementById('scroll-progress');
  if(!bar) return;
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, {passive:true});
})();

/* ===== NAVBAR SCROLL EFFECT ===== */
(function(){
  var nav = document.getElementById('navbar');
  if(!nav) return;
  window.addEventListener('scroll', function(){
    if(window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }, {passive:true});
})();

/* ===== REVEAL / STAGGER ANIMATIONS ===== */
(function(){
  var revealEls  = document.querySelectorAll('.reveal');
  var staggerEls = document.querySelectorAll('.stagger');

  if(!('IntersectionObserver' in window)){
    revealEls.forEach(function(el){ el.classList.add('visible'); });
    staggerEls.forEach(function(el){ el.classList.add('visible'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15});

  revealEls.forEach(function(el){ io.observe(el); });
  staggerEls.forEach(function(el){ io.observe(el); });
})();

/* ===== ACHIEVEMENT HUB – TAB SWITCHING ===== */
function switchTab(tabId, btn){
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
  // Deactivate all buttons
  document.querySelectorAll('.filter-btn[data-tab]').forEach(function(b){ b.classList.remove('active'); });
  // Activate selected
  var panel = document.getElementById('tab-' + tabId);
  if(panel) panel.classList.add('active');
  if(btn)   btn.classList.add('active');
  // Trigger stagger animations inside newly visible panel
  if(panel){
    panel.querySelectorAll('.stagger,.reveal').forEach(function(el){
      el.classList.add('visible');
    });
  }
}

/* ===== ADMISSION MODAL ===== */
function openAdmissionModal(){
  var overlay = document.getElementById('adm-modal-overlay');
  if(!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  var success = document.getElementById('adm-modal-success');
  var form    = document.getElementById('adm-modal-form');
  if(success) success.style.display = 'none';
  if(form)    form.style.display    = 'block';
}

function closeAdmissionModal(){
  var overlay = document.getElementById('adm-modal-overlay');
  if(!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
(function(){
  var overlay = document.getElementById('adm-modal-overlay');
  if(!overlay) return;
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeAdmissionModal();
  });
})();

// Show stream selector for Class 11/12
function handleModalClassChange(v){
  var box = document.getElementById('m-stream-box');
  if(!box) return;
  box.style.display = (v === 'Class 11' || v === 'Class 12') ? 'block' : 'none';
}

function submitModalAdmission(){
  var parent  = (document.getElementById('m-parent')  || {value:''}).value.trim();
  var email   = (document.getElementById('m-email')   || {value:''}).value.trim();
  var phone   = (document.getElementById('m-phone')   || {value:''}).value.trim();
  var student = (document.getElementById('m-student') || {value:''}).value.trim();
  var cls     = (document.getElementById('m-class')   || {value:''}).value;
  var consent = (document.getElementById('m-consent') || {checked:false}).checked;
  var country = (document.getElementById('m-country') || {value:'+91'}).value;
  var stream  = (document.getElementById('m-stream')  || {value:''}).value;
  var streamBox = document.getElementById('m-stream-box');
  var streamVisible = streamBox && streamBox.style.display === 'block';

  if(!parent || !email || !phone || !student || !cls){
    alert('Please fill all required fields.');
    return;
  }
  if(streamVisible && !stream){
    alert('Please select a Stream.');
    return;
  }
  if(!consent){
    alert('Please give your consent to proceed.');
    return;
  }

  var msg = '*New Admission Enquiry – Prakash Model School*'
    + '%0AParent: '  + encodeURIComponent(parent)
    + '%0AEmail: '   + encodeURIComponent(email)
    + '%0AMobile: '  + encodeURIComponent(country + ' ' + phone)
    + '%0AStudent: ' + encodeURIComponent(student)
    + '%0AClass: '   + encodeURIComponent(cls)
    + (stream ? '%0AStream: ' + encodeURIComponent(stream) : '');

  window.open('https://wa.me/91XXXXXXXXXX?text=' + msg, '_blank');

  var form    = document.getElementById('adm-modal-form');
  var success = document.getElementById('adm-modal-success');
  if(form)    form.style.display    = 'none';
  if(success) success.style.display = 'block';
}

/* ===== LIGHTBOX (shared across all gallery sub-pages) ===== */
var lbImages = [];
var lbIndex  = 0;

function openLightbox(images, index){
  lbImages = images || [];
  lbIndex  = index  || 0;
  var lb = document.getElementById('lightbox');
  if(!lb) return;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbRender();
}

function closeLightbox(){
  var lb = document.getElementById('lightbox');
  if(lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir){
  if(!lbImages.length) return;
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  lbRender();
}

function lbRender(){
  var item = lbImages[lbIndex];
  if(!item) return;

  // Handle both gallery.html structure and sub-page structure
  var imgEl     = document.getElementById('lb-img');
  var titleEl   = document.getElementById('lb-title');
  var counterEl = document.getElementById('lb-counter');
  var captionEl = document.getElementById('lb-caption');

  if(imgEl){
    imgEl.src = item.src || item;
    imgEl.alt = item.title || item.label || '';
  }
  if(titleEl)   titleEl.textContent   = item.title || item.label || '';
  if(counterEl) counterEl.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
  if(captionEl && captionEl.tagName !== 'H4'){
    captionEl.textContent = item.label || item.title || '';
  }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e){
  var lb = document.getElementById('lightbox');
  if(!lb || !lb.classList.contains('open')) return;
  if(e.key === 'ArrowLeft')  lbNav(-1);
  if(e.key === 'ArrowRight') lbNav(1);
  if(e.key === 'Escape')     closeLightbox();
});

/* ===== BACK TO TOP BUTTON (gallery.html) ===== */
(function(){
  var btn = document.getElementById('btt');
  if(!btn) return;
  window.addEventListener('scroll', function(){
    btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }, {passive:true});
})();
  
