# Plan 01-02 Summary: REST Controller + Service + CORS

**Status:** Complete
**Completed:** 2026-05-08

## What Was Done

- Created `RequestDto.java` — inbound POST body DTO (name, title, description)
- Created `RequestService.java` — service with `createRequest` (sets createdAt via Instant.now()) and `getAllRequests`
- Created `CorsConfig.java` — WebMvcConfigurer allowing http://localhost:3000 and http://localhost:5173, methods GET/POST/OPTIONS
- Created `RequestController.java` — @RestController with POST /api/requests (201) and GET /api/requests (200)

## Verification Results

- GET /api/requests (empty) → 200, body `[]`
- POST /api/requests with valid JSON → 201, body `{"id":1,"name":"...","createdAt":"2026-05-08T..."}`
- GET /api/requests after 2 POSTs → 200, JSON array with 2 records
- CORS preflight from http://localhost:5173 → `Access-Control-Allow-Origin: http://localhost:5173` ✓
- createdAt serialized as ISO 8601 string (not numeric timestamp) ✓

## Files Created

- `backend/src/main/java/com/example/srt/model/RequestDto.java`
- `backend/src/main/java/com/example/srt/service/RequestService.java`
- `backend/src/main/java/com/example/srt/config/CorsConfig.java`
- `backend/src/main/java/com/example/srt/controller/RequestController.java`
