## F0: Request Submission Form

**Description:** The Request Submission Form is the primary entry point for all data in the SRT system. It is a React-rendered web form that collects a requester's Name, Title, and Description, validates all three fields on the client side before sending, and POSTs the payload to the backend API. On success, the form resets and triggers the Submission Acknowledgment (see F3) and a refresh of the Request List View (see F2). On error, a descriptive inline message is shown.

---

**Terminology:**

- **Form Reset:** After a successful submission, all input fields are cleared back to their initial empty state.
- **Inline Error:** A validation message rendered adjacent to the offending field (or at the top of the form for server-level errors).
- **Submit Button:** The button that triggers client-side validation and, if valid, the POST request.
- **Dirty State:** The condition where one or more form fields contain user-entered text that has not yet been submitted.

---

**Sub-features:**

- Three text input fields: Name, Title, Description
- Client-side required-field validation on all three inputs
- Submit button is enabled at all times but triggers validation on click
- POST to `POST /api/requests` on passing validation
- Form reset on successful API response
- Success acknowledgment displayed (delegated to F3)
- Inline error message displayed on API failure
- Table refresh triggered on successful submission (delegated to F2)

---

**Process:**

1. User navigates to the SRT main page.
2. The form renders with three empty text inputs: **Name**, **Title**, **Description**, and a **Submit** button.
3. User enters text into one or more fields.
4. User clicks **Submit**.
5. The React component trims whitespace from all field values.
6. Client-side validation checks each trimmed value is non-empty:
   - If any field is empty → display an inline error adjacent to each empty field; **stop here** (no network request is made).
7. A POST request is constructed with JSON body `{ "name": "...", "title": "...", "description": "..." }` and sent to `POST /api/requests`.
8. While the request is in-flight, the Submit button is disabled to prevent duplicate submissions.
9. **On HTTP 201 response:**
   a. Parse the response body and extract the created request record.
   b. Clear the Success/Error acknowledgment area, then display a success message (F3).
   c. Reset all form fields to empty.
   d. Re-enable the Submit button.
   e. Trigger a refresh of the Request List View (F2) — either via shared state or a new GET call.
10. **On HTTP 400 or 500 response:**
    a. Display a server-level error message inline (e.g., "Submission failed. Please try again.").
    b. Re-enable the Submit button.
    c. Do NOT reset the form fields (preserve user input for correction).
11. **On network failure (no response):**
    a. Display a connectivity error message (e.g., "Could not reach server. Check your connection.").
    b. Re-enable the Submit button.

---

**Inputs:**

- `name` (string, required): Requester's full name or display name. Trimmed before validation and submission. Maximum 255 characters.
- `title` (string, required): Short title describing the request. Trimmed before validation and submission. Maximum 255 characters.
- `description` (string, required): Full description of the request. Trimmed before validation and submission. Maximum 1000 characters.

---

**Outputs:**

- HTTP POST request to `POST /api/requests` with JSON body on valid form submission.
- Inline validation error messages for each empty/blank field (client-side only, no network call).
- Success acknowledgment message after HTTP 201 response (see F3 for display spec).
- Server-level error message after HTTP 400/500 response.
- Network error message on connection failure.
- Form state reset (all fields empty) after successful submission.
- Trigger for Request List View refresh (see F2).

---

**Validation:**

- `name` must not be empty or whitespace-only after trimming.
- `title` must not be empty or whitespace-only after trimming.
- `description` must not be empty or whitespace-only after trimming.
- All validation occurs client-side before any network request is issued.
- Client-side validation is a UX convenience; server-side validation (F1) is the authoritative gate.
- No format or length validation beyond required-field checks is required at MVP scope.
- Submission is blocked (no POST sent) if any client-side validation rule fails.

---

**Error States:**

| Scenario | Where Displayed | Message |
|----------|----------------|---------|
| One or more fields are empty/blank | Inline, adjacent to each empty field | "This field is required." |
| Server returns HTTP 400 | Inline form-level alert | "Submission failed: [server error message]." |
| Server returns HTTP 500 | Inline form-level alert | "An unexpected error occurred. Please try again." |
| Network request fails (no response) | Inline form-level alert | "Could not reach server. Check your connection." |

---

**API Surface (this feature):** Issues `POST /api/requests`. See `Y1-api.md` §POST /api/requests for full request/response schema.

**Schema Surface (this feature):** Causes creation of a `requests` table row. See `Y0-schema.md` §requests.
