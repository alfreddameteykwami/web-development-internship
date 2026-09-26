/* ── Hamburger + sidebar ── */
const hamburger = document.getElementById('hamburger-btn');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('sidebar-overlay');
const closeBtn  = document.getElementById('sidebar-close');

function openMenu() {
  hamburger.classList.add('open');
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () =>
  sidebar.classList.contains('open') ? closeMenu() : openMenu()
);
overlay.addEventListener('click', closeMenu);
closeBtn.addEventListener('click', closeMenu);

// Close on any sidebar link click
document.querySelectorAll('.sidebar-link[data-close]').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* ── Contact form ── */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display    = 'none';
  success.style.display = 'flex';
});

/* ── Navbar shadow on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 4px 24px rgba(0,0,0,0.18)'
    : 'none';
}, { passive: true });