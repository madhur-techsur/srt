## F03: Submission Acknowledgment

**Description:** The Submission Acknowledgment feature provides clear, immediate visual feedback to the Requester after a form submission attempt. It renders an inline success message after a confirmed HTTP 201 response, and an inline error message after a failed submission. No page reload occurs; all feedback is managed through React component state. The acknowledgment is visible long enough for the user to read it and can be dismissed or is cleared before the next submission attempt begins.

---

**Terminology:**

- **Acknowledgment Area:** A dedicated UI region (above or below the form) reserved for displaying success or error messages.
- **Success Message:** Positive confirmation rendered when the backend returns HTTP 201.
- **Error Message:** Negative feedback rendered when the backend returns HTTP 400, HTTP 500, or when a network failure occurs.
- **Auto-clear:** The behavior of removing the acknowledgment message when the user begins a new submission.
- **Dismiss:** User-initiated removal of the acknowledgment message (optional: a close button on the message).

---

**Sub-features:**

- Success acknowledgment message on HTTP 201 response
- Server-level error message on HTTP 400/500 response
- Network error message on connection failure
- Messages rendered in a dedicated acknowledgment area (not an alert/dialog popup)
- Acknowledgment area cleared at the start of each new submission attempt
- Optional: user-dismissible close button on the message
- No page reload required — all state managed in React

---

**Process:**

1. On page load: the acknowledgment area is empty (no message displayed).
2. When the user clicks **Submit** and client-side validation passes (F00 step 7):
   a. Clear any existing message in the acknowledgment area.
   b. Disable the Submit button while the request is in-flight.
3. **On HTTP 201 response:**
   a. Set acknowledgment state to `success`.
   b. Render the success message: *"Request submitted successfully."*
   c. Apply a success visual style (e.g., green background, checkmark icon, or equivalent).
4. **On HTTP 400 response:**
   a. Set acknowledgment state to `error`.
   b. Render the error message including detail from the server response if available: *"Submission failed: [server message]."*
   c. Apply an error visual style (e.g., red/orange background or border).
5. **On HTTP 500 response:**
   a. Set acknowledgment state to `error`.
   b. Render: *"An unexpected error occurred. Please try again."*
6. **On network failure:**
   a. Set acknowledgment state to `error`.
   b. Render: *"Could not reach server. Check your connection."*
7. The acknowledgment message remains visible until one of:
   a. The user clicks **Submit** again (auto-clear at step 2a above).
   b. The user clicks a dismiss/close button (if implemented).
8. The message does NOT disappear automatically on a timer (no auto-dismiss timeout required for MVP).

---

**Inputs:**

- HTTP response status and body from `POST /api/requests` (provided by F00).
- User click on dismiss button (if implemented).
- New submission trigger (clears previous acknowledgment).

---

**Outputs:**

- Success message rendered in acknowledgment area: *"Request submitted successfully."*
- Error message rendered in acknowledgment area (content depends on error type).
- Empty acknowledgment area (initial state and after dismiss/new-submission).

---

**Validation:**

- Acknowledgment area must exist in the DOM at all times (even when empty) to avoid layout shift.
- Acknowledgment messages must not use browser `alert()` or modal dialogs — must be inline.
- Success and error states must be visually distinct (color, icon, or ARIA role).
- Acknowledgment area must be cleared before each new submission attempt begins.
- No auto-dismiss timer is required at MVP scope.
- ARIA role `role="alert"` or `role="status"` should be applied to the acknowledgment area for accessibility.

---

**Error States:**

| Trigger | State | Message |
|---------|-------|---------|
| HTTP 201 received | `success` | "Request submitted successfully." |
| HTTP 400 received | `error` | "Submission failed: [server error message]." |
| HTTP 500 received | `error` | "An unexpected error occurred. Please try again." |
| Network failure | `error` | "Could not reach server. Check your connection." |
| Page load / new submission starts | (empty) | (no message) |

---

**API Surface (this feature):** No direct API calls. Consumes response status/body from `POST /api/requests` triggered by F00.

**Schema Surface (this feature):** None. This feature is purely presentational React state.
