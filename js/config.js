/* =========================================================
   CONFIG — edit this file only to personalize the invitation.
   Nothing else needs to change for basic customization.
   ========================================================= */

const WEDDING_CONFIG = {
  // ---- Couple ----
  groom: {
    name: "drg. M. Mukti Ginanjar",          // full name
    shortName: "Ginanjar",     // used in cover title (can be first name)
    father: "H. Abdulah Chotib (Alm.)",
    mother: "Hj. Nur Khasanah, S.Pd.",
    photo: "assets/images/groom.png",
  },
  bride: {
    name: "Puteri Awaliatush Shofro, M.Kom.",
    shortName: "Puteri",
    father: "H. Moh. Robikhun, S.Ag., M.Pd.",
    mother: "Hj. Sofuah, M.Pd.",
    photo: "assets/images/bride.png",
  },
  monogramInitials: "P & G", // e.g. "R & A" — shown on cover/gate/closing

  // ---- Events ----
  // Use ISO 8601 with timezone offset, e.g. "2026-11-14T08:00:00+07:00"
  akad: {
    label: "Akad Nikah",
    dateDisplay: "Ahad, 30 Agustus 2026", // shown on the page
    timeDisplay: "15:30 WIB - Selesai",
    isoStart: "2026-11-14T08:00:00+07:00",
    isoEnd: "2026-11-14T10:00:00+07:00",
  },
  resepsi: {
    label: "Resepsi",
    dateDisplay: "Senin, 31 Agustus 2026",
    timeDisplay: "10:00 WIB - Selesai",
    isoStart: "2026-08-31T11:00:00+07:00",
    isoEnd: "2026-08-31T14:00:00+07:00",
  },

  // Countdown always targets the earlier of the two events above (akad.isoStart).
  // Change countdownTarget if you want the countdown to point somewhere else.
  countdownTarget: "2026-08-31T08:00:00+07:00",

  // ---- Venue ----
  venue: {
    name: "Gedung Serbaguna Islamic Center Brebes",                       // e.g. "Gedung Serbaguna XXX"
    address: "Jl. Yos Sudarso No.36, Ps. Batang, Kecamatan Bulakamba, Kabupaten Brebes, Jawa Tengah", // full address shown on page
    googleMapsShareUrl: "https://maps.app.goo.gl/wykp2CvvCJcaJGvYA?g_st=iw", // "Share" link from Google Maps app
    // Optional: a Google Maps EMBED src (Maps > Share > Embed a map > copy the src="...").
    // Leave empty to hide the embedded map and only show the "Open in Google Maps" button.
    googleMapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.1976537283954!2d109.04246297463364!3d-6.866902793131692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb13c31aed2c9%3A0xc95e2ec54676bba!2sGedung%20Serba%20Guna%20Islamic%20Centre!5e0!3m2!1sid!2sid!4v1785893284599!5m2!1sid!2sid",
    
  },

  // ---- Gift ----
  gift: {
    bankName: "Bank BNI",
    bankAccountNumber: "0690843250",
    bankAccountHolder: "Puteri Awaliatush Shofro",
    bank2Name: "Bank Mandiri",
    bank2AccountNumber: "1800016856900",
    bank2AccountHolder: "M. Mukti Ginanjar",
    deliveryAddress: "Jalan Raya Banjaratma RT 05 RW 09, Kecamatan Bulakamba, Kabupaten Brebes, Jawa Tengah, Indonesia",
  },

  // ---- Music ----
  music: {
    src: "assets/audio/song.mp3",
    autoplayOnOpen: true, // tries to play right after the guest taps "Buka Undangan"
  },

  // ---- Google Apps Script Web App URL ----
  // Deploy google-apps-script/Code.gs as a Web App (Execute as: Me,
  // Who has access: Anyone) and paste the resulting /exec URL below.
  // See README.md for the full step-by-step.
  scriptUrl: "https://script.google.com/macros/s/AKfycbweOF9hPc26lXFfBgdNjynT8Ph7zO0yH-YL8PUXakDJgJu7QLy0iemZxBNhi2ecP0HdZg/exec",

  // How often (ms) the wishes list auto-refreshes to pick up new RSVPs.
  wishesPollInterval: 15000,
};
