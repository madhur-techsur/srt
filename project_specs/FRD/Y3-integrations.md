## Y3: Integration Points

**Summary:** SRT has no external integrations. All dependencies are local, in-process, or development-infrastructure-only. This section documents the internal integration contracts between system layers and the configuration points that must be set correctly for the frontend and backend to communicate.

---

### §Frontend → Backend HTTP Integration

| Property | Value |
|----------|-------|
| Protocol | HTTP/1.1 |
| Backend base URL (dev) | `http://localhost:8080` |
| Frontend origin (Vite dev server) | `http://localhost:5173` |
| Frontend origin (CRA dev server) | `http://localhost:3000` |
| API base path | `/api` |
| Communication style | Synchronous request/response (fetch or axios) |
| Data format | JSON (`application/json`) |
| Auth headers | None |

**CORS requirement:** Spring Boot must configure CORS to allow both `http://localhost:3000` and `http://localhost:5173` as origins. Without this, browsers will block all API calls from the React dev server. See `Y1-api.md` §CORS Configuration.

**Frontend API client notes:**
- The React app should use `fetch()` or `axios` to call the backend.
- Base URL should be configurable (e.g., via environment variable `VITE_API_BASE_URL` or `REACT_APP_API_BASE_URL`) to avoid hardcoding.
- Default base URL for development: `http://localhost:8080`.

---

### §Spring Boot → H2 In-Memory Database Integration

| Property | Value |
|----------|-------|
| Database engine | H2 (in-memory, embedded) |
| JDBC URL | `jdbc:h2:mem:srtdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE` |
| Driver | `org.h2.Driver` |
| ORM | Spring Data JPA (Hibernate) |
| Schema management | `ddl-auto=create-drop` (auto-created on startup) |
| Persistence | Session-scoped only; data lost on JVM restart |
| H2 console | Enabled at `/h2-console` (development only) |

**Dependency (Maven):**
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

---

### §Build Tooling Integration

| Layer | Tool | Notes |
|-------|------|-------|
| Frontend | npm + Vite (or Create React App) | Standard React build pipeline |
| Backend | Maven (or Gradle) | Standard Spring Boot build |
| Frontend dev server port | 5173 (Vite) or 3000 (CRA) | Must match CORS allowed origins |
| Backend server port | 8080 | Spring Boot default; configurable via `server.port` |

---

### §Out-of-Scope Integrations (Explicitly Excluded)

The following integration types are **not present** and **must not be added** within demo scope:

- External databases (PostgreSQL, MySQL, MongoDB, etc.)
- Authentication providers (OAuth2, LDAP, Azure AD, etc.)
- Email or notification services
- Cloud storage or CDN
- Message queues or event streaming
- External REST APIs
- Container orchestration or cloud deployment platforms

---

*No external systems are called at runtime. SRT is fully self-contained within the developer's local machine.*
