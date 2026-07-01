/* Imperio Construction — interactions (multi-page) */
(function () {
  "use strict";

  // Year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header style on scroll
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  if (header) { onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); }

  // Homepage only: keep the header "Get a Free Estimate" button hidden
  // until the visitor has scrolled past the hero (which contains the form).
  if (document.body.classList.contains("home-page")) {
    var hero = document.getElementById("home");
    if (hero) {
      var onHeroScroll = function () {
        var pastHero = hero.getBoundingClientRect().bottom <= 80;
        document.body.classList.toggle("show-nav-cta", pastHero);
      };
      onHeroScroll();
      window.addEventListener("scroll", onHeroScroll, { passive: true });
      window.addEventListener("resize", onHeroScroll);
    }
  }

  // Mobile nav toggle
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----------------------------------------------------------------
     Placeholder lead forms.
     These will be replaced by GoHighLevel (GHL) embeds. Until then,
     submitting opens the visitor's email app pre-filled, so no lead
     is ever lost during preview / before GHL is connected.
  ---------------------------------------------------------------- */
  var EMAIL = "contact@imperioconstructionllc.com";
  document.querySelectorAll("form.lead-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body =
        "Name: " + (d.get("name") || "") + "\n" +
        "Phone: " + (d.get("phone") || "") + "\n" +
        "Email: " + (d.get("email") || "") + "\n" +
        "Service: " + (d.get("service") || "") + "\n\n" +
        (d.get("message") || "");
      window.location.href =
        "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent("Estimate Request — " + (d.get("name") || "Website")) +
        "&body=" + encodeURIComponent(body);
    });
  });
})();
