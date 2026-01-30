/**
 * Business logic for user-to-variant assignments.
 * Assigns a variant to a user for an experiment (weighted random).
 */
const storage = require('../storage');

function getAssignment(experimentId, userId) {
  const experiment = storage.experiments.getById(experimentId);
  if (!experiment) return null;
  const existing = storage.assignments.get(experimentId, userId);
  if (existing) {
    const variant = storage.variants.getById(existing.variantId);
    return { ...existing, variant };
  }
  return null;
}

function assignVariant(experimentId, userId) {
  const experiment = storage.experiments.getById(experimentId);
  if (!experiment) return null;
  if (experiment.status !== 'running') {
    const err = new Error('Experiment is not running');
    err.code = 'INVALID_STATE';
    throw err;
  }
  const existing = storage.assignments.get(experimentId, userId);
  if (existing) {
    const variant = storage.variants.getById(existing.variantId);
    return { ...existing, variant };
  }
  const variants = storage.variants.getByExperimentId(experimentId);
  if (variants.length === 0) return null;
  const totalWeight = variants.reduce((sum, v) => sum + (v.trafficWeight ?? 0), 0);
  let r = Math.random() * totalWeight;
  for (const v of variants) {
    r -= v.trafficWeight ?? 0;
    if (r <= 0) {
      const assignment = storage.assignments.set(experimentId, userId, v.id);
      return { ...assignment, variant: v };
    }
  }
  const chosen = variants[variants.length - 1];
  const assignment = storage.assignments.set(experimentId, userId, chosen.id);
  return { ...assignment, variant: chosen };
}

module.exports = {
  getAssignment,
  assignVariant,
};
