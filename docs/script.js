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

/* =========================================================
   Secret door portal: the brickwork around the hero logo
   lights up joint by joint (clockwise from the tap), then the
   door swings open to the left and we walk through to videos.
   ========================================================= */
(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  var portal = document.getElementById("portal");
  if (!hero || !portal) return;

  var DEST = "videos.html";
  var TILE_COLS = 8;            // bricks across brick-wall.jpg
  var BRICK_RATIO = 55 / 180;   // course height / brick length (incl. joints)
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var svg = portal.querySelector(".portal__svg");
  var glowPath = portal.querySelector(".portal__trace--glow");
  var corePath = portal.querySelector(".portal__trace--core");
  var hotPath = portal.querySelector(".portal__trace--hot");
  var hintPath = portal.querySelector(".portal__hint");
  var trailPath = portal.querySelector(".portal__hint-trail");
  var ghostPath = portal.querySelector(".portal__ghost");
  var pulses = portal.querySelector(".portal__pulses");
  var tip = portal.querySelector(".portal__tip");
  var spark = portal.querySelector(".portal__spark");
  var halo = portal.querySelector(".portal__spark-halo");
  var hit = portal.querySelector(".portal__hit");
  var leaf = portal.querySelector(".portal__leaf");
  var faces = portal.querySelectorAll(".portal__face");
  var logoHolder = portal.querySelector(".portal__logo");
  var light = portal.querySelector(".portal__light");
  var spill = portal.querySelector(".portal__spill");
  var flash = document.getElementById("portalFlash");
  var btn = document.getElementById("portalBtn");
  var content = hero.querySelector(".hero__content");
  var eyebrow = content && content.querySelector(".eyebrow");
  var title = content && content.querySelector(".hero__title");
  var slogan = content && content.querySelector(".hero__slogan");
  var lead = content && content.querySelector(".hero__lead");
  if (!eyebrow || !title || !slogan) return;

  var geo = null;
  var busy = false;
  var timers = [];

  function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function textBox(el) {
    var r = document.createRange();
    r.selectNodeContents(el);
    return r.getBoundingClientRect();
  }

  function rel(r, h) {
    return { l: r.left - h.left, t: r.top - h.top, r: r.right - h.left, b: r.bottom - h.top, w: r.width, h: r.height };
  }

  function layout() {
    if (busy) return;
    var hr = hero.getBoundingClientRect();
    var W = hero.clientWidth;
    var H = hero.clientHeight;
    if (!W || !H) return;

    var cx = Math.round(W / 2);
    var slog0 = textBox(slogan);
    var logoW = Math.max(eyebrow.getBoundingClientRect().width,
      textBox(title.querySelector(".hero__brand") || title).width,
      textBox(title.querySelector(".hero__sub") || title).width, slog0.width);

    // Door size: narrow courses N bricks, wide courses N+1 (stretcher bond),
    // N grows with the screen. Bricks sized so the wide courses fit on screen.
    var N = W >= 1100 ? 5 : W >= 700 ? 4 : 3;
    var pad = Math.max(10, Math.min(26, logoW * 0.06));
    var bl = (logoW + pad * 2) / 3;
    bl = Math.min(bl, (W - 28) / (N + 1), 132);
    bl = Math.max(bl, 56);
    var ch = bl * BRICK_RATIO;

    // Keep the intro text inside the narrow courses so it rides on the door.
    if (lead) {
      var inner = N * bl - Math.max(24, bl * 0.34);
      lead.style.maxWidth = Math.round(Math.min(540, inner)) + "px";
    }
    hr = hero.getBoundingClientRect();
    H = hero.clientHeight;

    var eb = rel(eyebrow.getBoundingClientRect(), hr);
    var actionsEl = content.querySelector(".hero__actions");
    var ab = rel((actionsEl || slogan).getBoundingClientRect(), hr);
    var teaser = document.getElementById("portalTeaser");
    var limit = teaser ? rel(teaser.getBoundingClientRect(), hr).t - 8 : H - 6;
    var cTop = eb.t, cBot = ab.b;

    // Door spans pill -> CTA with room for the stepped arch above.
    var archRows = Math.max(0, (N + 1) - Math.max(2, N - 2));
    var mTop = ch * (archRows * 0.55 + 0.4);
    var mBot = ch * 0.9;
    var rows = Math.ceil((cBot + mBot - (cTop - mTop)) / ch);
    rows = Math.max(7, Math.min(rows, Math.floor((limit - 4) / ch)));
    var doorH = rows * ch;
    var top = cBot + mBot - doorH;
    if (top + doorH > limit) top = limit - doorH;
    top = Math.max(top, 4);

    // Course widths: stepped arch up to N+1, then N / N+1 alternating.
    var widths = [];
    var wv = Math.max(2, N - 2);
    for (var i = 0; i < rows; i++) {
      if (wv < N + 1 && i > 0) wv++;
      else if (i > 0) wv = widths[i - 1] === N + 1 ? N : N + 1;
      widths.push(wv);
    }

    // Align the tile: bed joint on the door top; a head joint on the
    // centre line in courses with an even brick count.
    var tileW = bl * TILE_COLS;
    var wallX = cx - Math.ceil(cx / bl) * bl;
    var wallY = top - Math.ceil(top / (2 * ch)) * 2 * ch;
    if (widths[0] % 2 === 1) wallY -= ch;
    hero.style.setProperty("--wall-w", tileW + "px");
    hero.style.setProperty("--wall-x", wallX + "px");
    hero.style.setProperty("--wall-y", wallY + "px");
    hero.style.setProperty("--hero-w", W + "px");
    hero.style.setProperty("--hero-h", H + "px");

    // Secret business-card brick: the first complete brick, top-left of the wall.
    var cardBrick = document.getElementById("cardBrick");
    if (cardBrick) {
      var r0 = Math.ceil((-wallY - 0.5) / ch);
      var by = wallY + r0 * ch;
      var xo = (r0 % 2 === 0) ? wallX : wallX + bl / 2;
      var bx = xo + Math.ceil((-xo - 0.5) / bl) * bl;
      cardBrick.style.left = bx + "px";
      cardBrick.style.top = by + "px";
      cardBrick.style.width = bl + "px";
      cardBrick.style.height = ch + "px";
      cardBrick.style.setProperty("--brick-positions",
        [-bx + "px " + -by + "px", -bx + "px " + -by + "px", (wallX - bx) + "px " + (wallY - by) + "px"].join(", "));
    }

    var maxHalf = 0;
    widths.forEach(function (n) { maxHalf = Math.max(maxHalf, (n / 2) * bl); });

    // Outline, clockwise on screen: down the right jamb, back up the left.
    var pts = [];
    var k;
    for (k = 0; k < rows; k++) {
      var hw = (widths[k] / 2) * bl;
      pts.push([cx + hw, top + k * ch], [cx + hw, top + (k + 1) * ch]);
    }
    for (k = rows - 1; k >= 0; k--) {
      var hw2 = (widths[k] / 2) * bl;
      pts.push([cx - hw2, top + (k + 1) * ch], [cx - hw2, top + k * ch]);
    }
    pts = simplify(pts);

    var box = { l: cx - maxHalf, t: top, w: maxHalf * 2, h: doorH };
    geo = { W: W, H: H, cx: cx, bl: bl, ch: ch, pts: pts, box: box, rows: rows, widths: widths };

    // Door leaf + light share the outline as a clip-path.
    var poly = "polygon(" + pts.map(function (p) {
      return (p[0] - box.l).toFixed(2) + "px " + (p[1] - box.t).toFixed(2) + "px";
    }).join(",") + ")";
    [leaf, light].forEach(function (el) {
      el.style.left = box.l + "px";
      el.style.top = box.t + "px";
      el.style.width = box.w + "px";
      el.style.height = box.h + "px";
    });
    light.style.clipPath = poly;
    light.style.webkitClipPath = poly;
    for (var f = 0; f < faces.length; f++) {
      faces[f].style.clipPath = poly;
      faces[f].style.webkitClipPath = poly;
    }
    leaf.style.setProperty(
      "--door-positions",
      [-box.l + "px " + -box.t + "px", -box.l + "px " + -box.t + "px", (wallX - box.l) + "px " + (wallY - box.t) + "px"].join(", ")
    );
    var stage = portal.querySelector(".portal__stage");
    stage.style.perspectiveOrigin = (box.l + box.w / 2) + "px " + (box.t + box.h / 2) + "px";
    stage.style.perspective = Math.max(1300, box.w * 2.6) + "px";

    var sw = box.w * 2.2;
    spill.style.width = sw + "px";
    spill.style.height = sw + "px";
    spill.style.left = (cx - sw / 2) + "px";
    spill.style.top = (box.t + box.h / 2 - sw / 2) + "px";

    // Generous, invisible hit area around the door.
    var px = bl * 0.3;
    var py = ch * 0.5;
    var hl = Math.max(0, box.l - px), ht = Math.max(0, box.t - py);
    hit.style.left = hl + "px";
    hit.style.top = ht + "px";
    hit.style.width = (Math.min(W, box.l + box.w + px) - hl) + "px";
    hit.style.height = (Math.min(H, limit, box.t + box.h + py) - ht) + "px";
    ghostPath.setAttribute("d", pathFrom({ i: 0, p: pts[0] }).d + " Z");

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    portal.classList.add("is-ready");
  }

  function simplify(pts) {
    var out = [];
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var q = out[out.length - 1];
      if (q && Math.abs(q[0] - p[0]) < 0.01 && Math.abs(q[1] - p[1]) < 0.01) continue;
      out.push(p);
    }
    // drop collinear points
    var res = [];
    var n = out.length;
    for (var j = 0; j < n; j++) {
      var a = out[(j - 1 + n) % n], b = out[j], c = out[(j + 1) % n];
      var cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (Math.abs(cross) > 0.01) res.push(b);
    }
    return res;
  }

  function nearestOnOutline(x, y) {
    var pts = geo.pts, best = null;
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i], b = pts[(i + 1) % pts.length];
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var len2 = dx * dx + dy * dy || 1;
      var t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / len2));
      var px = a[0] + dx * t, py = a[1] + dy * t;
      var d = (px - x) * (px - x) + (py - y) * (py - y);
      if (!best || d < best.d) best = { d: d, i: i, p: [px, py] };
    }
    return best;
  }

  // Closed path that starts at the tap point and runs clockwise back to it.
  function pathFrom(start) {
    var pts = geo.pts, n = pts.length;
    var seq = [start.p];
    for (var k = 1; k <= n; k++) seq.push(pts[(start.i + k) % n]);
    seq.push(start.p);
    var d = "M" + seq.map(function (p) { return p[0].toFixed(2) + " " + p[1].toFixed(2); }).join(" L");
    var len = 0;
    for (var j = 1; j < seq.length; j++) {
      len += Math.abs(seq[j][0] - seq[j - 1][0]) + Math.abs(seq[j][1] - seq[j - 1][1]);
    }
    return { d: d, len: len };
  }

  function buildLogoClone() {
    logoHolder.innerHTML = "";
    var lr = leaf.getBoundingClientRect();
    [eyebrow, title, slogan, lead, content.querySelector(".hero__actions")].forEach(function (el) {
      if (!el) return;
      var r = el.getBoundingClientRect();
      var c = el.cloneNode(true);
      c.removeAttribute("id");
      if (c.tagName === "H1") {
        var d = document.createElement("div");
        d.className = c.className;
        d.innerHTML = c.innerHTML;
        c = d;
      }
      c.style.left = (r.left - lr.left) + "px";
      c.style.top = (r.top - lr.top) + "px";
      c.style.width = r.width + "px";
      if (el === eyebrow) c.style.width = "auto";
      logoHolder.appendChild(c);
    });
  }

  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function go() {
    try { sessionStorage.setItem("nfsPortal", String(Date.now())); } catch (e) { /* private mode */ }
    window.location.href = DEST;
  }

  function open(clientX, clientY) {
    if (busy) return;
    if (!geo) layout();
    if (!geo) { go(); return; }
    busy = true;
    clearTimeout(tipTimer);
    portal.classList.remove("is-hover", "show-tip");
    portal.classList.add("is-busy");

    if (reduceMotion) {
      flash.classList.add("is-quick");
      later(go, 320);
      return;
    }

    var hr = hero.getBoundingClientRect();
    var x, y;
    if (clientX == null) {
      // keyboard / nav link: start at the threshold, bottom centre of the door
      x = geo.cx; y = geo.box.t + geo.box.h;
    } else {
      x = clientX - hr.left; y = clientY - hr.top;
    }
    var start = nearestOnOutline(x, y);
    var route = pathFrom(start);
    [glowPath, corePath, hotPath].forEach(function (p) { p.setAttribute("d", route.d); });
    glowPath.style.strokeDasharray = corePath.style.strokeDasharray = route.len + " " + route.len;
    var hot = Math.min(route.len * 0.12, geo.bl * 0.9);
    hotPath.style.strokeDasharray = hot + " " + (route.len + hot);

    // Swap in the door leaf (pixel-identical copy of wall + logo).
    buildLogoClone();
    portal.classList.add("is-armed", "is-tracing");
    hero.classList.add("portal-armed");

    var TRACE = 1900;
    var t0 = null;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var t = Math.min(1, (ts - t0) / TRACE);
      var e = ease(t);
      var shown = route.len * e;
      glowPath.style.strokeDashoffset = corePath.style.strokeDashoffset = String(route.len - shown);
      hotPath.style.strokeDashoffset = String(-(shown - hot));
      var pt = corePath.getPointAtLength(Math.max(0, Math.min(route.len, shown)));
      spark.setAttribute("cx", pt.x); spark.setAttribute("cy", pt.y);
      halo.setAttribute("cx", pt.x); halo.setAttribute("cy", pt.y);
      halo.setAttribute("r", String(15 + Math.sin(ts / 45) * 4));
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        portal.classList.add("is-complete");
        later(swing, 380);
      }
    }
    requestAnimationFrame(frame);
  }

  function swing() {
    portal.classList.add("is-open");
    hero.classList.add("portal-opening");
    later(walk, 1050);
  }

  function walk() {
    var hr = hero.getBoundingClientRect();
    var ox = geo.box.l + geo.box.w / 2;
    var oy = geo.box.t + geo.box.h / 2;
    hero.style.transformOrigin = ox + "px " + oy + "px";
    flash.style.setProperty("--flash-x", (hr.left + ox) + "px");
    flash.style.setProperty("--flash-y", (hr.top + oy) + "px");
    hero.classList.add("portal-walk");
    flash.classList.add("is-on");
    later(go, 650);
  }

  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    busy = false;
    portal.classList.remove("is-busy", "is-armed", "is-tracing", "is-complete", "is-open");
    hero.classList.remove("portal-armed", "portal-opening", "portal-walk");
    hero.style.transformOrigin = "";
    flash.classList.remove("is-on", "is-quick");
    logoHolder.innerHTML = "";
    layout();
  }

  // ---- Triggers ----
  hit.addEventListener("click", function (e) {
    e.preventDefault();
    open(e.clientX, e.clientY);
  });

  if (btn) {
    btn.addEventListener("click", function () { open(null, null); });
  }

  function openFromNav(e) {
    if (busy) { e.preventDefault(); return; }
    e.preventDefault();
    var heroTop = hero.getBoundingClientRect().top + window.pageYOffset;
    var needScroll = window.pageYOffset > heroTop + 40;
    if (needScroll) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      var waited = 0;
      (function waitTop() {
        if (window.pageYOffset <= 2 || waited > 1200) {
          setTimeout(function () { open(null, null); }, 150);
        } else {
          waited += 50;
          setTimeout(waitTop, 50);
        }
      })();
    } else {
      open(null, null);
    }
  }

  document.querySelectorAll("[data-portal-trigger]").forEach(function (a) {
    a.addEventListener("click", openFromNav);
  });

  // ---- Hint: every ~4-5s a bright cyan glow runs part-way round the door
  //      outline and a few joints pulse; the teaser note glows with it. ----
  var teaserEl = document.getElementById("portalTeaser");
  var SVGNS = "http://www.w3.org/2000/svg";

  function hint() {
    if (busy || !geo || document.hidden) return;
    var hr = hero.getBoundingClientRect();
    if (hr.bottom < 0 || hr.top > window.innerHeight) return;
    if (teaserEl) {
      teaserEl.classList.remove("is-glow");
      void teaserEl.offsetWidth;
      teaserEl.classList.add("is-glow");
    }
    if (reduceMotion || !hintPath.animate) return;
    var pts = geo.pts;
    var i0 = Math.floor(Math.random() * pts.length);
    var route = pathFrom({ i: i0, p: pts[i0] });
    var L = route.len;
    var run = L * (0.22 + Math.random() * 0.08);
    var dash = Math.min(L * 0.06, geo.bl * 1.1);
    hintPath.setAttribute("d", route.d);
    trailPath.setAttribute("d", route.d);
    hintPath.style.strokeDasharray = dash + " " + (L + dash);
    trailPath.style.strokeDasharray = run + " " + (L + run);
    var dur = 1700;
    hintPath.animate(
      [{ strokeDashoffset: dash, opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.8 }, { strokeDashoffset: -(run - dash), opacity: 0 }],
      { duration: dur, easing: "cubic-bezier(.4,0,.3,1)", fill: "both" }
    );
    trailPath.animate(
      [{ strokeDashoffset: run, opacity: 0.85 }, { strokeDashoffset: 0, opacity: 0.8, offset: 0.7 }, { strokeDashoffset: 0, opacity: 0 }],
      { duration: dur + 500, easing: "cubic-bezier(.4,0,.3,1)", fill: "both" }
    );
    // a few joints of the door pulse
    for (var k = 0; k < 4; k++) {
      var j = Math.floor(Math.random() * pts.length);
      var p1 = pts[j], p2 = pts[(j + 1) % pts.length];
      var el = document.createElementNS(SVGNS, "path");
      el.setAttribute("d", "M" + p1[0] + " " + p1[1] + " L" + p2[0] + " " + p2[1]);
      pulses.appendChild(el);
      var an = el.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }],
        { duration: 1100, delay: 250 + k * 260, easing: "ease-in-out", fill: "both" });
      an.onfinish = (function (node) { return function () { node.remove(); }; })(el);
    }
  }

  function scheduleHint() {
    setTimeout(function () { hint(); scheduleHint(); }, 4000 + Math.random() * 1000);
  }

  // Desktop hover: outline glows all round + a little "Knock knock..." tip.
  var tipTimer = null;
  hit.addEventListener("mouseenter", function () {
    if (busy) return;
    portal.classList.add("is-hover");
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { portal.classList.add("show-tip"); }, 450);
  });
  hit.addEventListener("mousemove", function (e) {
    var hr = hero.getBoundingClientRect();
    tip.style.transform = "translate(" + (e.clientX - hr.left + 16) + "px," + (e.clientY - hr.top + 18) + "px)";
  });
  hit.addEventListener("mouseleave", function () {
    clearTimeout(tipTimer);
    portal.classList.remove("is-hover", "show-tip");
  });
  if (reduceMotion) portal.classList.add("is-reduced");

  // ---- Layout lifecycle ----
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(layout, 120);
  });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) reset();
  });
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  window.addEventListener("load", layout);
  setTimeout(function () { hint(); scheduleHint(); }, 1500);

  // test hook
  window.__nfsPortal = { open: open, layout: layout, geo: function () { return geo; } };
})();

/* Videos page entrance: fade in from the doorway glow */
(function () {
  "use strict";
  var root = document.documentElement;
  if (!root.classList.contains("portal-enter")) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { root.classList.add("portal-entered"); });
  });
  setTimeout(function () { root.classList.remove("portal-enter", "portal-entered"); }, 1400);
})();
