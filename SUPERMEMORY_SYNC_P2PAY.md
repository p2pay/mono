# p2pay Supermemory sync package

Use this file as the source of truth to push missing notes to the shared external Supermemory for p2pay.

## Copy-paste note body

Project: p2pay
Date: 2026-03-22
Scope: mono repository structure and booking flow conventions

Decisions to store:
- Peach rail remains only inside mono; no separate peach repository.
- Mono naming convention updated:
  - rails paths are mono/rails/peach and mono/rails/template
  - flows path is mono/flows/booking
- Booking flow standard:
  - package name is @p2payto/booking
  - location is mono/flows/booking
  - routes are /flows/booking and /flows/booking/embed
  - login/auth is intentionally excluded for now
  - theme customization comes from query params customMode, customPrimary, customBackground
- Workspace standards remain:
  - package naming uses @p2payto/*
  - default license is MIT unless explicitly overridden

Reason:
- Keep one stable mono convention for rails and flows while onboarding booking flow quickly without auth complexity.

## Terminal checklist

1. Verify MCP auth/session is active for the p2pay Supermemory connector.
2. Open your preferred Supermemory client and create a new memory entry.
3. Paste the full note body from this file.
4. Tag with: p2pay, mono, rails, flows, booking-flow, convention.
5. Confirm the note is visible to shared team members.

## Optional HTTP attempt (only if your MCP gateway supports direct JSON-RPC over HTTP)

If your gateway supports this mode and you already have valid auth headers, adapt this template:

curl -X POST "https://supermemory-mcp.p2pay.to/mcp" \
  -H "content-type: application/json" \
  -H "accept: application/json, text/event-stream" \
  -H "authorization: Bearer YOUR_TOKEN" \
  --data '{
    "jsonrpc": "2.0",
    "id": "save-p2pay-2026-03-22",
    "method": "tools/call",
    "params": {
      "name": "memory_create",
      "arguments": {
        "content": "PASTE THE NOTE BODY HERE"
      }
    }
  }'

Only run the HTTP command if your server docs confirm the exact method and tool names.
