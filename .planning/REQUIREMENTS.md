# Requirements: Simple Request Tracker (SRT)

**Defined:** 2026-05-08
**Core Value:** A user can submit a request and immediately see it appear in the list — the full input → store → retrieve → display flow must work.

## v1 Requirements

### Request Form

- [ ] **FORM-01**: User can enter Name, Title, and Description in a form with stacked input fields
- [ ] **FORM-02**: User can submit the form via a Submit button
- [ ] **FORM-03**: Client-side validation shows per-field inline errors for empty required fields (no network call)
- [ ] **FORM-04**: Form fields are reset/cleared after a successful submission

### Storage & API

- [ ] **API-01**: POST /api/requests — Spring Boot endpoint receives and persists submitted requests to H2 in-memory database
- [ ] **API-02**: GET /api/requests — Spring Boot endpoint returns all stored requests as JSON
- [ ] **API-03**: CORS configuration allows the React frontend to call the Spring Boot backend
- [ ] **API-04**: Server-side validation rejects requests with missing/empty required fields (HTTP 400 with error body)

### Request List View

- [ ] **LIST-01**: Table displays all stored requests with columns: Name, Title, Description
- [ ] **LIST-02**: Empty state message is shown when no requests exist
- [ ] **LIST-03**: Table auto-refreshes after a successful form submission (new record appears without manual reload)

### Submission Acknowledgment

- [ ] **ACK-01**: Inline success acknowledgment is displayed when submission returns HTTP 201
- [ ] **ACK-02**: Inline error message is displayed when submission returns HTTP 400 or HTTP 500

## v2 Requirements

### Enhancements

- **V2-01**: Pagination for the request list (deferred — demo scope has small data volumes)
- **V2-02**: Persistent database (PostgreSQL or equivalent) replacing in-memory H2 (deferred — demo uses H2)
- **V2-03**: Submission timestamp display in list view (data exists in model but not shown in demo UI)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Authentication / Authorization | Explicitly excluded from demo scope |
| External API integrations | Not required for demo |
| Complex workflows or approvals | Out of demo scope |
| Notifications | Out of demo scope |
| Mobile-specific UI | Web demo only |
| OAuth / SSO | No auth in scope |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORM-01 | Phase 2 | Pending |
| FORM-02 | Phase 2 | Pending |
| FORM-03 | Phase 2 | Pending |
| FORM-04 | Phase 2 | Pending |
| API-01 | Phase 1 | Pending |
| API-02 | Phase 1 | Pending |
| API-03 | Phase 1 | Pending |
| API-04 | Phase 1 | Pending |
| LIST-01 | Phase 3 | Pending |
| LIST-02 | Phase 3 | Pending |
| LIST-03 | Phase 3 | Pending |
| ACK-01 | Phase 2 | Pending |
| ACK-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-08*
*Last updated: 2026-05-08 after initial definition*
