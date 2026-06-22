/**
 * script.js — ApexPlanet Internship Task 1
 * ==========================================
 * Handles all JavaScript interactivity for the page:
 *   1. Custom modal (alert replacement) triggered by the hero button
 *   2. Navbar background change on scroll
 *   3. Scroll-reveal animation for cards and sections
 *   4. Active nav link highlighting based on scroll position
 *
 * No external libraries used — pure vanilla JavaScript.
 */


/* ------------------------------------------------
   1. MODAL SETUP
      Build and inject a modal element into the DOM
      so we can show a styled alert instead of
      the plain browser window.alert().
------------------------------------------------ */

/**
 * createModal()
 * Dynamically creates the modal HTML and appends
 * it to <body>. Called once on page load.
 */
function createModal() {
  // Create the overlay div (dark backdrop)
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  overlay.id = 'greetModal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modalTitle');

  // Inner modal box with content
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-emoji">👋</div>
      <h2 id="modalTitle">Hello, World!</h2>
      <p>
        Welcome to my first web development project!<br />
        Built with <strong>HTML</strong>, <strong>CSS</strong> &amp;
        <strong>JavaScript</strong> for the ApexPlanet 45-Day Internship.
      </p>
      <button class="modal-close" id="modalCloseBtn">Awesome, thanks! 🚀</button>
    </div>
  `;

  // Add the overlay to the page
  document.body.appendChild(overlay);

  // Clicking outside the modal box closes it
  overlay.addEventListener('click', function (event) {
    // event.target is the overlay itself (not the inner box)
    if (event.target === overlay) {
      closeModal();
    }
  });

  // Close button inside the modal
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
}


/**
 * showGreeting()
 * Called by the "Click to Say Hello" button's onclick.
 * Opens the modal with an animation.
 */
function showGreeting() {
  const modal = document.getElementById('greetModal');
  if (modal) {
    modal.classList.add('is-open');   // CSS transition shows the modal
    // Move focus to the close button for accessibility
    document.getElementById('modalCloseBtn').focus();
  }
}


/**
 * closeModal()
 * Removes the open class so CSS transitions hide the modal.
 */
function closeModal() {
  const modal = document.getElementById('greetModal');
  if (modal) {
    modal.classList.remove('is-open');
    // Return focus to the button that triggered the modal
    document.getElementById('greetBtn').focus();
  }
}


/* ------------------------------------------------
   2. KEYBOARD ACCESSIBILITY FOR MODAL
      Close the modal when the user presses Escape.
------------------------------------------------ */
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});


/* ------------------------------------------------
   3. NAVBAR SCROLL EFFECT
      Add a visible border/shadow to the navbar when
      the user scrolls down, to separate it from content.
------------------------------------------------ */
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      // Scrolled — make navbar more opaque
      navbar.style.background = 'rgba(13, 15, 26, 0.97)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
    } else {
      // At top — semi-transparent
      navbar.style.background = 'rgba(13, 15, 26, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  });
}


/* ------------------------------------------------
   4. SCROLL-REVEAL ANIMATION
      Elements with class .reveal fade + slide in
      as they enter the viewport.
      Uses IntersectionObserver for performance.
------------------------------------------------ */

/**
 * setupScrollReveal()
 * Adds the .reveal class to target elements, then
 * observes them with IntersectionObserver.
 */
function setupScrollReveal() {
  // Select all elements we want to animate on scroll
  const targets = document.querySelectorAll(
    '.card, .resource-card, .skill-item, .hero-content, .hero-visual, .section-heading, .skills-text'
  );

  // Add base styles via inline style for the reveal effect
  targets.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  // Create the observer
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Element is visible — animate in
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Stop observing once revealed (one-time effect)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // Trigger when 12% of element is visible
      rootMargin: '0px', // No extra margin
    }
  );

  // Observe each target element
  targets.forEach(function (el) {
    observer.observe(el);
  });
}


/* ------------------------------------------------
   5. ACTIVE NAV LINK HIGHLIGHT
      Update the active state of nav links as the
      user scrolls through sections.
------------------------------------------------ */
function setupActiveNav() {
  // All sections that have a matching nav link
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Remove active from all links
          navLinks.forEach(function (link) {
            link.style.color = '';  // Reset to CSS default
          });

          // Highlight the matching link
          const activeLink = document.querySelector(
            `nav a[href="#${entry.target.id}"]`
          );
          if (activeLink && !activeLink.classList.contains('nav-cta')) {
            activeLink.style.color = '#eef0ff'; // --text-1
          }
        }
      });
    },
    { threshold: 0.4 } // Section must be 40% visible
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}


/* ------------------------------------------------
   6. STAGGERED CARD ANIMATION
      Give each card a slight delay so they animate
      in one after another instead of all at once.
------------------------------------------------ */
function staggerCards() {
  // Cards grid children
  const cards = document.querySelectorAll('.cards-grid .card');
  cards.forEach(function (card, index) {
    card.style.transitionDelay = (index * 0.1) + 's';
  });

  // Resource cards
  const resCards = document.querySelectorAll('.resource-card');
  resCards.forEach(function (card, index) {
    card.style.transitionDelay = (index * 0.08) + 's';
  });
}


/* ------------------------------------------------
   7. YEAR AUTO-UPDATE (bonus quality touch)
      Keep the copyright year in the footer current.
------------------------------------------------ */
function updateYear() {
  const yearEl = document.querySelector('.footer-small');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.textContent = `© ${currentYear} — HTML • CSS • JavaScript`;
  }
}


/* ------------------------------------------------
   8. INIT — Run everything when the DOM is ready
------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function () {

  // Build and inject the modal
  createModal();

  // Set up navbar scroll behaviour
  handleNavbarScroll();

  // Set up scroll-triggered reveal animations
  setupScrollReveal();

  // Stagger card animation delays
  staggerCards();

  // Active nav link highlighting
  setupActiveNav();

  // Update footer year
  updateYear();

  // Log a friendly message for anyone who opens DevTools 😊
  console.log('%c👋 Hey there, fellow developer!', 'font-size:16px; color:#7c6ef9; font-weight:bold;');
  console.log('%cThis page was built for the ApexPlanet 45-Day Web Dev Internship — Task 1.', 'color:#8b93c4;');
  console.log('%cStack: HTML5 + CSS3 + Vanilla JavaScript. No frameworks. No shortcuts!', 'color:#f97316;');
});
