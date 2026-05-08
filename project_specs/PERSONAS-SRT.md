# PERSONAS: Simple Request Tracker (SRT)

**Document Type:** Persona Profiles  
**Project Acronym:** SRT  
**Date:** 2026-05-08  
**Status:** Draft  
**Related PRD:** PRD-SRT.md  
**Derived From:** PRD Section 2.2 — Target Users  

---

## 1. Persona Summary

| Persona ID | Name | Role | Primary Goal |
|------------|------|------|--------------|
| PER-01 | Alex Rivera | Business User / Requester | Submit a request quickly and know it was received |
| PER-02 | Jordan Kim | Internal User / Viewer & Engineer | Review all submitted requests in a clear, reliable table |

---

## 2. Persona Profiles

---

### PER-01: Alex Rivera

**Role Title:** Business User — Requester

**Role & Context:**
Alex is a non-technical business user who needs to submit requests to an internal team. Alex works at a desk, primarily in a browser, and interacts with the Simple Request Tracker occasionally — typically to flag something that needs attention, log a need, or submit a work item for review. Alex is not involved in the technical operation of the system and has no visibility into how data is stored or processed. The form is Alex's only touchpoint with the application. Alex's primary concern is that the form is easy to fill out, behaves predictably, and provides clear confirmation that the submission was received. Any ambiguity about whether the request actually went through causes frustration and erodes trust in the tool.

**Goals:**
- Submit a request with Name, Title, and Description without confusion or friction (F0)
- Receive clear, immediate confirmation that the submission was accepted (F3)
- Understand what went wrong if a submission fails — without needing to contact someone (F0)
- Have the form reset cleanly after submission so a second request can be entered without residue (F0)

**Pain Points:**
- Without a confirmation message, Alex cannot tell if the form submission succeeded or silently failed
- If form errors are not clearly labeled, Alex may not know which field caused the problem
- Without field validation feedback, Alex may waste time submitting an incomplete form and receiving a confusing error
- Without an immediate table refresh, Alex has no way to visually verify that the submission appeared

**Technical Expertise:** Low to Intermediate — comfortable with standard web forms and browsers; does not use developer tools or inspect network traffic; relies entirely on visible UI feedback

**Top Tasks:**
1. Fill out the Name, Title, and Description fields and submit the form (primary use case, every session)
2. Read the success confirmation message to verify the request was received (every submission)
3. Observe the request appear in the table after submission (every submission, secondary confirmation)
4. Correct a validation error if a required field was missed before resubmitting (occasional)

**Success Criteria:**
- Can complete a full form submission in under 60 seconds with no prior instruction
- Receives visible confirmation within 2 seconds of clicking Submit
- Knows exactly which field is missing if the form submission is blocked by validation
- Can submit a second request immediately after the first without reloading the page

---

### PER-02: Jordan Kim

**Role Title:** Internal User — Viewer / Engineer

**Role & Context:**
Jordan is a technically fluent internal team member — either an engineer validating the application's behavior, a product owner reviewing submitted data, or a stakeholder assessing the end-to-end delivery demo. Jordan accesses the request table to review what has been submitted, verify that the system is storing and displaying data correctly, and confirm that the full input → store → retrieve → display flow is working as designed. Jordan may also use the form to submit test entries and immediately verify they appear in the table. Unlike Alex, Jordan understands the underlying data model and is actively checking system correctness — not just usability. Jordan cares that the table is complete, accurate, and automatically up to date without requiring a manual page refresh.

**Goals:**
- See all submitted requests in a structured, readable table with Name, Title, and Description columns (F2)
- Confirm that a newly submitted request appears in the table automatically, without a manual reload (F2, F3)
- Verify that the backend API returns correct HTTP status codes and JSON payloads (F4)
- Confirm that server-side validation rejects incomplete or invalid submissions with an appropriate 400 response (F1, F4)
- Validate the full end-to-end cycle — form entry to stored data to visible table row — in a single session (F0, F1, F2, F4)

**Pain Points:**
- Without an automatically refreshing table, Jordan cannot confirm the round-trip without manually reloading, which breaks the demo narrative
- If the empty state message is missing, it is unclear whether the table is broken or simply unpopulated
- If CORS is misconfigured, the frontend cannot reach the backend at all — the most critical integration failure
- Without consistent HTTP status codes from the API, validating backend correctness requires external tooling (Postman, curl) rather than the UI alone

**Technical Expertise:** High — comfortable with browser developer tools, REST API testing, reading JSON responses, and inspecting network requests; understands the React + Spring Boot architecture and can trace failures across both layers

**Top Tasks:**
1. Review the request table to confirm all submitted entries are displayed correctly (every demo session)
2. Submit a test request via the form and verify it appears in the table immediately (validation/demo flow)
3. Inspect API responses (status codes, JSON payloads) to confirm backend contract compliance (F4)
4. Verify form validation — attempt an empty submission and confirm the error state appears without a network call (F0, F1)
5. Confirm empty state message displays correctly before any requests are submitted (F2)

**Success Criteria:**
- Table displays all stored requests immediately on page load with no manual refresh
- A newly submitted request appears in the table within 2 seconds, without a page reload
- Attempting to submit an empty form shows a validation error and does not trigger a POST request
- `POST /api/requests` returns HTTP 201 with the stored object; `GET /api/requests` returns the full list
- The application runs without crash or blank screen for a full 30-minute demo session

---

## 3. Persona Relationships

| Interaction | PER-01 (Alex / Requester) | PER-02 (Jordan / Viewer) | Nature |
|-------------|--------------------------|--------------------------|--------|
| Form submission | Creates data | Validates data appeared | Sequential — Alex's submission is what Jordan reviews |
| Table view | Secondary confirmation | Primary use case | Alex glances at the table; Jordan scrutinizes it |
| Error states | Triggered by invalid input | Verified by deliberate test submissions | Alex encounters errors naturally; Jordan tests them intentionally |
| API layer | Invisible — Alex uses the form only | Directly inspected via dev tools | Jordan operates at both UI and API levels |

In practice, Alex and Jordan do not interact with each other in the product — they interact with the same system from different angles and with different expectations. Alex produces the data; Jordan verifies the system handles it correctly.

---

## 4. Feature-Persona Matrix

| Feature ID | Feature Name | PER-01 (Alex / Requester) | PER-02 (Jordan / Viewer) |
|------------|--------------|--------------------------|--------------------------|
| F0 | Request Submission Form | **Primary** — core interaction, only touchpoint | **Secondary** — used to create test data and validate form behavior |
| F1 | Request Storage | None — invisible to Alex | **Primary** — validates backend persistence, API contract, server-side validation |
| F2 | Request List View | **Secondary** — visual confirmation that submission appeared | **Primary** — main review surface; validates data completeness and auto-refresh |
| F3 | Submission Acknowledgment | **Primary** — critical trust signal; confirms request was received | **Secondary** — confirms correct UX behavior after submission |
| F4 | Basic API Layer | None — invisible to Alex | **Primary** — directly validated; HTTP codes, JSON payloads, CORS configuration |

**Matrix Key:**
- **Primary** — This persona is the main user of this feature; it directly serves their core goal
- **Secondary** — This persona benefits from or interacts with this feature, but it is not their primary focus
- **None** — This feature is invisible to or not used by this persona in normal interaction

---

*Document generated by Pivota Spec Personas Generator | Project: SRT | 2026-05-08*
