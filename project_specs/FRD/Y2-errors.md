## Y2: Cross-Feature Error Catalog

This catalog lists all error scenarios across the SRT system, with HTTP status codes, error codes, messages, originating feature, and client guidance.

---

### §Backend Error Codes

| Error Code | HTTP Status | Feature | Trigger Condition | Response Message | Client Guidance |
|------------|-------------|---------|-------------------|-----------------|-----------------|
| `VALIDATION_FAILED` | 400 | F1, F4 | One or more of `name`, `title`, `description` are blank/empty after trimming | "One or more fields failed validation." | Display `fieldErrors` array to user; do not reset the form |
| `INVALID_JSON` | 400 | F4 | Request body is not valid JSON or cannot be deserialized | "Request body could not be parsed." | Check that `Content-Type: application/json` is set and body is well-formed |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | F4 | `Content-Type` header is not `application/json` on POST | "Content-Type must be application/json." | Set `Content-Type: application/json` header |
| `INTERNAL_ERROR` | 500 | F1, F4 | Unhandled exception in controller, service, or repository layer | "An unexpected error occurred." | Display generic retry message; do not expose stack trace to client |

---

### §Frontend Error States

| Scenario | Feature | Where Displayed | Message |
|----------|---------|----------------|---------|
| Form field empty on submit | F0, F3 | Inline, adjacent to empty field | "This field is required." |
| POST returns 400 VALIDATION_FAILED | F0, F3 | Acknowledgment area | "Submission failed: [server message]." |
| POST returns 400 INVALID_JSON | F0, F3 | Acknowledgment area | "Submission failed: Request body could not be parsed." |
| POST returns 415 | F0, F3 | Acknowledgment area | "Submission failed: [server message]." |
| POST returns 500 | F0, F3 | Acknowledgment area | "An unexpected error occurred. Please try again." |
| POST network failure | F0, F3 | Acknowledgment area | "Could not reach server. Check your connection." |
| GET returns 500 | F2 | Inline below form | "Could not load requests. Please refresh the page." |
| GET network failure | F2 | Inline below form | "Could not load requests. Please refresh the page." |
| GET returns empty array | F2 | Table area (empty state) | "No requests yet." |
| GET returns malformed JSON | F2 | Inline below form | "Could not load requests. Please refresh the page." |

---

### §HTTP Status Code Usage Summary

| HTTP Status | Meaning in SRT | Endpoints |
|-------------|----------------|-----------|
| 200 OK | Successful GET; list returned (may be empty) | `GET /api/requests` |
| 201 Created | Successful POST; new record created and returned | `POST /api/requests` |
| 400 Bad Request | Client error: validation failure or malformed body | `POST /api/requests` |
| 415 Unsupported Media Type | Wrong `Content-Type` on POST | `POST /api/requests` |
| 500 Internal Server Error | Unhandled server exception | All endpoints |

---

### §Error Response Body Structure

All error responses from the backend use this structure:

```json
{
  "errorCode": "string",
  "message": "string",
  "fieldErrors": [
    { "field": "string", "message": "string" }
  ]
}
```

- `fieldErrors` is **omitted** (or empty array) for non-validation errors.
- `message` is always human-readable and safe to display to end users.
- No stack traces or internal exception details are exposed in the response body.

---

### §Behavior on Unknown Routes

If a client requests a route not defined by the API (e.g., `GET /api/unknown`), Spring Boot's default `NoHandlerFoundException` behavior applies:

- HTTP 404 Not Found
- Body: Spring Boot default error JSON (acceptable for demo scope; no custom handler required)
