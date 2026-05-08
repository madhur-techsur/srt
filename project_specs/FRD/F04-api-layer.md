## F04: Basic API Layer (Backend REST Contract)

**Description:** The Basic API Layer is the Spring Boot REST backend that underpins all data operations in SRT. It exposes two endpoints — `POST /api/requests` and `GET /api/requests` — uses JSON for all request/response bodies, applies correct HTTP status codes, and configures CORS to allow the React frontend development origin. This feature defines the contract that F00, F01, and F02 depend on and enables independent development and testing of frontend and backend.

---

**Terminology:**

- **Base Path:** `/api` — the common path prefix for all SRT REST endpoints.
- **CORS:** Cross-Origin Resource Sharing policy configured in Spring Boot to allow the React dev server origin.
- **Controller:** Spring Boot `@RestController` class handling HTTP routing and serialization.
- **Service:** Spring Boot `@Service` class containing business logic (validation, entity construction).
- **Repository:** Spring Boot `@Repository` / `JpaRepository` interface for H2 data access.
- **DTO:** Data Transfer Object — the deserialized shape of an inbound JSON request body.
- **Entity:** JPA `@Entity` class mapped to the H2 `requests` table.
- **Global Exception Handler:** Spring `@ControllerAdvice` that catches unhandled exceptions and returns structured error responses.

---

**Sub-features:**

- `POST /api/requests` — create a new request (see F01 for full behavior)
- `GET /api/requests` — retrieve all requests
- JSON serialization/deserialization for all endpoints
- CORS policy allowing React dev server (`http://localhost:3000` or `http://localhost:5173`)
- Correct HTTP status codes: 200, 201, 400, 415, 500
- Global exception handler returning structured JSON error bodies
- Spring Boot layered architecture: Controller → Service → Repository

---

**Process:**

**POST /api/requests:**
1. See F01 §Process for the full POST handling flow.

**GET /api/requests:**
1. Spring Boot controller receives `GET /api/requests`.
2. No request body or query parameters are required.
3. Service calls repository `findAll()` — returns all `Request` entities in insertion order.
4. Service returns the list (empty list if no records exist).
5. Controller serializes list to JSON array and returns HTTP 200 OK.
6. If an unexpected exception occurs → Global Exception Handler returns HTTP 500 with `INTERNAL_ERROR` body.

**CORS Configuration:**
1. Spring Boot `WebMvcConfigurer` (or `@CrossOrigin`) configured to allow:
   - Allowed origins: `http://localhost:3000`, `http://localhost:5173`
   - Allowed methods: `GET`, `POST`, `OPTIONS`
   - Allowed headers: `Content-Type`, `Accept`
   - Max age: 3600 seconds
2. Preflight `OPTIONS` requests return HTTP 200 with CORS headers.

**Global Exception Handling:**
1. `@ControllerAdvice` intercepts any unhandled `Exception`.
2. Returns HTTP 500 with body: `{ "errorCode": "INTERNAL_ERROR", "message": "An unexpected error occurred." }`.
3. `HttpMessageNotReadableException` (malformed JSON) → HTTP 400, `INVALID_JSON`.
4. `HttpMediaTypeNotSupportedException` → HTTP 415, `UNSUPPORTED_MEDIA_TYPE`.

---

**Inputs:**

- `POST /api/requests`:
  - HTTP method: POST
  - Path: `/api/requests`
  - Headers: `Content-Type: application/json`
  - Body: `{ "name": string, "title": string, "description": string }`

- `GET /api/requests`:
  - HTTP method: GET
  - Path: `/api/requests`
  - Headers: none required
  - Body: none

---

**Outputs:**

- `POST /api/requests`:
  - HTTP 201 with created request record JSON (see F01 §Outputs)
  - HTTP 400 with error JSON on validation failure or malformed body
  - HTTP 415 on wrong Content-Type
  - HTTP 500 on unexpected error

- `GET /api/requests`:
  - HTTP 200 with JSON array of all request records (may be empty `[]`)
  - HTTP 500 on unexpected error

---

**Validation:**

- All endpoints must return `Content-Type: application/json` in the response.
- CORS headers must be present on all responses (not just preflight) for allowed origins.
- HTTP status codes must strictly follow the rules: 201 for created resources, 200 for reads, 400 for client errors, 500 for server errors.
- No authentication or authorization headers are required or checked.
- No rate limiting is applied (demo scope).
- Request body for POST must be valid JSON with `Content-Type: application/json`.

---

**Error States:**

| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| POST success | 201 | — | (record returned) |
| GET success | 200 | — | (array returned) |
| POST validation failure | 400 | `VALIDATION_FAILED` | "One or more fields failed validation." |
| Malformed JSON body | 400 | `INVALID_JSON` | "Request body could not be parsed." |
| Wrong Content-Type on POST | 415 | `UNSUPPORTED_MEDIA_TYPE` | "Content-Type must be application/json." |
| Unhandled server exception | 500 | `INTERNAL_ERROR` | "An unexpected error occurred." |

---

**API Surface (this feature):** Defines all SRT API endpoints. See `Y1-api.md` for full request/response schemas including headers and example payloads.

**Schema Surface (this feature):** Reads and writes `requests` table via JPA. See `Y0-schema.md` §requests and §Spring Boot Entity Mapping.
