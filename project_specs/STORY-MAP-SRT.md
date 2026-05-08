# STORY MAP: Simple Request Tracker (SRT)

**Document Type:** User Story Map  
**Project Acronym:** SRT  
**Date:** 2026-05-08  
**Status:** Draft  
**Version:** 1.0  

| Field | Value |
|-------|-------|
| Product | Simple Request Tracker (SRT) |
| Generated | 2026-05-08 |
| Personas | PER-01 (Alex Rivera), PER-02 (Jordan Kim) |
| Related PRD | PRD-SRT.md |
| Related JTBD | JTBD-SRT.md |
| Related Journeys | JOURNEYS-SRT.md |
| Related UserStories | UserStories-SRT.md |
| Total Stories Mapped | 18 |
| Releases Planned | 2 (R1: MVP Core, R2: UX Polish) |

---

## 1. Overview

### Purpose

This story map organizes the 18 user stories of the Simple Request Tracker across two dimensions:

- **X-axis (columns):** Journey stages derived from JOURNEYS-SRT.md — the sequential steps each persona takes through the application
- **Y-axis (rows):** Activities and stories within each stage, grouped by epic and persona

Each story is annotated with a **Natural Acceptance Criterion (NaC)** — a testable statement derived directly from the intersection of a JTBD outcome (the "what matters") and the journey stage context (the "when/where"). NaC entries are NOT invented; every NaC is traceable to a specific JTBD-ID.

### NaC Concept

> **Natural Acceptance Criteria (NaC)** bridge JTBD job outcomes to story-level test criteria.  
> Derivation chain: `JTBD-ID: outcome` → `journey stage context` → `testable NaC statement`

NaC complement (not replace) the formal Acceptance Criteria in UserStories-SRT.md. They express the *user-observable success condition* that confirms a story fulfills the underlying job.

### Release Strategy

| Release | Theme | Scope |
|---------|-------|-------|
| R1 | **MVP Core — End-to-End Flow** | All P0 stories (15 stories). Delivers a complete, working application: form submission → backend storage → API contract → table display. Both personas can complete their primary journeys. |
| R2 | **UX Polish — Acknowledgment Layer** | All P1 stories (3 stories). Adds inline success/error messaging and acknowledgment lifecycle management. Elevates Alex's confidence and Jordan's UX validation surface. |

---

## 2. Story Map Matrix

### Consolidated Journey Stages (X-axis)

The SRT journeys converge on five canonical stages that span both personas:

| Stage ID | Stage Name | Description | Primary Journeys |
|----------|-----------|-------------|-----------------|
| **S1** | Arrive & Orient | Open app; inspect initial state; scan form layout | JRN-01.1 (Stages 1–2), JRN-02.1 (Stages 1–2) |
| **S2** | Fill Out Form | Enter data into Name, Title, Description fields | JRN-01.1 (Stage 3), JRN-01.3 (Stage 2), JRN-02.1 (Stage 3), JRN-02.3 (Stages 2–3) |
| **S3** | Submit & Validate | Click Submit; client-side + server-side validation fires | JRN-01.1 (Stage 4), JRN-01.2 (Stages 1–3), JRN-02.3 (Stages 2–4) |
| **S4** | API Contract | Backend processes request; HTTP status codes + CORS verified | JRN-02.2 (Stages 2–4), JRN-02.3 (Stage 5) |
| **S5** | Confirm & Review | Success/error feedback displayed; table refreshes; data verified | JRN-01.1 (Stage 5), JRN-01.2 (Stage 4), JRN-01.3 (Stages 1+3), JRN-02.1 (Stages 4–6) |

---

### Story Map Matrix — Full View

> **Columns:** Journey Stages (S1–S5)  
> **Rows:** Stories grouped by Epic  
> **NaC:** Derived from JTBD outcomes (see NaC Derivation Table for full traceability)  
> **Release:** R1 = P0 MVP, R2 = P1 Polish

---

#### PER-01: Alex Rivera (Business User / Requester)

| Story ID | Title | Journey Stage | Epic | NaC (JTBD Source) | Release |
|----------|-------|---------------|------|-------------------|---------|
| **US-0.1** | Submit a Request | S3: Submit & Validate | Epic 0 — F0 Form | *JTBD-01.1:* Clicking Submit with all fields filled sends the request and transitions to the confirm stage within 2 seconds | R1 |
| **US-0.2** | Client-Side Validation on Empty Fields | S3: Submit & Validate | Epic 0 — F0 Form | *JTBD-01.2:* Clicking Submit with empty fields shows a field-specific inline error and triggers zero network requests | R1 |
| **US-0.3** | Form Reset After Successful Submission | S5: Confirm & Review | Epic 0 — F0 Form | *JTBD-01.3:* After a successful submission, all three form fields are empty and ready for a new entry with no page reload | R1 |
| **US-0.4** | Server Error Handling Without Losing Input | S3: Submit & Validate | Epic 0 — F0 Form | *JTBD-01.2:* When a server error occurs, the user's typed content is preserved in the form fields so they can retry without re-entering data | R1 |
| **US-2.2** | Table Refreshes Automatically After Submission | S5: Confirm & Review | Epic 2 — F2 Table | *JTBD-01.1:* The new request appears in the table within 2 seconds of submission confirmation, without a manual page reload | R1 |
| **US-3.1** | Success Confirmation After Submission | S5: Confirm & Review | Epic 3 — F3 Ack | *JTBD-01.1:* A visually distinct success message "Request submitted successfully." appears inline within 2 seconds of HTTP 201, with no page reload | R2 |
| **US-3.2** | Error Message After Failed Submission | S5: Confirm & Review | Epic 3 — F3 Ack | *JTBD-01.2:* A specific, inline error message identifies the failure type (400 / 500 / network) so the user knows whether and how to retry | R2 |
| **US-3.3** | Acknowledgment Clears Before Next Submission | S5: Confirm & Review | Epic 3 — F3 Ack | *JTBD-01.3:* When the user submits again, any prior confirmation or error message clears before the new request is sent, so old and new feedback are never conflated | R2 |

---

#### PER-02: Jordan Kim (Internal User / Viewer & Engineer)

| Story ID | Title | Journey Stage | Epic | NaC (JTBD Source) | Release |
|----------|-------|---------------|------|-------------------|---------|
| **US-1.1** | Store a Valid Submission | S4: API Contract | Epic 1 — F1 Storage | *JTBD-02.1:* `POST /api/requests` with valid JSON returns HTTP 201 with the stored record (id, name, title, description, createdAt); the record is retrievable via GET in the same session | R1 |
| **US-1.2** | Server-Side Validation Rejects Blank Fields | S4: API Contract | Epic 1 — F1 Storage | *JTBD-02.3:* A POST with blank fields returns HTTP 400 with `errorCode: VALIDATION_FAILED` and a `fieldErrors` array — server-side validation fires independently of client-side validation | R1 |
| **US-1.3** | Malformed or Invalid Request Handling | S4: API Contract | Epic 1 — F1 Storage | *JTBD-02.2:* Malformed JSON returns HTTP 400 with `errorCode: INVALID_JSON`; wrong Content-Type returns HTTP 415; all error responses use `Content-Type: application/json` | R1 |
| **US-2.1** | View All Submitted Requests in a Table | S5: Confirm & Review | Epic 2 — F2 Table | *JTBD-02.1:* On page load, GET /api/requests is issued and the response renders as a table with Name, Title, Description columns in insertion order within 3 seconds | R1 |
| **US-2.3** | Empty State When No Requests Exist | S1: Arrive & Orient | Epic 2 — F2 Table | *JTBD-02.1:* Before any submissions, the message "No requests yet." is displayed in the table area — confirming the table render path is working, not broken | R1 |
| **US-2.4** | Table Load Error Handling | S1: Arrive & Orient | Epic 2 — F2 Table | *JTBD-02.1:* If GET /api/requests fails, the message "Could not load requests. Please refresh the page." is displayed and no empty/broken table element is rendered | R1 |
| **US-4.1** | POST Endpoint Creates and Returns a Request | S4: API Contract | Epic 4 — F4 API | *JTBD-02.2:* `POST /api/requests` returns HTTP 201 with `Content-Type: application/json` and a body containing id, name, title, description, and createdAt as ISO 8601 UTC | R1 |
| **US-4.2** | GET Endpoint Returns All Stored Requests | S4: API Contract | Epic 4 — F4 API | *JTBD-02.2:* `GET /api/requests` returns HTTP 200 with a JSON array of all stored records in insertion order; returns `[]` (not 404) when no records exist | R1 |
| **US-4.3** | CORS Configured for React Dev Server | S4: API Contract | Epic 4 — F4 API | *JTBD-02.2:* No CORS errors appear in the browser console when the React frontend on localhost:3000 or localhost:5173 calls either API endpoint; Access-Control-Allow-Origin header is present on responses | R1 |
| **US-4.4** | Correct HTTP Status Codes on All Responses | S4: API Contract | Epic 4 — F4 API | *JTBD-02.2:* POST returns 201 (not 200); GET returns 200; validation failure returns 400; wrong Content-Type returns 415; unhandled exception returns 500; all error bodies include `errorCode` and `message` — verifiable via browser Network tab without external tooling | R1 |

---

#### Summary: Story-to-Stage Mapping

| Journey Stage | Stories | Persona(s) | Epic(s) |
|---------------|---------|------------|---------|
| **S1: Arrive & Orient** | US-2.3, US-2.4 | PER-02 primary, PER-01 secondary | Epic 2 |
| **S2: Fill Out Form** | *(no standalone stories — inputs are part of US-0.1, US-0.2)* | — | — |
| **S3: Submit & Validate** | US-0.1, US-0.2, US-0.4 | PER-01 primary, PER-02 secondary | Epic 0 |
| **S4: API Contract** | US-1.1, US-1.2, US-1.3, US-4.1, US-4.2, US-4.3, US-4.4 | PER-02 primary | Epics 1, 4 |
| **S5: Confirm & Review** | US-0.3, US-2.1, US-2.2, US-3.1, US-3.2, US-3.3 | PER-01 + PER-02 | Epics 0, 2, 3 |

> **Note on S2 (Fill Out Form):** No story is exclusively scoped to the Fill Out stage — the form fields are built as part of US-0.1 (the base form story). US-0.2 and US-0.4 cover the validation and error paths that happen at the Submit boundary. This is expected and not a gap.

---

## 3. NaC Derivation Table

Full traceability: JTBD outcome → Journey stage → NaC text → Story

| NaC-ID | JTBD-ID | JTBD Outcome | Journey Stage | NaC Statement | Story |
|--------|---------|-------------|---------------|---------------|-------|
| NaC-01 | JTBD-01.1 | Submit a request and know it was received | S3: Submit & Validate (JRN-01.1, Stage 4) | Clicking Submit with all fields filled sends the POST request; the Submit button enters a loading/disabled state during the in-flight request | US-0.1 |
| NaC-02 | JTBD-01.2 | Understand and fix a failed submission without outside help | S3: Submit & Validate (JRN-01.2, Stage 1–2) | Clicking Submit with one or more empty fields shows field-specific inline errors ("This field is required.") and sends zero network requests | US-0.2 |
| NaC-03 | JTBD-01.3 | Submit a follow-up request immediately after the first | S5: Confirm & Review (JRN-01.3, Stage 1) | After HTTP 201 is received, all three form fields reset to empty and the Submit button is re-enabled — no page reload required | US-0.3 |
| NaC-04 | JTBD-01.2 | Understand and fix a failed submission without outside help | S3: Submit & Validate (JRN-01.1, Stage 4 — error path) | When the backend returns 400, 500, or a network failure, the user's form input is preserved in the fields so they can retry without re-entering data | US-0.4 |
| NaC-05 | JTBD-02.1 | Verify the end-to-end request flow works in a single session | S4: API Contract (JRN-02.1, Stage 3) | `POST /api/requests` with valid JSON returns HTTP 201 with a body containing id, name, title, description, and createdAt; the stored record is retrievable via GET in the same session | US-1.1 |
| NaC-06 | JTBD-02.3 | Validate that the system handles invalid input correctly | S4: API Contract (JRN-02.3, Stage 5) | A POST with blank/whitespace-only fields returns HTTP 400 with `errorCode: VALIDATION_FAILED` and a `fieldErrors` array identifying each failing field by name | US-1.2 |
| NaC-07 | JTBD-02.2 | Confirm the backend API contract is correct without external tooling | S4: API Contract (JRN-02.2, Stage 2) | Malformed JSON body returns HTTP 400 with `errorCode: INVALID_JSON`; wrong Content-Type returns HTTP 415; all error bodies use `Content-Type: application/json` | US-1.3 |
| NaC-08 | JTBD-02.1 | Verify the end-to-end request flow works in a single session | S5: Confirm & Review (JRN-02.1, Stage 5) | On page load, GET /api/requests renders all stored records as a Name/Title/Description table in insertion order within 3 seconds on localhost | US-2.1 |
| NaC-09 | JTBD-01.1 | Submit a request and know it was received | S5: Confirm & Review (JRN-01.1, Stage 5) | After HTTP 201, the new request appears in the table within 2 seconds without a manual page reload; no duplicates appear | US-2.2 |
| NaC-10 | JTBD-02.1 | Verify the end-to-end request flow works in a single session | S1: Arrive & Orient (JRN-02.1, Stage 2) | When GET /api/requests returns `[]`, the message "No requests yet." is displayed — confirming the table render path is working before any data exists | US-2.3 |
| NaC-11 | JTBD-02.1 | Verify the end-to-end request flow works in a single session | S1: Arrive & Orient (JRN-02.1, Stage 1) | If GET /api/requests fails (500 or network error), the message "Could not load requests. Please refresh the page." is displayed; no broken or empty table element is rendered | US-2.4 |
| NaC-12 | JTBD-01.1 | Submit a request and know it was received | S5: Confirm & Review (JRN-01.1, Stage 5) | After HTTP 201, a visually distinct inline success message "Request submitted successfully." appears within 2 seconds, using ARIA role="status" — no page reload, no browser alert() | US-3.1 |
| NaC-13 | JTBD-01.2 | Understand and fix a failed submission without outside help | S5: Confirm & Review (JRN-01.2, Stage 4) | After a failed submission, a specific inline error message identifies the failure type (HTTP 400, 500, or network) using visually distinct styling; it appears in the acknowledgment area, not as a popup | US-3.2 |
| NaC-14 | JTBD-01.3 | Submit a follow-up request immediately after the first | S5: Confirm & Review (JRN-01.3, Stage 2) | When the user clicks Submit again, any prior confirmation or error message is cleared before the new POST request is sent; the acknowledgment area remains in the DOM (no layout shift) | US-3.3 |
| NaC-15 | JTBD-02.2 | Confirm the backend API contract is correct without external tooling | S4: API Contract (JRN-02.2, Stage 2) | `POST /api/requests` with valid JSON returns HTTP 201 with `Content-Type: application/json`; response body includes id, name, title, description, createdAt (ISO 8601 UTC); client-provided id/createdAt values are ignored | US-4.1 |
| NaC-16 | JTBD-02.2 | Confirm the backend API contract is correct without external tooling | S4: API Contract (JRN-02.2, Stage 3) | `GET /api/requests` returns HTTP 200 with `Content-Type: application/json`; body is a JSON array of all stored records ordered by id ascending; returns `[]` (not 404) when empty | US-4.2 |
| NaC-17 | JTBD-02.2 | Confirm the backend API contract is correct without external tooling | S4: API Contract (JRN-02.2, Stage 4) | The React frontend on localhost:3000 and localhost:5173 can call both API endpoints without CORS errors in the browser console; Access-Control-Allow-Origin header is present on actual responses (not only preflight) | US-4.3 |
| NaC-18 | JTBD-02.2 | Confirm the backend API contract is correct without external tooling | S4: API Contract (JRN-02.2, Stage 2–4) | POST returns 201; GET returns 200; invalid POST returns 400; wrong Content-Type returns 415; unhandled server error returns 500; all error responses include `errorCode` and `message` — verifiable via browser Network tab with no external tooling | US-4.4 |

---

## 4. Release Planning

### R1: MVP Core — End-to-End Flow

**Theme:** Deliver a complete, working request submission and review cycle. Both personas can complete their primary journeys without workarounds.  
**Story count:** 15 (all P0 stories)  
**Journey completeness:** All five canonical stages (S1–S5) are covered. Alex can submit a request and see it in the table. Jordan can validate the full input → store → retrieve → display cycle and inspect the API contract.

#### R1 Stories by Epic

| Epic | Story ID | Title | Persona | NaC-ID |
|------|----------|-------|---------|--------|
| Epic 0 — F0 Form | US-0.1 | Submit a Request | PER-01 | NaC-01 |
| Epic 0 — F0 Form | US-0.2 | Client-Side Validation on Empty Fields | PER-01 | NaC-02 |
| Epic 0 — F0 Form | US-0.3 | Form Reset After Successful Submission | PER-01 | NaC-03 |
| Epic 0 — F0 Form | US-0.4 | Server Error Handling Without Losing Input | PER-01 | NaC-04 |
| Epic 1 — F1 Storage | US-1.1 | Store a Valid Submission | PER-02 | NaC-05 |
| Epic 1 — F1 Storage | US-1.2 | Server-Side Validation Rejects Blank Fields | PER-02 | NaC-06 |
| Epic 1 — F1 Storage | US-1.3 | Malformed or Invalid Request Handling | PER-02 | NaC-07 |
| Epic 2 — F2 Table | US-2.1 | View All Submitted Requests in a Table | PER-02 | NaC-08 |
| Epic 2 — F2 Table | US-2.2 | Table Refreshes Automatically After Submission | PER-01 | NaC-09 |
| Epic 2 — F2 Table | US-2.3 | Empty State When No Requests Exist | PER-02 | NaC-10 |
| Epic 2 — F2 Table | US-2.4 | Table Load Error Handling | PER-02 | NaC-11 |
| Epic 4 — F4 API | US-4.1 | POST Endpoint Creates and Returns a Request | PER-02 | NaC-15 |
| Epic 4 — F4 API | US-4.2 | GET Endpoint Returns All Stored Requests | PER-02 | NaC-16 |
| Epic 4 — F4 API | US-4.3 | CORS Configured for React Dev Server | PER-02 | NaC-17 |
| Epic 4 — F4 API | US-4.4 | Correct HTTP Status Codes on All Responses | PER-02 | NaC-18 |

#### R1 Journey Completion Check

| Journey | Stage Coverage | R1 Complete? |
|---------|---------------|-------------|
| JRN-01.1 (Alex: first request) | S1 (US-2.3), S3 (US-0.1), S4 (US-4.1, US-1.1), S5 (US-2.1, US-2.2) | ✅ Yes — full path; note: no acknowledgment banner (US-3.1 is R2), but table auto-refresh (US-2.2) provides secondary confirmation |
| JRN-01.2 (Alex: validation error) | S3 (US-0.2, US-0.4), S4 (US-1.2), S5 (US-2.1, US-2.2) | ✅ Yes — validation fires and user can recover; acknowledgment messaging added in R2 |
| JRN-01.3 (Alex: follow-up request) | S3 (US-0.1, US-0.3), S4 (US-4.1), S5 (US-2.2) | ✅ Yes — form resets; second submission flows |
| JRN-02.1 (Jordan: end-to-end validation) | S1 (US-2.3, US-2.4), S3 (US-0.1), S4 (US-1.1, US-4.1, US-4.2), S5 (US-2.1, US-2.2) | ✅ Yes — complete round-trip verifiable in R1 |
| JRN-02.2 (Jordan: API contract) | S4 (US-4.1, US-4.2, US-4.3, US-4.4, US-1.3) | ✅ Yes — all API contract checks covered |
| JRN-02.3 (Jordan: invalid input test) | S3 (US-0.2), S4 (US-1.2, US-4.4) | ✅ Yes — both layers validated |

#### R1 JTBD Coverage

| JTBD-ID | Job Statement | Addressed in R1? | Stories |
|---------|--------------|-----------------|---------|
| JTBD-01.1 | Submit a request and know it was received | ✅ Partial — table confirmation present; banner acknowledgment (US-3.1) deferred to R2 | US-0.1, US-2.2 |
| JTBD-01.2 | Understand and fix a failed submission without outside help | ✅ Core path covered — inline field errors (US-0.2) and input preservation (US-0.4) | US-0.2, US-0.4 |
| JTBD-01.3 | Submit a follow-up request immediately after the first | ✅ Covered — form reset (US-0.3) and acknowledgment clear (US-3.3 in R2, but reset itself is R1) | US-0.3 |
| JTBD-02.1 | Verify the end-to-end request flow works in a single session | ✅ Fully covered — empty state, table load, auto-refresh, data fidelity | US-1.1, US-2.1, US-2.2, US-2.3, US-2.4 |
| JTBD-02.2 | Confirm the backend API contract is correct without external tooling | ✅ Fully covered — all endpoint contracts, CORS, status codes | US-1.3, US-4.1, US-4.2, US-4.3, US-4.4 |
| JTBD-02.3 | Validate that the system handles invalid input correctly | ✅ Fully covered — both client-side and server-side rejection validated | US-0.2, US-1.2 |

---

### R2: UX Polish — Acknowledgment Layer

**Theme:** Add inline success/error acknowledgment messaging and its lifecycle management. Elevates Alex Rivera's trust in the system and completes Jordan Kim's UX validation surface.  
**Story count:** 3 (all P1 stories)  
**Journey completeness:** Completes the acknowledgment layer for JRN-01.1, JRN-01.2, and JRN-01.3. Jordan can now validate F3 UX correctness during demos.

#### R2 Stories

| Epic | Story ID | Title | Persona | NaC-ID | Why R2 (not R1) |
|------|----------|-------|---------|--------|-----------------|
| Epic 3 — F3 Ack | US-3.1 | Success Confirmation After Submission | PER-01 | NaC-12 | Table auto-refresh (US-2.2) provides functional confirmation in R1; banner adds trust, not capability |
| Epic 3 — F3 Ack | US-3.2 | Error Message After Failed Submission | PER-01 | NaC-13 | Server error handling (US-0.4) preserves input in R1; explicit error categorization in the acknowledgment area is a UX enhancement |
| Epic 3 — F3 Ack | US-3.3 | Acknowledgment Clears Before Next Submission | PER-01 | NaC-14 | Depends on US-3.1 and US-3.2 existing; acknowledgment lifecycle management is meaningful only when the acknowledgment messages exist |

#### R2 Journey Impact

| Journey | R2 Enhancement |
|---------|---------------|
| JRN-01.1 Stage 5 | Alex now sees "Request submitted successfully." (US-3.1) in addition to the table row — both confirmation signals present simultaneously |
| JRN-01.2 Stage 4 | Error message (US-3.2) categorizes 400 vs. 500 vs. network failures explicitly; Alex knows whether to retry or investigate |
| JRN-01.3 Stage 2 | Acknowledgment from first submission clears when second submission begins (US-3.3); no confusion between old and new feedback |
| JRN-02.1 Stages 3–4 | Jordan can now validate F3 UX correctness: success banner appears, uses ARIA role, does not trigger page reload |

#### R2 JTBD Completion

| JTBD-ID | R1 State | R2 Completion |
|---------|----------|--------------|
| JTBD-01.1 | Table confirmation present | ✅ Complete — US-3.1 adds the banner; both confirmation signals now satisfy hiring criteria |
| JTBD-01.2 | Input preserved on error | ✅ Complete — US-3.2 adds categorized error messaging; US-0.4 + US-3.2 together satisfy all hiring criteria |
| JTBD-01.3 | Form resets after submission | ✅ Complete — US-3.3 ensures acknowledgment state does not linger or confuse follow-up submission cycle |

---

## 5. Coverage Analysis

### 5.1 Persona Coverage by Release

| Persona | R1 Served? | R2 Served? | Primary Features |
|---------|-----------|-----------|-----------------|
| PER-01 (Alex Rivera / Requester) | ✅ Yes — can submit, fix errors, follow up | ✅ Yes — acknowledgment messaging completes trust loop | F0 (primary), F2 (secondary), F3 (R2) |
| PER-02 (Jordan Kim / Engineer) | ✅ Yes — full end-to-end validation and API contract check | ✅ Yes — F3 UX correctness now testable | F1, F2, F4 (primary), F0, F3 (secondary) |

Both personas are fully served by the end of R2.

---

### 5.2 JTBD Coverage by Release

| JTBD-ID | Priority | R1 Status | R2 Status | Complete After |
|---------|----------|-----------|-----------|---------------|
| JTBD-01.1 | P0 | Partial (table confirms; no banner) | Complete | R2 |
| JTBD-01.2 | P0 | Core covered (inline errors, input preserved) | Complete | R2 |
| JTBD-01.3 | P1 | Core covered (form reset) | Complete | R2 |
| JTBD-02.1 | P0 | Fully covered | — | R1 |
| JTBD-02.2 | P0 | Fully covered | — | R1 |
| JTBD-02.3 | P0 | Fully covered | — | R1 |

All 6 JTBD outcomes are fully addressed by end of R2.

---

### 5.3 Journey Stage Coverage

| Stage | R1 Coverage | R2 Coverage | Gap? |
|-------|------------|------------|------|
| S1: Arrive & Orient | US-2.3 (empty state), US-2.4 (load error) | — | None |
| S2: Fill Out Form | US-0.1 (form fields built as part of submit story) | — | None — no standalone story needed; fields are an integrated part of US-0.1 |
| S3: Submit & Validate | US-0.1, US-0.2, US-0.4 | — | None |
| S4: API Contract | US-1.1, US-1.2, US-1.3, US-4.1, US-4.2, US-4.3, US-4.4 | — | None |
| S5: Confirm & Review | US-0.3, US-2.1, US-2.2 | US-3.1, US-3.2, US-3.3 | None — acknowledgment layer intentionally deferred to R2 |

**No uncovered journey stages.** All 5 stages have story coverage across R1+R2.

---

### 5.4 Orphan Stories

> An orphan story is one that cannot be mapped to any journey stage.

| Story ID | Title | Orphan? | Notes |
|----------|-------|---------|-------|
| US-0.1 | Submit a Request | No | S3 |
| US-0.2 | Client-Side Validation on Empty Fields | No | S3 |
| US-0.3 | Form Reset After Successful Submission | No | S5 |
| US-0.4 | Server Error Handling Without Losing Input | No | S3 |
| US-1.1 | Store a Valid Submission | No | S4 |
| US-1.2 | Server-Side Validation Rejects Blank Fields | No | S4 |
| US-1.3 | Malformed or Invalid Request Handling | No | S4 |
| US-2.1 | View All Submitted Requests in a Table | No | S5 |
| US-2.2 | Table Refreshes Automatically After Submission | No | S5 |
| US-2.3 | Empty State When No Requests Exist | No | S1 |
| US-2.4 | Table Load Error Handling | No | S1 |
| US-3.1 | Success Confirmation After Submission | No | S5 |
| US-3.2 | Error Message After Failed Submission | No | S5 |
| US-3.3 | Acknowledgment Clears Before Next Submission | No | S5 |
| US-4.1 | POST Endpoint Creates and Returns a Request | No | S4 |
| US-4.2 | GET Endpoint Returns All Stored Requests | No | S4 |
| US-4.3 | CORS Configured for React Dev Server | No | S4 |
| US-4.4 | Correct HTTP Status Codes on All Responses | No | S4 |

**✅ No orphan stories. All 18 stories are mapped to a journey stage.**

---

### 5.5 Gap Analysis

**JTBD outcomes without derived NaC:**
- None. All 6 JTBD outcomes have at least one NaC derived from them (JTBD-01.1 → NaC-01, NaC-09, NaC-12; JTBD-01.2 → NaC-02, NaC-04, NaC-13; JTBD-01.3 → NaC-03, NaC-14; JTBD-02.1 → NaC-05, NaC-08, NaC-10, NaC-11; JTBD-02.2 → NaC-07, NaC-15, NaC-16, NaC-17, NaC-18; JTBD-02.3 → NaC-06).

**Journey stages without story coverage:**
- None. All 5 canonical stages have coverage.

**Features without story coverage:**
- None. F0 → Epic 0 (4 stories); F1 → Epic 1 (3 stories); F2 → Epic 2 (4 stories); F3 → Epic 3 (3 stories); F4 → Epic 4 (4 stories).

**Stories not assignable to a release:**
- None. All 18 stories are assigned to R1 (15 stories) or R2 (3 stories).

**Notable design note — S2 (Fill Out Form):** No story is exclusively scoped to the form-filling activity. The form fields are built as part of US-0.1 (Submit a Request), and the fill-out experience is validated through US-0.2 (client-side validation). This is a deliberate design choice, not a gap — the form fields have no independent story because they have no independent value without the submit action.

---

## 6. NaC-to-Acceptance Criteria Alignment

This section verifies that each NaC aligns with the formal Acceptance Criteria (AC) in UserStories-SRT.md. Alignment means the NaC expresses the same testable outcome as one or more AC items — not that they are identical in wording.

| NaC-ID | NaC Statement (abbreviated) | Story | Aligned AC Item(s) | Aligned? |
|--------|-----------------------------|-------|--------------------|---------|
| NaC-01 | Submit with all fields filled → POST sent; button disabled in-flight | US-0.1 | AC3 (POST sent on submit), AC4 (button disabled in-flight) | ✅ |
| NaC-02 | Empty submit → field-specific errors, zero network requests | US-0.2 | AC1 (no network request), AC2 (inline error per empty field), AC4 (whitespace treated as blank) | ✅ |
| NaC-03 | After HTTP 201, all fields reset, form ready, no reload | US-0.3 | AC1 (fields reset after 201), AC2 (ready without reload), AC3 (errors cleared), AC4 (button re-enabled) | ✅ |
| NaC-04 | On server/network error, form input preserved | US-0.4 | AC4 (fields retain input on error), AC5 (Submit re-enabled after error) | ✅ |
| NaC-05 | POST 201 with id, name, title, description, createdAt; retrievable via GET | US-1.1 | AC1 (201 Created), AC2 (response body fields), AC6 (retrievable via GET) | ✅ |
| NaC-06 | Blank POST → 400 with VALIDATION_FAILED + fieldErrors array | US-1.2 | AC1 (400 on blank fields), AC2 (errorCode + message), AC3 (fieldErrors array) | ✅ |
| NaC-07 | Malformed JSON → 400 INVALID_JSON; wrong Content-Type → 415 | US-1.3 | AC1 (malformed JSON → 400), AC2 (wrong Content-Type → 415), AC4 (all errors use application/json) | ✅ |
| NaC-08 | Page load → GET issued; table renders in insertion order within 3s | US-2.1 | AC1 (GET on page load), AC2 (three columns), AC4 (insertion order), AC6 (renders within 3s) | ✅ |
| NaC-09 | After 201, new row appears within 2s, no reload, no duplicates | US-2.2 | AC1 (re-fetch after 201), AC2 (appears within 2s without reload), AC4 (no duplicates) | ✅ |
| NaC-10 | Empty array → "No requests yet." displayed; no empty table element | US-2.3 | AC1 ("No requests yet." on empty array), AC2 (no empty table element), AC3 (visible on first load) | ✅ |
| NaC-11 | GET failure → "Could not load requests." displayed; no broken table | US-2.4 | AC1 (error message on 500/network), AC2 (table not rendered on error), AC4 (component does not crash) | ✅ |
| NaC-12 | After 201, "Request submitted successfully." inline within 2s, ARIA role | US-3.1 | AC1 (message text), AC2 (visually distinct), AC3 (inline, not alert()), AC4 (ARIA role), AC5 (no reload) | ✅ |
| NaC-13 | Failed submit → specific inline error by type; visually distinct | US-3.2 | AC1–AC3 (400/500/network messages), AC4 (visually distinct from success), AC5 (inline, not popup) | ✅ |
| NaC-14 | Clicking Submit clears prior message before new request; DOM stable | US-3.3 | AC1 (clears on next submit), AC2 (acknowledgment area always in DOM), AC4 (dismiss button clears immediately) | ✅ |
| NaC-15 | POST 201 with application/json; body has id, name, title, description, createdAt ISO 8601; client id ignored | US-4.1 | AC1 (201 + application/json), AC2 (all required fields), AC3 (createdAt ISO 8601), AC4 (client values ignored) | ✅ |
| NaC-16 | GET 200 with JSON array in id-ascending order; returns [] not 404 when empty | US-4.2 | AC1 (200 + application/json), AC2 (JSON array with all records), AC4 (id ascending), AC5 ([] not 404 when empty) | ✅ |
| NaC-17 | No CORS errors from localhost:3000 or :5173; Access-Control-Allow-Origin on responses | US-4.3 | AC1 (allows :3000 and :5173), AC2 (headers on actual responses), AC6 (no CORS errors in console) | ✅ |
| NaC-18 | 201/200/400/415/500 all correct; all errors have errorCode + message | US-4.4 | AC1 (POST→201), AC2 (GET→200), AC3 (validation→400), AC4 (wrong type→415), AC5 (exception→500), AC6 (structured error body) | ✅ |

**✅ All 18 NaC entries align with formal Acceptance Criteria. No misalignments detected.**

---

## 7. Validation Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Every UserStory (US-X.Y) appears in the map | ✅ | All 18 stories mapped |
| Every mapped story has a NaC derived from a JTBD | ✅ | 18 NaC entries, all traceable |
| NaC Derivation Table has full traceability chains | ✅ | JTBD-ID → stage context → NaC text → story ID in every row |
| Release planning groups are defined | ✅ | R1 (15 P0 stories), R2 (3 P1 stories) |
| Coverage analysis identifies gaps and orphans | ✅ | No gaps, no orphans |
| NaC-to-Acceptance Criteria alignment verified | ✅ | All 18 NaC aligned |
| No orphan stories | ✅ | 0 orphans |
| Each release enables at least one complete journey | ✅ | R1 completes all 6 journeys (with R2 adding acknowledgment polish) |
| No new stories invented | ✅ | Only existing UserStories-SRT.md stories mapped |
| NaC not invented — all derived from JTBD outcomes | ✅ | Every NaC cites a JTBD-ID |

---

*Document generated by Pivota Spec Story Map Generator | Project: SRT | 2026-05-08*
