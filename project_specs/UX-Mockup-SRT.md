# UX Mockup: Simple Request Tracker (SRT)

**Project:** Simple Request Tracker (SRT)
**Generated:** 2026-05-08
**Based on:** UserStories-SRT.md, JOURNEYS-SRT.md, PRD-SRT.md, FRD-SRT.md, PROJECT.md
**Personas:** PER-01 Alex Rivera (Business User / Requester), PER-02 Jordan Kim (Internal User / Viewer & Engineer)

---

## Overview

SRT is a single-page application with two co-located UI regions on one page: a **Request Submission Form** (top) and a **Request List View** (bottom). There is no navigation, no login, and no routing. The entire experience lives on one URL.

**Design Principles:**
1. **Immediacy** — Every action produces visible feedback within 2 seconds; the user never waits in silence.
2. **Self-sufficiency** — No instructions needed; labels, placeholder text, and inline errors guide the user without external help.
3. **Dual-audience clarity** — The same UI satisfies Alex (non-technical, trusts success messages) and Jordan (technical, verifies table rows and HTTP status codes).
4. **Layout stability** — The acknowledgment area is always in the DOM; no layout shift when messages appear or disappear.
5. **Minimal chrome** — No sidebar, no modal, no navigation. Form above, table below.

---

## User Flows

### Flow 1: Happy Path — Successful Request Submission

**Trigger:** Alex opens the app URL in a browser.
**User Stories:** US-0.1, US-0.3, US-2.2, US-3.1, US-4.1

```
[Page Load]
    │
    ▼
[Form renders — 3 empty fields, Submit button enabled]
    │
    ├── Table area fires GET /api/requests on mount
    │       ├── Empty array  ──▶  [Empty State: "No requests yet."]
    │       ├── Records exist ──▶ [Table with rows]
    │       └── GET error    ──▶  [Error: "Could not load requests. Please refresh the page."]
    │
    ▼
[Alex fills Name, Title, Description]
    │
    ▼
[Alex clicks Submit]
    │
    ├── Client validation passes
    │       │
    │       ▼
    │   [Submit button → disabled | Acknowledgment area → cleared]
    │       │
    │       ▼
    │   [POST /api/requests in-flight]
    │       │
    │       ├── HTTP 201 ──▶ [Acknowledgment: success ✓ "Request submitted successfully."]
    │       │                [Form fields → reset to empty]
    │       │                [Submit button → re-enabled]
    │       │                [GET /api/requests re-fired → table refreshes]
    │       │                        └── New row appears in table
    │       │
    │       ├── HTTP 400 ──▶ [Acknowledgment: error "Submission failed: [server message]."]
    │       │                [Form fields → preserved | Submit → re-enabled]
    │       │
    │       ├── HTTP 500 ──▶ [Acknowledgment: error "An unexpected error occurred. Please try again."]
    │       │                [Form fields → preserved | Submit → re-enabled]
    │       │
    │       └── Network fail ▶ [Acknowledgment: error "Could not reach server. Check your connection."]
    │                          [Form fields → preserved | Submit → re-enabled]
    │
    └── Client validation fails (one or more empty fields)
            │
            ▼
        [No network request sent]
        [Inline error "This field is required." beside each empty field]
        [Submit → remains enabled for correction]
```

**Steps:**
1. User lands on page; form renders with 3 empty inputs and a disabled-until-ready Submit button. Table area starts fetching in the background.
2. User fills all three fields. No real-time validation fires during typing.
3. User clicks Submit. Any prior acknowledgment message is cleared immediately.
4. Submit button disables to prevent duplicate submissions (US-0.1).
5. On HTTP 201: acknowledgment shows success message (US-3.1), form resets (US-0.3), table re-fetches and new row appears (US-2.2).
6. On error: acknowledgment shows the appropriate error message (US-0.4, US-3.2), fields are preserved.

---

### Flow 2: Validation Error Recovery

**Trigger:** Alex clicks Submit with one or more empty fields.
**User Stories:** US-0.2, US-3.3

```
[Submit clicked — one or more fields blank]
    │
    ▼
[Client-side validation runs — no network call]
    │
    ▼
[Inline "This field is required." shown beside each empty field]
[Submit button remains enabled]
[Previously filled fields retain their values]
    │
    ▼
[Alex fills the missing field(s)]
    │
    ▼ (inline errors optionally clear on field input)
[Alex clicks Submit again → Flow 1 resumes from "Client validation passes"]
```

**Steps:**
1. Submit clicked. Whitespace-only input is treated as blank (US-0.2).
2. Each empty/blank field gets its own inline error "This field is required." — no generic top-level message.
3. Fields already filled are not cleared (data preserved from JRN-01.2).
4. Submit stays enabled so the user can immediately correct and retry.
5. When Submit is clicked again, the acknowledgment area clears first (US-3.3), then validation runs again.

---

### Flow 3: Multi-Submission in One Session

**Trigger:** Alex submits a second request immediately after a successful first submission.
**User Stories:** US-0.3, US-2.2, US-3.3

```
[First submission completes — success state]
    │
    ├── Form fields: empty (auto-reset)
    ├── Acknowledgment: "Request submitted successfully." visible
    └── Table: shows 1 row
    │
    ▼
[Alex types second request — new data in all 3 fields]
    │
    ▼
[Alex clicks Submit]
    │
    ├── Acknowledgment area clears (US-3.3)
    └── Flow 1 resumes → second row appears in table alongside first
```

---

## Screen Designs

---

### Screen 1: Request Submission Form

**Purpose:** Primary data entry point. Collects Name, Title, and Description; validates client-side; POSTs to the backend.
**User Stories:** US-0.1, US-0.2, US-0.3, US-0.4, US-3.1, US-3.2, US-3.3
**Journeys:** JRN-01.1, JRN-01.2, JRN-01.3, JRN-02.3

#### Layout

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Simple Request Tracker                                     │
│   ─────────────────────────────────────────────────────      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Submit a Request                                      │  │
│  │                                                        │  │
│  │  Name *                                                │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  e.g. Alex Rivera                                │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  [inline error zone — empty by default]                │  │
│  │                                                        │  │
│  │  Title *                                               │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  e.g. Printer on 3rd floor is broken             │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  [inline error zone — empty by default]                │  │
│  │                                                        │  │
│  │  Description *                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │                                                  │  │  │
│  │  │  e.g. The HP LaserJet on the 3rd floor has been  │  │  │
│  │  │  offline since Monday. IT ticket not raised yet. │  │  │
│  │  │                                                  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │  [inline error zone — empty by default]                │  │
│  │                                                        │  │
│  │  ┌──────────────┐                                      │  │
│  │  │    Submit    │  ← primary CTA button                │  │
│  │  └──────────────┘                                      │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │  [Acknowledgment Area — always in DOM]         │    │  │
│  │  │  (empty on page load and after dismiss)        │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [Request List View — Screen 2 below]                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement | Notes |
|----------|---------|-----------|-------|
| Primary | Name, Title, Description inputs | Form body, stacked vertically | These are the only actions on this screen |
| Primary | Submit button | Below Description field | Single CTA; always visible |
| Primary | Acknowledgment area | Below Submit button | Always in DOM; shows success or error after submission |
| Secondary | Field labels + asterisk (*) for required | Above each input | Required visual; helps Alex orient (JRN-01.1 Stage 2) |
| Secondary | Placeholder hint text | Inside each input | Guides interpretation; disappears on focus |
| Tertiary | Inline validation error messages | Below each input field | Appear only on validation failure; field-specific |
| Tertiary | Page/form title | Above the form card | Orients users on page load (JRN-01.1 Stage 1) |

#### Field Specifications

| Field | Input Type | Max Length | Placeholder Text | Required |
|-------|-----------|------------|-----------------|----------|
| Name | `<input type="text">` | 255 chars | "e.g. Alex Rivera" | Yes |
| Title | `<input type="text">` | 255 chars | "e.g. Printer on 3rd floor is broken" | Yes |
| Description | `<textarea>` (multi-line) | 1000 chars | "e.g. Describe the request in detail…" | Yes |

#### States

##### Default State (Page Load)
```
┌──────────────────────────────────────┐
│  Name *                              │
│  ┌──────────────────────────────┐    │
│  │  (placeholder text)          │    │
│  └──────────────────────────────┘    │
│                                      │
│  Title *                             │
│  ┌──────────────────────────────┐    │
│  │  (placeholder text)          │    │
│  └──────────────────────────────┘    │
│                                      │
│  Description *                       │
│  ┌──────────────────────────────┐    │
│  │  (placeholder text)          │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  [ Submit ]  ← enabled               │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  (acknowledgment — empty)    │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```
- All fields empty, placeholders visible
- Submit button enabled
- Acknowledgment area present but invisible (zero height or transparent)
- No error messages shown

##### In-Flight State (POST in progress)
```
┌──────────────────────────────────────┐
│  Name *                              │
│  ┌──────────────────────────────┐    │
│  │  Alex Rivera                 │    │  ← user input retained
│  └──────────────────────────────┘    │
│                                      │
│  Title *                             │
│  ┌──────────────────────────────┐    │
│  │  Printer on 3rd floor broken │    │
│  └──────────────────────────────┘    │
│                                      │
│  Description *                       │
│  ┌──────────────────────────────┐    │
│  │  HP LaserJet offline since…  │    │
│  └──────────────────────────────┘    │
│                                      │
│  [ Submitting… ]  ← disabled, muted  │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  (acknowledgment — empty)    │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```
- Submit button: disabled, label changes to "Submitting…" (or shows a spinner)
- All fields retain current values and are still readable (not disabled)
- Acknowledgment area cleared

##### Validation Error State (client-side, no network call)
```
┌──────────────────────────────────────┐
│  Name *                              │
│  ┌──────────────────────────────┐    │
│  │  Alex Rivera                 │    │  ← filled: no error
│  └──────────────────────────────┘    │
│                                      │
│  Title *                             │
│  ┌──────────────────────────────┐    │
│  │                              │    │  ← empty
│  └──────────────────────────────┘    │
│  ⚠ This field is required.           │  ← inline error, red/orange text
│                                      │
│  Description *                       │
│  ┌──────────────────────────────┐    │
│  │                              │    │  ← empty
│  └──────────────────────────────┘    │
│  ⚠ This field is required.           │  ← inline error
│                                      │
│  [ Submit ]  ← still enabled         │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  (acknowledgment — empty)    │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```
- Each empty field independently shows "This field is required."
- Filled fields show no error
- Submit remains enabled for correction (US-0.2)
- No network request was fired (verifiable by Jordan in Network tab)

##### Success State (after HTTP 201)
```
┌──────────────────────────────────────┐
│  Name *                              │
│  ┌──────────────────────────────┐    │
│  │  (placeholder — reset)       │    │  ← form cleared
│  └──────────────────────────────┘    │
│                                      │
│  Title *                             │
│  ┌──────────────────────────────┐    │
│  │  (placeholder — reset)       │    │
│  └──────────────────────────────┘    │
│                                      │
│  Description *                       │
│  ┌──────────────────────────────┐    │
│  │  (placeholder — reset)       │    │
│  └──────────────────────────────┘    │
│                                      │
│  [ Submit ]  ← re-enabled            │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ✓  Request submitted        │    │  ← green bg, checkmark
│  │     successfully.            │    │     role="status"
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```
- All form fields reset to empty (US-0.3)
- Submit re-enabled
- Acknowledgment area: green background, checkmark icon, success message
- Message persists until next Submit click

##### Server Error State (HTTP 400 / 500 / network failure)
```
┌──────────────────────────────────────┐
│  Name *                              │
│  ┌──────────────────────────────┐    │
│  │  Alex Rivera                 │    │  ← input preserved
│  └──────────────────────────────┘    │
│                                      │
│  Title *                             │
│  ┌──────────────────────────────┐    │
│  │  Printer broken              │    │  ← input preserved
│  └──────────────────────────────┘    │
│                                      │
│  Description *                       │
│  ┌──────────────────────────────┐    │
│  │  HP LaserJet offline…        │    │  ← input preserved
│  └──────────────────────────────┘    │
│                                      │
│  [ Submit ]  ← re-enabled            │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ✕  An unexpected error      │    │  ← red/orange border,
│  │     occurred. Please try     │    │     error icon
│  │     again.                   │    │     role="alert"
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```
- Form fields preserved — user does not re-enter data (US-0.4)
- Submit re-enabled for retry
- Error message in acknowledgment area with red/orange visual treatment
- Exact message depends on error type (see Error Messages table below)

#### Error Messages Reference

| Scenario | Displayed Where | Message Text |
|----------|----------------|-------------|
| Field is empty or whitespace-only | Inline below field | "This field is required." |
| POST → HTTP 400 | Acknowledgment area | "Submission failed: [server error message]." |
| POST → HTTP 500 | Acknowledgment area | "An unexpected error occurred. Please try again." |
| POST → network failure | Acknowledgment area | "Could not reach server. Check your connection." |

#### Interactive Elements

| Element | Type | Default State | On Click / Interaction |
|---------|------|--------------|------------------------|
| Name input | `<input type="text">` | Empty | Accepts text up to 255 chars; placeholder disappears on focus |
| Title input | `<input type="text">` | Empty | Accepts text up to 255 chars; placeholder disappears on focus |
| Description textarea | `<textarea>` | Empty | Multi-line; accepts text up to 1000 chars; vertically resizable |
| Submit button | Primary CTA | Enabled | Triggers client validation → POST if valid; disables during request |
| Acknowledgment area | Status region | Empty/hidden | Displays success or error message; cleared on next Submit click |
| (Optional) Dismiss [×] | Icon button | Hidden when empty | Clears acknowledgment message immediately |

---

### Screen 2: Request List View

**Purpose:** Read-only table displaying all submitted requests. Auto-refreshes after each successful submission. Provides empty state and error state handling.
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-4.2
**Journeys:** JRN-02.1, JRN-02.2, JRN-01.1 (Stage 5), JRN-01.3 (Stage 3)

#### Layout

The Request List View lives directly below the Request Submission Form on the same page. No separate route or navigation required.

```
┌──────────────────────────────────────────────────────────────┐
│  [Request Submission Form — Screen 1 above]                  │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Submitted Requests                                          │
│                                                              │
│  ┌──────────────┬──────────────────────┬───────────────────┐ │
│  │  Name        │  Title               │  Description      │ │
│  ├──────────────┼──────────────────────┼───────────────────┤ │
│  │  Alex Rivera │  Printer broken      │  HP LaserJet on   │ │
│  │              │                      │  3rd floor has    │ │
│  │              │                      │  been offline…    │ │
│  ├──────────────┼──────────────────────┼───────────────────┤ │
│  │  Jordan Kim  │  Test Entry          │  Verifying        │ │
│  │              │                      │  round-trip       │ │
│  └──────────────┴──────────────────────┴───────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Column Definitions:**

| Column | Source Field | Width Guidance | Truncation |
|--------|-------------|---------------|------------|
| Name | `name` | ~20% | None for demo-scale data |
| Title | `title` | ~30% | None for demo-scale data |
| Description | `description` | ~50% | None for demo-scale data (US-2.1 / JRN-02.1 Stage 5) |

> Note: `id` and `createdAt` are NOT displayed as columns (US-2.1). They are available in the API response for Jordan's Network panel validation (JRN-02.2) but intentionally hidden from the table UI.

#### Information Hierarchy

| Priority | Content | Placement | Notes |
|----------|---------|-----------|-------|
| Primary | Table rows (Name, Title, Description) | Table body | Each row = one stored request |
| Primary | Empty state message | Table body area | Shown only when array is empty |
| Secondary | Table column headers (Name, Title, Description) | Table `<thead>` | Visible when ≥1 row exists |
| Secondary | Section title "Submitted Requests" | Above table | Helps both personas orient to this section |
| Tertiary | Loading indicator | Table body area | Transitional; shown during GET fetch |
| Tertiary | Error message | Table body area | Shown on GET failure |

#### States

##### Loading State (GET in progress)
```
  Submitted Requests

  ┌────────────────────────────────────────────────┐
  │  ⏳  Loading requests…                          │
  └────────────────────────────────────────────────┘
```
- Spinner or skeleton placeholder shown while GET /api/requests is in-flight
- No table headers rendered yet
- Prevents blank flash that could be confused with empty state (CP-04)

##### Empty State (GET returns `[]`)
```
  Submitted Requests

  ┌────────────────────────────────────────────────┐
  │                                                │
  │     No requests yet.                           │
  │                                                │
  └────────────────────────────────────────────────┘
```
- Plain message: **"No requests yet."** (US-2.3)
- No table element or header row rendered
- Visible on first page load before any submission (JRN-02.1 Stage 2)
- Distinguishes "table is working but empty" from "table is broken" (Jordan's check)

##### Populated State (GET returns ≥1 records)
```
  Submitted Requests

  ┌──────────────┬──────────────────────┬──────────────────────┐
  │  Name        │  Title               │  Description         │
  ├──────────────┼──────────────────────┼──────────────────────┤
  │  Alex Rivera │  Printer broken      │  HP LaserJet on 3rd  │
  │              │                      │  floor offline…      │
  ├──────────────┼──────────────────────┼──────────────────────┤
  │  Jordan Kim  │  Test Entry          │  Verifying round-    │
  │              │                      │  trip submission     │
  └──────────────┴──────────────────────┴──────────────────────┘
```
- Table with `<thead>` header row and `<tbody>` data rows
- Records in insertion order, oldest first (US-2.1, US-4.2)
- Each row maps exactly to one API record
- Data displayed character-for-character — no reformatting (JRN-02.1 Stage 5)

##### Auto-Refresh State (triggered after successful POST)
- Identical to Populated State visually
- New row appends at the bottom of the table
- Transition: if previously showing Empty State → smoothly switches to table view (US-2.2)
- No duplicate rows appear after auto-refresh (US-2.2)
- Update completes within 2 seconds of POST 201 response (US-2.2, JRN-02.1 Stage 4)

##### Error State (GET → HTTP 500 or network failure)
```
  Submitted Requests

  ┌────────────────────────────────────────────────┐
  │  ✕  Could not load requests.                   │
  │     Please refresh the page.                   │
  └────────────────────────────────────────────────┘
```
- Error message: **"Could not load requests. Please refresh the page."** (US-2.4)
- No table rendered — only the error message shown
- Same message for HTTP 500, network failure, and malformed JSON response
- Component does not crash (US-2.4)

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Table section | Static display | No click/hover actions; read-only |
| Table rows | `<tr>` elements | No row-level actions (no select, delete, or expand) |
| Empty state | Text block | Non-interactive; visible only when array is empty |
| Error state | Text block | Non-interactive; user prompted to use browser refresh |

---

## Interaction Patterns

### Pattern 1: Submit-and-Confirm (CP-01)

**When to use:** Every form submission attempt.
**User Stories:** US-0.1, US-3.1, US-3.3

**Behavior sequence:**
1. User clicks Submit
2. Acknowledgment area clears immediately (removes previous message)
3. Submit button disables (label → "Submitting…")
4. POST fires
5. On 201: success message appears (green), form resets, Submit re-enables, table re-fetches
6. On error: error message appears (red/orange), fields preserved, Submit re-enables

**Visual contract:**
- The Submit button's disabled state is the primary "something is happening" signal
- The acknowledgment area is the primary "it completed" signal
- Both together eliminate the "did it work?" anxiety moment (JRN-01.1 Stage 4)

---

### Pattern 2: Inline Field Validation (CP-03)

**When to use:** Submit clicked with empty/whitespace fields.
**User Stories:** US-0.2

**Behavior:**
- No network call made — validation is purely client-side
- Each empty field independently shows: "This field is required." directly below the input
- Error text appears in red/orange; field border may change to red/orange as visual indicator
- Error messages clear when the user:
  - Corrects the field and clicks Submit again (required)
  - Optionally: clears as soon as the field receives non-empty input (enhanced UX signal noted in JRN-02.3 Stage 4)
- Submit button remains enabled at all times during validation errors

**Error placement:**
```
  ┌──────────────────────────────┐
  │                              │  ← empty input
  └──────────────────────────────┘
  ⚠ This field is required.       ← below the input, left-aligned
```

---

### Pattern 3: Table Auto-Refresh (CP-02)

**When to use:** After every successful POST (HTTP 201).
**User Stories:** US-2.2

**Behavior:**
- Triggered by the form component after receiving HTTP 201
- Re-issues GET /api/requests
- Table contents replaced with fresh response
- If table was in empty state → transitions to populated table
- No loading indicator during refresh (refresh is fast on localhost; avoiding flash)
- New row always appears at the bottom (insertion order)

---

### Pattern 4: Acknowledgment Lifecycle

**When to use:** All submission outcomes.
**User Stories:** US-3.1, US-3.2, US-3.3

**State machine:**
```
[empty] ──(submit clicked)──▶ [empty]  ← cleared at start of each submission
    ▲                            │
    │                            ▼
[dismissed]           [POST response received]
    ▲                   │               │
    │              HTTP 201          error
    │                 ▼                 ▼
    │           [success state]   [error state]
    └──────────────────┴─────────────────┘
         (next Submit click OR dismiss button)
```

**Visual treatment:**
- **Success:** Green background (#e8f5e9 or equivalent), ✓ checkmark icon, dark green text
- **Error:** Red/orange border or background (#fff3e0 / #ffebee), ✕ icon, dark red/orange text
- **Empty:** No visible element (zero height or `visibility: hidden` to avoid layout shift)
- **ARIA:** `role="status"` for success (polite announcement); `role="alert"` for errors (assertive announcement) (US-3.1)

---

## Full Page Layout

The complete single-page layout showing both screens together:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   Simple Request Tracker                                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Submit a Request                                        │   │
│  │                                                          │   │
│  │  Name *          [____________________________________]  │   │
│  │                  [inline error zone]                     │   │
│  │                                                          │   │
│  │  Title *         [____________________________________]  │   │
│  │                  [inline error zone]                     │   │
│  │                                                          │   │
│  │  Description *   [____________________________________]  │   │
│  │                  [____________________________________]  │   │
│  │                  [____________________________________]  │   │
│  │                  [inline error zone]                     │   │
│  │                                                          │   │
│  │  [ Submit ]                                              │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  [Acknowledgment Area — always in DOM]           │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Submitted Requests                                              │
│                                                                  │
│  ┌──────────────┬──────────────────────┬───────────────────┐    │
│  │  Name        │  Title               │  Description      │    │
│  ├──────────────┼──────────────────────┼───────────────────┤    │
│  │  …           │  …                   │  …                │    │
│  └──────────────┴──────────────────────┴───────────────────┘    │
│  — OR —                                                          │
│  No requests yet.                                                │
│  — OR —                                                          │
│  ✕  Could not load requests. Please refresh the page.           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Responsive Considerations

### Desktop (>1024px)
- Form and table display at full width up to a max-width container (~800px centered)
- Description textarea: ~4–6 rows visible
- Table columns share available width: Name ~20%, Title ~30%, Description ~50%
- Acknowledgment area spans full form width

### Tablet (768px – 1024px)
- Same single-column layout; form and table stack vertically
- Table columns maintain proportional widths
- Touch targets for Submit button: minimum 44×44px
- Description textarea remains multi-line

### Mobile (<768px)
- Form fills full viewport width with comfortable padding (~16px)
- Submit button: full width for easy tap targeting
- Table: horizontally scrollable if content overflows, or stacked card view per row
- Acknowledgment area: full width, clearly visible above the fold if possible
- Inline error messages remain adjacent to their respective fields

---

## Accessibility Notes

### Semantic HTML
- Form wrapped in `<form>` element with submit handler
- Each input paired with a `<label>` element using `for`/`id` association (not just visual proximity)
- Description field uses `<textarea>`, not `<input>` — allows multi-line entry and screen reader context
- Table uses proper `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`, `<td>` structure
- Required fields marked with `aria-required="true"` in addition to visual asterisk (*)

### ARIA
- Acknowledgment area: `role="status"` for success messages (polite, non-interrupting) and `role="alert"` for error messages (assertive, immediate) — per US-3.1
- Inline field error messages: linked to their input via `aria-describedby` so screen readers announce "Name: This field is required." when the field receives focus
- Submit button: uses `aria-disabled="true"` (not just `disabled`) during in-flight state to retain focus management; label change to "Submitting…" provides verbal cue
- Empty state and error state table messages: wrapped in `<p>` or `<div>` with appropriate role, not hidden from accessibility tree

### Keyboard Navigation
- All interactive elements reachable by Tab in logical document order: Name → Title → Description → Submit
- Submit button activatable by Enter (inside form) and Space/Enter directly on button
- No keyboard traps introduced
- Dismiss button (if implemented) reachable by Tab; activatable by Enter/Space

### Color & Contrast
- Error text and icons must meet WCAG AA contrast ratio (≥4.5:1) against their background
- Success state: do not rely on green color alone — pair with ✓ icon and text
- Error state: do not rely on red color alone — pair with ✕ icon and text
- Input borders in error state: increase border width (2px) in addition to color change for users who cannot distinguish red

### Focus Management
- On successful form reset (US-0.3): focus returns to the Name input to allow immediate multi-submission (JRN-01.3)
- On validation error (US-0.2): focus moves to the first field with an error so keyboard users are immediately directed to the problem
- On server error: focus remains on Submit button (or moves to acknowledgment area) so user can retry without tabbing back

---

## Story-to-Screen Traceability

| Story ID | Story Title | Screen(s) | UI Element(s) |
|----------|------------|-----------|--------------|
| US-0.1 | Submit a Request | Screen 1 | Name/Title/Description inputs, Submit button |
| US-0.2 | Client-Side Validation | Screen 1 | Inline error messages below each field |
| US-0.3 | Form Reset After Success | Screen 1 | All inputs cleared after HTTP 201 |
| US-0.4 | Server Error — Preserve Input | Screen 1 | Fields retain values on error; acknowledgment shows error |
| US-2.1 | View All Requests in Table | Screen 2 | Table with Name/Title/Description columns |
| US-2.2 | Table Auto-Refresh After Submit | Screen 2 | New row appears after POST 201 without reload |
| US-2.3 | Empty State | Screen 2 | "No requests yet." message |
| US-2.4 | Table Load Error | Screen 2 | "Could not load requests. Please refresh the page." |
| US-3.1 | Success Confirmation | Screen 1 | Acknowledgment area, success style, role="status" |
| US-3.2 | Error Message After Failure | Screen 1 | Acknowledgment area, error style, role="alert" |
| US-3.3 | Acknowledgment Clears on Next Submit | Screen 1 | Acknowledgment area cleared when Submit clicked |
| US-1.1 | Store Valid Submission | (backend) | Reflected in table row after auto-refresh |
| US-1.2 | Server-Side Validation Rejects Blank | (backend) | Surfaces as HTTP 400 → Screen 1 error acknowledgment |
| US-1.3 | Malformed Request Handling | (backend) | Surfaces as HTTP 400 → Screen 1 error acknowledgment |
| US-4.1 | POST Endpoint Contract | (backend) | Enables Screen 1 success flow |
| US-4.2 | GET Endpoint Contract | (backend) | Enables Screen 2 table population |
| US-4.3 | CORS Configuration | (backend) | Prerequisite for all frontend–backend communication |
| US-4.4 | Correct HTTP Status Codes | (backend) | Drives correct Screen 1 acknowledgment state |

---

*Document generated by UX Design Partner | Project: SRT | 2026-05-08*
