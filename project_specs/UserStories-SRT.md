# User Stories: Simple Request Tracker (SRT)

**Document Type:** User Stories  
**Project Acronym:** SRT  
**Date:** 2026-05-08  
**Status:** Draft  
**Derived From:** PRD-SRT.md, FRD-SRT.md, PERSONAS-SRT.md  

---

## Personas

| Persona ID | Name | Role |
|------------|------|------|
| PER-01 | Alex Rivera | Business User / Requester |
| PER-02 | Jordan Kim | Internal User / Viewer & Engineer |

---

## Epic 0: Request Submission Form (F0)

**Description:** The primary data entry point — a React form that collects Name, Title, and Description, validates all fields client-side, and submits them to the backend API. Serves Alex Rivera as the core touchpoint and Jordan Kim for validation testing.

---

### US-0.1: Submit a Request
**As** Alex Rivera (Business User), **I want to** fill in a form with my Name, Title, and Description and click Submit, **so that** my request is sent to the system and I can get on with my work.

**Acceptance Criteria:**
- [ ] The main page renders a form with three labeled text input fields: Name, Title, and Description
- [ ] A Submit button is visible and clickable at all times
- [ ] Clicking Submit with all three fields filled sends a POST request to `POST /api/requests` with a JSON body containing `name`, `title`, and `description`
- [ ] The Submit button is disabled while the POST request is in-flight to prevent duplicate submissions
- [ ] The form accepts free-text input up to 255 characters for Name and Title, and up to 1000 characters for Description

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Client-Side Validation on Empty Fields
**As** Alex Rivera (Business User), **I want to** see a clear error next to each empty field when I click Submit without filling everything in, **so that** I know exactly what I need to fix without getting a confusing blank response.

**Acceptance Criteria:**
- [ ] Clicking Submit with one or more empty/whitespace-only fields does NOT send a network request
- [ ] An inline error message "This field is required." is displayed adjacent to each empty or blank field
- [ ] All three fields (Name, Title, Description) are individually validated and each shows its own error if blank
- [ ] Whitespace-only input (e.g., spaces only) is treated as blank and triggers the required-field error
- [ ] The Submit button remains enabled after a client-side validation failure so the user can correct and resubmit

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Form Reset After Successful Submission
**As** Alex Rivera (Business User), **I want to** see all form fields cleared after a successful submission, **so that** I can immediately enter a new request without manually deleting my previous input.

**Acceptance Criteria:**
- [ ] After receiving an HTTP 201 response, all three form fields are reset to empty
- [ ] The form is ready for new input without a page reload
- [ ] Any previous inline validation errors are cleared after a successful submission
- [ ] The Submit button is re-enabled after the form resets

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Server Error Handling Without Losing Input
**As** Alex Rivera (Business User), **I want to** see an error message if my submission fails on the server side, and have my typed content preserved, **so that** I can retry without re-entering everything.

**Acceptance Criteria:**
- [ ] If the backend returns HTTP 400, an inline form-level error is displayed: "Submission failed: [server error message]."
- [ ] If the backend returns HTTP 500, the message shown is: "An unexpected error occurred. Please try again."
- [ ] If there is a network failure (no response), the message shown is: "Could not reach server. Check your connection."
- [ ] On any server or network error, the form fields retain the user's input (not cleared)
- [ ] The Submit button is re-enabled after an error so the user can retry

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: Request Storage (F1)

**Description:** The Spring Boot backend persistence layer — receives POST submissions, validates them server-side, assigns IDs and timestamps, stores records in H2, and returns the created record. Primarily validated by Jordan Kim.

---

### US-1.1: Store a Valid Submission
**As** Jordan Kim (Engineer), **I want** `POST /api/requests` to accept a valid JSON payload, persist it to the database, and return the stored record with HTTP 201, **so that** I can confirm the full write path is working correctly.

**Acceptance Criteria:**
- [ ] `POST /api/requests` with a valid JSON body (`name`, `title`, `description` all non-blank) returns HTTP 201 Created
- [ ] The response body is JSON containing `id` (system-assigned integer), `name`, `title`, `description`, and `createdAt` (ISO 8601 UTC string)
- [ ] The `id` is unique, auto-incremented, and not provided by the client
- [ ] The `createdAt` timestamp is set by the server at the time of persistence — not provided by the client
- [ ] Input field values are trimmed of leading/trailing whitespace before storage
- [ ] The stored record is retrievable via `GET /api/requests` in the same session

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Server-Side Validation Rejects Blank Fields
**As** Jordan Kim (Engineer), **I want** the backend to reject submissions with blank fields and return a structured HTTP 400 response, **so that** I can confirm server-side validation is the authoritative gate independent of client behavior.

**Acceptance Criteria:**
- [ ] `POST /api/requests` with one or more blank/whitespace-only fields returns HTTP 400 Bad Request
- [ ] The response body includes `"errorCode": "VALIDATION_FAILED"` and `"message": "One or more fields failed validation."`
- [ ] The response body includes a `fieldErrors` array identifying each failing field by name (e.g., `{ "field": "name", "message": "must not be blank" }`)
- [ ] Server-side validation fires regardless of whether client-side validation passed
- [ ] Missing fields in the JSON payload are treated as blank and trigger validation errors

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: Malformed or Invalid Request Handling
**As** Jordan Kim (Engineer), **I want** the backend to return appropriate HTTP error codes for malformed requests, **so that** the API contract is robust against bad input from any client.

**Acceptance Criteria:**
- [ ] A POST with malformed JSON body returns HTTP 400 with `"errorCode": "INVALID_JSON"` and `"message": "Request body could not be parsed."`
- [ ] A POST with `Content-Type` other than `application/json` returns HTTP 415 with `"errorCode": "UNSUPPORTED_MEDIA_TYPE"`
- [ ] An unhandled server exception returns HTTP 500 with `"errorCode": "INTERNAL_ERROR"` — no stack trace in the response body
- [ ] All error responses use `Content-Type: application/json`

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Request List View (F2)

**Description:** A read-only React table displaying all stored requests. Used by Jordan Kim as a primary validation surface and by Alex Rivera as secondary confirmation that their submission was received.

---

### US-2.1: View All Submitted Requests in a Table
**As** Jordan Kim (Engineer), **I want to** see all submitted requests displayed in a structured table on the main page, **so that** I can confirm every stored request is visible with correct data in the right columns.

**Acceptance Criteria:**
- [ ] On page load, the frontend issues `GET /api/requests` and renders the response as an HTML table
- [ ] The table has three visible columns: Name, Title, Description
- [ ] Each row corresponds to one stored request record and displays the correct field values
- [ ] Records are displayed in insertion order (oldest first)
- [ ] The `id` and `createdAt` fields are not displayed as columns in the table
- [ ] The table renders within 3 seconds on localhost

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Table Refreshes Automatically After Submission
**As** Alex Rivera (Business User), **I want to** see my newly submitted request appear in the table immediately after I submit the form, **so that** I have visual confirmation my request was saved without having to reload the page.

**Acceptance Criteria:**
- [ ] After a successful form submission (HTTP 201), the request list is automatically re-fetched via `GET /api/requests`
- [ ] The new request appears in the table within 2 seconds of submission, without a manual page reload
- [ ] If the table was previously showing the empty state, it transitions to showing the table with the new entry
- [ ] No duplicate entries appear in the table after auto-refresh

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Empty State When No Requests Exist
**As** Jordan Kim (Engineer), **I want to** see a clear placeholder message when no requests have been submitted, **so that** I can distinguish between "the table is working but empty" and "the table is broken."

**Acceptance Criteria:**
- [ ] When `GET /api/requests` returns an empty array (`[]`), the message "No requests yet." is displayed in the table area
- [ ] No empty table element or header row is rendered in the empty state
- [ ] The empty state message is visible on first page load before any submissions

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: Table Load Error Handling
**As** Jordan Kim (Engineer), **I want to** see an error message if the request list fails to load, **so that** I know the issue is a fetch failure rather than an empty dataset.

**Acceptance Criteria:**
- [ ] If `GET /api/requests` returns HTTP 500 or a network error, the message "Could not load requests. Please refresh the page." is displayed
- [ ] The table is not rendered when a fetch error occurs — only the error message is shown
- [ ] If the GET response contains malformed JSON, the same error message is displayed
- [ ] The error display does not crash the React component

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Submission Acknowledgment (F3)

**Description:** Inline visual feedback displayed after each form submission attempt — success or failure. Keeps Alex Rivera informed and gives Jordan Kim a UX correctness signal. All state is managed in React with no page reload.

---

### US-3.1: Success Confirmation After Submission
**As** Alex Rivera (Business User), **I want to** see a clear success message after my request is accepted, **so that** I know with certainty that my submission went through and I don't need to submit again.

**Acceptance Criteria:**
- [ ] After receiving HTTP 201 from the backend, the acknowledgment area displays: "Request submitted successfully."
- [ ] The success message uses a visually distinct style (e.g., green background, checkmark icon, or equivalent)
- [ ] The message appears inline on the page — not as a browser `alert()` or modal dialog
- [ ] The acknowledgment area uses ARIA `role="status"` or `role="alert"` for accessibility
- [ ] The message is visible immediately after the POST response is received — no page reload required

**Priority:** P1 | **Feature Ref:** F3

---

### US-3.2: Error Message After Failed Submission
**As** Alex Rivera (Business User), **I want to** see a specific error message if my submission fails, **so that** I understand what happened and know whether to retry.

**Acceptance Criteria:**
- [ ] HTTP 400 response displays: "Submission failed: [server error message]."
- [ ] HTTP 500 response displays: "An unexpected error occurred. Please try again."
- [ ] Network failure (no response) displays: "Could not reach server. Check your connection."
- [ ] Error messages use a visually distinct style from the success state (e.g., red/orange color or border)
- [ ] Error messages appear inline in the acknowledgment area — not as popups or browser alerts

**Priority:** P1 | **Feature Ref:** F3

---

### US-3.3: Acknowledgment Clears Before Next Submission
**As** Alex Rivera (Business User), **I want** the previous confirmation or error message to clear when I start a new submission, **so that** I don't confuse old feedback with the result of my new request.

**Acceptance Criteria:**
- [ ] When the user clicks Submit again, any existing acknowledgment message is cleared before the new request is sent
- [ ] The acknowledgment area exists in the DOM at all times (even when empty) to avoid layout shift
- [ ] No auto-dismiss timer is required — the message persists until the next submission or user dismissal
- [ ] If a dismiss/close button is present, clicking it clears the message immediately

**Priority:** P1 | **Feature Ref:** F3

---

## Epic 4: Basic API Layer (F4)

**Description:** The Spring Boot REST backend contract — defines both endpoints, enforces JSON throughout, configures CORS for the React dev server, and applies correct HTTP status codes. Primarily validated by Jordan Kim.

---

### US-4.1: POST Endpoint Creates and Returns a Request
**As** Jordan Kim (Engineer), **I want** `POST /api/requests` to return a correctly structured HTTP 201 response with the stored record, **so that** I can verify the create path satisfies the API contract.

**Acceptance Criteria:**
- [ ] `POST /api/requests` with valid JSON returns HTTP 201 with `Content-Type: application/json`
- [ ] The response body includes `id`, `name`, `title`, `description`, and `createdAt` fields
- [ ] `createdAt` is serialized as an ISO 8601 UTC string (e.g., `"2026-05-08T14:00:00Z"`) — not a Unix timestamp
- [ ] Client-provided `id` or `createdAt` values in the request body are ignored; server-assigned values are used
- [ ] The endpoint is reachable at exactly `POST /api/requests` with base path `http://localhost:8080`

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.2: GET Endpoint Returns All Stored Requests
**As** Jordan Kim (Engineer), **I want** `GET /api/requests` to return the full list of stored requests as a JSON array, **so that** I can confirm the read path is complete and returns data in the correct shape.

**Acceptance Criteria:**
- [ ] `GET /api/requests` returns HTTP 200 with `Content-Type: application/json`
- [ ] The response body is a JSON array containing all stored request records
- [ ] Each record in the array contains `id`, `name`, `title`, `description`, and `createdAt`
- [ ] Records are ordered by `id` ascending (insertion order)
- [ ] When no requests exist, the endpoint returns HTTP 200 with an empty array `[]` — not a 404 or error
- [ ] The endpoint accepts no query parameters, path variables, or request body

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.3: CORS Configured for React Dev Server
**As** Jordan Kim (Engineer), **I want** the Spring Boot backend to have CORS configured for the React dev server origins, **so that** the frontend can call the API from the browser without being blocked by cross-origin policy.

**Acceptance Criteria:**
- [ ] The backend allows requests from `http://localhost:3000` (CRA) and `http://localhost:5173` (Vite)
- [ ] CORS headers are present on actual responses — not only on preflight `OPTIONS` requests
- [ ] `OPTIONS` preflight requests return HTTP 200 with correct `Access-Control-Allow-*` headers
- [ ] Allowed methods include `GET`, `POST`, and `OPTIONS`
- [ ] Allowed headers include `Content-Type` and `Accept`
- [ ] A React frontend running on either dev server port can successfully call both API endpoints without CORS errors in the browser console

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.4: Correct HTTP Status Codes on All Responses
**As** Jordan Kim (Engineer), **I want** the API to return semantically correct HTTP status codes for every scenario, **so that** I can validate backend correctness from the UI and without external tooling.

**Acceptance Criteria:**
- [ ] Successful POST returns HTTP 201 (not 200)
- [ ] Successful GET returns HTTP 200
- [ ] Client validation failure on POST returns HTTP 400
- [ ] Wrong Content-Type on POST returns HTTP 415
- [ ] Unhandled server exception returns HTTP 500
- [ ] All error responses include a structured JSON body with `errorCode` and `message` fields — never raw exception text

**Priority:** P0 | **Feature Ref:** F4

---

## Story Index

| Story ID | Title | Persona | Priority | Feature Ref |
|----------|-------|---------|----------|-------------|
| US-0.1 | Submit a Request | Alex Rivera | P0 | F0 |
| US-0.2 | Client-Side Validation on Empty Fields | Alex Rivera | P0 | F0 |
| US-0.3 | Form Reset After Successful Submission | Alex Rivera | P0 | F0 |
| US-0.4 | Server Error Handling Without Losing Input | Alex Rivera | P0 | F0 |
| US-1.1 | Store a Valid Submission | Jordan Kim | P0 | F1 |
| US-1.2 | Server-Side Validation Rejects Blank Fields | Jordan Kim | P0 | F1 |
| US-1.3 | Malformed or Invalid Request Handling | Jordan Kim | P0 | F1 |
| US-2.1 | View All Submitted Requests in a Table | Jordan Kim | P0 | F2 |
| US-2.2 | Table Refreshes Automatically After Submission | Alex Rivera | P0 | F2 |
| US-2.3 | Empty State When No Requests Exist | Jordan Kim | P0 | F2 |
| US-2.4 | Table Load Error Handling | Jordan Kim | P0 | F2 |
| US-3.1 | Success Confirmation After Submission | Alex Rivera | P1 | F3 |
| US-3.2 | Error Message After Failed Submission | Alex Rivera | P1 | F3 |
| US-3.3 | Acknowledgment Clears Before Next Submission | Alex Rivera | P1 | F3 |
| US-4.1 | POST Endpoint Creates and Returns a Request | Jordan Kim | P0 | F4 |
| US-4.2 | GET Endpoint Returns All Stored Requests | Jordan Kim | P0 | F4 |
| US-4.3 | CORS Configured for React Dev Server | Jordan Kim | P0 | F4 |
| US-4.4 | Correct HTTP Status Codes on All Responses | Jordan Kim | P0 | F4 |

**Total Stories:** 18 across 5 Epics

---

## Priority Definitions

| Priority | Label | Description |
|----------|-------|-------------|
| **P0** | Critical | MVP blocker. Must be delivered for the product to function. All P0 stories are required for the demo to run end-to-end. |
| **P1** | High | Strong UX expectation. Should be delivered in initial scope. Absence degrades user confidence significantly. |
| **P2** | Nice to Have | Useful enhancement. Defer if time-constrained. Not required for demo. |
| **P3** | Future | Out of current scope. Log for later consideration. |

---

*Document generated by Pivota Spec UserStories Generator | Project: SRT | 2026-05-08*
