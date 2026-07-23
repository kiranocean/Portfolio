(function () {
  "use strict";

  /* ---------------- Theme toggle ---------------- */

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var label = toggle.querySelector(".theme-toggle__label");
  var STORAGE_KEY = "kiran-portfolio-theme";

  function systemPrefersDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    label.textContent = isDark ? "DARK" : "LIGHT";
  }

  var stored = localStorage.getItem(STORAGE_KEY);
  applyTheme(stored || (systemPrefersDark() ? "dark" : "light"));

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  /* ---------------- Footer year ---------------- */

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Verification log: staggered type-in ---------------- */

  var logItems = document.querySelectorAll("#log-list li");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    logItems.forEach(function (li) { li.classList.add("is-in"); });
  } else {
    logItems.forEach(function (li, i) {
      setTimeout(function () {
        li.classList.add("is-in");
      }, 280 + i * 160);
    });
  }

  /* ---------------- Scroll reveal ---------------- */

  var revealTargets = document.querySelectorAll(".role-card, .skill-group, .edu-item");
  revealTargets.forEach(function (el) { el.setAttribute("data-reveal", ""); });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Copy deterrence ----------------
     Casual-copy deterrent only: blocks right-click, copy shortcuts, and
     text selection on body content. Does not (and cannot) stop view-source,
     reader mode, or screenshots — this is not real content protection. */

  var toast = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    showToast("✗ right-click disabled");
  });

  document.addEventListener("copy", function (e) {
    e.preventDefault();
    showToast("✗ copy blocked — content is © protected");
  });

  document.addEventListener("keydown", function (e) {
    var key = e.key.toLowerCase();
    var mod = e.ctrlKey || e.metaKey;
    if (mod && (key === "c" || key === "u" || key === "s")) {
      e.preventDefault();
      showToast("✗ action disabled");
    }
  });
})();
