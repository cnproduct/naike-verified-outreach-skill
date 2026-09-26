---
name: naike-verified-outreach
description: Build and operate evidence-gated B2B customer discovery and outreach for Naike product lines. Use when discovering importers, distributors, retail buyers, corporate-gift agencies, silicone baby/kitchenware buyers, or when qualifying leads, verifying companies, generating 1:1 outreach, managing follow-ups, or auditing campaign quality.
---

# Naike Verified Outreach

Use this skill to turn public or provided lead data into a defensible outreach queue. The central rule is: discovery is not verification, and a lead must pass evidence gates before any outreach is sent.

## Operating contract

- Separate `discovered`, `review`, `verified`, `approved`, `sent`, `opened`, `replied`, and `qualified` states.
- Never convert a keyword hit, a public mailbox, a search-result snippet, or a plausible company name into a factual company claim.
- Every verified lead must retain source URLs, checked time, evidence snippets, identity-match notes, product-fit signals, and a confidence score.
- If evidence is insufficient, keep the lead in review or reject it; do not send a generic pitch to fill a quota.
- Treat personal/public email addresses as a contact channel only. They do not prove the company, role, or purchasing authority.
- Never invent headquarters, revenue, product lines, certifications, procurement pain points, or decision-maker names.
- Do not send, publish, or modify external records unless the user explicitly authorizes that action. When sending is authorized, use the pre-send gate below.

## Workflow

### 1. Define the buyer hypothesis

Before collecting leads, state the target product line, buyer type, geography, and disqualifiers. Typical Naike lanes are:

- silicone baby feeding, toddler tableware, and weaning products;
- silicone kitchenware, bakeware, and food containers;
- drinkware and reusable daily-use products;
- promotional products, corporate gifts, branded merchandise, and event swag;
- importers, distributors, wholesalers, private-label brands, retail buyers, and promotional-product agencies.

Read [references/qualification-matrix.md](references/qualification-matrix.md) when choosing positive and negative signals.

### 2. Discover candidates

Use multiple public sources where available: official websites, product/catalog pages, distributor or wholesale pages, trade directories, public company pages, and search results. Record the exact query or source that produced each candidate. Deduplicate by normalized company domain, email, and company name.

Discovery may use industry keywords, but the query category is only a hypothesis. Store it as `discovery_signal`, not as the customer's confirmed business.

### 3. Verify the company

For each candidate, try to identify an official domain and inspect the homepage plus relevant pages such as About, Products, Collections, Wholesale, Trade, Distributor, Contact, and Supplier/Procurement. For public-mailbox leads, require an independently matched official website before treating the company as verified.

Confirm three separate things:

1. **Identity:** the website belongs to the named company and country/market.
2. **Business fit:** the website demonstrates an active product or distribution business related to the selected Naike lane.
3. **Buying relevance:** there is evidence of wholesale, distribution, importing, private label, procurement, retail, promotional programs, or a plausible sourcing role.

Use `verified` only when the evidence supports all three. Use `review` when one is plausible but not proven. Use `rejected` for wrong industries, directories, parked domains, personal pages, unrelated services, or identity mismatch. See [references/verification-evidence.md](references/verification-evidence.md).

### 4. Score and route

Score evidence, not confidence theater. A suggested 100-point model is:

- 30 identity match;
- 30 product/business fit;
- 25 buying/distribution signal;
- 10 contact quality and role relevance;
- 5 source freshness and consistency.

Recommended routing:

- `80–100`: verified and eligible for tailored outreach;
- `60–79`: review queue; do not auto-send;
- below `60`: reject or enrich later;
- any hard negative or identity conflict: reject regardless of score.

Keep the component scores and reasons. A single total without evidence is not an audit trail.

### 5. Identify the right contact

Prefer role evidence from the company site or public professional pages: sourcing, procurement, purchasing, buying, merchandising, import, wholesale, or owner/GM for small companies. Do not infer a person's title from an email local-part. If only a generic company mailbox is found, address the team and lower contact-quality confidence.

For decision-maker enrichment, use the separate decision-maker workflow only when the user requests it and preserve the source and verification status of each person.

### 6. Generate the outreach

Tailor the message to verified facts only:

- mention the verified business model or product category;
- connect one specific Naike capability to an evidenced buyer context;
- ask a low-friction validation question;
- avoid claiming the buyer has a pain point unless the source supports it;
- do not include a full catalog or multiple unrelated product lines in the first message;
- use a neutral validation email for review leads, but do not send it automatically unless the user explicitly permits review-tier outreach.

Read [references/outreach-patterns.md](references/outreach-patterns.md) for message structure, product-lane variants, and follow-up rules.

### 7. Enforce the pre-send gate

Before SMTP/API sending, require:

```text
status == approved
verification.status == verified
verification.sources is not empty
verification.checked_at is recent
identity_match == true
business_fit == true
buying_signal == true
email is syntactically valid and not suppressed
dedupe and domain-cooldown checks pass
```

Anything else stays out of the sending queue. Log the rejection reason and retain it for review. Sending code must re-check the gate immediately before transmission; dashboard labels or an earlier collector score are not sufficient.

### 8. Track outcomes and learn safely

Track delivery, bounce, open, reply, positive reply, qualification, unsubscribe, and complaint separately. An open is not buying intent. Use feedback to adjust discovery and message hypotheses, not to silently overwrite evidence. Re-verify stale companies before a follow-up sequence.

## Dashboard and audit requirements

Operational dashboards should show, per lead:

- company, domain, country, buyer type, contact and email type;
- verification status, score components, checked time, sources, and evidence summary;
- product lane and why it matched;
- send eligibility and exact rejection reason;
- campaign, sender, message version, and dedupe key;
- opens, replies, bounces, unsubscribes, and human qualification status.

Never display a high match percentage without showing the evidence basis. Separate “verified company” from “verified email reachability.”

## Persistent updates

When this skill is maintained in a Git repository, keep the skill folder self-contained, commit meaningful changes with tests, and push only after validation. Do not commit passwords, SMTP credentials, tokens, customer exports, raw mailbox content, or unredacted personal data. Use configuration placeholders and document required environment variables.

Validate changes with the bundled skill validator and run deterministic checks for the verification gate before publishing.
