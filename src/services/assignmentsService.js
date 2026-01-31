/**
 * Business logic for user-to-variant assignments.
 *
 * Deterministic assignment: same (experimentId, userId) always receives the same variant.
 * Uses SHA-256 hash of "experimentId:userId" → value in [0, 1), then maps to a variant
 * by weighted buckets. Variants are sorted by key so bucket order is stable across
 * requests and data changes.
 */
const crypto = require('crypto');
const storage = require('../storage');

/**
 * Deterministic hash: (experimentId, userId) → value in [0, 1).
 * Same inputs always produce the same output (SHA-256, first 4 bytes as big-endian uint32).
 */
function hashToUnitInterval(experimentId, userId) {
  const input = `${String(experimentId)}:${String(userId)}`;
  const hash = crypto.createHash('sha256').update(input, 'utf8').digest();
  const n = hash.readUInt32BE(0);
  return n / (0xffffffff + 1);
}

/**
 * Pick variant by deterministic weighted bucket.
 * variants: sorted by key; bucket boundaries are defined by cumulative weight.
 */
function pickVariantByHash(variants, value01) {
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 0), 0);
  if (totalWeight <= 0) return variants[0] ?? null;
  let r = value01 * totalWeight;
  for (const v of variants) {
    r -= v.weight ?? 0;
    if (r < 0) return v;
  }
  return variants[variants.length - 1];
}

function getAssignment(experimentId, userId) {
  const experiment = storage.experiments.getById(experimentId);
  if (!experiment) return null;
  const existing = storage.assignments.get(experimentId, userId);
  if (!existing) return null;
  const variant = experiment.variants.find((v) => v.key === existing.variantKey) ?? { key: existing.variantKey, weight: 0 };
  return { ...existing, variant };
}

function assignVariant(experimentId, userId) {
  const experiment = storage.experiments.getById(experimentId);
  if (!experiment) return null;
  const existing = storage.assignments.get(experimentId, userId);
  if (existing) {
    const variant = experiment.variants.find((v) => v.key === existing.variantKey) ?? { key: existing.variantKey, weight: 0 };
    return { ...existing, variant };
  }
  const rawVariants = experiment.variants ?? [];
  if (rawVariants.length === 0) return null;
  // Stable order by key so same user always maps to same bucket
  const variants = [...rawVariants].sort((a, b) => (a.key || '').localeCompare(b.key || ''));
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 0), 0);
  if (totalWeight <= 0) {
    const chosen = variants[0];
    const assignment = storage.assignments.set(experimentId, userId, chosen.key);
    return { ...assignment, variant: chosen };
  }
  const value01 = hashToUnitInterval(experimentId, userId);
  const chosen = pickVariantByHash(variants, value01);
  if (!chosen) return null;
  const assignment = storage.assignments.set(experimentId, userId, chosen.key);
  return { ...assignment, variant: chosen };
}

module.exports = {
  getAssignment,
  assignVariant,
};
