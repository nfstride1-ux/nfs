/* NFS Bricklaying - digital business card
   Used by card.html (rendered inline) and index.html (secret top-left brick -> modal). */
(function () {
  "use strict";

  var CARD_URL = "https://nfsbricklaying.org/card.html";
  var PHONE_DISPLAY = "0408 941 768";
  var PHONE_INTL = "+61408941768";
  var EMAIL = "nstride@nfsbricklaying.org";
  var SITE = "https://nfsbricklaying.org/";
  var FB = "https://www.facebook.com/Nfsbricklaying";
  var IG = "https://www.instagram.com/nfsbricklaying/";
  var FORM_AJAX = "https://formsubmit.co/ajax/" + EMAIL;
  var CARD_MSG = "NFS Bricklaying - Nathe Stride, " + PHONE_DISPLAY + ". Digital card: " + CARD_URL;
  var WA_NATHE = "https://wa.me/61408941768?text=" + encodeURIComponent("Hi Nathe, I found you on the NFS Bricklaying website and would like a quote for...");
  var WA_SHARE = "https://wa.me/?text=" + encodeURIComponent(CARD_MSG);

  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var isMobile = isIOS || /Android|Mobile/i.test(ua);

  var ICON = {
    phone: '<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/>',
    mail: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2.2V17h16V7.2l-8 5.3-8-5.3zM5.4 7l6.6 4.4L18.6 7H5.4z"/>',
    web: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-3a15.6 15.6 0 0 0-1.3-3.9A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3zm.8 2h3a15.6 15.6 0 0 0 1.3 3.9A8 8 0 0 1 5.1 16zm3-8h-3a8 8 0 0 1 4.3-3.9C8.9 5.3 8.4 6.6 8.1 8zM12 20c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.9c.6-1.2 1-2.5 1.3-3.9h3a8 8 0 0 1-4.3 3.9zm1.7-5.9a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4h-3.4z"/>',
    fb: '<path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z"/>',
    ig: '<path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 3c-2.4 0-2.7 0-3.7.1-3.3.2-5 1.9-5.2 5.2C3 9.3 3 9.6 3 12s0 2.7.1 3.7c.2 3.3 1.9 5 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.3-.2 5-1.9 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.2-3.3-1.9-5-5.2-5.2C14.7 3 14.4 3 12 3zm0 1.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1 1 .1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-1 .1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-1-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.3-3.6 3.7-3.7 1-.1 1.2-.1 3.6-.1z"/>',
    pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>',
    wa: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/>',
    save: '<path d="M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c4.4 0 8 1.8 8 4v2H4v-2c0-2.2 3.6-4 8-4zm7-10v2h2v2h-2v2h-2V7h-2V5h2V3h2z"/>',
    share: '<path d="M18 16.1c-.8 0-1.5.3-2 .8l-7.1-4.2c.1-.2.1-.5.1-.7s0-.5-.1-.7L16 7.2a3 3 0 1 0-1-2.2c0 .2 0 .5.1.7L8 9.8A3 3 0 1 0 8 14.2l7.1 4.2-.1.6a3 3 0 1 0 3-2.9z"/>',
    chat: '<path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 1-2z"/>'
  };

  function ic(name) {
    return '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + "</svg>";
  }

  function cardHTML(idp) {
    return '' +
      '<div class="bc-top">' +
        '<img class="bc-logo" src="media/card-logo.jpg" width="480" height="236" alt="NFS Bricklaying - Built with Pride">' +
      '</div>' +
      '<div class="bc-body">' +
        '<h2 class="bc-name" id="' + idp + 'Title">Nathaniel Stride</h2>' +
        '<p class="bc-org">NFS Bricklaying</p>' +
        '<p class="bc-tag">Built with Pride</p>' +
        '<ul class="bc-list">' +
          '<li><a href="tel:' + PHONE_INTL + '">' + ic("phone") + '<span>' + PHONE_DISPLAY + '</span></a></li>' +
          '<li><a href="mailto:' + EMAIL + '">' + ic("mail") + '<span>' + EMAIL + '</span></a></li>' +
          '<li><a href="' + SITE + '" target="_blank" rel="noopener">' + ic("web") + '<span>nfsbricklaying.org</span></a></li>' +
          '<li><a href="' + FB + '" target="_blank" rel="noopener noreferrer">' + ic("fb") + '<span>facebook.com/Nfsbricklaying</span></a></li>' +
          '<li><a href="' + IG + '" target="_blank" rel="noopener noreferrer">' + ic("ig") + '<span>@nfsbricklaying</span></a></li>' +
          '<li><span class="bc-static">' + ic("pin") + '<span>Golden Bay &amp; South of the River, Perth</span></span></li>' +
        '</ul>' +
        '<div class="bc-actions">' +
          '<a class="bc-btn bc-btn--primary" href="nfs-bricklaying.vcf" download="nfs-bricklaying.vcf">' + ic("save") + 'Save to contacts</a>' +
          '<a class="bc-btn" href="tel:' + PHONE_INTL + '">' + ic("phone") + 'Call</a>' +
          '<a class="bc-btn bc-btn--wa" href="' + WA_NATHE + '" target="_blank" rel="noopener">' + ic("wa") + 'WhatsApp Nathe</a>' +
          '<a class="bc-btn bc-btn--gold" href="index.html#contact" data-bc-quote>Request a quote</a>' +
        '</div>' +
        '<div class="bc-share">' +
          '<span>Share this card</span>' +
          '<button type="button" class="bc-chip" data-bc-share>' + ic("share") + '<span data-bc-share-label>Share</span></button>' +
          '<a class="bc-chip bc-chip--wa" href="' + WA_SHARE + '" target="_blank" rel="noopener">' + ic("wa") + 'WhatsApp</a>' +
        '</div>' +
        '<form class="bc-form" novalidate data-bc-form>' +
          '<p class="bc-form__title">Send me the card</p>' +
          '<p class="bc-form__sub">Pop your mobile in and the card lands in your messages.</p>' +
          '<label class="bc-sr" for="' + idp + 'Phone">Your mobile number</label>' +
          '<input id="' + idp + 'Phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Your mobile (04xx xxx xxx)" required>' +
          '<label class="bc-sr" for="' + idp + 'Name">Your name (optional)</label>' +
          '<input id="' + idp + 'Name" name="name" type="text" autocomplete="name" placeholder="Your name (optional)">' +
          '<p class="bc-form__err" role="alert" hidden></p>' +
          '<button type="submit" class="bc-btn bc-btn--primary bc-btn--block">' + ic("chat") + 'Send me the card</button>' +
        '</form>' +
        '<div class="bc-done" data-bc-done hidden tabindex="-1">' +
          '<p class="bc-done__title" data-bc-done-title>Card on its way</p>' +
          '<p class="bc-done__sub" data-bc-done-sub></p>' +
          '<div class="bc-done__btns">' +
            '<a class="bc-btn bc-btn--primary" data-bc-sms href="#">' + ic("chat") + 'Text it to me</a>' +
            '<a class="bc-btn bc-btn--wa" href="' + WA_SHARE + '" target="_blank" rel="noopener">' + ic("wa") + 'Send card via WhatsApp</a>' +
            '<a class="bc-btn" href="nfs-bricklaying.vcf" download="nfs-bricklaying.vcf">' + ic("save") + 'Save to contacts</a>' +
          '</div>' +
          '<figure class="bc-qr" data-bc-qr hidden>' +
            '<img src="media/card-qr.png" width="290" height="290" alt="QR code for the NFS Bricklaying digital card">' +
            '<figcaption>Scan with your phone camera to open the card</figcaption>' +
          '</figure>' +
        '</div>' +
      '</div>';
  }

  function normalisePhone(v) {
    var d = String(v || "").replace(/[\s\-().]/g, "");
    if (/^04\d{8}$/.test(d)) return "+61" + d.slice(1);
    if (/^\+614\d{8}$/.test(d)) return d;
    if (/^614\d{8}$/.test(d)) return "+" + d;
    if (/^00614\d{8}$/.test(d)) return "+" + d.slice(2);
    return null;
  }

  function smsLink(num) {
    return "sms:" + num + (isIOS ? "&" : "?") + "body=" + encodeURIComponent(CARD_MSG);
  }

  function wire(root) {
    var share = root.querySelector("[data-bc-share]");
    var shareLabel = root.querySelector("[data-bc-share-label]");
    share.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({ title: "NFS Bricklaying - Nathe Stride", text: "NFS Bricklaying - Nathe Stride, " + PHONE_DISPLAY, url: CARD_URL }).catch(function () {});
        return;
      }
      var done = function () {
        shareLabel.textContent = "Link copied";
        setTimeout(function () { shareLabel.textContent = "Share"; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CARD_URL).then(done, function () { window.prompt("Copy this link:", CARD_URL); });
      } else {
        window.prompt("Copy this link:", CARD_URL);
      }
    });

    var form = root.querySelector("[data-bc-form]");
    var err = form.querySelector(".bc-form__err");
    var doneBox = root.querySelector("[data-bc-done]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var phoneRaw = form.phone.value;
      var num = normalisePhone(phoneRaw);
      if (!num) {
        err.textContent = "Please enter an Australian mobile, e.g. 0412 345 678 or +61 412 345 678.";
        err.hidden = false;
        form.phone.focus();
        return;
      }
      err.hidden = true;
      var name = (form.name.value || "").trim();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.lastChild.textContent = "Sending\u2026";

      var payload = {
        name: name || "(not given)",
        phone: phoneRaw.trim() + " (" + num + ")",
        message: "Someone asked for Nathe's digital business card on the website.",
        page: location.href,
        _subject: "Business card request from website",
        _template: "table",
        _captcha: "false"
      };
      var sent = fetch(FORM_AJAX, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.ok; }).catch(function () { return false; });

      sent.then(function (ok) {
        form.hidden = true;
        doneBox.hidden = false;
        var sms = doneBox.querySelector("[data-bc-sms]");
        sms.href = smsLink(num);
        var sub = doneBox.querySelector("[data-bc-done-sub]");
        if (isMobile) {
          doneBox.querySelector("[data-bc-done-title]").textContent = "Card on its way \u2013 check your messages";
          sub.textContent = "Your messages app opens with the card ready to send to yourself. You can also WhatsApp it or save it to contacts.";
          setTimeout(function () { window.location.href = sms.href; }, 500);
        } else {
          doneBox.querySelector("[data-bc-done-title]").textContent = "Thanks" + (name ? ", " + name.split(" ")[0] : "") + "! Nathe has your number.";
          sub.textContent = "Scan the code to open the card on your phone, or save it to contacts now.";
          sms.hidden = true;
          doneBox.querySelector("[data-bc-qr]").hidden = false;
        }
        if (!ok) sub.textContent += " (We couldn't reach the server just now, so please also save the card below.)";
        doneBox.focus();
      });
    });
  }

  function mount(el, idp) {
    el.innerHTML = cardHTML(idp);
    wire(el);
  }

  window.NFSCard = { mount: mount };

  // ---- card.html: render inline ----
  var inline = document.getElementById("bcardMount");
  if (inline) mount(inline, "bcPage");

  // ---- index.html: secret brick -> modal ----
  var brick = document.getElementById("cardBrick");
  var modal = document.getElementById("bcModal");
  if (!brick || !modal) return;
  var dialog = modal.querySelector(".bc-dialog");
  var cardEl = modal.querySelector(".bc-card");
  var lastFocus = null;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mounted = false;

  function openCard(fromEl) {
    if (!mounted) { mount(cardEl, "bcModal"); mounted = true; }
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("bc-open");
    var r = (fromEl || brick).getBoundingClientRect();
    modal.classList.add("is-open");
    dialog.scrollTop = 0;
    if (!reduce && dialog.animate && r.width) {
      // brick pops out of the wall, flies to the centre and flips over into the card
      var proxy = brick.cloneNode(false);
      proxy.removeAttribute("id");
      proxy.className = "bc-proxy";
      proxy.style.cssText = "left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;" +
        "background-image:" + getComputedStyle(brick).backgroundImage + ";background-size:" + getComputedStyle(brick).backgroundSize + ";background-position:" + getComputedStyle(brick).backgroundPosition;
      document.body.appendChild(proxy);
      cardEl.style.opacity = "0";
      var dx = window.innerWidth / 2 - (r.left + r.width / 2);
      var dy = window.innerHeight / 2 - (r.top + r.height / 2);
      proxy.animate([
        { transform: "translate(0,0) scale(1) rotateY(0deg)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
        { transform: "translate(0,0) scale(1.12) rotateY(0deg)", boxShadow: "0 10px 26px rgba(0,0,0,.7), 0 0 22px rgba(61,224,255,.35)", offset: 0.25 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(2.6) rotateY(90deg)", boxShadow: "0 20px 40px rgba(0,0,0,.6), 0 0 30px rgba(61,224,255,.5)" }
      ], { duration: 620, easing: "cubic-bezier(.5,0,.6,1)", fill: "forwards" }).onfinish = function () {
        proxy.remove();
        cardEl.style.opacity = "";
        cardEl.animate([
          { transform: "perspective(1200px) rotateY(-90deg) scale(.55)", opacity: 0.6 },
          { transform: "perspective(1200px) rotateY(0deg) scale(1)", opacity: 1 }
        ], { duration: 520, easing: "cubic-bezier(.2,.8,.25,1)" });
        var x = modal.querySelector(".bc-close"); if (x) x.focus({ preventScroll: true });
      };
      modal.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "both" });
    } else {
      var x2 = modal.querySelector(".bc-close"); if (x2) x2.focus({ preventScroll: true });
    }
  }

  function closeCard() {
    if (modal.hidden) return;
    var fin = function () {
      modal.hidden = true;
      modal.classList.remove("is-open");
      document.body.classList.remove("bc-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    if (!reduce && modal.animate) modal.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220 }).onfinish = fin;
    else fin();
  }

  brick.addEventListener("click", function () { openCard(brick); });
  var kb = document.getElementById("cardBrickBtn");
  if (kb) kb.addEventListener("click", function () { openCard(brick); });
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest("[data-bc-close]")) closeCard();
    if (e.target.closest("[data-bc-quote]")) closeCard();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCard();
    if (e.key === "Tab" && !modal.hidden) {
      var f = modal.querySelectorAll('a[href],button:not([disabled]),input,[tabindex="0"]');
      var vis = Array.prototype.filter.call(f, function (n) { return n.offsetParent !== null; });
      if (!vis.length) return;
      var first = vis[0], last = vis[vis.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.__nfsCard = { open: openCard, close: closeCard };
})();
