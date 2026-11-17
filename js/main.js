/* ==========================================================================
   Roma Custom Specialties — Interactions
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Header: solid on scroll ---------- */
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");

  const openMenu = () => {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
    const first = $("a", menu);
    if (first) first.focus();
  };
  const closeMenu = (returnFocus = true) => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    setTimeout(() => { menu.hidden = true; }, 350);
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => (toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu()));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => closeMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") closeMenu();
  });
  // Keep focus inside the menu (toggle button sits above overlay and stays reachable)
  menu.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const items = [...$$("a", menu), toggle];
    const i = items.indexOf(document.activeElement);
    if (e.shiftKey && i === 0) { e.preventDefault(); toggle.focus(); }
    else if (!e.shiftKey && i === items.length - 2) { e.preventDefault(); toggle.focus(); }
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (mq) => {
    if (mq.matches && toggle.getAttribute("aria-expanded") === "true") closeMenu(false);
  });

  /* ---------- Scroll reveal (staggered) ---------- */
  const reveals = $$(".reveal");
  // Stagger siblings that share a parent
  const groups = new Map();
  reveals.forEach((el) => {
    const p = el.parentElement;
    const n = groups.get(p) || 0;
    el.style.setProperty("--d", `${Math.min(n, 6) * 0.08}s`);
    groups.set(p, n + 1);
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav-link");
  const sections = navLinks.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => {
          const active = l.getAttribute("href") === `#${entry.target.id}`;
          l.classList.toggle("is-active", active);
          if (active) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = $("#lightbox");
  const lbImg = $("img", lightbox);
  const lbCap = $("figcaption", lightbox);
  const lbClose = $(".lightbox-close", lightbox);
  let lastTrigger = null;

  const openLightbox = (btn) => {
    lastTrigger = btn;
    lbImg.src = btn.dataset.full;
    lbImg.alt = $("img", btn).alt;
    lbCap.textContent = btn.dataset.caption || "";
    lightbox.hidden = false;
    document.body.classList.add("menu-open");
    lbClose.focus();
  };
  const closeLightbox = () => {
    lightbox.hidden = true;
    lbImg.src = "";
    document.body.classList.remove("menu-open");
    if (lastTrigger) lastTrigger.focus();
  };
  $$(".gallery-item").forEach((btn) => btn.addEventListener("click", () => openLightbox(btn)));
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "Tab") { e.preventDefault(); lbClose.focus(); }
  });

  /* ---------- Quote form ---------- */
  const form = $("#quoteForm");
  const success = $("#formSuccess");
  const fileInput = $("#f-photos");
  const fileNames = $("#fileNames");

  // Float labels on selects once a value is chosen
  $$("select", form).forEach((sel) => {
    sel.addEventListener("change", () => sel.classList.toggle("has-value", !!sel.value));
  });

  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files || []);
    fileNames.textContent = files.length ? files.map((f) => f.name).join(", ") : "";
  });

  const messages = {
    valueMissing: "This field is required.",
    typeMismatch: "Please enter a valid email address.",
    patternMismatch: "Please enter a valid phone number.",
    tooShort: "Please add a few more details.",
  };

  const validateField = (el) => {
    const field = el.closest(".field");
    const err = field && $(".field-error", field);
    if (!field || !err) return true;
    let msg = "";
    if (!el.validity.valid) {
      for (const key of Object.keys(messages)) if (el.validity[key]) { msg = messages[key]; break; }
      msg = msg || "Please check this field.";
    }
    err.textContent = msg;
    field.classList.toggle("is-invalid", !!msg);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err.id === "") err.id = `${el.id}-error`;
    el.setAttribute("aria-describedby", err.id);
    return !msg;
  };

  $$("input[required], select[required], textarea[required]", form).forEach((el) => {
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("is-invalid")) validateField(el); });
    el.addEventListener("change", () => validateField(el));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const required = $$("input[required], select[required], textarea[required]", form);
    const results = required.map(validateField);
    const firstInvalid = required[results.indexOf(false)];
    if (firstInvalid) { firstInvalid.focus(); return; }

    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    btn.textContent = "Sending…";

    /*
     * TODO: connect to a real endpoint. Example with Formspree:
     *   await fetch("https://formspree.io/f/YOUR_ID", { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
     * Until then, the submit is simulated so the success state can be reviewed.
     */
    await new Promise((r) => setTimeout(r, 700));

    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  /* ---------- Footer year in Roman numerals ---------- */
  const toRoman = (num) => {
    const map = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    for (const [v, s] of map) while (num >= v) { out += s; num -= v; }
    return out;
  };
  const yearEl = $("#romanYear");
  if (yearEl) yearEl.textContent = toRoman(new Date().getFullYear());
})();
