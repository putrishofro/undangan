/**
 * ============================================================
 * WEDDING INVITATION — Google Apps Script backend
 * ============================================================
 * What this does:
 *  - doPost(e)  → receives an RSVP submission from the website
 *                 and appends it as a new row in Google Sheets.
 *  - doGet(e)   → returns all submitted wishes as JSON so the
 *                 website's "Ucapan & Doa" section can display
 *                 them (called on page load + every N seconds).
 *
 * SETUP (see README.md for full step-by-step with screenshots
 * descriptions):
 *  1. Create a Google Sheet. Rename the first tab "RSVP".
 *  2. Open Extensions > Apps Script, delete the placeholder code,
 *     and paste this entire file in.
 *  3. Run `setupSheet` once from the Apps Script editor (this
 *     creates the header row for you) and grant permissions.
 *  4. Deploy > New deployment > Web app.
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  5. Copy the /exec URL you're given and paste it into
 *     js/config.js as `scriptUrl`.
 * ============================================================
 */

const SHEET_NAME = "RSVP";

/** Creates the header row. Run this once manually before deploying. */
function setupSheet() {
  const sheet = getSheet_();
  const headers = ["Timestamp", "Name", "Attendance", "Guests", "Message"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles RSVP submissions (POST) from the website.
 * Expected JSON body: { action: "rsvp", name, attendance, guests, message }
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.action !== "rsvp") {
      return jsonResponse_({ status: "error", message: "Unknown action" });
    }

    const name = (body.name || "").toString().trim();
    const attendance = (body.attendance || "").toString().trim();
    const guests = (body.guests || "1").toString().trim();
    const message = (body.message || "").toString().trim();

    if (!name || !attendance || !message) {
      return jsonResponse_({ status: "error", message: "Missing required fields" });
    }

    const sheet = getSheet_();
    sheet.appendRow([new Date(), name, attendance, guests, message]);

    return jsonResponse_({ status: "success" });
  } catch (err) {
    return jsonResponse_({ status: "error", message: err.message });
  }
}

/**
 * Serves the wishes list (GET) for the "Ucapan & Doa" section.
 * Usage: GET {scriptUrl}?action=wishes
 */
function doGet(e) {
  const action = e.parameter.action;

  if (action === "wishes") {
    const sheet = getSheet_();
    const values = sheet.getDataRange().getValues();
    const rows = values.slice(1); // drop header row

    const wishes = rows
      .filter((r) => r[1]) // has a name
      .map((r) => ({
        timestamp: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        name: String(r[1]),
        attendance: String(r[2]),
        guests: String(r[3]),
        message: String(r[4]),
      }));

    return jsonResponse_({ status: "success", wishes: wishes });
  }

  return jsonResponse_({ status: "error", message: "Unknown action" });
}
