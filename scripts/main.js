/* ── Theme toggle ── */
const root     = document.documentElement;
const themeBtns = document.querySelectorAll('#theme-btn, #theme-btn-mobile');

function setTheme(isDark) {
  root.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  themeBtns.forEach(btn => {
    const sun   = btn.querySelector('.icon-sun');
    const moon  = btn.querySelector('.icon-moon');
    const label = btn.querySelector('.theme-label');
    if (sun)   sun.style.display   = isDark ? 'none'  : 'block';
    if (moon)  moon.style.display  = isDark ? 'block'   : 'none';
    if (label) label.textContent   = isDark ? 'light'  : 'dark';
  });
}

// Restore saved preference orfallback to system preference 
const saved = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (saved !== null) {
  setTheme(saved === 'dark');
} else {
  setTheme(systemPrefersDark);
}

// Event Listeners for theme toggle buttons
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setTheme(!root.classList.contains('dark'));
  });
});

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


/* ── Navbar shadow on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
  ? '0 4px 24px rgba(0,0,0,0.18)'
    : 'none';
}, { passive: true });

/* Navigation */
const navLinks = document.querySelectorAll(".nav-link");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const sections = document.querySelectorAll("#hero, #about, #skills, #projects, #resume, #contact");

const allNavLinks = document.querySelectorAll(".nav-link, sidebar-link");

allNavLinks.forEach(link => {
  link.addEventListener("click", function () {
    
    const targetId = this.getAttribute("href");
    
    if (!targetId || !targetId.getAttribute("href")) {
      return;
    }
    
    const targetSection = document.querySelector(targetId);
    
    if (!targetSection) {
      return;
    }
    
    closeMenu();
    
  });
});

/* Active Navigation */

function setActiveSection(sectionId) {
  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${sectionId}`
    );
  });
  sidebarLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${sectionId}`
    );
  });
}

/* Intersection Observer */
const observerOptions = {
  root: null,
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
};

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveSection(
          entry.target.id
        );
      }
    });
  },
  observerOptions
);

/* Observe Section */
sections.forEach(section => {
  sectionObserver.observe(section);
});


/* ── Contact form ── */
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitButton = form.querySelector('.form-submit');

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  const formData = new FormData(form);

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  })
    .then(respond => respond.json())
    .then(data => {
      if (data.success) {
        form.style.display = 'none';
        success.style.display = 'flex';
      } else {
        throw new Error(data.message);
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
  
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
  
      alert('Something went wrong. Please try again.');
    });
});