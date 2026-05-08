# Technical Architecture: Simple Request Tracker (SRT)

**Document Type:** Technical Architecture Document  
**Project Acronym:** SRT  
**Version:** 1.0  
**Date:** 2026-05-08  
**Status:** Draft  
**Derived From:** PRD-SRT.md, FRD-SRT.md

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture)
3. [Data Model](#3-data-model)
4. [API Design](#4-api-design)
5. [Security Architecture](#5-security-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Integration Points](#7-integration-points)

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

SRT uses a **two-tier client-server architecture** with a strict separation between the React single-page application (SPA) frontend and the Java Spring Boot REST backend. The two tiers communicate exclusively via JSON over HTTP. There is no server-side rendering, no message queue, and no shared in-process state between layers.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   React SPA (Vite)                        │  │
│  │                                                           │  │
│  │   ┌─────────────────────┐   ┌─────────────────────────┐  │  │
│  │   │  RequestForm        │   │  RequestList            │  │  │
│  │   │  Component          │   │  Component              │  │  │
│  │   │  (F0, F3)           │   │  (F2)                   │  │  │
│  │   └──────────┬──────────┘   └──────────┬──────────────┘  │  │
│  │              │                         │                  │  │
│  │   ┌──────────▼─────────────────────────▼──────────────┐  │  │
│  │   │               apiClient (fetch / axios)           │  │  │
│  │   │         http://localhost:8080/api                  │  │  │
│  │   └───────────────────────┬───────────────────────────┘  │  │
│  └───────────────────────────│───────────────────────────────┘  │
└──────────────────────────────│──────────────────────────────────┘
                               │  HTTP/1.1  JSON  REST
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                  Java Spring Boot (Port 8080)                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   @RestController                        │   │
│  │             RequestController  /api/requests             │   │
│  └─────────────────────────┬────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │                      @Service                             │  │
│  │              RequestService  (validation, logic)          │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │              @Repository / JpaRepository                  │  │
│  │                   RequestRepository                       │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                             │  JPA / Hibernate                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │              H2 In-Memory Database (embedded)             │  │
│  │                    requests table                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 1.2 Deployment Topology

SRT is deployed locally on a single developer machine for demonstration purposes. Both processes run on localhost:

| Process | Port | Notes |
|---------|------|-------|
| React dev server (Vite) | 5173 | Serves the SPA during development |
| Spring Boot application | 8080 | Serves the REST API; hosts H2 |
| H2 in-memory database | (in-JVM) | Embedded within the Spring Boot process |

No containerization, cloud deployment, or reverse proxy is required for demo scope.

### 1.3 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| H2 in-memory over file-based DB | Zero configuration, embedded in JVM; data loss on restart is acceptable for demo scope |
| `ddl-auto=create-drop` | Schema auto-created from JPA entity on startup; eliminates migration tooling complexity |
| Two endpoints only (`POST`, `GET`) | Minimal API surface required by requirements; YAGNI for demo scope |
| No auth layer | Explicitly out of scope; removing it reduces implementation surface by ~30% |
| CORS via `WebMvcConfigurer` | Single configuration class covers all endpoints; no per-controller annotation duplication |
| React state for table refresh | After a successful POST, the frontend re-issues `GET /api/requests`; no WebSocket or polling needed |

---

## 2. Component Architecture

### 2.1 Frontend Components (React)

```
src/
├── App.tsx                      ← Root component; renders RequestForm + RequestList
├── components/
│   ├── RequestForm.tsx           ← F0 + F3: form inputs, validation, POST call, acknowledgment
│   └── RequestList.tsx           ← F2: table display, empty state, error state, GET call
├── api/
│   └── requestsApi.ts            ← API client: typed fetch wrappers for POST and GET
└── types/
    └── request.ts                ← TypeScript interfaces shared between components
```

| Component | Responsibility |
|-----------|---------------|
| `App` | Layout root; holds shared `requests` state; passes refresh callback to `RequestForm` |
| `RequestForm` | Renders Name / Title / Description inputs; client-side validation; POSTs on submit; displays acknowledgment (F3) |
| `RequestList` | Fires GET on mount; renders table or empty-state; re-fetches when `refreshTrigger` prop changes |
| `requestsApi.ts` | Wraps `fetch`; sets `Content-Type: application/json`; parses response; throws typed errors |
| `request.ts` | Shared `Request`, `CreateRequestPayload`, `ApiError` TypeScript interfaces |

### 2.2 Backend Components (Spring Boot)

```
src/main/java/com/example/srt/
├── SrtApplication.java               ← @SpringBootApplication entry point
├── config/
│   └── CorsConfig.java               ← WebMvcConfigurer; CORS policy for localhost:5173 + 3000
├── controller/
│   └── RequestController.java        ← @RestController; routes POST + GET /api/requests
├── service/
│   └── RequestService.java           ← @Service; trim + validate fields; set createdAt
├── repository/
│   └── RequestRepository.java        ← JpaRepository<Request, Long>; findAll()
├── model/
│   ├── Request.java                  ← @Entity; maps to requests table
│   └── RequestDto.java               ← Inbound JSON deserialization DTO
├── exception/
│   ├── GlobalExceptionHandler.java   ← @ControllerAdvice; structured error responses
│   └── ValidationException.java      ← Custom checked exception for field errors
└── dto/
    └── ErrorResponse.java            ← Response body shape for all error cases
```

| Component | Responsibility |
|-----------|---------------|
| `RequestController` | HTTP routing; deserializes DTO; delegates to service; serializes response |
| `RequestService` | Trims fields; validates non-blank; builds `Request` entity with `Instant.now()`; calls repository |
| `RequestRepository` | Spring Data JPA; `save()` and `findAll()` are the only operations needed |
| `CorsConfig` | Registers allowed origins, methods, headers for cross-origin requests from the React dev server |
| `GlobalExceptionHandler` | Maps `ValidationException` → 400, `HttpMessageNotReadableException` → 400, `Exception` → 500 |
| `Request` (Entity) | JPA entity mapped to `requests` table; fields: `id`, `name`, `title`, `description`, `createdAt` |

---

## 3. Data Model

### 3.1 Entity-Relationship Diagram

SRT has a single entity. No relationships exist.

```
┌────────────────────────────────────┐
│             requests               │
├────────────────────────────────────┤
│ PK  id           BIGINT (AI)       │
│     name         VARCHAR(255)      │
│     title        VARCHAR(255)      │
│     description  VARCHAR(1000)     │
│     created_at   TIMESTAMP         │
└────────────────────────────────────┘
```

### 3.2 DDL — H2-Compatible SQL

```sql
CREATE TABLE requests (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)  NOT NULL,
    title       VARCHAR(255)  NOT NULL,
    description VARCHAR(1000) NOT NULL,
    created_at  TIMESTAMP     NOT NULL,
    CONSTRAINT pk_requests PRIMARY KEY (id)
);
```

> **Note:** Schema is auto-created by Hibernate (`ddl-auto=create-drop`) from the `Request` JPA entity at application startup. The DDL above is the equivalent hand-written form for reference. No separate migration script is required for demo scope.

### 3.3 Column Reference

| Column | Type | Nullable | Constraints | Source |
|--------|------|----------|-------------|--------|
| `id` | `BIGINT` | NO | `PRIMARY KEY`, `AUTO_INCREMENT` | Database-generated sequence |
| `name` | `VARCHAR(255)` | NO | `NOT NULL` | Client input, trimmed by service |
| `title` | `VARCHAR(255)` | NO | `NOT NULL` | Client input, trimmed by service |
| `description` | `VARCHAR(1000)` | NO | `NOT NULL` | Client input, trimmed by service |
| `created_at` | `TIMESTAMP` | NO | `NOT NULL` | `Instant.now()` set by `RequestService` |

### 3.4 JPA Entity

```java
@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // Constructors, getters, setters
}
```

### 3.5 Spring Boot application.properties (H2 Configuration)

```properties
# H2 In-Memory Datasource
spring.datasource.url=jdbc:h2:mem:srtdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# Jackson — ISO 8601 timestamps
spring.jackson.serialization.write-dates-as-timestamps=false

# H2 Console (development only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

---

## 4. API Design

### 4.1 API Overview

| Property | Value |
|----------|-------|
| Base URL (dev) | `http://localhost:8080` |
| API base path | `/api` |
| Style | REST over HTTP/1.1 |
| Format | `application/json` for all request and response bodies |
| Authentication | None |
| Versioning | None (demo scope) |

### 4.2 Endpoint Summary

| Method | Path | Feature | Purpose |
|--------|------|---------|---------|
| `POST` | `/api/requests` | F1, F4 | Create a new request |
| `GET` | `/api/requests` | F2, F4 | Retrieve all requests |

### 4.3 POST /api/requests — Create a New Request

**Request:**

```http
POST /api/requests HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "name": "Alice Johnson",
  "title": "New desk required",
  "description": "I need a standing desk for ergonomic reasons."
}
```

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 201 Created | All fields valid; record persisted | Full request record (see below) |
| 400 Bad Request | One or more fields blank | `VALIDATION_FAILED` error body |
| 400 Bad Request | Malformed JSON | `INVALID_JSON` error body |
| 415 Unsupported Media Type | Missing/wrong `Content-Type` | `UNSUPPORTED_MEDIA_TYPE` error body |
| 500 Internal Server Error | Unhandled exception | `INTERNAL_ERROR` error body |

**201 Response Body:**

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "title": "New desk required",
  "description": "I need a standing desk for ergonomic reasons.",
  "createdAt": "2026-05-08T14:00:00Z"
}
```

### 4.4 GET /api/requests — Retrieve All Requests

**Request:**

```http
GET /api/requests HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Responses:**

| Status | Condition | Body |
|--------|-----------|------|
| 200 OK | Records exist | JSON array of request records |
| 200 OK | No records stored | `[]` (empty array — not an error) |
| 500 Internal Server Error | Unhandled exception | `INTERNAL_ERROR` error body |

**200 Response Body (records exist):**

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "title": "New desk required",
    "description": "I need a standing desk for ergonomic reasons.",
    "createdAt": "2026-05-08T14:00:00Z"
  }
]
```

Records are returned in ascending `id` order (insertion order). No pagination, sorting, or filtering.

### 4.5 Shared Error Response Schema

```json
{
  "errorCode": "VALIDATION_FAILED",
  "message": "One or more fields failed validation.",
  "fieldErrors": [
    { "field": "name", "message": "must not be blank" }
  ]
}
```

`fieldErrors` is omitted on non-validation errors.

### 4.6 TypeScript Interfaces (Frontend)

```typescript
// types/request.ts

/** A persisted request record as returned by the API. */
export interface Request {
  id: number;
  name: string;
  title: string;
  description: string;
  createdAt: string; // ISO 8601 UTC string, e.g. "2026-05-08T14:00:00Z"
}

/** Payload sent to POST /api/requests. */
export interface CreateRequestPayload {
  name: string;
  title: string;
  description: string;
}

/** Field-level validation error returned in a 400 VALIDATION_FAILED response. */
export interface FieldError {
  field: string;
  message: string;
}

/** Structured error body returned for all non-2xx responses. */
export interface ApiError {
  errorCode: string;
  message: string;
  fieldErrors?: FieldError[];
}

/** Union of possible states for the submission acknowledgment area. */
export type AcknowledgmentState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };
```

### 4.7 CORS Configuration

| Property | Value |
|----------|-------|
| Allowed Origins | `http://localhost:3000`, `http://localhost:5173` |
| Allowed Methods | `GET`, `POST`, `OPTIONS` |
| Allowed Headers | `Content-Type`, `Accept` |
| Allow Credentials | `false` |
| Max Age | 3600 seconds |

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000", "http://localhost:5173")
            .allowedMethods("GET", "POST", "OPTIONS")
            .allowedHeaders("Content-Type", "Accept")
            .maxAge(3600);
    }
}
```

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

SRT has **no authentication or authorization**. All endpoints are publicly accessible to any caller on localhost. This is intentional and explicitly in-scope for the demo.

### 5.2 Input Validation & Sanitization

| Layer | Measure |
|-------|---------|
| Frontend (React) | Client-side required-field validation before POST is issued; trims whitespace |
| Backend (Service) | Server-side authoritative validation: all three fields trimmed and checked for blank; returns 400 on failure |
| Backend (JPA/DB) | Column-level `NOT NULL` constraints as final backstop |

No SQL injection risk exists: all queries go through JPA/Hibernate parameterized queries; no native SQL strings are constructed.

No XSS risk in the backend: the backend serves only JSON, not HTML. XSS prevention in the React frontend is handled automatically by React's JSX rendering (values are escaped before DOM insertion).

### 5.3 Data Protection

- No sensitive data is stored (no passwords, PII beyond a free-text name field, financial data, or credentials).
- All data exists only in the H2 in-memory store for the duration of the JVM session; it is not written to disk.
- No HTTPS is required for localhost demo scope.
- No logging of request payload content is required; `spring.jpa.show-sql=false` prevents SQL logging to stdout.

### 5.4 Error Handling & Information Disclosure

- The `GlobalExceptionHandler` ensures stack traces and internal error details are **never** returned to the client.
- All error responses use the structured `ApiError` body with a safe `message` field only.
- Spring Boot's default `/error` endpoint is acceptable for 404s on undefined routes (demo scope; no custom 404 handler required).

---

## 6. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend framework | React | 18.x | SPA component rendering |
| Frontend language | TypeScript | 5.x | Type-safe component and API client code |
| Frontend build tool | Vite | 5.x | Dev server (port 5173), HMR, production build |
| Frontend HTTP client | Fetch API (native) or Axios | — | HTTP calls to Spring Boot REST API |
| Backend framework | Java Spring Boot | 3.x | REST API, DI, auto-configuration |
| Backend language | Java | 21 (LTS) | Application language |
| Backend build tool | Maven | 3.x | Dependency management, packaging |
| ORM | Spring Data JPA (Hibernate) | (Boot-managed) | Entity mapping, auto DDL, CRUD repository |
| Database | H2 | 2.x | Embedded in-memory SQL database |
| JSON serialization | Jackson (`jackson-databind`) | (Boot-managed) | JSON ↔ Java object conversion; `JavaTimeModule` for `Instant` |
| CORS | Spring MVC `WebMvcConfigurer` | (Boot-managed) | Cross-origin policy for React dev server |

### 6.1 Key Maven Dependencies

```xml
<dependencies>
    <!-- Web + REST -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA + Hibernate -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- H2 in-memory DB -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

### 6.2 Key npm Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## 7. Integration Points

### 7.1 Frontend → Backend (HTTP)

The only runtime integration is the React SPA calling the Spring Boot REST API over HTTP on localhost.

| Property | Value |
|----------|-------|
| Protocol | HTTP/1.1 |
| Backend base URL | `http://localhost:8080` |
| API base path | `/api` |
| Frontend origin | `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA) |
| Auth headers | None |
| Data format | `application/json` |

**Configurable base URL:** The React app should read the API base URL from an environment variable (`VITE_API_BASE_URL`) to avoid hardcoding. Default: `http://localhost:8080`.

```typescript
// api/requestsApi.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function createRequest(payload: CreateRequestPayload): Promise<Request> {
  const res = await fetch(`${BASE_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error: ApiError = await res.json();
    throw error;
  }
  return res.json() as Promise<Request>;
}

export async function getRequests(): Promise<Request[]> {
  const res = await fetch(`${BASE_URL}/api/requests`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    const error: ApiError = await res.json();
    throw error;
  }
  return res.json() as Promise<Request[]>;
}
```

### 7.2 Backend → H2 (JPA)

Spring Boot connects to H2 via JDBC entirely within the same JVM process. No network socket or external process is involved.

| Property | Value |
|----------|-------|
| JDBC URL | `jdbc:h2:mem:srtdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE` |
| Driver | `org.h2.Driver` |
| ORM | Hibernate (via Spring Data JPA) |
| Schema strategy | `create-drop` — schema created on startup, dropped on shutdown |
| Persistence scope | Single JVM session only |
| Dev console | `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:srtdb`, user: `sa`, password: empty) |

### 7.3 Out-of-Scope Integrations

The following are **explicitly excluded** and must not be added within demo scope:

- External databases (PostgreSQL, MySQL, MongoDB, etc.)
- Authentication providers (OAuth2, LDAP, etc.)
- Email or notification services
- Cloud storage, CDN, or object stores
- Message queues or event streaming
- External REST APIs
- Container orchestration or cloud deployment platforms

---

## Appendix: File Structure Reference

### Frontend

```
srt-frontend/
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── RequestForm.tsx
│   │   └── RequestList.tsx
│   ├── api/
│   │   └── requestsApi.ts
│   └── types/
│       └── request.ts
├── .env                   ← VITE_API_BASE_URL=http://localhost:8080
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Backend

```
srt-backend/
├── src/
│   └── main/
│       ├── java/com/example/srt/
│       │   ├── SrtApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── controller/RequestController.java
│       │   ├── service/RequestService.java
│       │   ├── repository/RequestRepository.java
│       │   ├── model/Request.java
│       │   ├── model/RequestDto.java
│       │   ├── exception/GlobalExceptionHandler.java
│       │   ├── exception/ValidationException.java
│       │   └── dto/ErrorResponse.java
│       └── resources/
│           └── application.properties
└── pom.xml
```

---

*Document generated by Pivota Spec TechArch Generator | Project: SRT | 2026-05-08*
