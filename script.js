/* ELEFTHERI — Der Freiheits-Check — Interaktion */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  var mobileCta = document.getElementById("mobileCta");

  /* ---------- Sticky header state ---------- */
  var onScroll = function () {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("scrolled", y > 8);
    if (mobileCta) mobileCta.classList.toggle("show", y > 640);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var closeNav = function () {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
  };
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeNav();
      toggle.focus();
    }
  });

  /* ---------- Smooth scroll with header offset ---------- */
  var headerH = 68;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
        return;
      }
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top: top, behavior: prefersReduced() ? "auto" : "smooth" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  function prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ---------- Accordions: one open at a time per group ---------- */
  document.querySelectorAll(".accordion").forEach(function (group) {
    var items = group.querySelectorAll("details");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  });

  /* ---------- Entrance animations ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (prefersReduced() || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Form validation (client-side only) ---------- */
  var form = document.getElementById("signupForm");
  var success = document.getElementById("formSuccess");
  if (!form) return;

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var setError = function (name, msg) {
    var slot = form.querySelector('.err[data-for="' + name + '"]');
    var input = form.elements[name];
    var field = input ? input.closest(".field") : null;
    if (slot) slot.textContent = msg || "";
    if (field) field.classList.toggle("invalid", !!msg);
  };

  var validate = function () {
    var ok = true;
    var v = form.elements;

    if (!v.vorname.value.trim()) { setError("vorname", "Bitte gib deinen Vornamen ein."); ok = false; }
    else setError("vorname", "");

    if (!emailRe.test(v.email.value.trim())) { setError("email", "Bitte gib eine gültige E‑Mail‑Adresse ein."); ok = false; }
    else setError("email", "");

    if (!v.situation.value) { setError("situation", "Bitte wähle eine Option."); ok = false; }
    else setError("situation", "");

    if (!v.consent.checked) { setError("consent", "Ohne deine Einwilligung dürfen wir dir nichts schicken."); ok = false; }
    else setError("consent", "");

    return ok;
  };

  form.addEventListener("submit", function (e) {
    if (!validate()) {
      e.preventDefault();
      var firstBad = form.querySelector(".field.invalid input, .field.invalid select");
      if (firstBad) firstBad.focus();
      return;
    }
    // Gültig: der Browser sendet das Formular an das versteckte Brevo-iframe
    // (kein Seitenwechsel). Brevo verschickt danach die Double-Opt-In-Mail.
    // Wir zeigen sofort unsere eigene Bestätigung.
    form.hidden = true;
    success.hidden = false;
    success.setAttribute("tabindex", "-1");
    success.focus({ preventScroll: true });
    success.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "center" });
  });

  // Clear an error as soon as the user fixes the field
  ["vorname", "email", "situation", "consent"].forEach(function (name) {
    var el = form.elements[name];
    if (!el) return;
    var evt = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, function () {
      if (form.querySelector('.field.invalid, .err[data-for="consent"]')) validate();
    });
  });
})();
