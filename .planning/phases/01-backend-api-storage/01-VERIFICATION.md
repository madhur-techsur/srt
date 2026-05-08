---
phase: 01-backend-api-storage
verified: 2026-05-08T00:00:00Z
status: passed
score: 4/4 must-haves verified
---

# Phase 1: Backend API & Storage — Verification Report

**Phase Goal:** The Spring Boot backend accepts, validates, stores, and returns request data — the API contract is complete and testable independently of the frontend
**Verified:** 2026-05-08
**Status:** ✓ PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Success Criteria)

| #  | Truth                                                                                   | Status     | Evidence                                                                                                      |
|----|-----------------------------------------------------------------------------------------|------------|---------------------------------------------------------------------------------------------------------------|
| 1  | `POST /api/requests` with valid JSON returns HTTP 201 with `id` and `createdAt`         | ✓ VERIFIED | Controller returns `ResponseEntity.status(CREATED).body(saved)`; entity has `@GeneratedValue(IDENTITY)` id; service sets `Instant.now()` as `createdAt`; Jackson serialises as ISO 8601 via `jackson-datatype-jsr310` + `write-dates-as-timestamps=false` |
| 2  | `POST /api/requests` with any blank field returns HTTP 400 `VALIDATION_FAILED` with offending fields | ✓ VERIFIED | Service collects all blank-field errors into `List<FieldError>`, throws `ValidationException`; `GlobalExceptionHandler` maps it to `ErrorResponse("VALIDATION_FAILED", ..., fieldErrors)` → HTTP 400 |
| 3  | `GET /api/requests` returns HTTP 200 with JSON array (empty array when none exist)      | ✓ VERIFIED | Controller calls `requestService.getAllRequests()` → `requestRepository.findAll()` (returns `[]` when empty); wrapped in `ResponseEntity.ok()` |
| 4  | `http://localhost:5173` can call both endpoints without browser CORS errors             | ✓ VERIFIED | `CorsConfig` registers `.allowedOrigins("http://localhost:3000", "http://localhost:5173")` on `/api/**` with `GET`, `POST`, `OPTIONS` methods |

**Score: 4/4 truths verified**

---

## Required Artifacts

| Artifact | Purpose | Status | Details |
|----------|---------|--------|---------|
| `backend/pom.xml` | Maven project, Spring Boot 3.2.5 / Java 21, all 5 dependencies | ✓ VERIFIED | Substantive: web, data-jpa, h2, validation, jackson-datatype-jsr310, spring-boot-starter-test all present |
| `backend/src/main/resources/application.properties` | H2 in-memory config, ISO timestamp format | ✓ VERIFIED | `jdbc:h2:mem:srtdb`, `create-drop`, `write-dates-as-timestamps=false` all present |
| `SrtApplication.java` | Spring Boot entry point | ✓ VERIFIED | `@SpringBootApplication` + `SpringApplication.run` |
| `model/Request.java` | JPA entity (id, name, title, description, createdAt) | ✓ VERIFIED | `@Entity`, `@Table(name="requests")`, `@GeneratedValue(IDENTITY)`, all four columns with correct nullable/length constraints |
| `model/RequestDto.java` | Inbound POST body DTO | ✓ VERIFIED | All three fields with getters/setters; used by controller |
| `repository/RequestRepository.java` | H2 persistence via JPA | ✓ VERIFIED | Extends `JpaRepository<Request, Long>`; wired into `RequestService` |
| `service/RequestService.java` | Business logic: validation + persistence | ✓ VERIFIED | Collects all blank-field errors; throws `ValidationException`; calls `requestRepository.save()` / `findAll()` |
| `controller/RequestController.java` | REST endpoints POST + GET | ✓ VERIFIED | `@PostMapping` → 201, `@GetMapping` → 200; delegates to `RequestService` |
| `config/CorsConfig.java` | CORS for localhost:5173 | ✓ VERIFIED | `WebMvcConfigurer`, `/api/**`, origins `5173` + `3000`, methods `GET`/`POST`/`OPTIONS` |
| `exception/ValidationException.java` | Custom exception with field-error list | ✓ VERIFIED | `RuntimeException` subclass with `List<FieldError>` record; wired in service + handler |
| `dto/ErrorResponse.java` | HTTP 400 error body shape | ✓ VERIFIED | `errorCode`, `message`, `fieldErrors` fields with getters; matches TechArch contract |
| `exception/GlobalExceptionHandler.java` | Maps exceptions to HTTP responses | ✓ VERIFIED | `@RestControllerAdvice`; `ValidationException` → 400 `VALIDATION_FAILED`; `Exception` → 500 `INTERNAL_ERROR` |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `RequestController` | `RequestService` | Constructor injection | ✓ WIRED | `private final RequestService requestService` + constructor; used in both `@PostMapping` and `@GetMapping` handlers |
| `RequestService` | `RequestRepository` | Constructor injection | ✓ WIRED | `private final RequestRepository requestRepository`; called as `requestRepository.save()` and `requestRepository.findAll()` |
| `RequestService` | `ValidationException` | throw on blank fields | ✓ WIRED | Blank-field loop populates `errors` list, `if (!errors.isEmpty()) throw new ValidationException(errors)` |
| `GlobalExceptionHandler` | `ValidationException` | `@ExceptionHandler` | ✓ WIRED | `@ExceptionHandler(ValidationException.class)` maps to `ErrorResponse` with `VALIDATION_FAILED` code → HTTP 400 |
| `GlobalExceptionHandler` | `ErrorResponse` | Instantiation | ✓ WIRED | `new ErrorResponse("VALIDATION_FAILED", ..., fieldErrors)` constructed and returned in response body |
| `CorsConfig` | `/api/**` | `WebMvcConfigurer` | ✓ WIRED | `registry.addMapping("/api/**").allowedOrigins(...localhost:5173...)` — covers both controller endpoints |
| `Request` entity | H2 | JPA `@Entity` + `create-drop` | ✓ WIRED | `@Entity @Table(name="requests")` + `spring.jpa.hibernate.ddl-auto=create-drop` auto-creates `requests` table on startup |
| Jackson | `Instant` serialization | `jackson-datatype-jsr310` + `write-dates-as-timestamps=false` | ✓ WIRED | Dependency in pom.xml; property in application.properties; `createdAt` field is `Instant` type — produces ISO 8601 in JSON |

---

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| — | None found | — | — |

No TODO, FIXME, placeholder, `return null`, `return {}`, `return []`, or debug logging found in any source file.

---

## Human Verification Required

None identified. All four success criteria can be assessed programmatically through code inspection:

- HTTP status codes are determined by explicit `ResponseEntity.status(...)` calls in the controller
- Validation error collection is deterministic (blank-check + exception throw)
- CORS origin string `http://localhost:5173` is literal in `CorsConfig.java`
- JSON serialization of `Instant` is configuration-driven via documented Spring Boot properties

The only items that strictly require a running server are live HTTP smoke tests, but the code paths are fully wired and non-stubbed. Those are noted below for informational purposes only:

### 1. Live HTTP smoke test — POST valid
**Test:** `curl -X POST http://localhost:8080/api/requests -H "Content-Type: application/json" -d '{"name":"Alice","title":"Fix login","description":"Broken"}'`
**Expected:** HTTP 201 with JSON body containing `id` (integer), `createdAt` (ISO 8601 string)
**Why human:** Requires running application process

### 2. Live HTTP smoke test — POST blank fields
**Test:** `curl -X POST http://localhost:8080/api/requests -H "Content-Type: application/json" -d '{"name":"","title":"","description":""}'`
**Expected:** HTTP 400 body `{"errorCode":"VALIDATION_FAILED","message":"One or more fields failed validation.","fieldErrors":[{"field":"name",...},{"field":"title",...},{"field":"description",...}]}`
**Why human:** Requires running application process

### 3. Live CORS preflight
**Test:** `curl -X OPTIONS http://localhost:8080/api/requests -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" -v`
**Expected:** Response header `Access-Control-Allow-Origin: http://localhost:5173`
**Why human:** Requires running application process

---

## Summary

All 4 success criteria are **fully achieved**. Every artifact exists, is substantive (no stubs, no placeholders), and is correctly wired into the request-handling chain:

- **SC1 (POST → 201 + id + createdAt):** Controller returns `CREATED` status with the saved entity. The entity's `id` is JPA-generated (`@GeneratedValue(IDENTITY)`), `createdAt` is set by `Instant.now()` in the service, and Jackson serialises `Instant` as ISO 8601 via the configured `jackson-datatype-jsr310` module.
- **SC2 (POST blank → 400 VALIDATION_FAILED with fields):** Service collects all blank-field violations before throwing, producing a complete `fieldErrors` list. `GlobalExceptionHandler` translates this to the exact `VALIDATION_FAILED` error shape required.
- **SC3 (GET → 200 array):** `requestRepository.findAll()` returns an empty list when no rows exist; Jackson serialises it as `[]`. The controller wraps it in `ResponseEntity.ok()`.
- **SC4 (CORS for localhost:5173):** `CorsConfig` explicitly lists `http://localhost:5173` as an allowed origin for all `/api/**` routes with the required HTTP methods.

Phase 1 goal is **achieved**. The API contract is complete and testable independently of the frontend.

---

_Verified: 2026-05-08T00:00:00Z_
_Verifier: Claude (pivota_spec-verifier)_
