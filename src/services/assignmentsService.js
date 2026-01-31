/**
 * Business logic for user-to-variant assignments.
 * Deterministic assignment: same userId always receives the same variant (via hashing).
 */
const crypto = require('crypto');
const storage = require('../storage');

/**
 * Deterministic hash of (experimentId, userId) -> value in [0, 1).
 * Same inputs always produce the same output.
 */
function hashToUnitInterval(experimentId, userId) {
  const input = `${String(experimentId)}:${String(userId)}`;
  const hash = crypto.createHash('sha256').update(input, 'utf8').digest();
  const n = hash.readUInt32BE(0);
  return n / (0xffffffff + 1);
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
  const variants = experiment.variants ?? [];
  if (variants.length === 0) return null;
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 0), 0);
  if (totalWeight <= 0) {
    const chosen = variants[0];
    const assignment = storage.assignments.set(experimentId, userId, chosen.key);
    return { ...assignment, variant: chosen };
  }
  const deterministicValue = hashToUnitInterval(experimentId, userId);
  let r = deterministicValue * totalWeight;
  for (const v of variants) {
    r -= v.weight ?? 0;
    if (r <= 0) {
      const assignment = storage.assignments.set(experimentId, userId, v.key);
      return { ...assignment, variant: v };
    }
  }
  const chosen = variants[variants.length - 1];
  const assignment = storage.assignments.set(experimentId, userId, chosen.key);
  return { ...assignment, variant: chosen };
}

module.exports = {
  getAssignment,
  assignVariant,
};
