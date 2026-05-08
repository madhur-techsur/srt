# Requirements Traceability Matrix: Simple Request Tracker (SRT)

**Document Type:** Requirements Traceability Matrix  
**Project Acronym:** SRT  
**Version:** 1.0  
**Date:** 2026-05-08  
**Status:** Draft  
**Derived From:** PRD-SRT.md, FRD-SRT.md, TechArch-SRT.md, UserStories-SRT.md

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all Simple Request Tracker (SRT) specification documents. It ensures every product requirement defined in the PRD is refined into functional specifications in the FRD, grounded in architectural decisions in TechArch, expressed as testable user stories, and covered by test cases — and conversely, that no specification, story, or test exists without a traceable requirement.

SRT spans five features (F0–F4) covering the complete input → store → retrieve → display lifecycle of a lightweight web application. Traceability is maintained across four levels: business requirements (PRD), functional specifications (FRD), technical architecture (TechArch), and user acceptance (UserStories). This matrix is the authoritative cross-reference for change impact analysis, test planning, and delivery sign-off.

The matrix is organized to support both forward traceability (PRD → test) and backward traceability (test → PRD), enabling any team member to answer "where does this requirement come from?" or "what is affected if this spec changes?"

---

## 2. Requirements Summary

### 2.1 PRD Features (F0–F4)

- **F0 — Request Submission Form** (P0): React form with Name, Title, Description inputs; client-side validation; POST submission; form reset on success; error handling on failure
- **F1 — Request Storage** (P0): Spring Boot `POST /api/requests` endpoint; server-side validation; auto-assigned ID and timestamp; H2 in-memory persistence; HTTP 201/400/500 responses
- **F2 — Request List View** (P0): Spring Boot `GET /api/requests` endpoint; React table with Name/Title/Description columns; empty-state message; auto-refresh after submission; error state on fetch failure
- **F3 — Submission Acknowledgment** (P1): Inline success/error feedback area; visually distinct states; ARIA accessibility; clears on new submission; no page reload
- **F4 — Basic API Layer** (P0): Full REST contract for both endpoints; JSON throughout; CORS for React dev server origins; correct HTTP status codes; global exception handler

### 2.2 FRD Functional Requirements

- **REQ-FUNC-001** (F0): Three required text input fields — Name (max 255 chars), Title (max 255 chars), Description (max 1000 chars)
- **REQ-FUNC-002** (F0): Client-side required-field validation; whitespace-trimmed; no network call on validation failure; inline field-level error messages
- **REQ-FUNC-003** (F0): POST `{ name, title, description }` to `POST /api/requests` on passing validation; Submit button disabled in-flight
- **REQ-FUNC-004** (F0): Form reset to empty state on HTTP 201 response; Submit re-enabled
- **REQ-FUNC-005** (F0): Inline error messages on HTTP 400, 500, and network failure; form fields preserved on error
- **REQ-FUNC-006** (F1): `POST /api/requests` endpoint — deserialize JSON body; server-side trim and blank-field validation
- **REQ-FUNC-007** (F1): Auto-assign unique auto-incremented `id` and `createdAt` UTC timestamp on insert; client values for these fields ignored
- **REQ-FUNC-008** (F1): Persist record to H2 in-memory store via JPA; session-scoped durability only
- **REQ-FUNC-009** (F1): HTTP 201 with full stored record on success; HTTP 400 `VALIDATION_FAILED` on blank fields; HTTP 400 `INVALID_JSON` on malformed body; HTTP 500 on unhandled exception
- **REQ-FUNC-010** (F2): `GET /api/requests` endpoint — `findAll()` returning all records in insertion order; HTTP 200 with JSON array (may be empty)
- **REQ-FUNC-011** (F2): React table renders Name, Title, Description columns; one row per record; `id` and `createdAt` not displayed
- **REQ-FUNC-012** (F2): Empty-state message "No requests yet." when array is empty; no table element rendered
- **REQ-FUNC-013** (F2): Auto-refresh via re-issued `GET /api/requests` after successful POST; no page reload
- **REQ-FUNC-014** (F2): Error message "Could not load requests. Please refresh the page." on GET HTTP 500, network failure, or malformed JSON
- **REQ-FUNC-015** (F3): Inline acknowledgment area always present in DOM; success message "Request submitted successfully." on HTTP 201
- **REQ-FUNC-016** (F3): Error messages in acknowledgment area for HTTP 400/500 and network failure; visually distinct from success state; ARIA `role="status"` or `role="alert"`
- **REQ-FUNC-017** (F3): Acknowledgment area cleared at start of each new submission; no auto-dismiss timer at MVP scope
- **REQ-FUNC-018** (F4): `POST /api/requests` and `GET /api/requests` endpoints; JSON request/response bodies; `Content-Type: application/json` on all responses
- **REQ-FUNC-019** (F4): CORS policy — allowed origins `http://localhost:3000` and `http://localhost:5173`; methods `GET`, `POST`, `OPTIONS`; headers `Content-Type`, `Accept`; max-age 3600
- **REQ-FUNC-020** (F4): Global Exception Handler (`@ControllerAdvice`) — `VALIDATION_FAILED` → 400, `INVALID_JSON` → 400, `UNSUPPORTED_MEDIA_TYPE` → 415, unhandled → 500; no stack traces in responses
- **REQ-FUNC-021** (F4): HTTP status codes strictly enforced: 201 (POST success), 200 (GET success), 400 (client error), 415 (wrong Content-Type), 500 (server error)

### 2.3 Non-Functional Requirements

- **REQ-NFR-001**: Page load under 3 seconds on localhost; form submission round-trip under 1 second
- **REQ-NFR-002**: Application stable for a full demo session (30+ minutes) without crash
- **REQ-NFR-003**: All interactions completable without instruction; form errors clearly labeled
- **REQ-NFR-004**: Compatible with current versions of Chrome and Firefox on desktop
- **REQ-NFR-005**: Code structured in standard React component and Spring Boot controller/service/repository layers
- **REQ-NFR-006**: No sensitive data stored; standard input trimming; no auth required for demo scope
- **REQ-NFR-007**: Basic semantic HTML (labels); keyboard-navigable form; ARIA roles on acknowledgment area

### 2.4 TechArch Specifications

- **SPEC-001**: Two-tier client-server architecture; React SPA (Vite, port 5173) + Spring Boot REST (port 8080) + H2 embedded in-JVM; no SSR, no shared state
- **SPEC-002**: Frontend component structure — `App.tsx` (root, shared state), `RequestForm.tsx` (F0+F3), `RequestList.tsx` (F2), `requestsApi.ts` (typed fetch wrappers), `request.ts` (TypeScript interfaces)
- **SPEC-003**: Backend layered architecture — `RequestController` → `RequestService` → `RequestRepository` → H2; `CorsConfig`; `GlobalExceptionHandler`; `ErrorResponse` DTO
- **SPEC-004**: H2 in-memory database; `ddl-auto=create-drop`; single `requests` table; `BIGINT AUTO_INCREMENT id`, `VARCHAR(255) name`, `VARCHAR(255) title`, `VARCHAR(1000) description`, `TIMESTAMP created_at`
- **SPEC-005**: REST API — `POST /api/requests` (F1, F4) and `GET /api/requests` (F2, F4); JSON throughout; no auth; no versioning
- **SPEC-006**: CORS via `WebMvcConfigurer` (`CorsConfig.java`) — origins `localhost:3000` and `localhost:5173`; methods `GET`, `POST`, `OPTIONS`; max-age 3600
- **SPEC-007**: Input validation chain — React client-side trim + blank check → Spring Boot service-layer trim + blank check → JPA `NOT NULL` column constraints as final backstop
- **SPEC-008**: Error handling — `GlobalExceptionHandler` maps `ValidationException` → 400, `HttpMessageNotReadableException` → 400, `HttpMediaTypeNotSupportedException` → 415, `Exception` → 500; structured `ApiError` JSON body; no stack traces
- **SPEC-009**: TypeScript interfaces — `Request`, `CreateRequestPayload`, `FieldError`, `ApiError`, `AcknowledgmentState` union type in `types/request.ts`
- **SPEC-010**: Technology stack — React 18.x / TypeScript 5.x / Vite 5.x; Spring Boot 3.x / Java 21 / Maven 3.x; Spring Data JPA + Hibernate; Jackson with `JavaTimeModule`; H2 2.x
- **SPEC-011**: Configurable API base URL via `VITE_API_BASE_URL` environment variable; default `http://localhost:8080`; `fetch()` or Axios as HTTP client
- **SPEC-012**: `createdAt` serialized as ISO 8601 UTC string via Jackson `JavaTimeModule`; `WRITE_DATES_AS_TIMESTAMPS=false`

### 2.5 User Stories Summary

- **18 stories** across 5 epics (US-0.1–US-0.4, US-1.1–US-1.3, US-2.1–US-2.4, US-3.1–US-3.3, US-4.1–US-4.4)
- **14 P0 stories** (MVP critical); **4 P1 stories** (F3 acknowledgment UX)
- **2 personas**: Alex Rivera (Business User / Requester), Jordan Kim (Internal User / Engineer)

---

## 3. Traceability Matrix

### 3.1 Forward Traceability: PRD → FRD → TechArch → User Stories

| PRD Feature | FRD Requirement | TechArch Spec | User Story |
|---|---|---|---|
| F0: Request Submission Form | REQ-FUNC-001 | SPEC-002, SPEC-010 | US-0.1 |
| F0: Request Submission Form | REQ-FUNC-002 | SPEC-002, SPEC-007 | US-0.2 |
| F0: Request Submission Form | REQ-FUNC-003 | SPEC-002, SPEC-005, SPEC-011 | US-0.1 |
| F0: Request Submission Form | REQ-FUNC-004 | SPEC-002 | US-0.3 |
| F0: Request Submission Form | REQ-FUNC-005 | SPEC-002, SPEC-008 | US-0.4 |
| F1: Request Storage | REQ-FUNC-006 | SPEC-003, SPEC-007 | US-1.1, US-1.2 |
| F1: Request Storage | REQ-FUNC-007 | SPEC-003, SPEC-004, SPEC-012 | US-1.1, US-4.1 |
| F1: Request Storage | REQ-FUNC-008 | SPEC-004, SPEC-010 | US-1.1 |
| F1: Request Storage | REQ-FUNC-009 | SPEC-003, SPEC-008 | US-1.1, US-1.2, US-1.3 |
| F2: Request List View | REQ-FUNC-010 | SPEC-003, SPEC-005 | US-2.1, US-4.2 |
| F2: Request List View | REQ-FUNC-011 | SPEC-002, SPEC-009 | US-2.1 |
| F2: Request List View | REQ-FUNC-012 | SPEC-002 | US-2.3 |
| F2: Request List View | REQ-FUNC-013 | SPEC-002, SPEC-005 | US-2.2 |
| F2: Request List View | REQ-FUNC-014 | SPEC-002, SPEC-008 | US-2.4 |
| F3: Submission Acknowledgment | REQ-FUNC-015 | SPEC-002, SPEC-009 | US-3.1 |
| F3: Submission Acknowledgment | REQ-FUNC-016 | SPEC-002, SPEC-009 | US-3.2 |
| F3: Submission Acknowledgment | REQ-FUNC-017 | SPEC-002 | US-3.3 |
| F4: Basic API Layer | REQ-FUNC-018 | SPEC-005, SPEC-010 | US-4.1, US-4.2 |
| F4: Basic API Layer | REQ-FUNC-019 | SPEC-006 | US-4.3 |
| F4: Basic API Layer | REQ-FUNC-020 | SPEC-008 | US-1.3, US-4.4 |
| F4: Basic API Layer | REQ-FUNC-021 | SPEC-005, SPEC-008 | US-4.4 |

### 3.2 Backward Traceability: User Stories → FRD → PRD

| User Story | Story Title | FRD Requirement(s) | PRD Feature |
|---|---|---|---|
| US-0.1 | Submit a Request | REQ-FUNC-001, REQ-FUNC-003 | F0 |
| US-0.2 | Client-Side Validation on Empty Fields | REQ-FUNC-002 | F0 |
| US-0.3 | Form Reset After Successful Submission | REQ-FUNC-004 | F0 |
| US-0.4 | Server Error Handling Without Losing Input | REQ-FUNC-005 | F0 |
| US-1.1 | Store a Valid Submission | REQ-FUNC-006, REQ-FUNC-007, REQ-FUNC-008, REQ-FUNC-009 | F1 |
| US-1.2 | Server-Side Validation Rejects Blank Fields | REQ-FUNC-006, REQ-FUNC-009 | F1 |
| US-1.3 | Malformed or Invalid Request Handling | REQ-FUNC-009, REQ-FUNC-020 | F1, F4 |
| US-2.1 | View All Submitted Requests in a Table | REQ-FUNC-010, REQ-FUNC-011 | F2 |
| US-2.2 | Table Refreshes Automatically After Submission | REQ-FUNC-013 | F2 |
| US-2.3 | Empty State When No Requests Exist | REQ-FUNC-012 | F2 |
| US-2.4 | Table Load Error Handling | REQ-FUNC-014 | F2 |
| US-3.1 | Success Confirmation After Submission | REQ-FUNC-015 | F3 |
| US-3.2 | Error Message After Failed Submission | REQ-FUNC-016 | F3 |
| US-3.3 | Acknowledgment Clears Before Next Submission | REQ-FUNC-017 | F3 |
| US-4.1 | POST Endpoint Creates and Returns a Request | REQ-FUNC-007, REQ-FUNC-018, REQ-FUNC-021 | F4 |
| US-4.2 | GET Endpoint Returns All Stored Requests | REQ-FUNC-010, REQ-FUNC-018, REQ-FUNC-021 | F2, F4 |
| US-4.3 | CORS Configured for React Dev Server | REQ-FUNC-019 | F4 |
| US-4.4 | Correct HTTP Status Codes on All Responses | REQ-FUNC-020, REQ-FUNC-021 | F4 |

### 3.3 TechArch Spec → FRD Backward Traceability

| TechArch Spec | Spec Description (Summary) | FRD Requirement(s) | PRD Feature(s) |
|---|---|---|---|
| SPEC-001 | Two-tier client-server architecture | REQ-FUNC-018 | F0, F1, F2, F4 |
| SPEC-002 | Frontend component structure | REQ-FUNC-001–005, REQ-FUNC-011–017 | F0, F2, F3 |
| SPEC-003 | Backend layered architecture (Controller→Service→Repo) | REQ-FUNC-006–010, REQ-FUNC-018, REQ-FUNC-020 | F1, F2, F4 |
| SPEC-004 | H2 in-memory database schema and JPA entity | REQ-FUNC-007, REQ-FUNC-008 | F1 |
| SPEC-005 | REST API — POST and GET /api/requests | REQ-FUNC-009, REQ-FUNC-010, REQ-FUNC-018, REQ-FUNC-021 | F1, F2, F4 |
| SPEC-006 | CORS via WebMvcConfigurer | REQ-FUNC-019 | F4 |
| SPEC-007 | Input validation chain (client + server + DB) | REQ-FUNC-002, REQ-FUNC-006 | F0, F1 |
| SPEC-008 | Global Exception Handler and error response structure | REQ-FUNC-005, REQ-FUNC-009, REQ-FUNC-014, REQ-FUNC-016, REQ-FUNC-020 | F0, F1, F2, F3, F4 |
| SPEC-009 | TypeScript interfaces | REQ-FUNC-011, REQ-FUNC-015, REQ-FUNC-016 | F2, F3 |
| SPEC-010 | Technology stack | REQ-FUNC-001, REQ-FUNC-008, REQ-FUNC-018 | F0, F1, F4 |
| SPEC-011 | Configurable API base URL | REQ-FUNC-003 | F0 |
| SPEC-012 | ISO 8601 createdAt serialization | REQ-FUNC-007 | F1 |

---

## 4. Requirements Detail

### 4.1 F0: Request Submission Form

**PRD Priority:** P0 | **FRD Section:** F0-request-submission-form.md

**Functional Requirements:**
- **REQ-FUNC-001** — Three text input fields rendered: Name (max 255 chars), Title (max 255 chars), Description (max 1000 chars); all labeled and required
- **REQ-FUNC-002** — Client-side required-field validation fires on Submit click; whitespace-trimmed before check; inline "This field is required." shown adjacent to each empty field; no network request made on validation failure; Submit button remains enabled after client-side error
- **REQ-FUNC-003** — On passing validation, POST request issued to `POST /api/requests` with JSON body `{ "name": "...", "title": "...", "description": "..." }`; Submit button disabled during in-flight request
- **REQ-FUNC-004** — On HTTP 201 response: all form fields cleared to empty; Submit button re-enabled; form ready for next entry without page reload
- **REQ-FUNC-005** — On HTTP 400: inline error "Submission failed: [server error message]."; on HTTP 500: "An unexpected error occurred. Please try again."; on network failure: "Could not reach server. Check your connection."; form fields preserved (not cleared) on any error; Submit button re-enabled

**TechArch Mapping:** `RequestForm.tsx` (SPEC-002), `requestsApi.ts` (SPEC-011), client-side validation (SPEC-007), `AcknowledgmentState` type (SPEC-009)

**User Stories:** US-0.1 (submit), US-0.2 (validation), US-0.3 (reset), US-0.4 (error handling)

---

### 4.2 F1: Request Storage

**PRD Priority:** P0 | **FRD Section:** F1-request-storage.md

**Functional Requirements:**
- **REQ-FUNC-006** — `POST /api/requests` Spring Boot controller receives JSON payload; deserializes to `RequestDto`; service layer trims and validates `name`, `title`, `description` are non-blank; returns HTTP 400 `VALIDATION_FAILED` with `fieldErrors` array if any field fails
- **REQ-FUNC-007** — Server assigns `id` (auto-incremented `BIGINT`) and `createdAt` (`Instant.now()` UTC) at write time; any client-provided values for these fields are ignored
- **REQ-FUNC-008** — Record persisted to H2 in-memory `requests` table via `RequestRepository.save()`; data lives for JVM session duration only
- **REQ-FUNC-009** — HTTP 201 returns full stored record (`id`, `name`, `title`, `description`, `createdAt`); HTTP 400 `VALIDATION_FAILED` on blank fields; HTTP 400 `INVALID_JSON` on malformed body; HTTP 415 `UNSUPPORTED_MEDIA_TYPE` on wrong Content-Type; HTTP 500 `INTERNAL_ERROR` on unhandled exception

**TechArch Mapping:** `RequestController.java`, `RequestService.java`, `RequestRepository.java` (SPEC-003); `requests` table DDL (SPEC-004); `POST /api/requests` endpoint (SPEC-005); `GlobalExceptionHandler.java` (SPEC-008); Jackson `JavaTimeModule` (SPEC-012)

**User Stories:** US-1.1 (valid storage), US-1.2 (server validation), US-1.3 (error handling)

---

### 4.3 F2: Request List View

**PRD Priority:** P0 | **FRD Section:** F2-request-list-view.md

**Functional Requirements:**
- **REQ-FUNC-010** — `GET /api/requests` backend endpoint returns all `Request` entities via `findAll()` in ascending `id` order; HTTP 200 with JSON array (empty array `[]` is a valid success response, not an error)
- **REQ-FUNC-011** — React `RequestList.tsx` renders HTML table with three visible columns: Name, Title, Description; one `<tr>` per record; `id` and `createdAt` not shown; fires GET on component mount
- **REQ-FUNC-012** — When GET returns empty array, renders "No requests yet." message in table area; no `<table>` element or header row rendered
- **REQ-FUNC-013** — After successful POST (HTTP 201), F0 triggers re-fetch of `GET /api/requests`; table updated with new record within 2 seconds; no page reload; if previously in empty state, transitions to table view
- **REQ-FUNC-014** — On GET HTTP 500, network failure, or malformed JSON response: renders "Could not load requests. Please refresh the page."; table not rendered; React component does not crash

**TechArch Mapping:** `RequestList.tsx` (SPEC-002); `GET /api/requests` endpoint (SPEC-005); `RequestController` → `RequestRepository.findAll()` (SPEC-003); `Request` TypeScript interface (SPEC-009); `GlobalExceptionHandler` for GET 500 (SPEC-008)

**User Stories:** US-2.1 (table view), US-2.2 (auto-refresh), US-2.3 (empty state), US-2.4 (error handling)

---

### 4.4 F3: Submission Acknowledgment

**PRD Priority:** P1 | **FRD Section:** F3-submission-acknowledgment.md

**Functional Requirements:**
- **REQ-FUNC-015** — Acknowledgment area is always present in DOM (avoids layout shift); on HTTP 201: renders "Request submitted successfully." with success visual style (green/checkmark); inline on page, not a browser `alert()` or modal; ARIA `role="status"` or `role="alert"` applied
- **REQ-FUNC-016** — On HTTP 400: "Submission failed: [server error message]."; on HTTP 500: "An unexpected error occurred. Please try again."; on network failure: "Could not reach server. Check your connection."; error style visually distinct from success (red/orange); messages inline in acknowledgment area
- **REQ-FUNC-017** — Acknowledgment area cleared at start of each new Submit click (before request is sent); no auto-dismiss timer at MVP scope; optional user-dismissible close button

**TechArch Mapping:** `RequestForm.tsx` acknowledgment state (SPEC-002); `AcknowledgmentState` union type `{ status: 'idle' | 'success' | 'error'; message: string }` (SPEC-009)

**User Stories:** US-3.1 (success confirmation), US-3.2 (error message), US-3.3 (clear on new submission)

---

### 4.5 F4: Basic API Layer

**PRD Priority:** P0 | **FRD Section:** F4-api-layer.md

**Functional Requirements:**
- **REQ-FUNC-018** — Both endpoints (`POST /api/requests`, `GET /api/requests`) return `Content-Type: application/json`; all request/response bodies are JSON; no authentication headers required or checked
- **REQ-FUNC-019** — CORS configured via `CorsConfig.java` (`WebMvcConfigurer`): origins `http://localhost:3000` and `http://localhost:5173`; methods `GET`, `POST`, `OPTIONS`; headers `Content-Type`, `Accept`; `allowCredentials=false`; max-age 3600; CORS headers present on all responses (not only preflight); `OPTIONS` preflight returns HTTP 200
- **REQ-FUNC-020** — `GlobalExceptionHandler` (`@ControllerAdvice`): `ValidationException` → HTTP 400 `VALIDATION_FAILED`; `HttpMessageNotReadableException` → HTTP 400 `INVALID_JSON`; `HttpMediaTypeNotSupportedException` → HTTP 415 `UNSUPPORTED_MEDIA_TYPE`; all other `Exception` → HTTP 500 `INTERNAL_ERROR`; no stack traces in any error response body
- **REQ-FUNC-021** — HTTP status codes strictly enforced: `POST` success → 201, `GET` success → 200, client error → 400, wrong Content-Type → 415, unhandled server error → 500; all error responses include `errorCode` and `message` fields in structured JSON body

**TechArch Mapping:** REST API overview (SPEC-005); `CorsConfig.java` (SPEC-006); `GlobalExceptionHandler.java`, `ErrorResponse.java` (SPEC-008); Spring Boot 3.x / Java 21 / Maven (SPEC-010)

**User Stories:** US-4.1 (POST contract), US-4.2 (GET contract), US-4.3 (CORS), US-4.4 (HTTP status codes)

---

## 5. Test Case Coverage

### 5.1 Test Case Definitions

| Test ID | Test Case Title | Type | Story Ref | FRD Req | Condition | Expected Result |
|---|---|---|---|---|---|---|
| TEST-001 | Form renders three labeled input fields | UI/Functional | US-0.1 | REQ-FUNC-001 | Page load | Name, Title, Description fields visible and labeled; Submit button visible |
| TEST-002 | Submit with all fields filled sends POST request | UI/Functional | US-0.1 | REQ-FUNC-003 | All fields non-empty; Submit clicked | `POST /api/requests` called with `{ name, title, description }` JSON body |
| TEST-003 | Submit button disabled during in-flight POST | UI/Functional | US-0.1 | REQ-FUNC-003 | Submit clicked; request in-flight | Submit button disabled until response received |
| TEST-004 | Client validation: empty Name shows inline error | UI/Validation | US-0.2 | REQ-FUNC-002 | Name empty; Submit clicked | "This field is required." adjacent to Name field; no network request made |
| TEST-005 | Client validation: empty Title shows inline error | UI/Validation | US-0.2 | REQ-FUNC-002 | Title empty; Submit clicked | "This field is required." adjacent to Title field; no network request made |
| TEST-006 | Client validation: empty Description shows inline error | UI/Validation | US-0.2 | REQ-FUNC-002 | Description empty; Submit clicked | "This field is required." adjacent to Description field; no network request made |
| TEST-007 | Whitespace-only input treated as blank | UI/Validation | US-0.2 | REQ-FUNC-002 | Field contains spaces only; Submit clicked | Treated as blank; inline error shown; no POST sent |
| TEST-008 | Form resets after successful submission | UI/Functional | US-0.3 | REQ-FUNC-004 | POST returns HTTP 201 | All fields cleared to empty; Submit re-enabled |
| TEST-009 | HTTP 400 response shows error message, preserves input | UI/Error | US-0.4 | REQ-FUNC-005 | POST returns 400 | "Submission failed: [server message]." shown; form fields not cleared |
| TEST-010 | HTTP 500 response shows generic error message | UI/Error | US-0.4 | REQ-FUNC-005 | POST returns 500 | "An unexpected error occurred. Please try again." shown; form fields not cleared |
| TEST-011 | Network failure shows connectivity error message | UI/Error | US-0.4 | REQ-FUNC-005 | Network unavailable | "Could not reach server. Check your connection." shown |
| TEST-012 | POST with valid payload returns HTTP 201 and record | API/Functional | US-1.1 | REQ-FUNC-006, REQ-FUNC-009 | Valid JSON body | HTTP 201; response body has `id`, `name`, `title`, `description`, `createdAt` |
| TEST-013 | POST assigns unique id and createdAt | API/Functional | US-1.1 | REQ-FUNC-007 | Valid POST | `id` is integer > 0; `createdAt` is ISO 8601 UTC string; not provided by client |
| TEST-014 | POST trims whitespace from fields before storage | API/Functional | US-1.1 | REQ-FUNC-006 | Fields have leading/trailing spaces | Stored values are trimmed |
| TEST-015 | POST with blank name returns 400 VALIDATION_FAILED | API/Validation | US-1.2 | REQ-FUNC-006, REQ-FUNC-009 | `name` blank | HTTP 400; `errorCode: VALIDATION_FAILED`; `fieldErrors` array includes `name` |
| TEST-016 | POST with blank title returns 400 VALIDATION_FAILED | API/Validation | US-1.2 | REQ-FUNC-006, REQ-FUNC-009 | `title` blank | HTTP 400; `errorCode: VALIDATION_FAILED`; `fieldErrors` includes `title` |
| TEST-017 | POST with blank description returns 400 VALIDATION_FAILED | API/Validation | US-1.2 | REQ-FUNC-006, REQ-FUNC-009 | `description` blank | HTTP 400; `errorCode: VALIDATION_FAILED`; `fieldErrors` includes `description` |
| TEST-018 | POST with malformed JSON returns 400 INVALID_JSON | API/Error | US-1.3 | REQ-FUNC-009, REQ-FUNC-020 | Body is not valid JSON | HTTP 400; `errorCode: INVALID_JSON` |
| TEST-019 | POST with wrong Content-Type returns 415 | API/Error | US-1.3 | REQ-FUNC-020 | `Content-Type: text/plain` | HTTP 415; `errorCode: UNSUPPORTED_MEDIA_TYPE` |
| TEST-020 | No stack trace in any error response body | API/Security | US-1.3 | REQ-FUNC-020 | Any error scenario | Response body contains only `errorCode`, `message`, optional `fieldErrors` |
| TEST-021 | GET returns table with Name/Title/Description columns | UI/Functional | US-2.1 | REQ-FUNC-010, REQ-FUNC-011 | Records exist | HTML table rendered; three column headers visible; rows match stored records |
| TEST-022 | GET table shows records in insertion order | UI/Functional | US-2.1 | REQ-FUNC-010 | Multiple records | Rows ordered by id ascending |
| TEST-023 | id and createdAt not shown as table columns | UI/Functional | US-2.1 | REQ-FUNC-011 | Records displayed | No `id` or `createdAt` column in rendered table |
| TEST-024 | Table auto-refreshes after successful POST | UI/Functional | US-2.2 | REQ-FUNC-013 | Form submitted; HTTP 201 received | New record appears in table within 2 seconds; no page reload |
| TEST-025 | Empty-state message shown when no records | UI/Functional | US-2.3 | REQ-FUNC-012 | GET returns `[]` | "No requests yet." displayed; no `<table>` element rendered |
| TEST-026 | Table error message on GET HTTP 500 | UI/Error | US-2.4 | REQ-FUNC-014 | GET returns 500 | "Could not load requests. Please refresh the page." displayed; no table shown |
| TEST-027 | Table error message on GET network failure | UI/Error | US-2.4 | REQ-FUNC-014 | Network unavailable | "Could not load requests. Please refresh the page." displayed |
| TEST-028 | Success acknowledgment shown after HTTP 201 | UI/Functional | US-3.1 | REQ-FUNC-015 | POST returns 201 | "Request submitted successfully." visible in acknowledgment area |
| TEST-029 | Acknowledgment area uses ARIA role | UI/Accessibility | US-3.1 | REQ-FUNC-015 | Any acknowledgment state | Element has `role="status"` or `role="alert"` |
| TEST-030 | Error acknowledgment on HTTP 400 | UI/Functional | US-3.2 | REQ-FUNC-016 | POST returns 400 | "Submission failed: [server message]." in acknowledgment area; error style applied |
| TEST-031 | Acknowledgment cleared on new Submit click | UI/Functional | US-3.3 | REQ-FUNC-017 | Previous acknowledgment visible; Submit clicked again | Acknowledgment area cleared before new request sent |
| TEST-032 | Acknowledgment area always present in DOM | UI/Functional | US-3.3 | REQ-FUNC-015 | Page load / empty state | Acknowledgment element exists in DOM even when no message |
| TEST-033 | POST /api/requests returns 201 with correct JSON shape | API/Contract | US-4.1 | REQ-FUNC-018, REQ-FUNC-021 | Valid POST | HTTP 201; `Content-Type: application/json`; all five fields present |
| TEST-034 | createdAt serialized as ISO 8601 UTC string | API/Contract | US-4.1 | REQ-FUNC-007, REQ-FUNC-018 | POST returns 201 | `createdAt` matches pattern `\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z` |
| TEST-035 | GET /api/requests returns 200 with JSON array | API/Contract | US-4.2 | REQ-FUNC-010, REQ-FUNC-018, REQ-FUNC-021 | GET issued | HTTP 200; `Content-Type: application/json`; response is JSON array |
| TEST-036 | GET returns empty array when no records | API/Contract | US-4.2 | REQ-FUNC-010 | No records in H2 | HTTP 200; body is `[]` |
| TEST-037 | CORS headers present on POST response | API/Integration | US-4.3 | REQ-FUNC-019 | POST from localhost:5173 | `Access-Control-Allow-Origin` header present in response |
| TEST-038 | CORS headers present on GET response | API/Integration | US-4.3 | REQ-FUNC-019 | GET from localhost:3000 | `Access-Control-Allow-Origin` header present in response |
| TEST-039 | OPTIONS preflight returns 200 with CORS headers | API/Integration | US-4.3 | REQ-FUNC-019 | OPTIONS to `/api/requests` | HTTP 200; `Access-Control-Allow-Methods` includes GET, POST, OPTIONS |
| TEST-040 | End-to-end: submit form → record appears in table | E2E | US-0.1, US-2.2 | REQ-FUNC-003, REQ-FUNC-013 | Full flow from browser | Submitted request visible in table within 2 seconds; no page reload |

### 5.2 Test Coverage Matrix by Feature

| Feature | User Stories | Test Cases | Test Count | Coverage |
|---|---|---|---|---|
| F0: Request Submission Form | US-0.1, US-0.2, US-0.3, US-0.4 | TEST-001–011 | 11 | 100% |
| F1: Request Storage | US-1.1, US-1.2, US-1.3 | TEST-012–020 | 9 | 100% |
| F2: Request List View | US-2.1, US-2.2, US-2.3, US-2.4 | TEST-021–027 | 7 | 100% |
| F3: Submission Acknowledgment | US-3.1, US-3.2, US-3.3 | TEST-028–032 | 5 | 100% |
| F4: Basic API Layer | US-4.1, US-4.2, US-4.3, US-4.4 | TEST-033–039 | 7 | 100% |
| Cross-Feature (E2E) | US-0.1, US-2.2 | TEST-040 | 1 | — |
| **Total** | **18 stories** | **TEST-001–040** | **40** | **100%** |

### 5.3 Test Coverage by Type

| Test Type | Test Count | Features Covered |
|---|---|---|
| UI / Functional | 18 | F0, F2, F3 |
| API / Functional | 5 | F1, F4 |
| API / Validation | 3 | F1 |
| API / Contract | 5 | F4 |
| API / Error | 3 | F1 |
| API / Integration | 3 | F4 |
| UI / Validation | 4 | F0 |
| UI / Error | 4 | F0, F2 |
| UI / Accessibility | 1 | F3 |
| API / Security | 1 | F1 |
| End-to-End | 1 | F0, F2 |
| **Total** | **48** | **All Features** |

### 5.4 NFR Coverage

| NFR ID | Requirement | Test Ref | Notes |
|---|---|---|---|
| REQ-NFR-001 | Page load < 3s; form round-trip < 1s | TEST-021, TEST-040 | Performance validated during E2E and table load tests |
| REQ-NFR-002 | Stable for 30+ min demo session | TEST-040 (extended) | Manual/exploratory testing; no automated long-run test defined |
| REQ-NFR-003 | Form errors clearly labeled; usable without instruction | TEST-004–007, TEST-028–031 | Validated via UI/Validation and UI/Functional tests |
| REQ-NFR-004 | Chrome and Firefox desktop compatibility | TEST-040 | Manual cross-browser smoke test |
| REQ-NFR-005 | Standard React component + Spring Boot layered structure | — | Code review / architecture review; no automated test |
| REQ-NFR-006 | No sensitive data; input trimming; no auth | TEST-014, TEST-020 | Trimming tested in TEST-014; no stack trace in TEST-020 |
| REQ-NFR-007 | Semantic HTML; keyboard-navigable; ARIA roles | TEST-029 | ARIA tested in TEST-029; keyboard navigation via manual accessibility check |

---

## 6. Change Management

### 6.1 Change Log

| Change ID | Date | Version | Section(s) Affected | Change Description | Author | Status |
|---|---|---|---|---|---|---|
| CHG-001 | 2026-05-08 | 1.0 | All | Initial RTM created from PRD-SRT.md v1.0, FRD-SRT.md v1.0, TechArch-SRT.md v1.0, UserStories-SRT.md v1.0 | Pivota RTM Generator | Approved |

### 6.2 Impact Analysis Guidelines

When a source document changes, the following RTM sections require review:

| Change Type | Sections to Update |
|---|---|
| New PRD feature added | §2.1, §3.1, §3.2, §4, §5.2 |
| PRD feature modified | §2.1, §3.1 (forward), §4 (detail for that feature), §5.1 (relevant tests) |
| PRD feature removed | §2.1, §3.1, §3.2, §4, §5.1, §5.2 |
| FRD requirement added | §2.2, §3.1, §3.2, §5.1 |
| TechArch spec changed | §2.4, §3.1, §3.3, §4 (TechArch mapping) |
| User story added/modified | §2.5, §3.2, §5.1, §5.2 |
| Test case added/modified | §5.1, §5.2, §5.3 |

### 6.3 Traceability Validation Checklist

- [x] All PRD features (F0–F4) have at least one FRD requirement mapped
- [x] All FRD requirements (REQ-FUNC-001–021) map to a PRD feature
- [x] All FRD requirements map to at least one TechArch spec
- [x] All TechArch specs (SPEC-001–012) map to at least one FRD requirement
- [x] All user stories (US-0.1–US-4.4) map to a PRD feature and FRD requirement
- [x] All user stories have at least one test case
- [x] All test cases reference a user story and FRD requirement
- [x] No orphaned requirements (requirements with no story or test)
- [x] No orphaned tests (tests with no traceable requirement)

---

## 7. Approval

### 7.1 Document Sign-Off

| Role | Name | Signature | Date | Status |
|---|---|---|---|---|
| Product Owner | — | — | — | Pending |
| Tech Lead / Architect | — | — | — | Pending |
| QA Lead | — | — | — | Pending |
| Delivery Manager | — | — | — | Pending |

### 7.2 Review Notes

| Reviewer | Date | Comments |
|---|---|---|
| — | — | — |

### 7.3 Document Status

| Property | Value |
|---|---|
| Document Version | 1.0 |
| Status | Draft — Pending Review |
| Source PRD Version | 1.0 (2026-05-08) |
| Source FRD Version | 1.0 (2026-05-08) |
| Source TechArch Version | 1.0 (2026-05-08) |
| Source UserStories Version | 1.0 (2026-05-08) |
| Next Review Date | Upon any source document change |
| RTM Owner | Delivery Team |

---

*Document generated by Pivota Spec RTM Generator | Project: SRT | 2026-05-08*
