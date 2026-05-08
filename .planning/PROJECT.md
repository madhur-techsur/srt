# Simple Request Tracker

## What This Is

A lightweight web application that enables users to submit simple requests via a form and view all submitted requests in a list. Designed as a demonstration of end-to-end software delivery, it validates the ability to generate requirements from intent, produce working UI screens, and enable basic data storage and retrieval.

## Core Value

A user can submit a request and immediately see it appear in the list — the full input → store → retrieve → display flow must work.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can submit a request with Name, Title, and Description via a form
- [ ] Form validates that all required fields are filled before submission
- [ ] System stores submitted requests (in-memory or lightweight DB)
- [ ] User can view all submitted requests in a table with Name, Title, and Description columns
- [ ] System acknowledges successful form submission

### Out of Scope

- Authentication / Authorization — demo scope only, not required
- External API integrations — demo scope only
- Complex workflows or approvals — out of demo scope
- Notifications — out of demo scope
- Advanced validations — basic required-field validation only
- Pagination — not required for demo

## Context

- This is a demonstration/validation project for Pivota end-to-end delivery
- Two personas: Business User (Requester) who submits forms; Internal User (Viewer/Engineer) who reviews stored data
- Frontend: React (auto-generated)
- Backend: Java Spring Boot (or equivalent)
- Storage: In-memory or lightweight DB (no external integrations)
- No authentication, no external APIs, no complex workflows

## Constraints

- **Tech Stack**: React frontend, Java Spring Boot backend — specified by project requirements
- **Storage**: In-memory or lightweight DB — no external database integrations required
- **Scope**: Demo/validation project — no production-grade security, auth, or scalability needed
- **Timeline**: Rapid delivery to demonstrate Pivota capabilities

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| In-memory or lightweight DB for storage | Demo scope, simplicity over persistence durability | — Pending |
| React frontend + Spring Boot backend | Specified in PRD technical considerations | — Pending |
| No authentication | Explicitly out of scope for demo | — Pending |

---
*Last updated: 2026-05-08 after initialization*
