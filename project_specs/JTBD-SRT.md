# JTBD: Simple Request Tracker (SRT)

**Document Type:** Jobs-to-be-Done  
**Project Acronym:** SRT  
**Date:** 2026-05-08  
**Status:** Draft  
**Related Personas:** PERSONAS-SRT.md  
**Related PRD:** PRD-SRT.md  

---

## 1. JTBD Summary Table

| JTBD-ID | Persona | Job Statement (abbreviated) | Priority |
|---------|---------|------------------------------|----------|
| JTBD-01.1 | PER-01 Alex Rivera | Submit a request and know it was received | P0 |
| JTBD-01.2 | PER-01 Alex Rivera | Understand and fix a failed submission without outside help | P0 |
| JTBD-01.3 | PER-01 Alex Rivera | Submit a follow-up request immediately after the first | P1 |
| JTBD-02.1 | PER-02 Jordan Kim | Verify the end-to-end request flow works in a single session | P0 |
| JTBD-02.2 | PER-02 Jordan Kim | Confirm the backend API contract is correct without external tooling | P0 |
| JTBD-02.3 | PER-02 Jordan Kim | Validate that the system handles invalid input correctly | P0 |

---

## 2. PER-01: Alex Rivera — Requester Jobs

---

### JTBD-01.1: Submit a Request and Know It Was Received

**Job Statement:**
When I need to flag something for the internal team, I want to fill out a short form and submit it, so I can be confident the request was received and will be acted on.

**Current Alternatives:**
- Sends a direct message in Slack or email, with no structured confirmation the item was logged
- Uses a shared spreadsheet, with no real-time acknowledgment or validation
- Relies on a colleague to confirm receipt verbally, adding unnecessary follow-up overhead

**Hiring Criteria:**
- Form presents Name, Title, and Description fields with clear labels
- Submit button is clearly identifiable and only activates when all fields are valid
- A visible, distinct confirmation message appears within 2 seconds of submission — no page reload required
- The submission also appears in the visible request table, providing a second layer of confirmation

**Success Measure:** Alex completes a full form submission and sees a confirmation message in under 60 seconds, with no prior instruction needed.

**Related Features:** F0, F3, F4  
**Priority:** P0

---

### JTBD-01.2: Understand and Fix a Failed Submission Without Outside Help

**Job Statement:**
When my form submission is blocked or fails, I want to immediately see which field caused the problem and what to fix, so I can correct it myself without contacting support or guessing.

**Current Alternatives:**
- Resubmits the form repeatedly hoping different input fixes the problem
- Contacts a colleague or support person to ask why the form isn't working
- Abandons the submission entirely and uses an alternative channel

**Hiring Criteria:**
- Inline validation error messages appear directly beside the field that is missing or invalid
- Errors appear before or immediately upon submission attempt — not after a page reload
- Error language is plain and specific (e.g., "Name is required") — not a generic system message
- A failed submission does not erase the data already entered in other fields

**Success Measure:** Alex identifies the exact field causing a validation failure and resubmits successfully within 30 seconds, without leaving the page.

**Related Features:** F0, F1  
**Priority:** P0

---

### JTBD-01.3: Submit a Follow-Up Request Immediately After the First

**Job Statement:**
When I have more than one item to log in the same session, I want the form to reset cleanly after my first submission, so I can enter a second request without reloading the page or clearing residual data manually.

**Current Alternatives:**
- Manually clears each field after submission before re-entering new data
- Reloads the page to get a clean form, losing context and slowing down
- Uses a separate browser tab for each request

**Hiring Criteria:**
- All form fields are cleared automatically after a successful submission
- The confirmation message from the first submission does not persist in a confusing way during the second submission
- No page reload is required to begin a second submission

**Success Measure:** Alex submits a second distinct request within 15 seconds of the first confirmation appearing, without touching the browser refresh button.

**Related Features:** F0, F3  
**Priority:** P1

---

## 3. PER-02: Jordan Kim — Viewer / Engineer Jobs

---

### JTBD-02.1: Verify the End-to-End Request Flow Works in a Single Session

**Job Statement:**
When I am validating the application before or during a demo, I want to submit a test request and immediately see it appear in the table without reloading, so I can confirm that the full input → store → retrieve → display cycle is functioning correctly.

**Current Alternatives:**
- Manually refreshes the page after each submission to check if the table updates — breaks the demo narrative
- Uses curl or Postman to verify the POST was stored and then separately checks the UI — requires context switching
- Relies on a pre-seeded database state rather than a live round-trip test

**Hiring Criteria:**
- A submitted request appears in the request table within 2 seconds of submission confirmation, with no manual page reload
- The table displays all three data fields — Name, Title, and Description — exactly as entered in the form
- The empty state message ("No requests yet") is present before any submissions, confirming the table render path is working

**Success Measure:** Jordan submits a test entry and confirms it appears correctly in the table in under 5 seconds, without triggering a page reload or using any external tool.

**Related Features:** F0, F1, F2, F3, F4  
**Priority:** P0

---

### JTBD-02.2: Confirm the Backend API Contract Is Correct Without External Tooling

**Job Statement:**
When I need to verify backend correctness during a demo or integration check, I want the API to return well-formed, consistent HTTP responses that I can observe through the browser's network panel, so I can confirm backend compliance without switching to Postman or curl.

**Current Alternatives:**
- Uses Postman to manually test `POST /api/requests` and `GET /api/requests` outside the UI
- Reads raw server logs to infer correct behavior — not accessible during a demo
- Infers correctness from UI behavior alone, without confirming actual HTTP status codes or JSON structure

**Hiring Criteria:**
- `POST /api/requests` returns HTTP 201 with the stored request object (including system-assigned ID and timestamp) in the JSON response body
- `GET /api/requests` returns HTTP 200 with a JSON array of all stored requests
- `POST /api/requests` with missing fields returns HTTP 400 with a descriptive error payload
- CORS headers are correctly configured so the React frontend can reach the Spring Boot API without error
- All responses use `Content-Type: application/json`

**Success Measure:** Jordan inspects the browser Network tab and confirms `POST /api/requests` returns 201 and `GET /api/requests` returns the full array — both in a single demo session, with no external tooling.

**Related Features:** F1, F4  
**Priority:** P0

---

### JTBD-02.3: Validate That the System Handles Invalid Input Correctly

**Job Statement:**
When I deliberately submit a form with missing fields, I want to see the validation error appear in the UI without a network request being sent, so I can confirm that client-side validation is working and that the backend is not receiving invalid data unnecessarily.

**Current Alternatives:**
- Submits an empty form and inspects the Network tab to see if a POST was attempted — infers pass/fail from network activity
- Tests directly against the API with curl, bypassing the UI validation layer entirely
- Reviews frontend source code to infer whether validation is implemented — not a behavioral test

**Hiring Criteria:**
- Submitting the form with one or more empty fields shows an inline error and does not trigger a POST request (verifiable via the Network tab — zero network calls)
- Server-side validation independently rejects a malformed POST (missing fields) with HTTP 400 and a descriptive error message
- The UI error state is cleared when the user corrects the field and resubmits successfully

**Success Measure:** Jordan submits an empty form, confirms zero network requests were triggered (via Network tab), then submits the same form with all fields filled and confirms HTTP 201 is returned — all within a single 2-minute test sequence.

**Related Features:** F0, F1, F4  
**Priority:** P0

---

## 4. Outcome-to-Feature Traceability

| JTBD-ID | Related Features | Expected Outcome |
|---------|-----------------|-----------------|
| JTBD-01.1 | F0, F3, F4 | User submits form and sees a success message within 2 seconds; request appears in the table |
| JTBD-01.2 | F0, F1 | User sees field-level validation errors inline; can correct and resubmit without page reload |
| JTBD-01.3 | F0, F3 | Form fields reset automatically after successful submission; second submission flows without friction |
| JTBD-02.1 | F0, F1, F2, F3, F4 | Submitted request appears in table within 2 seconds; empty state renders correctly before first entry |
| JTBD-02.2 | F1, F4 | `POST /api/requests` returns 201 with stored object; `GET /api/requests` returns full JSON array; CORS configured |
| JTBD-02.3 | F0, F1, F4 | Empty form submission triggers no network call and shows inline errors; invalid POST returns HTTP 400 |

---

## 5. NaC Preview

> *Candidate Natural Acceptance Criteria — to be refined in STORY-MAP. These are testable expressions of each job's success measure.*

| JTBD-ID | Outcome | Candidate Natural Acceptance Criteria |
|---------|---------|---------------------------------------|
| JTBD-01.1 | Request submitted and acknowledged | Given a user fills in Name, Title, and Description and clicks Submit, when the submission succeeds, then a confirmation message is visible within 2 seconds and the new entry appears in the table without a page reload |
| JTBD-01.2 | Validation error is clear and actionable | Given a user clicks Submit with one or more empty fields, when validation fires, then a field-specific error message appears inline beside each empty field and no POST request is sent |
| JTBD-01.3 | Form resets cleanly after submission | Given a user has just completed a successful submission, when the confirmation message appears, then all form fields are empty and ready for a new entry without any page reload |
| JTBD-02.1 | End-to-end flow verified in session | Given a test entry is submitted via the form, when the success confirmation appears, then the entry is visible in the request table within 2 seconds — with Name, Title, and Description matching the submitted values — and no manual page reload occurred |
| JTBD-02.2 | API contract verified via network panel | Given a valid POST to `/api/requests`, when the response is received, then HTTP 201 is returned with a JSON body containing the stored request including ID and timestamp; and `GET /api/requests` returns HTTP 200 with a JSON array including the new entry |
| JTBD-02.3 | Invalid submission rejected at UI and API | Given a form submission with all fields empty, when Submit is clicked, then zero network requests are triggered (confirmed via Network tab) and inline errors are shown; and a direct POST to `/api/requests` with empty fields returns HTTP 400 with a descriptive error body |

---

*Document generated by Pivota Spec JTBD Generator | Project: SRT | 2026-05-08*
