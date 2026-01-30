/**
 * Business logic for user-to-variant assignments.
 * Assigns a variant (by key) to a user for an experiment (weighted random).
 */
const storage = require('../storage');

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
  let r = Math.random() * totalWeight;
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
