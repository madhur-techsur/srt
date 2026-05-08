## Y1: REST API Endpoint Catalog

**Base URL (development):** `http://localhost:8080`  
**API Base Path:** `/api`  
**Content-Type:** `application/json` for all request and response bodies  
**Authentication:** None  
**API Style:** REST over HTTP/1.1

---

### §POST /api/requests — Create a New Request

**Feature:** F1 (Request Storage), F4 (API Layer)  
**Purpose:** Accepts a new request submission from the React frontend, validates it, persists it, and returns the stored record.

**Request:**

| Property | Value |
|----------|-------|
| Method | POST |
| Path | `/api/requests` |
| Content-Type | `application/json` |
| Auth | None |

**Request Body Schema:**

```json
{
  "name": "string (required, non-blank)",
  "title": "string (required, non-blank)",
  "description": "string (required, non-blank)"
}
```

**Example Request:**

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

**Success Response — HTTP 201 Created:**

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "name": "Alice Johnson",
  "title": "New desk required",
  "description": "I need a standing desk for ergonomic reasons.",
  "createdAt": "2026-05-08T14:00:00Z"
}
```

**Error Response — HTTP 400 Validation Failure:**

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "errorCode": "VALIDATION_FAILED",
  "message": "One or more fields failed validation.",
  "fieldErrors": [
    { "field": "name", "message": "must not be blank" },
    { "field": "description", "message": "must not be blank" }
  ]
}
```

**Error Response — HTTP 400 Malformed JSON:**

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "errorCode": "INVALID_JSON",
  "message": "Request body could not be parsed."
}
```

**Error Response — HTTP 415 Unsupported Media Type:**

```http
HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json

{
  "errorCode": "UNSUPPORTED_MEDIA_TYPE",
  "message": "Content-Type must be application/json."
}
```

**Error Response — HTTP 500 Internal Server Error:**

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "errorCode": "INTERNAL_ERROR",
  "message": "An unexpected error occurred."
}
```

**Response Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | System-assigned unique identifier |
| `name` | string | Stored requester name (trimmed) |
| `title` | string | Stored request title (trimmed) |
| `description` | string | Stored request description (trimmed) |
| `createdAt` | string (ISO 8601 UTC) | Server-assigned creation timestamp |

---

### §GET /api/requests — Retrieve All Requests

**Feature:** F2 (Request List View), F4 (API Layer)  
**Purpose:** Returns all stored request records as a JSON array for display in the frontend table.

**Request:**

| Property | Value |
|----------|-------|
| Method | GET |
| Path | `/api/requests` |
| Content-Type | N/A (no body) |
| Auth | None |
| Query Parameters | None |

**Example Request:**

```http
GET /api/requests HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Success Response — HTTP 200 OK (records exist):**

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "name": "Alice Johnson",
    "title": "New desk required",
    "description": "I need a standing desk for ergonomic reasons.",
    "createdAt": "2026-05-08T14:00:00Z"
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "title": "Laptop upgrade",
    "description": "Current laptop is too slow for development work.",
    "createdAt": "2026-05-08T14:05:00Z"
  }
]
```

**Success Response — HTTP 200 OK (no records):**

```http
HTTP/1.1 200 OK
Content-Type: application/json

[]
```

**Error Response — HTTP 500 Internal Server Error:**

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "errorCode": "INTERNAL_ERROR",
  "message": "An unexpected error occurred."
}
```

**Notes:**
- Records are returned in insertion order (ascending by `id`).
- No pagination, filtering, or sorting parameters are supported.
- An empty array (`[]`) is a valid success response — not an error.

---

### §CORS Configuration

Configured in Spring Boot `WebMvcConfigurer`:

| Property | Value |
|----------|-------|
| Allowed Origins | `http://localhost:3000`, `http://localhost:5173` |
| Allowed Methods | `GET`, `POST`, `OPTIONS` |
| Allowed Headers | `Content-Type`, `Accept` |
| Allow Credentials | `false` |
| Max Age | 3600 seconds |

**Preflight (OPTIONS) Response Example:**

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
Access-Control-Max-Age: 3600
```

---

### §Shared Error Response Schema

All error responses share the following JSON structure:

```json
{
  "errorCode": "string",
  "message": "string",
  "fieldErrors": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

- `errorCode`: machine-readable identifier (see Y2-errors.md for full catalog).
- `message`: human-readable explanation.
- `fieldErrors`: optional array; only present on `VALIDATION_FAILED` responses.
