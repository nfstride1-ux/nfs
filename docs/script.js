(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeNav() {
    if (!links || !toggle) return;
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  var MAX_BYTES = 10 * 1024 * 1024;
  var drop = document.getElementById("plansDrop");
  var fileInput = document.getElementById("plans");
  var fileNameEl = document.getElementById("plansFileName");

  function isPdf(file) {
    if (!file) return false;
    var name = (file.name || "").toLowerCase();
    return file.type === "application/pdf" || name.endsWith(".pdf");
  }

  function showFile(file) {
    if (!fileNameEl || !drop) return;
    if (!file) {
      fileNameEl.hidden = true;
      fileNameEl.textContent = "";
      drop.classList.remove("is-ready");
      return;
    }
    fileNameEl.hidden = false;
    fileNameEl.textContent = file.name + " (" + Math.round(file.size / 1024) + " KB)";
    drop.classList.add("is-ready");
  }

  function setFile(file) {
    if (!file) {
      showFile(null);
      return;
    }
    if (!isPdf(file)) {
      alert("Please drop a PDF plan file.");
      if (fileInput) fileInput.value = "";
      showFile(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      alert("PDF is too large. Keep it under 10 MB.");
      if (fileInput) fileInput.value = "";
      showFile(null);
      return;
    }
    showFile(file);
  }

  if (drop && fileInput) {
    ["dragenter", "dragover"].forEach(function (evt) {
      drop.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        drop.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      drop.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        drop.classList.remove("is-dragover");
      });
    });
    drop.addEventListener("drop", function (e) {
      var files = e.dataTransfer && e.dataTransfer.files;
      if (!files || !files.length) return;
      var file = files[0];
      try {
        var dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
      } catch (err) {
        /* some browsers block setting files; still validate visually */
      }
      setFile(file);
    });
    fileInput.addEventListener("change", function () {
      setFile(fileInput.files && fileInput.files[0]);
    });
    drop.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });
  }

  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      var name = (form.name.value || "").trim();
      var phone = (form.phone.value || "").trim();
      var message = (form.message.value || "").trim();
      var file = fileInput && fileInput.files && fileInput.files[0];

      if (!name || !phone || !message) {
        e.preventDefault();
        alert("Please fill in your name, phone, and project details.");
        return;
      }
      if (file && (!isPdf(file) || file.size > MAX_BYTES)) {
        e.preventDefault();
        alert("Plans must be a PDF under 10 MB.");
        return;
      }
      var btn = document.getElementById("submitBtn");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      /* allow native FormSubmit POST so the PDF is attached */
    });
  }
})();
