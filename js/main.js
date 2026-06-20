'use strict';

// ── Hamburger menu toggle ──────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
}

// ── Smooth scroll for all in-page anchor links ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });

    // Close mobile menu if open
    if (navLinks && navLinks.classList.contains('nav-open')) {
      navLinks.classList.remove('nav-open');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});

// ── Contact form validation ────────────────────────────────────────────────
/**
 * Pure validation function — returns array of { fieldId, msg } error objects.
 * An empty array means all fields are valid.
 *
 * @param {HTMLFormElement} form
 * @returns {{ fieldId: string, msg: string }[]}
 */
function validateForm(form) {
  const errors = [];
  ['name', 'email', 'message'].forEach(field => {
    const errorEl = document.getElementById(field + '-error');
    if (errorEl) errorEl.textContent = '';
    const el = form.elements[field];
    if (!el || !el.value.trim()) {
      const label = field.charAt(0).toUpperCase() + field.slice(1);
      errors.push({ fieldId: field, msg: `${label} is required.` });
    }
  });
  return errors;
}

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const errors = validateForm(contactForm);

    if (errors.length === 0) {
      contactForm.reset();
      if (formSuccess) formSuccess.hidden = false;
    } else {
      if (formSuccess) formSuccess.hidden = true;
      errors.forEach(({ fieldId, msg }) => {
        const errorEl = document.getElementById(fieldId + '-error');
        if (errorEl) errorEl.textContent = msg;
      });
    }
  });
}

// ── AOS (Animate On Scroll) — custom IntersectionObserver ─────────────────
(function initAOS() {
  const aosElements = document.querySelectorAll('[data-aos]');
  if (!aosElements.length || !('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    aosElements.forEach(el => el.classList.add('aos-animate'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15 });

  aosElements.forEach(el => observer.observe(el));
})();

// ── Scroll-spy active nav link ─────────────────────────────────────────────
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function onScroll() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 80) {
        current = section.id;
      }
    });
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();
