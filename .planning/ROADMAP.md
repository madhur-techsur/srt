# Roadmap: Simple Request Tracker (SRT)

## Overview

SRT delivers a single end-to-end capability: a user fills in a form, submits a request, and immediately sees it appear in a table — no reload required. The work clusters naturally into three phases that mirror the architecture: first the backend API and storage layer, then the request submission form with acknowledgment, then the request list view that closes the loop. All three phases must be complete for the core value to be demonstrable.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Backend API & Storage** - Spring Boot REST endpoints, H2 persistence, CORS, and server-side validation
- [ ] **Phase 2: Request Form & Acknowledgment** - React form with client-side validation, POST submission, and inline success/error feedback
- [ ] **Phase 3: Request List View** - React table displaying all stored requests with empty state and auto-refresh after submission

## Phase Details

### Phase 1: Backend API & Storage
**Status**: awaiting verify
**Goal**: The Spring Boot backend accepts, validates, stores, and returns request data — the API contract is complete and testable independently of the frontend
**Depends on**: Nothing (first phase)
**Requirements**: API-01, API-02, API-03, API-04
**Success Criteria** (what must be TRUE):
  1. `POST /api/requests` with valid JSON returns HTTP 201 with the stored record including system-assigned `id` and `createdAt`
  2. `POST /api/requests` with any blank field returns HTTP 400 with a structured `VALIDATION_FAILED` error body listing the offending fields
  3. `GET /api/requests` returns HTTP 200 with a JSON array of all previously submitted requests (empty array when none exist)
  4. The React dev server origin (`http://localhost:5173`) can call both endpoints without browser CORS errors
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md — Maven project scaffold + JPA entity + H2 repository + application config
- [ ] 01-02-PLAN.md — REST controller (POST/GET) + service + CORS configuration
- [ ] 01-03-PLAN.md — Service-layer validation + global exception handler + HTTP 400 error body

### Phase 2: Request Form & Acknowledgment
**Goal**: A user can fill in the form, submit it, and receive immediate inline feedback — the submission flow works end-to-end with the backend
**Depends on**: Phase 1
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04, ACK-01, ACK-02
**Success Criteria** (what must be TRUE):
  1. The form renders three labeled input fields (Name, Title, Description) and a Submit button
  2. Clicking Submit with any field empty shows an inline per-field error message and does not send a network request
  3. Clicking Submit with all fields filled sends a POST and — on HTTP 201 — displays a success message ("Request submitted successfully") and clears all form fields
  4. When the server returns HTTP 400 or 500, an inline error message is displayed and form fields are preserved (not cleared)
**Plans**: TBD

### Phase 3: Request List View
**Goal**: All submitted requests are visible in a table that stays current — the full input → store → retrieve → display loop is complete
**Depends on**: Phase 2
**Requirements**: LIST-01, LIST-02, LIST-03
**Success Criteria** (what must be TRUE):
  1. On page load, all previously submitted requests appear in a table with columns: Name, Title, Description
  2. When no requests exist, the table area shows "No requests yet." instead of an empty or broken table
  3. After a successful form submission, the new request appears in the table without a manual page reload
**Plans**: 1 plan

Plans:
- [ ] 03-01-PLAN.md — Implement RequestList.tsx (replace null stub) + Playwright e2e tests for table, empty state, and auto-refresh

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Backend API & Storage | 0/TBD | Not started | - |
| 2. Request Form & Acknowledgment | 0/TBD | Not started | - |
| 3. Request List View | 0/TBD | Not started | - |