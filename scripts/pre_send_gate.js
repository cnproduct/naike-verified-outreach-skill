#!/usr/bin/env node
/*
 * Deterministic pre-send gate.
 * Usage: node scripts/pre_send_gate.js leads.json
 * Input may be a JSON array or newline-delimited JSON records.
 * The script never sends mail; it only emits an approved/rejected queue.
 */
const fs = require("node:fs");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/pre_send_gate.js <leads.json|leads.jsonl>");
  process.exit(2);
}

function loadRecords(file) {
  const raw = fs.readFileSync(file, "utf8").trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return raw.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  }
}

function check(record) {
  const reasons = [];
  const email = String(record.email || record.Email || record.recipientEmail || "").trim();
  const v = record.verification || {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) reasons.push("invalid_email");
  if (record.status && record.status !== "approved") reasons.push("lead_not_approved");
  if (v.status !== "verified") reasons.push("verification_not_verified");
  if (Number(v.score || 0) < 55) reasons.push("verification_score_below_55");
  if (!v.sources || !v.sources.length) reasons.push("missing_sources");
  if (v.identity_match !== true) reasons.push("identity_not_confirmed");
  if (v.business_fit !== true) reasons.push("business_fit_not_confirmed");
  if (v.buying_signal !== true) reasons.push("buying_signal_not_confirmed");
  return { ...record, email, sendEligible: reasons.length === 0, rejectionReasons: reasons };
}

const checked = loadRecords(inputPath).map(check);
const approved = checked.filter((item) => item.sendEligible);
const rejected = checked.filter((item) => !item.sendEligible);
process.stdout.write(JSON.stringify({
  checkedAt: new Date().toISOString(),
  totals: { checked: checked.length, approved: approved.length, rejected: rejected.length },
  approved,
  rejected
}, null, 2) + "\n");
