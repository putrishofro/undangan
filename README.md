# Undangan Pernikahan Digital — XXX & XXX

A mobile-first digital wedding invitation with live RSVP → Google Sheets sync,
a real-time-ish wishes wall, countdown, Google Maps venue link, and
Google Calendar "save the date" buttons.

**Important — read this first:** I built and tested all the code below, but
I don't have the ability to log into *your* Google account or push to *your*
GitHub repository from here — those steps need real credentials that only
you can provide. Everything that doesn't require your accounts is done;
everything below marked **You do this** is a short manual step (5–15 minutes
total). I'll walk you through each one.

---

## 1. What's in this folder

```
wedding-invitation/
├── index.html                  ← the whole page (all sections)
├── css/style.css                ← all styling
├── js/config.js                 ← ⭐ EDIT THIS — every name/date/address lives here
├── js/main.js                   ← behavior (countdown, RSVP, maps, etc.) — no edits needed
├── assets/images/               ← put your photos here (groom.jpg, bride.jpg, etc.)
├── assets/audio/                ← put your background music here (song.mp3)
├── google-apps-script/Code.gs   ← paste this into Google Apps Script
└── README.md                    ← this file
```

## 2. Personalize the content — **You do this**

Open `js/config.js` and replace every `"XXX"` with the real values: couple's
names and parents' names, event dates/times, venue name/address, Google Maps
link, bank account details, and gift delivery address. Everything on the
page reads from this one file, so you only need to edit it in one place.

Then drop your media into `assets/`:
- `assets/images/groom.jpg`, `assets/images/bride.jpg`, `assets/images/cover.jpg`
- `assets/audio/song.mp3`
- (Compress photos to roughly 200–400 KB each and keep the music file under
  ~5 MB so the page loads fast on mobile data — any online image compressor
  or `ffmpeg -b:a 128k` for audio works well.)

## 3. Connect Google Sheets — **You do this** (~5 minutes)

This is what makes RSVP submissions land in a spreadsheet automatically.

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it whatever you like, e.g. "Wedding RSVP".
2. Rename the first tab (bottom-left) to exactly `RSVP`.
3. Go to **Extensions → Apps Script**. Delete the placeholder `myFunction()`
   code in the editor.
4. Open `google-apps-script/Code.gs` from this project, copy its entire
   contents, and paste it into the Apps Script editor. Save (Ctrl/Cmd+S).
5. In the function dropdown at the top of the editor, select `setupSheet`
   and click **Run**. The first time, Google will ask you to authorize the
   script — click through **Review permissions → (your account) → Advanced
   → Go to project (unsafe) → Allow**. ("Unsafe" here just means Google
   can't vouch for a script it didn't write — this is your own script.)
   This creates the header row (Timestamp, Name, Attendance, Guests, Message).
6. Click **Deploy → New deployment**. Click the gear icon next to "Select
   type" and choose **Web app**. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
   Click **Deploy**, authorize again if asked, and copy the **Web app URL**
   (it ends in `/exec`).
7. Paste that URL into `js/config.js` as the value of `scriptUrl`.

That's it — new RSVP submissions will now appear as new rows in your
`RSVP` sheet in real time, and the website's wishes wall reads from that
same sheet.

**Whenever you edit `Code.gs` again later**, you must create a **new
deployment version** (Deploy → Manage deployments → pencil icon → New
version → Deploy) for changes to take effect — just saving the script isn't
enough.

### Google Sheets structure

| Column | Name | Example |
|---|---|---|
| A | Timestamp | 2026-08-07T09:15:00.000Z |
| B | Name | Ade Fitriyani |
| C | Attendance | Hadir / Tidak Hadir |
| D | Guests | 2 |
| E | Message | Wishing you both a lifetime of happiness! |

You can filter, sort, export to CSV/Excel, or build a pivot table/chart
directly in this sheet at any time — it's a normal Google Sheet.

## 4. Google Maps venue link — **You do this** (~2 minutes)

1. Open [Google Maps](https://maps.google.com), search for or drop a pin on
   your venue.
2. Click **Share → Copy link**, and paste that into `venue.googleMapsShareUrl`
   in `js/config.js`. (This is the button guests tap to get directions.)
3. *Optional embedded map:* click **Share → Embed a map**, copy just the
   `src="..."` URL from the `<iframe>` code shown, and paste it into
   `venue.googleMapsEmbedSrc` in `js/config.js`. If you skip this, the page
   simply hides the embedded map and keeps the "Open in Google Maps" button.

## 5. Deploy to GitHub Pages — **You do this** (~5 minutes)

I can't push to your GitHub account directly, but this is copy/paste simple:

1. Create a new **public** repository on GitHub, e.g. `our-wedding`.
2. Upload every file in this `wedding-invitation/` folder to the repository
   root (drag-and-drop on the GitHub web UI works, or use `git`:
   ```bash
   cd wedding-invitation
   git init
   git add .
   git commit -m "Wedding invitation site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/our-wedding.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**. Under "Build and
   deployment", set **Source: Deploy from a branch**, **Branch: main**,
   folder **/ (root)**. Save.
4. Wait 1–2 minutes, then your site will be live at:
   `https://<your-username>.github.io/our-wedding/`
5. To personalize the invitation per guest, share links like:
   `https://<your-username>.github.io/our-wedding/?to=Ade%20Fitriyani`
   (the `?to=` value shows up as the guest's name on the cover — spaces
   become `%20`, or use `+`).

## 6. Test before sending invites

- Open the live URL on an actual phone (not just desktop) — check the
  cover animation, countdown, and that "Buka Undangan" unmutes the music.
- Submit a test RSVP and confirm a new row appears in your Google Sheet
  within a few seconds, and that it shows up in the "Ucapan & Doa" wall
  after it refreshes (or tap "Muat ulang ucapan").
- Tap the venue address and confirm it opens Google Maps correctly.
- Tap "Simpan ke Kalender" on both event cards and confirm the event,
  date, time, and location prefill correctly in Google Calendar.

## Maintenance / editing later

- **Change any text, date, name, or bank details:** edit `js/config.js`
  only, then re-upload/commit that one file — no HTML editing needed.
- **Change colors/fonts:** edit the `:root { --gold: ...; }` variables at
  the top of `css/style.css`.
- **Export/manage RSVPs:** open your Google Sheet directly — File → Download
  as CSV/Excel, or use Sheets' built-in filters and charts.
- **Close RSVPs after the wedding:** in `js/config.js`, you can simply
  leave the form as-is (guests can still send well-wishes), or hide the
  form by adding `style="display:none"` to the `<section id="rsvp">` and
  `<section id="wishes">` tags in `index.html` if you'd rather freeze it.
- **Rotate/replace photos:** just overwrite the files in `assets/images/`
  with the same filenames, or update the paths in `js/config.js`.

## Requirements checklist

| Requirement | Status |
|---|---|
| RSVP form (name, attendance, guest count, message) | ✅ Built |
| RSVP auto-syncs to Google Sheets, new row per submission | ✅ Built — needs your 5-minute Apps Script setup (§3) |
| Wishes wall shows guest name + message, near real-time | ✅ Built (loads on open + auto-refreshes + manual refresh button) |
| Countdown (days/hours/minutes/seconds) | ✅ Built |
| Clickable venue address → opens Google Maps | ✅ Built — needs your Maps link (§4) |
| Clickable date/time → adds event to Google Calendar with title/date/time/venue/description | ✅ Built (both Akad and Resepsi) |
| Editable placeholders for names/parents/venue/date | ✅ Built — single file: `js/config.js` |
| Gift section ("Wanna give us some gifts?") with bank + address | ✅ Built, with copy-to-clipboard buttons |
| Elegant, modern, mobile-first, responsive design | ✅ Built (see design notes below) |
| Opening cover / gate, bride & groom, countdown, event details, map, RSVP, wishes, gift, closing sections | ✅ Built, in that order |
| Smooth scrolling, fade-in reveal animations | ✅ Built (respects `prefers-reduced-motion`) |
| Floating music button | ✅ Built |
| Deployed to GitHub Pages | ⏳ You do this (§5) — no GitHub access on my end |
| Google Sheets as the live RSVP database | ⏳ You do this (§3) — no Google account access on my end |
| Media assets (your real photos/video/music) | ⏳ You do this (§2) — none were uploaded here for me to use |

## Design notes

Palette is deep forest green, warm ivory, brushed gold, and a touch of dusty
rose — an evening-garden feel rather than the more common cream-and-terracotta
invite look. Headings use Cormorant Garamond, the couple's monogram uses the
Alex Brush script, and body text uses Jost. A single hand-drawn vine line
(the "signature" motif) threads between sections and draws itself in as you
scroll, tying the whole page together.

## A note on scope

A few things in the original brief need a real account somewhere I can't
reach from this environment: your GitHub repo, your Google account for
Sheets/Apps Script, and your actual photo/video/audio files (none were
attached to our conversation). Everything else — the full site, the backend
script, and exact click-by-click instructions for those three steps — is
done and ready to go.
