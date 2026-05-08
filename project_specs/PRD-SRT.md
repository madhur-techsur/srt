# PRD: Simple Request Tracker (SRT)

**Document Type:** Product Requirements Document  
**Project Acronym:** SRT  
**Date:** 2026-05-08  
**Status:** Draft  

---

## 1. Executive Summary

The Simple Request Tracker (SRT) is a lightweight web application that enables users to submit requests through a form and view all submitted requests in a structured table. Built with a React frontend and Java Spring Boot backend, SRT validates the full end-to-end software delivery flow — input, store, retrieve, and display — without authentication or external integrations.

---

## 2. Problem Statement

Demonstration and validation projects need a minimal but complete example of end-to-end web delivery. Current gaps include:

- No lightweight reference implementation exists that shows React + Spring Boot working together cleanly
- The input → store → retrieve → display cycle must be proven before layering in complexity
- Teams validating Pivota delivery capabilities need a concrete, working output to assess

**Target Users:**
- **Business User (Requester):** Submits requests via a form; needs a simple, reliable input experience
- **Internal User (Viewer / Engineer):** Reviews all submitted requests; needs a clear, readable table view

The pain points are straightforward: without this app, there is no end-to-end proof of delivery. With it, the full lifecycle — from form entry to stored data to visible output — is demonstrable in a single session.

---

## 3. Product Vision

**Vision Statement:** A simple, working web application that proves the full request-submission-and-review cycle works — from form to storage to display — with zero friction and zero unnecessary complexity.

**Strategic Goals:**
- Validate Pivota's ability to generate working requirements, UI screens, and data flows end-to-end
- Deliver a clean demonstration of React + Spring Boot integration in minimal scope
- Serve as a reusable baseline pattern for lightweight CRUD-style delivery projects
- Demonstrate that a minimal viable product can be delivered rapidly without sacrificing correctness

---

## 4. Technical Architecture

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React | Auto-generated UI; form + table views |
| Backend | Java Spring Boot | REST API; handles form submissions and data retrieval |
| Storage | In-memory (H2) or lightweight DB | No external database integrations; demo scope |
| API Style | REST (JSON) | Simple request/response; no GraphQL or event streaming |
| Build | Standard Maven/Gradle + npm/Vite | Conventional tooling for each layer |
| Deployment | Local / single-host | No cloud or container orchestration required for demo |

---

## 5. Feature Requirements

### F0: Request Submission Form
**Description:** A web form that allows any user to submit a request by providing their name, a short title, and a description. The form is the primary entry point for all data in the system. On successful submission, the user receives immediate acknowledgment and the form resets for the next entry.

**Capabilities:**
- Input fields for Name, Title, and Description
- Client-side validation requiring all three fields before submission is allowed
- Submit button triggers a POST request to the backend API
- On success: display a confirmation message (e.g., "Request submitted successfully")
- On error: display a user-friendly error message
- Form resets after successful submission

**Priority:** P0 (Critical — MVP requirement)

---

### F1: Request Storage
**Description:** The backend receives submitted requests and persists them to an in-memory or lightweight database store. Data must survive for the duration of the application session. No durability across restarts is required for the demo scope.

**Capabilities:**
- REST endpoint `POST /api/requests` accepts Name, Title, Description as JSON payload
- Validates that all three fields are non-empty server-side
- Stores each request with a system-assigned unique ID and a creation timestamp
- Returns HTTP 201 Created with the stored request object on success
- Returns HTTP 400 Bad Request with descriptive error on invalid payload

**Priority:** P0 (Critical — MVP requirement)

---

### F2: Request List View
**Description:** A read-only table that displays all submitted requests. Users can see all entries at a glance, with Name, Title, and Description as visible columns. The table reflects the current state of stored data and updates after each new submission.

**Capabilities:**
- REST endpoint `GET /api/requests` returns all stored requests as a JSON array
- Frontend table renders one row per request with columns: Name, Title, Description
- Table is visible on the main page alongside or below the submission form
- Empty state message shown when no requests have been submitted yet (e.g., "No requests yet")
- Table refreshes automatically after a successful form submission

**Priority:** P0 (Critical — MVP requirement)

---

### F3: Submission Acknowledgment
**Description:** After a user submits a request, the system provides clear visual feedback confirming that the submission was received and stored. This closes the loop for the user and improves confidence in the system.

**Capabilities:**
- Success message displayed inline on the page after form submission
- Message is distinct and visible (e.g., banner, inline alert, or toast)
- Message disappears or can be dismissed before the next submission
- No page reload required — feedback is handled in-page via React state

**Priority:** P1 (High — strong UX expectation)

---

### F4: Basic API Layer (Backend REST Contract)
**Description:** The Spring Boot backend exposes a minimal REST API that the React frontend consumes. The API contract is simple and consistent, enabling the frontend and backend to be developed and tested independently.

**Capabilities:**
- `POST /api/requests` — create a new request
- `GET /api/requests` — retrieve all requests
- JSON request/response bodies throughout
- CORS configured to allow requests from the frontend development origin
- HTTP status codes used correctly (200, 201, 400, 500)

**Priority:** P0 (Critical — MVP requirement; underlies F0, F1, F2)

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Page load under 3 seconds on localhost; form submission round-trip under 1 second |
| **Reliability** | App must run without crash for a full demo session (30+ minutes) |
| **Usability** | All interactions completable without instruction; form errors clearly labeled |
| **Compatibility** | Works in current versions of Chrome and Firefox on desktop |
| **Maintainability** | Code structured in standard React component and Spring Boot controller/service/repo layers |
| **Security** | No auth required; no sensitive data stored; standard input trimming to prevent obvious issues |
| **Scalability** | Not required — demo scope; single-user, single-session |
| **Accessibility** | Basic semantic HTML (labels, fieldsets); keyboard-navigable form |

---

## 7. Success Metrics

- **End-to-end flow works:** A submitted request appears in the table within 2 seconds, with no manual refresh required
- **Zero critical defects at demo:** No crashes, blank screens, or data loss during a live demonstration session
- **Form validation works:** Attempting to submit an empty form shows an error and does not send a network request
- **API responds correctly:** `POST /api/requests` returns 201; `GET /api/requests` returns the full list including the new entry
- **Delivery speed:** Working application delivered within the rapid timeline expected for a Pivota demo project

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CORS misconfiguration blocks frontend from reaching backend | Medium | High | Configure Spring Boot CORS policy early; test during initial integration |
| In-memory storage resets unexpectedly between dev restarts | Low | Medium | Document expected behavior; use H2 with seeding script if persistence needed |
| React state management causes stale table after submission | Low | Medium | Refresh request list on every successful POST response |
| Form validation bypassed by direct API call | Low | Low | Server-side validation is the authoritative gate; client-side is a UX convenience |
| Scope creep beyond demo requirements | Medium | Medium | Strictly enforce out-of-scope list; defer any auth, pagination, or workflow requests |

---

## 9. Feature Index

| Feature ID | Feature Name | Priority | Category | Status |
|------------|-------------|----------|----------|--------|
| F0 | Request Submission Form | P0 | Frontend / UX | Pending |
| F1 | Request Storage | P0 | Backend / Data | Pending |
| F2 | Request List View | P0 | Frontend / UX | Pending |
| F3 | Submission Acknowledgment | P1 | Frontend / UX | Pending |
| F4 | Basic API Layer | P0 | Backend / API | Pending |

**Priority Key:**
- **P0** — Critical, MVP blocker. Must be delivered for the product to function.
- **P1** — High value, expected in demo. Should be delivered in initial scope.
- **P2** — Nice to have. Defer if time-constrained.
- **P3** — Future consideration. Out of current scope.

---

## 10. Out of Scope

The following are explicitly excluded from this project:

- Authentication and Authorization
- External API integrations
- Complex workflows or approval processes
- Notifications (email, push, in-app)
- Advanced input validation beyond required-field checks
- Pagination or sorting of the request table
- Production-grade security hardening
- Cloud deployment or containerization

---

*Document generated by Pivota Spec PRD Generator | Project: SRT | 2026-05-08*
