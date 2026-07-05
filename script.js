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

  // Keep the LeadConnector chat widget above the mobile sticky call bar.
  // The widget's fixed elements live in an open shadow root at bottom:20px,
  // which collides with the 64px-tall bar on small screens.
  function liftChatWidget() {
    var cw = document.querySelector("chat-widget");
    if (!cw || !cw.shadowRoot) return false;
    if (cw.shadowRoot.getElementById("imperio-chat-offset")) return true;
    var st = document.createElement("style");
    st.id = "imperio-chat-offset";
    st.textContent =
      "@media (max-width: 720px){" +
      ".lc_text-widget, .lc_text-widget--bubble { bottom: 84px !important; }" +
      "}";
    cw.shadowRoot.appendChild(st);
    return true;
  }
  var chatTries = 0;
  var chatTimer = setInterval(function () {
    if (liftChatWidget() || ++chatTries > 40) clearInterval(chatTimer);
  }, 500);

  // Gallery category filter (Our Work page)
  var filterBar = document.getElementById("galleryFilters");
  var galleryGrid = document.getElementById("galleryGrid");
  if (filterBar && galleryGrid) {
    var items = galleryGrid.querySelectorAll(".g-item");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      items.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-cat") === filter;
        item.classList.toggle("hide", !show);
      });
    });
  }

  // Gallery lightbox slideshow (Our Work page)
  if (galleryGrid) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-prev" aria-label="Previous photo">&#10094;</button>' +
      '<img class="lb-img" alt="" />' +
      '<button class="lb-next" aria-label="Next photo">&#10095;</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector(".lb-img");
    var lbCount = lb.querySelector(".lb-count");
    var slides = [];
    var current = 0;

    function visibleItems() {
      return Array.prototype.filter.call(
        galleryGrid.querySelectorAll(".g-item"),
        function (i) { return !i.classList.contains("hide"); }
      );
    }
    function showSlide(idx) {
      current = (idx + slides.length) % slides.length;
      var item = slides[current];
      lbImg.src = item.getAttribute("href");
      lbImg.alt = item.querySelector("img").alt;
      lbCount.textContent = (current + 1) + " / " + slides.length;
    }
    function openLightbox(item) {
      slides = visibleItems();
      var idx = slides.indexOf(item);
      if (idx < 0) return;
      showSlide(idx);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lb.classList.remove("open");
      lbImg.src = "";
      document.body.style.overflow = "";
    }

    galleryGrid.addEventListener("click", function (e) {
      var item = e.target.closest(".g-item");
      if (!item) return;
      e.preventDefault();
      openLightbox(item);
    });
    lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".lb-prev").addEventListener("click", function () { showSlide(current - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { showSlide(current + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showSlide(current - 1);
      else if (e.key === "ArrowRight") showSlide(current + 1);
    });

    // Swipe navigation on touch devices
    var touchX = null;
    lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) showSlide(dx > 0 ? current - 1 : current + 1);
      touchX = null;
    }, { passive: true });
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
