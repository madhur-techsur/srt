# Plan 01-03 Summary: Validation + GlobalExceptionHandler

**Status:** Complete
**Completed:** 2026-05-08

## What Was Done

- Created `ValidationException.java` — custom RuntimeException carrying `List<FieldError>` records
- Created `ErrorResponse.java` — DTO with `errorCode`, `message`, `fieldErrors` matching exact TechArch error shape
- Created `GlobalExceptionHandler.java` — @RestControllerAdvice handling ValidationException → 400 and Exception → 500
- Updated `RequestService.java` — added service-layer validation collecting ALL errors before throwing (not fail-fast)

## Verification Results — All 4 Phase 1 Success Criteria

1. **SC1: POST valid → 201**: `POST {"name":"Alice","title":"Fix login","description":"Login broken"}` → HTTP 201 `{"id":1,"name":"Alice",...,"createdAt":"2026-05-08T16:40:30Z"}` ✓
2. **SC2: POST blank → 400 VALIDATION_FAILED**: `POST {"name":"","title":"","description":""}` → HTTP 400 `{"errorCode":"VALIDATION_FAILED","message":"One or more fields failed validation.","fieldErrors":[{"field":"name",...},{"field":"title",...},{"field":"description",...}]}` ✓
3. **SC3: GET → 200 array**: `GET /api/requests` → HTTP 200 `[{...}]` ✓
4. **SC4: CORS for localhost:5173**: OPTIONS preflight → `Access-Control-Allow-Origin: http://localhost:5173` ✓

## Files Created/Modified

- `backend/src/main/java/com/example/srt/exception/ValidationException.java`
- `backend/src/main/java/com/example/srt/dto/ErrorResponse.java`
- `backend/src/main/java/com/example/srt/exception/GlobalExceptionHandler.java`
- `backend/src/main/java/com/example/srt/service/RequestService.java` (updated with validation)
