## F2: Request List View

**Description:** The Request List View is a read-only React table that displays all requests currently stored in the system. It renders one row per request with three visible columns — Name, Title, and Description — and shows an empty-state message when no requests exist. The table refreshes automatically after each successful form submission so the Requester and Viewer always see up-to-date data without a manual page reload.

---

**Terminology:**

- **Table Row:** A single rendered `<tr>` element corresponding to one stored Request Record.
- **Empty State:** The UI state when zero request records exist in the store; renders a descriptive placeholder message instead of an empty table body.
- **Auto-Refresh:** The automatic re-fetch of `GET /api/requests` triggered immediately after a successful POST, without requiring a page reload.
- **Column:** One of the three visible data columns: Name, Title, Description.

---

**Sub-features:**

- `GET /api/requests` REST endpoint (backend)
- Frontend table with three columns: Name, Title, Description
- Empty-state message when array is empty
- Initial data load on component mount
- Auto-refresh after successful submission (triggered by F0)
- Loading indicator during initial fetch on component mount (optional but recommended; not shown on auto-refresh)
- Error message if GET request fails

---

**Process:**

1. The SRT main page mounts in the browser.
2. The React component for the Request List View fires a `GET /api/requests` request on component mount.
3. While the initial request is in-flight, a loading indicator ("Loading requests…") is optionally displayed. This prevents the empty state from flashing before data arrives.
4. **On HTTP 200 response with a non-empty array:**
   a. Render a `<table>` with header row: **Name | Title | Description**.
   b. Render one `<tr>` per request record, in the order returned by the API (insertion order, most-recent last).
   c. Each row displays: `name`, `title`, `description` values.
5. **On HTTP 200 response with an empty array (`[]`):**
   a. Render the empty-state message: *"No requests yet."*
   b. Do not render table headers or an empty `<table>` element.
6. **On HTTP 500 or network error during GET:**
   a. Render an error message: *"Could not load requests. Please refresh the page."*
   b. Do not render the table.
7. After a successful form submission (F0 step 9e):
   a. Re-issue `GET /api/requests`.
   b. Replace the current table contents with the updated response.
   c. If the list was previously empty, transition from empty state to table view.
   d. No loading indicator is displayed during this auto-refresh (the refresh is fast on localhost and a loading flash would be disruptive; the current table content remains visible until the new data arrives).

---

**Inputs:**

- HTTP `GET /api/requests` response (JSON array of request records).
- Trigger signal from F0 on successful POST (internal React state/callback).

---

**Outputs:**

- Rendered HTML table with columns: Name, Title, Description — one row per request.
- Empty-state message: *"No requests yet."* (when array is empty).
- Loading indicator while fetch is in progress (optional).
- Error message if GET fails.

---

**Validation:**

- The component must handle an empty array (`[]`) without crashing — renders empty state.
- The component must handle a null or undefined API response gracefully — renders error state.
- Each row must display all three fields; missing/null field values render as an empty string (no crash).
- No client-side sorting, filtering, or pagination is applied (out of scope).
- The `id` and `createdAt` fields returned by the API are not displayed in the table.

---

**Error States:**

| Scenario | UI Display | Message |
|----------|-----------|---------|
| GET returns empty array | Empty-state placeholder | "No requests yet." |
| GET returns HTTP 500 | Inline error below form | "Could not load requests. Please refresh the page." |
| GET network failure | Inline error below form | "Could not load requests. Please refresh the page." |
| GET returns malformed JSON | Inline error below form | "Could not load requests. Please refresh the page." |

---

**API Surface (this feature):** Consumes `GET /api/requests`. See `Y1-api.md` §GET /api/requests for full response schema.

**Schema Surface (this feature):** Reads from `requests` table. See `Y0-schema.md` §requests.
