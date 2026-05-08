# Phase 1: Backend API & Storage - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the Spring Boot backend: two REST endpoints (POST /api/requests and GET /api/requests), H2 in-memory persistence, CORS configuration for the React dev origin, and server-side field validation. Frontend is not in this phase. The API contract must be independently testable via curl or Postman.

</domain>

<decisions>
## Implementation Decisions

### Validation Rules & Behavior

- All three fields are required: `name`, `title`, `description` — blank or missing any field → HTTP 400
- Validation is enforced at the **service layer** (not just controller annotation), using Spring's `@Valid` or manual checks in the service
- HTTP 400 response body must be structured JSON with an `errors` array listing offending fields — not a plain string message
- Error response shape (used by FRD and agreed in spec docs):
  ```json
  {
    "status": 400,
    "error": "VALIDATION_FAILED",
    "errors": [
      { "field": "name", "message": "Name is required" },
      { "field": "title", "message": "Title is required" }
    ]
  }
  ```
- Only "blank/missing" validation for v1 — no length limits enforced at service layer (DB column constraints of VARCHAR(255/1000) serve as the hard cap)
- Server returns **all failing fields at once** (not fail-fast on first field)

### API Response Shapes

- POST 201 success response includes the full stored record: `id` (UUID or auto-increment), `name`, `title`, `description`, `createdAt` timestamp
- GET 200 returns JSON array of all records; returns `[]` (empty array) when no records exist — not null, not 404
- No pagination for v1

### CORS Configuration

- Allow origin: `http://localhost:5173` (Vite/React dev server)
- Allow methods: GET, POST
- Allow headers: Content-Type
- No credentials needed (no auth)

### Data Layer

- H2 in-memory database with `spring.jpa.hibernate.ddl-auto=create-drop` (schema recreated on restart — acceptable for demo)
- JPA/Hibernate for ORM — no raw JDBC
- `createdAt` auto-populated via `@CreationTimestamp` or `DEFAULT CURRENT_TIMESTAMP`

### Claude's Discretion

- Exact package structure (controller/service/repository/model — standard Spring Boot convention is fine)
- Build tool: Maven or Gradle (Maven is more common for Spring Boot demos)
- Spring Boot starter version (3.x preferred, compatible with Java 17+)
- Whether to use `@RestControllerAdvice` for global exception handling (recommended pattern)
- Exact field names in JSON serialization (snake_case vs camelCase — Spring Boot default is camelCase)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Functional Requirements
- `project_specs/FRD-SRT.md` — Full functional specification for all features (F0–F4); F1 and F4 are directly relevant to this phase
- `project_specs/FRD-SRT.md` §F1 — Request Storage: POST endpoint spec, persistence contract, validation behavior
- `project_specs/FRD-SRT.md` §F4 — API Layer: full endpoint definitions, CORS spec, error codes
- `project_specs/FRD/Y0-schema.md` — H2 DDL, JPA entity, DTO definitions, application.properties
- `project_specs/FRD/Y1-api.md` — Full REST catalog with example HTTP requests/responses and CORS spec
- `project_specs/FRD/Y2-errors.md` — Error code catalog, HTTP statuses, structured error body shapes

### Technical Architecture
- `project_specs/TechArch-SRT.md` — System architecture, component layout, data model DDL, API design with TypeScript interfaces, tech stack (Java 21, Spring Boot 3, H2 2)
- `project_specs/TechArch-SRT.md` §3 — Data Model: H2-compatible DDL for `requests` table and JPA entity
- `project_specs/TechArch-SRT.md` §4 — API Design: POST and GET endpoint specs with request/response shapes and CORS Java config snippet

### Requirements
- `.planning/REQUIREMENTS.md` — API-01, API-02, API-03, API-04 are the v1 requirements for this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. No existing components, utilities, or patterns to reuse.

### Established Patterns
- None established yet — this is the first phase. Standard Spring Boot MVC patterns apply.

### Integration Points
- This phase creates the API that Phase 2 (React form) and Phase 3 (React list) will consume
- The CORS origin `http://localhost:5173` must be configured correctly so Phase 2/3 React code can call the API without browser errors
- The API contract (endpoint paths, request/response shapes, error body structure) established here is immutable from Phase 2 onward

</code_context>

<specifics>
## Specific Ideas

- The TechArch defines the exact DDL: `requests` table with `id` (auto-increment or UUID), `name` (VARCHAR 255), `title` (VARCHAR 255), `description` (TEXT/VARCHAR 1000), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- The FRD defines the exact API contract — downstream planner must copy specs verbatim, not abstract them
- Error body must use `VALIDATION_FAILED` as the error code (per FRD/Y2-errors.md)

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope. API response shapes and validation behavior were the only areas discussed, both resolved above.

</deferred>

---

*Phase: 01-backend-api-storage*
*Context gathered: 2026-05-08*
