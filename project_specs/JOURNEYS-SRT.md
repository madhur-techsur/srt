# JOURNEYS: Simple Request Tracker (SRT)

**Document Type:** User Journey Maps
**Project Acronym:** SRT
**Date:** 2026-05-08
**Status:** Draft
**Related Personas:** PERSONAS-SRT.md
**Related JTBD:** JTBD-SRT.md
**Related PRD:** PRD-SRT.md

---

## 1. Journey Index

| JRN-ID | Persona | Scenario | Key JTBD | Stages |
|--------|---------|----------|----------|--------|
| JRN-01.1 | PER-01 Alex Rivera | Submitting a first request and verifying it was received | JTBD-01.1 | 5 |
| JRN-01.2 | PER-01 Alex Rivera | Encountering a validation error and recovering without help | JTBD-01.2 | 4 |
| JRN-01.3 | PER-01 Alex Rivera | Submitting a follow-up request in the same session | JTBD-01.3 | 3 |
| JRN-02.1 | PER-02 Jordan Kim | Validating the end-to-end request flow during a demo session | JTBD-02.1 | 6 |
| JRN-02.2 | PER-02 Jordan Kim | Confirming backend API contract via the browser Network panel | JTBD-02.2 | 4 |
| JRN-02.3 | PER-02 Jordan Kim | Testing that invalid input is rejected at the UI and API layers | JTBD-02.3 | 5 |

---

## 2. PER-01: Alex Rivera — Journey Maps

---

### JRN-01.1: Submitting a First Request

**Persona:** PER-01 (Alex Rivera)

**Scenario:** Alex needs to flag a work item for the internal team. This is Alex's first time using the tracker today. Alex opens the page, fills out the three-field form, clicks Submit, and needs to feel confident the request actually went through — ideally without asking anyone for confirmation.

**Related Jobs:** JTBD-01.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Arrive** | Opens browser, navigates to the app URL | Main page / form view | "Is this the right place? What do I do here?" | Neutral, slightly uncertain | No onboarding cue; unclear if the page loaded correctly | Clear page title and a visible, labelled form immediately signal purpose |
| **2. Orient** | Scans the form — reads field labels: Name, Title, Description | F0 — Request Submission Form | "OK, three fields. Name is me, Title is the summary, Description is the details — makes sense." | Settled, ready | Labels could be ambiguous (whose Name? what kind of Title?) | Placeholder hint text guides interpretation without adding clutter |
| **3. Fill Out** | Types name, then title, then description into the three fields | F0 — Request Submission Form | "Am I putting too much in Description? Is there a character limit?" | Focused | No visible character counter or guidance on expected length | Subtle helper text under Description manages scope expectations |
| **4. Submit** | Clicks the Submit button | F0 — Submit button → F4 API → F1 Storage | "Did it work? The page didn't reload — is that normal?" | Anxious, waiting | No immediate visual change causes a half-second panic | Button enters loading/disabled state during request to signal processing |
| **5. Confirm** | Reads the success message; glances at the table to see the new row | F3 — Submission Acknowledgment; F2 — Request List View | "There it is — my request is in the table. It worked." | Relieved, confident | If table row doesn't appear, Alex has only the message to trust | Table auto-refresh ensures the row is visible within 2 seconds, reinforcing the message |

---

#### Key Moments

- **Decision Point — Stage 2:** If the form layout is confusing or labels are ambiguous, Alex may fill fields incorrectly, leading to a meaningless submission and frustration later.
- **Risk of Abandonment — Stage 4:** The gap between clicking Submit and seeing a response is the highest-risk moment. If nothing visually changes, Alex may click Submit again (duplicate submission) or leave the page.
- **Delight Opportunity — Stage 5:** Seeing both the confirmation message *and* the new row in the table simultaneously is the trust-clinching moment. Both signals together create confidence no single signal achieves alone.

---

#### Success Outcome

Alex completes a full form submission and sees a confirmation message within 2 seconds of clicking Submit, with the new entry visible in the table — all without a page reload and with no prior instruction needed. *(JTBD-01.1 success measure)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive | — |
| Orient | F0 (Request Submission Form) |
| Fill Out | F0 (Request Submission Form) |
| Submit | F0 (Submit), F4 (API Layer), F1 (Storage) |
| Confirm | F3 (Submission Acknowledgment), F2 (Request List View) |

---

### JRN-01.2: Encountering a Validation Error and Recovering

**Persona:** PER-01 (Alex Rivera)

**Scenario:** Alex is in a hurry and clicks Submit before filling in all three fields. The form should stop the submission, tell Alex exactly what is missing, and let Alex fix it without starting over or needing to reload the page.

**Related Jobs:** JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Premature Submit** | Clicks Submit with one or more empty fields | F0 — Submit button | "I think I filled everything — or did I?" | Impatient, slightly careless | If Submit is not visually disabled for empty forms, it's trivially easy to trigger this path | A disabled Submit state (or inline required-field indicators) prevents the error before it happens |
| **2. Error Appears** | Sees inline error message(s) beside the empty field(s) | F0 — Inline validation messages | "Oh — I missed the Description. It says it right there." | Briefly embarrassed, then focused | Generic error messages ("something went wrong") leave Alex guessing which field to fix | Field-specific, plain-language errors ("Description is required") pinpoint the fix immediately |
| **3. Correct & Resubmit** | Fills in the missing field and clicks Submit again | F0 — Request Submission Form | "Fixed it. Let me try again." | Determined | If data in other fields was erased by the first attempt, Alex must re-enter everything | Partial data is preserved; only the empty field needs attention |
| **4. Confirm** | Sees the success message and the row in the table | F3 — Submission Acknowledgment; F2 — Request List View | "OK, it went through this time. No harm done." | Relieved | If the error state lingers after successful resubmission, Alex may doubt the second attempt worked | Error indicators clear immediately upon success; confirmation message is visually distinct from the error state |

---

#### Key Moments

- **Critical Moment — Stage 2:** The quality of the error message determines whether Alex self-recovers in seconds or stalls. Vague errors push Alex toward frustration or abandonment.
- **Risk of Abandonment — Stage 2:** If errors feel overwhelming or confusing, Alex may give up and report the issue to a colleague instead of fixing it independently.
- **Delight Opportunity — Stage 3:** Preserving filled field data across a failed attempt is a small but meaningful quality signal — "it remembers what I already typed."

---

#### Success Outcome

Alex identifies the exact field causing the validation failure within seconds of the error appearing, corrects it, and resubmits successfully — all within 30 seconds, without leaving the page. *(JTBD-01.2 success measure)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Premature Submit | F0 (Request Submission Form) |
| Error Appears | F0 (Inline validation — client-side, no F1 call) |
| Correct & Resubmit | F0, F4 (API), F1 (Storage) |
| Confirm | F3 (Submission Acknowledgment), F2 (Request List View) |

---

### JRN-01.3: Submitting a Follow-Up Request in the Same Session

**Persona:** PER-01 (Alex Rivera)

**Scenario:** Alex has just successfully submitted one request and has a second item to log immediately. The form should reset automatically so Alex can enter new data without any manual clearing, reloading, or residual confusion from the previous submission.

**Related Jobs:** JTBD-01.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Notice Reset** | After confirmation message appears, glances back at the form | F0 — Form fields; F3 — Confirmation message | "The fields are empty again — it's ready for my next request." | Pleasantly surprised, efficient | If old data is still in the fields, Alex must manually clear each one before typing — annoying friction | Automatic post-submission reset is invisible when it works; it only becomes visible as a pain when it doesn't |
| **2. Enter Second Request** | Types new Name, Title, and Description for the second item | F0 — Request Submission Form | "I don't need to worry about the previous one bleeding into this." | Focused, efficient | Previous confirmation message still visible may create visual noise or confusion about which submission is current | Confirmation message auto-dismisses or clearly resets with the form, so it's unambiguous that a new submission cycle has begun |
| **3. Submit and Confirm** | Clicks Submit; sees second confirmation; sees second row in table | F0, F4, F1, F3, F2 | "Both requests are in the table now. Done." | Satisfied, confident | If the table now shows both entries but they look identical due to similar test data, Alex might not be sure both went through | Table rows display in submission order; each row is visually distinct via its data |

---

#### Key Moments

- **Critical Moment — Stage 1:** The form reset (or lack thereof) is the make-or-break of this journey. If it doesn't happen automatically, every multi-submission workflow is degraded.
- **Delight Opportunity — Stage 3:** Seeing both entries in the table side by side is a natural end-of-session confirmation — "everything I submitted is here."

---

#### Success Outcome

Alex submits a second distinct request within 15 seconds of the first confirmation appearing, without touching the browser refresh button, and both entries are visible in the table. *(JTBD-01.3 success measure)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Notice Reset | F0 (auto-reset), F3 (Confirmation message) |
| Enter Second Request | F0 (Request Submission Form) |
| Submit and Confirm | F0, F4, F1, F3, F2 |

---

## 3. PER-02: Jordan Kim — Journey Maps

---

### JRN-02.1: Validating the End-to-End Request Flow During a Demo Session

**Persona:** PER-02 (Jordan Kim)

**Scenario:** Jordan is about to run or observe a live demo of the application. Before any test data exists, Jordan needs to confirm the empty state renders correctly, then submit a test entry via the form and verify it appears in the table automatically — all within a single session, without triggering a page reload or switching to an external tool.

**Related Jobs:** JTBD-02.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Open App** | Navigates to the application URL; inspects the initial page state | Main page — form + table area | "Is the backend up? Does the table show the empty state correctly?" | Alert, methodical | If the table is blank with no message, it's ambiguous — is it empty or broken? | A clear "No requests yet" empty state message confirms the table render path is working before any data is submitted |
| **2. Verify Empty State** | Reads the empty state message in the table area; notes that no rows are present | F2 — Request List View (empty state) | "Good — it says 'No requests yet.' The table is rendering; it's just unpopulated." | Reassured | Absence of explicit empty state creates doubt that persists through the whole demo | A visible empty state is low-effort to implement and high-value for demo credibility |
| **3. Submit Test Entry** | Fills out the form with test data (e.g., "Jordan Kim", "Test Entry", "Verifying round-trip") and submits | F0 — Request Submission Form; F4 API; F1 Storage | "POST is going out… 201 returned. Now does the table update?" | Focused, slightly tense | Any lag between success message and table update creates doubt about the auto-refresh | Table refresh on POST success must be fast and automatic — no polling delay visible to the user |
| **4. Confirm Table Update** | Watches the table; sees the new row appear without reloading the page | F2 — Request List View (auto-refresh); F3 — Submission Acknowledgment | "Row appeared in under 2 seconds, all three fields correct. Round-trip confirmed." | Confident, satisfied | If data in the table row doesn't exactly match the submitted form input, it raises data integrity questions | Table renders submitted values character-for-character; no truncation or reformatting |
| **5. Verify Data Fidelity** | Compares the table row (Name, Title, Description) against what was entered in the form | F2 — Request List View | "Name, Title, Description — all matching. No truncation, no garbling." | Thorough, reassured | Truncated Description column (e.g., clipped at 50 chars in the UI) hides potential backend storage issues | All three columns render in full for demo-scale data; truncation is a concern only at production volume |
| **6. Declare Flow Valid** | Closes the form area or notes in demo script: "End-to-end flow is working" | — | "Input → store → retrieve → display: all green. Ready to demo." | Confident, ready | No explicit "all clear" UI signal exists — Jordan must mentally synthesize the evidence | The combination of 201 status + immediate table row + matching data is the three-signal confirmation Jordan needs |

---

#### Key Moments

- **Decision Point — Stage 2:** If the empty state is missing, Jordan may halt the demo to investigate whether the table component is broken. This is a visible, avoidable failure.
- **Risk of Abandonment — Stage 4:** If the table does not update automatically, Jordan must reload — which breaks the demo narrative and signals a known integration risk was unresolved.
- **Delight Opportunity — Stage 4-5:** A fast, automatic table update with exact field fidelity is the moment where the system "proves itself" in Jordan's eyes. It converts a technical check into a confident demo moment.

---

#### Success Outcome

Jordan submits a test entry and confirms it appears correctly in the table in under 5 seconds, without triggering a page reload or using any external tool, and all three fields match the submitted input. *(JTBD-02.1 success measure)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open App | F2 (initial GET), F4 (API) |
| Verify Empty State | F2 (Request List View — empty state) |
| Submit Test Entry | F0 (Form), F4 (API), F1 (Storage) |
| Confirm Table Update | F2 (auto-refresh), F3 (Acknowledgment) |
| Verify Data Fidelity | F2 (Request List View) |
| Declare Flow Valid | — |

---

### JRN-02.2: Confirming the Backend API Contract via the Browser Network Panel

**Persona:** PER-02 (Jordan Kim)

**Scenario:** Jordan opens the browser DevTools Network panel while using the app normally. Without switching to Postman or curl, Jordan needs to observe that `POST /api/requests` returns HTTP 201 with the stored object, `GET /api/requests` returns the full array, and CORS is not blocking any requests.

**Related Jobs:** JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Open DevTools** | Opens browser DevTools, switches to the Network tab, clears existing entries | Browser DevTools — Network panel | "I want to capture every request from a clean state." | Methodical, in control | Pre-existing network entries from page load clutter the view; Jordan must filter | Network tab filter on "XHR/Fetch" isolates the API calls cleanly |
| **2. Submit Valid Request** | Fills out the form and submits; watches Network tab for the POST | F0 (Form), F4 (API — POST /api/requests), F1 (Storage) | "POST fired. Status is… 201. Response body has ID and timestamp. CORS headers present." | Focused, analytical | If status is 200 instead of 201, Jordan flags a non-compliant backend contract | Correct use of 201 Created (not 200 OK) for POST is a clear correctness signal Jordan checks first |
| **3. Inspect GET Response** | Triggers page load or form submission; inspects the GET /api/requests call | F4 (API — GET /api/requests), F2 (Request List View) | "GET returned 200. JSON array with one entry — ID, name, title, description, timestamp. All present." | Satisfied | If the GET response schema doesn't match the POST response schema, it raises inconsistency concerns | Consistent JSON schema across POST response and GET array items is an implicit contract Jordan validates |
| **4. Verify CORS** | Checks response headers on any API call for CORS header presence; confirms no CORS errors in console | Browser DevTools — Console + Network headers | "No CORS error in console. Access-Control-Allow-Origin header is present. Frontend–backend connection is clean." | Relieved | A CORS misconfiguration produces a red console error that immediately undermines demo credibility | CORS configured correctly from the start eliminates the single most visible integration failure mode |

---

#### Key Moments

- **Critical Moment — Stage 2:** The HTTP 201 status code is Jordan's primary correctness signal. A 200 is technically functional but marks a backend contract violation.
- **Risk of Abandonment — Stage 4:** A CORS error in the console is visually alarming and immediately raises the question of whether *any* API call is actually succeeding. It can derail an entire demo.
- **Delight Opportunity — Stage 2:** Seeing the stored object returned in the POST response body — including the system-assigned ID and timestamp — confirms the backend is doing more than accepting data; it's actively processing and returning it.

---

#### Success Outcome

Jordan inspects the browser Network tab and confirms `POST /api/requests` returns 201 with the stored object and `GET /api/requests` returns the full array — both in a single demo session, no external tooling needed. *(JTBD-02.2 success measure)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open DevTools | — |
| Submit Valid Request | F0 (Form), F4 (POST /api/requests), F1 (Storage) |
| Inspect GET Response | F4 (GET /api/requests), F2 (Request List View) |
| Verify CORS | F4 (CORS configuration) |

---

### JRN-02.3: Testing That Invalid Input Is Rejected at the UI and API Layers

**Persona:** PER-02 (Jordan Kim)

**Scenario:** Jordan deliberately submits an empty form to verify that client-side validation fires without sending a network request, then tests the API directly (or observes the UI error state) to confirm that server-side validation independently returns HTTP 400 for a malformed POST. Jordan needs both layers to work correctly and independently.

**Related Jobs:** JTBD-02.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Open Network Tab** | Opens DevTools Network panel; sets up monitoring before triggering the test | Browser DevTools — Network panel | "I need to confirm zero network activity when the form fires a validation error." | Methodical, deliberate | If the Network tab is opened after the fact, Jordan may miss the non-event (no POST = no entry to inspect) | The test is self-documenting: the absence of a network entry is the evidence of correct behavior |
| **2. Submit Empty Form** | Leaves all fields blank and clicks Submit | F0 — Request Submission Form (client-side validation) | "No network call appeared. Inline errors are showing for all three fields. Client-side validation is working." | Confident, analytical | If a POST fires despite empty fields, client-side validation is broken — Jordan notes this as a defect | Zero network calls on empty submit is the binary pass/fail signal for this test step |
| **3. Verify Inline Errors** | Reads the field-level error messages displayed beside each empty field | F0 — Inline validation messages | "Each field has its own error. 'Name is required', 'Title is required', 'Description is required' — specific and clear." | Satisfied | A single generic error ("Please fill all fields") passes the functional test but fails the UX quality bar Jordan expects | Per-field errors demonstrate that the validation logic is field-aware, not just a blanket block |
| **4. Fix and Resubmit** | Fills in all three fields and submits; watches for 201 in Network tab | F0 (Form), F4 (API), F1 (Storage) | "Now the POST fired. Status 201. The error state cleared when I filled in the fields. Validation lifecycle is clean." | Thorough, reassured | If error indicators do not clear after the fields are filled, the UI is in a misleading state | Error clearing on field fill (not only on resubmit) signals a polished, reactive validation implementation |
| **5. Confirm API-Level Rejection** | Notes (from prior knowledge or direct curl test) that a malformed POST returns HTTP 400 | F4 (POST /api/requests — invalid payload), F1 (server-side validation) | "Even if someone bypasses the UI, the backend rejects it with 400. Both layers are defended." | Confident in system integrity | Without server-side validation, client-side validation is the only gate — easily bypassed | Server-side 400 with a descriptive error body closes the validation gap and satisfies Jordan's backend contract check |

---

#### Key Moments

- **Critical Moment — Stage 2:** Zero network calls on empty submit is a binary pass/fail. If Jordan sees a network entry, the client-side validation is broken regardless of whether the backend rejects it.
- **Decision Point — Stage 3:** The granularity of the error messages determines whether this is a passing UX test or merely a passing functional test. Jordan holds both bars simultaneously.
- **Delight Opportunity — Stage 4:** The error state clearing on fill (not just on next submit) is a subtlety Jordan notices and values — it signals a thoughtful implementation, not a bolted-on validation.

---

#### Success Outcome

Jordan submits an empty form, confirms zero network requests were triggered via the Network tab, then submits a complete form and confirms HTTP 201 is returned — all within a single 2-minute test sequence. *(JTBD-02.3 success measure)*

---

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open Network Tab | — |
| Submit Empty Form | F0 (client-side validation) |
| Verify Inline Errors | F0 (inline error messages) |
| Fix and Resubmit | F0, F4 (POST), F1 (Storage) |
| Confirm API-Level Rejection | F4 (POST — invalid payload), F1 (server-side validation) |

---

## 4. Cross-Journey Patterns

### CP-01: The Confirmation Gap (Stages: Submit → Confirm in JRN-01.1, JRN-01.3, JRN-02.1)

**Pattern:** All three journeys pass through the same critical moment — the user clicks Submit and waits for visual feedback. In JRN-01.1 and JRN-01.3, Alex needs the confirmation message to trust the submission was received. In JRN-02.1, Jordan needs the table update to verify the round-trip. The same underlying mechanism (POST response triggers F3 acknowledgment + F2 table refresh) must satisfy both personas simultaneously.

**Shared Opportunity:** A fast, reliable, single-mechanism response to a successful POST (confirmation message + table row addition) satisfies the trust need of the non-technical user *and* the verification need of the technical user in the same UI moment.

---

### CP-02: Table as Second Confirmation (JRN-01.1, JRN-01.3, JRN-02.1, JRN-02.2)

**Pattern:** Both personas use the table as a confirmation layer, but for different reasons. Alex uses it to double-check that the submission "really worked." Jordan uses it to verify data fidelity and end-to-end correctness. This means the table must be accurate *and* readable at the same time — it is simultaneously a UX trust signal and a technical validation surface.

**Shared Opportunity:** The table's auto-refresh on POST success is the single implementation decision that satisfies both use cases. Getting it right (fast, automatic, no reload) creates a system that works for both personas without trade-offs.

---

### CP-03: Validation Error as Dual Audience (JRN-01.2, JRN-02.3)

**Pattern:** Alex encounters validation errors accidentally; Jordan triggers them deliberately. The same error state must be legible to a non-technical user (plain language, field-specific) *and* informative to a technical user (confirming zero network calls, per-field specificity). These requirements are complementary, not in tension.

**Shared Opportunity:** Plain-language, per-field inline errors satisfy Alex's comprehension need while also being granular enough to satisfy Jordan's technical validation check. Implementing this once satisfies both personas completely.

---

### CP-04: Empty State as System Health Indicator (JRN-02.1)

**Pattern:** The empty state message ("No requests yet") matters most to Jordan but also benefits Alex on first load. If the table renders correctly with no data, both personas have early confirmation that the system is alive and functional before any data exists.

**Shared Opportunity:** A minimal empty state message is a low-cost, high-credibility signal for both personas. It confirms the table render path works, which is valuable for technical validation *and* reassuring for first-time business users.

---

## 5. Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|--------|-------|---------|-----------------|
| JRN-01.1 | Fill Out | JTBD-01.1 | All three fields accept input with clear labels and no friction |
| JRN-01.1 | Submit | JTBD-01.1 | POST request is sent; button enters loading state to signal processing |
| JRN-01.1 | Confirm | JTBD-01.1 | Confirmation message appears within 2 seconds; new row visible in table without reload |
| JRN-01.2 | Premature Submit | JTBD-01.2 | Submit attempt with empty fields is blocked at the client; no network call fires |
| JRN-01.2 | Error Appears | JTBD-01.2 | Field-specific, plain-language inline error messages appear beside each empty field |
| JRN-01.2 | Correct & Resubmit | JTBD-01.2 | Previously filled fields are preserved; only the empty field requires correction |
| JRN-01.2 | Confirm | JTBD-01.2 | Error state clears; success confirmation appears; no residual error indicators |
| JRN-01.3 | Notice Reset | JTBD-01.3 | All form fields are empty and ready after the first successful submission |
| JRN-01.3 | Enter Second Request | JTBD-01.3 | No residual data or UI state from previous submission interferes with new entry |
| JRN-01.3 | Submit and Confirm | JTBD-01.3 | Second entry appears in table alongside the first; both rows visible and distinct |
| JRN-02.1 | Verify Empty State | JTBD-02.1 | "No requests yet" message confirms table renders correctly before any data exists |
| JRN-02.1 | Submit Test Entry | JTBD-02.1 | POST fires; 201 returned; form acknowledgment appears; table refresh begins |
| JRN-02.1 | Confirm Table Update | JTBD-02.1 | New row appears in table within 2 seconds, with all three fields matching submitted input |
| JRN-02.1 | Verify Data Fidelity | JTBD-02.1 | Name, Title, and Description display exactly as entered — no truncation or reformatting |
| JRN-02.2 | Submit Valid Request | JTBD-02.2 | POST /api/requests returns HTTP 201 with stored object including ID and timestamp |
| JRN-02.2 | Inspect GET Response | JTBD-02.2 | GET /api/requests returns HTTP 200 with JSON array including the new entry |
| JRN-02.2 | Verify CORS | JTBD-02.2 | No CORS errors in browser console; Access-Control-Allow-Origin header present on API responses |
| JRN-02.3 | Submit Empty Form | JTBD-02.3 | Zero network requests triggered (visible in Network tab); inline errors appear for all empty fields |
| JRN-02.3 | Verify Inline Errors | JTBD-02.3 | Per-field errors are specific and plain-language ("Name is required", etc.) |
| JRN-02.3 | Fix and Resubmit | JTBD-02.3 | Error state clears on field fill; POST fires on resubmit; 201 returned |
| JRN-02.3 | Confirm API-Level Rejection | JTBD-02.3 | Direct POST to /api/requests with missing fields returns HTTP 400 with descriptive error body |

---

*Document generated by Pivota Spec Journeys Generator | Project: SRT | 2026-05-08*
