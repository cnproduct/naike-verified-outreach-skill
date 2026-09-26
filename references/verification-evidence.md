# Verification evidence schema

Store one record per lead, for example:

```json
{
  "status": "verified",
  "checked_at": "2026-09-26T00:00:00Z",
  "company": "Example Imports",
  "domain": "example.com",
  "identity_match": true,
  "business_fit": true,
  "buying_signal": true,
  "product_lane": "promotional_products",
  "score": 86,
  "score_components": {
    "identity": 28,
    "business_fit": 28,
    "buying_signal": 21,
    "contact_quality": 5,
    "freshness": 4
  },
  "evidence": [
    "Official Products page lists branded drinkware and event merchandise",
    "Wholesale page states the company serves distributors and corporate buyers"
  ],
  "sources": [
    "https://example.com/products",
    "https://example.com/wholesale"
  ],
  "contact_status": "company_team_email",
  "rejection_reason": ""
}
```

Use `review` when the evidence is incomplete, conflicting, stale, or only found in a third-party profile. Use `rejected` when identity or business fit fails. Do not set `verified` from a keyword score alone.
