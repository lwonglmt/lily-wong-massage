// Shared chrome (nav + footer) injected into every page.
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

  // Top utility bar
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
            Lily Wong Massage Therapy
            <small>Integrative Therapeutic Care</small>
          </span>
        </a>
        <div class="nav-links">${navLinks}</div>
        <a href="contact.html" class="btn btn-ghost">Book</a>
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
            <a href="contact.html">First Visit Guide</a>
            <a href="contact.html">Hours &amp; Location</a>
            <a href="contact.html">Contact</a>
          </div>
          <div>
            <h4>Studio</h4>
            <a href="#">44 E 32nd Street, 8th Floor<br/>New York, NY 10016</a>
            <a href="mailto:lwonglmt@gmail.com">lwonglmt@gmail.com</a>
            <a href="#">Phone provided upon booking</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Lily Wong Massage Therapy PLLC · NYS Licensed Massage Therapist · AMTA Member</span>
          <span>HSA / FSA accepted · Superbill provided on request</span>
        </div>
      </div>
    </footer>`;

  // Inject
  const navHost = document.querySelector('[data-include="nav"]');
  if (navHost) navHost.outerHTML = topbar + nav;

  const footHost = document.querySelector('[data-include="footer"]');
  if (footHost) footHost.outerHTML = footer;

  // Inject React + Babel + Tweaks panel (loaded once, in order)
  function injectScript(attrs) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      Object.assign(s, attrs);
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  (async () => {
    if (window.React) return; // already loaded
    await injectScript({
      src: "https://unpkg.com/react@18.3.1/umd/react.development.js",
      integrity: "sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L",
      crossOrigin: "anonymous"
    });
    await injectScript({
      src: "https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js",
      integrity: "sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm",
      crossOrigin: "anonymous"
    });
    await injectScript({
      src: "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js",
      integrity: "sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y",
      crossOrigin: "anonymous"
    });
    // Babel transforms scripts of type text/babel — append them as such
    const panelLoader = document.createElement("script");
    panelLoader.type = "text/babel";
    panelLoader.src = "tweaks-panel.jsx";
    document.body.appendChild(panelLoader);
    const appLoader = document.createElement("script");
    appLoader.type = "text/babel";
    appLoader.src = "tweaks-app.jsx";
    document.body.appendChild(appLoader);
  })();

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
