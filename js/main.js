/* =========================================================
   MAIN — behavior for the digital wedding invitation.
   Reads all editable values from WEDDING_CONFIG (js/config.js).
   ========================================================= */
(function () {
  "use strict";

  const cfg = WEDDING_CONFIG;

  /* ---------------------------------------------------------
     0. Guest name from URL — supports links like
        yoursite.github.io/?to=Ade%20Fitriyani
     --------------------------------------------------------- */
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to") ? decodeURIComponent(params.get("to")) : "Tamu Undangan";
  document.getElementById("guestNameGate").textContent = guestName;
  document.getElementById("guestNameCover").textContent = guestName;
  const rsvpNameInput = document.getElementById("rsvpName");
  if (guestName !== "Tamu Undangan" && rsvpNameInput) rsvpNameInput.value = guestName;

  /* ---------------------------------------------------------
     1. Populate placeholders from config
     --------------------------------------------------------- */
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  setText("gateTitle", `${cfg.bride.shortName} & ${cfg.groom.shortName}`);
  setText("gateMonogram", cfg.monogramInitials);
  setText("coverMonogram", cfg.monogramInitials);
  setText("coverGroomName", cfg.groom.shortName);
  setText("coverBrideName", cfg.bride.shortName);
  setText("coverDate", cfg.resepsi.dateDisplay);

  setText("groomName", cfg.groom.name);
  setText("groomFather", cfg.groom.father);
  setText("groomMother", cfg.groom.mother);
  setText("brideName", cfg.bride.name);
  setText("brideFather", cfg.bride.father);
  setText("brideMother", cfg.bride.mother);
  const groomPhoto = document.getElementById("groomPhoto");
  const bridePhoto = document.getElementById("bridePhoto");
  if (groomPhoto) groomPhoto.src = cfg.groom.photo;
  if (bridePhoto) bridePhoto.src = cfg.bride.photo;

  setText("akadDate", cfg.akad.dateDisplay);
  setText("akadTime", cfg.akad.timeDisplay);
  setText("akadVenueName", cfg.akad.venueName);
  setText("resepsiDate", cfg.resepsi.dateDisplay);
  setText("resepsiTime", cfg.resepsi.timeDisplay);
  setText("resepsiVenueName", cfg.resepsi.venueName);

  setText("venueAddress", cfg.venue.address);
  setText("closingMonogram", cfg.monogramInitials);
  setText("closingNames", ` ${cfg.bride.shortName} & ${cfg.groom.shortName}`);

  setText("bankValue", cfg.gift.bankAccountNumber);
  setText("bankSub", `${cfg.gift.bankName} a.n. ${cfg.gift.bankAccountHolder}`);
  setText("bankValue2", cfg.gift.bank2AccountNumber);
  setText("bankSub2", `${cfg.gift.bank2Name} a.n. ${cfg.gift.bank2AccountHolder}`);
  setText("giftAddress", cfg.gift.deliveryAddress);

  /* ---------------------------------------------------------
     2. Gate — open invitation, start music
     --------------------------------------------------------- */
  const gate = document.getElementById("gate");
  const openBtn = document.getElementById("openInvitation");
  const music = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicBtn");

  openBtn.addEventListener("click", function () {
    gate.classList.add("is-hidden");
    document.body.style.overflow = "";
    if (cfg.music.autoplayOnOpen && music) {
      music.play().then(function () {
        musicBtn.classList.add("is-playing");
      }).catch(function () {
        /* autoplay blocked — user can tap the music button manually */
      });
    }
  });
  document.body.style.overflow = "hidden";

  musicBtn.addEventListener("click", function () {
    if (music.paused) {
      music.play().then(() => musicBtn.classList.add("is-playing")).catch(() => {});
    } else {
      music.pause();
      musicBtn.classList.remove("is-playing");
    }
  });

  /* ---------------------------------------------------------
     3. Countdown
     --------------------------------------------------------- */
  function pad(n) { return String(n).padStart(2, "0"); }

  function tickCountdown() {
    const target = new Date(cfg.countdownTarget).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    setText("cdDays", pad(days));
    setText("cdHours", pad(hours));
    setText("cdMinutes", pad(minutes));
    setText("cdSeconds", pad(seconds));
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------------------------------------------------------
     4. Google Calendar "Save the Date" links
     --------------------------------------------------------- */
  function toGCalDate(iso) {
    // Google Calendar wants UTC basic format: YYYYMMDDTHHMMSSZ
    const d = new Date(iso);
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  function buildCalendarUrl(eventKey) {
    const ev = cfg[eventKey];
    const title = `${ev.label} — ${cfg.groom.shortName} & ${cfg.bride.shortName}`;
    const details = `Dengan penuh sukacita, kami mengundang Anda ke acara ${ev.label} kami.\n\nLokasi: ${cfg.venue.name}, ${cfg.venue.address}`;
    const dates = `${toGCalDate(ev.isoStart)}/${toGCalDate(ev.isoEnd)}`;
    const location = `${cfg.venue.name}, ${cfg.venue.address}`;

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", title);
    url.searchParams.set("dates", dates);
    url.searchParams.set("details", details);
    url.searchParams.set("location", location);
    return url.toString();
  }

  document.querySelectorAll("[data-calendar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const key = btn.getAttribute("data-calendar");
      window.open(buildCalendarUrl(key), "_blank", "noopener");
    });
  });

  /* ---------------------------------------------------------
     5. Google Maps — venue link + optional embed
     --------------------------------------------------------- */
  const mapOpenBtn = document.getElementById("mapOpenBtn");
  const mapFallback = cfg.venue.googleMapsShareUrl ||
    ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(cfg.venue.address));
  mapOpenBtn.href = mapFallback;

  const mapFrame = document.getElementById("mapEmbed");
  const mapFrameWrap = mapFrame.closest(".map-frame");
  if (cfg.venue.googleMapsEmbedSrc) {
    mapFrame.src = cfg.venue.googleMapsEmbedSrc;
  } else if (mapFrameWrap) {
    mapFrameWrap.style.display = "none";
  }

  /* ---------------------------------------------------------
     6. RSVP form — submit to Google Apps Script (Google Sheets)
     --------------------------------------------------------- */
  const attendToggle = document.getElementById("attendToggle");
  attendToggle.addEventListener("click", function (e) {
    const label = e.target.closest(".attend-option");
    if (!label) return;
    attendToggle.querySelectorAll(".attend-option").forEach((o) => o.classList.remove("is-selected"));
    label.classList.add("is-selected");
  });

  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpStatus = document.getElementById("rsvpStatus");
  const rsvpSubmit = document.getElementById("rsvpSubmit");

  rsvpForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!cfg.scriptUrl || cfg.scriptUrl.indexOf("XXXX") !== -1) {
      rsvpStatus.textContent = "Formulir belum terhubung ke Google Sheets. Tempel URL Apps Script di js/config.js (lihat README).";
      rsvpStatus.className = "form-status err";
      return;
    }

    const formData = new FormData(rsvpForm);
    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      attendance: (formData.get("attendance") || "").toString(),
      guests: (formData.get("guests") || "1").toString(),
      message: (formData.get("message") || "").toString().trim(),
    };

    if (!payload.name || !payload.attendance || !payload.message) {
      rsvpStatus.textContent = "Mohon lengkapi semua kolom yang wajib diisi.";
      rsvpStatus.className = "form-status err";
      return;
    }

    rsvpSubmit.disabled = true;
    rsvpSubmit.textContent = "Mengirim…";
    rsvpStatus.textContent = "";
    rsvpStatus.className = "form-status";

    try {
      // Content-Type: text/plain avoids a CORS preflight (Apps Script does
      // not handle OPTIONS requests). The script still reads the JSON body
      // from e.postData.contents. See google-apps-script/Code.gs.
      const res = await fetch(cfg.scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "rsvp", ...payload }),
      });
      const data = await res.json();

      if (data && data.status === "success") {
        rsvpStatus.textContent = "Terima kasih! RSVP Anda berhasil terkirim.";
        rsvpStatus.className = "form-status ok";
        rsvpForm.reset();
        attendToggle.querySelectorAll(".attend-option").forEach((o) => o.classList.remove("is-selected"));
        loadWishes(); // refresh wishes so the new message shows up right away
      } else {
        throw new Error((data && data.message) || "Unknown error");
      }
    } catch (err) {
      rsvpStatus.textContent = "Gagal mengirim RSVP. Periksa koneksi internet Anda dan coba lagi.";
      rsvpStatus.className = "form-status err";
    } finally {
      rsvpSubmit.disabled = false;
      rsvpSubmit.textContent = "Kirim RSVP";
    }
  });

  /* ---------------------------------------------------------
     7. Wishes — load from Google Sheets (near real-time)
     --------------------------------------------------------- */
  const wishesList = document.getElementById("wishesList");
  const wishesRefreshBtn = document.getElementById("wishesRefresh");

  function initials(name) {
    return (name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderWishes(items) {
    if (!items || !items.length) {
      wishesList.innerHTML = '<div class="wish-empty">Jadilah yang pertama mengirimkan ucapan!</div>';
      return;
    }
    wishesList.innerHTML = items
      .slice()
      .reverse()
      .map(function (w) {
        return (
          '<div class="wish-item">' +
            '<div class="wish-avatar">' + escapeHtml(initials(w.name)) + "</div>" +
            '<div class="wish-body">' +
              '<span class="wish-name">' + escapeHtml(w.name) + "</span>" +
              '<span class="wish-attend">' + escapeHtml(w.attendance) + "</span>" +
              '<p class="wish-text">' + escapeHtml(w.message) + "</p>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  async function loadWishes() {
    if (!cfg.scriptUrl || cfg.scriptUrl.indexOf("XXXX") !== -1) {
      wishesList.innerHTML = '<div class="wish-empty">Hubungkan Google Sheets di js/config.js untuk menampilkan ucapan.</div>';
      return;
    }
    try {
      const res = await fetch(cfg.scriptUrl + "?action=wishes", { method: "GET" });
      const data = await res.json();
      renderWishes(data && data.wishes ? data.wishes : []);
    } catch (err) {
      wishesList.innerHTML = '<div class="wish-empty">Tidak dapat memuat ucapan saat ini.</div>';
    }
  }

  wishesRefreshBtn.addEventListener("click", loadWishes);
  loadWishes();
  if (cfg.wishesPollInterval > 0) {
    setInterval(loadWishes, cfg.wishesPollInterval);
  }

  /* ---------------------------------------------------------
     8. Gift — copy to clipboard
     --------------------------------------------------------- */
  function wireCopy(btnId, text) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(text).then(function () {
        const original = btn.textContent;
        btn.textContent = "Tersalin!";
        setTimeout(() => (btn.textContent = original), 1800);
      });
    });
  }
  wireCopy("copyBank", cfg.gift.bankAccountNumber);
  wireCopy("copyBank2", cfg.gift.bank2AccountNumber);
  wireCopy("copyAddress", cfg.gift.deliveryAddress);

  /* ---------------------------------------------------------
     9. Reveal-on-scroll + vine dividers
     --------------------------------------------------------- */
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".reveal, .vine-divider").forEach((el) => io.observe(el));
})();
