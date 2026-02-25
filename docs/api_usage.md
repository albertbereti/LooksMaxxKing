# Organism API Usage Guide

This API allows you to monitor the **LOOKSMAXXKING Super-Organism** from any external dashboard (Retool, Notion, Custom Apps).

## Endpoint Information

- **URL**: `https://<YOUR_REGION>-<YOUR_PROJECT_ID>.cloudfunctions.net/getOrganismStats`
- **Method**: `GET`
- **Auth**: Pass your secret key in the headers.

## Headers

| Header | Value | Description |
| :--- | :--- | :--- |
| `x-organism-secret` | `LOOKS_KNG_99_SECURE` | Your personal secret key (Configurable via Firebase ENV) |

## Response Structure

The API returns a JSON object containing the organism's vital signs:

```json
{
  "status": "OPERATIONAL",
  "vitality": "HIGH",
  "metrics": {
    "totalUsers": 1250,
    "premiumUsers": 340,
    "activeStreaks": 890,
    "conversionRate": "0.27"
  },
  "heartbeats": [
    {
      "id": "abc123pulse",
      "decision": "RETENTION: Identifying at-risk streaks...",
      "timestamp": "2026-02-21T19:55:00Z"
    }
  ],
  "recentActivity": 10,
  "timestamp": "2026-02-21T20:00:00Z"
}
```

## How to use in Retool / Notion

1. Create a "REST API" resource.
2. Set the base URL to your Cloud Function endpoint.
3. Add the `x-organism-secret` header.
4. Set up a "Query on Page Load" to fetch real-time stats.
