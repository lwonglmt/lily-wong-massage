// Shared chrome (nav + footer) — standalone build (no dev Tweaks panel).
// Highlight active link based on data-page attribute on <body>.

(function () {
  const PAGES = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "about", label: "About", href: "about.html" },
    { key: "services", label: "Services", href: "services.html" },
    { key: "pricing", label: "Pricing", href: "pricing.html" },
    { key: "testimonials", label: "Testimonials", href: "testimonials.html" },
    { key: "faq", label: "FAQ", href: "faq.html" },
    { key: "contact", label: "Contact", href: "contact.html" },
  ];

  const active = document.body.dataset.page || "";

  const topbar = `
    <div class="topbar">
      <div class="topbar-inner">
        <div>
          <span>By appointment · Tue · Wed · Fri · Sat</span>
          <span>·</span>
          <span>Midtown &amp; Long Island</span>
        </div>
        <div>
          <a href="mailto:lwonglmt@gmail.com">lwonglmt@gmail.com</a>
          <span>·</span>
          <span>HSA / FSA · Superbills</span>
        </div>
      </div>
    </div>`;

  const navLinks = PAGES.map(
    (p) =>
      `<a href="${p.href}" class="${p.key === active ? "active" : ""}">${p.label}</a>`
  ).join("");

  const nav = `
    <nav class="nav">
      <div class="nav-inner">
        <a href="index.html" class="brand">
          <span class="brand-mark">L</span>
          <span class="brand-name">
            <span class="brand-name-full">Lily Wong Massage Therapy</span>
            <span class="brand-name-short">Lily Wong</span>
            <small>Integrative Therapeutic Care</small>
          </span>
        </a>
        <div class="nav-links">${navLinks}</div>
        <div class="nav-actions">
          <a href="contact.html" class="btn btn-ghost">Book</a>
          <button class="nav-toggle" type="button" aria-label="Toggle navigation menu" aria-expanded="false">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="2" y1="5" x2="20" y2="5" stroke="currentColor" stroke-width="1.6"/>
              <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" stroke-width="1.6"/>
              <line x1="2" y1="17" x2="20" y2="17" stroke="currentColor" stroke-width="1.6"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>`;

  const footer = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">Lily Wong Massage Therapy</div>
            <p class="footer-brand-tag">Condition-driven integrative massage for chronic pain, injury recovery, and surgical preparation. Midtown Manhattan and Long Island.</p>
          </div>
          <div>
            <h4>Practice</h4>
            <a href="about.html">About</a>
            <a href="services.html">Services</a>
            <a href="pricing.html">Pricing &amp; Packages</a>
            <a href="testimonials.html">Testimonials</a>
          </div>
          <div>
            <h4>Visit</h4>
            <a href="faq.html">FAQ</a>
            <a href="contact.html">Contact</a>
          </div>
          <div>
            <h4>Studio</h4>
            <p>44 E 32nd Street, 8th Floor<br/>New York, NY 10016</p>
            <a href="mailto:lwonglmt@gmail.com">lwonglmt@gmail.com</a>
            <p>Phone provided upon booking</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Lily Wong Massage Therapy PLLC · NYS Licensed Massage Therapist · AMTA Member</span>
          <span>HSA / FSA accepted · Superbill provided on request</span>
        </div>
      </div>
    </footer>`;

  const navHost = document.querySelector('[data-include="nav"]');
  if (navHost) navHost.outerHTML = topbar + nav;

  const footHost = document.querySelector('[data-include="footer"]');
  if (footHost) footHost.outerHTML = footer;

  // Mobile nav toggle
  const navEl = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  if (navEl && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navEl.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navEl.querySelectorAll(".nav-links a").forEach((a) => {
      a.addEventListener("click", () => {
        navEl.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal-on-scroll
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }
})();
