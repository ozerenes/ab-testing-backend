/**
 * Business logic for experiment variants.
 */
const storage = require('../storage');

function listVariants(experimentId) {
  if (!experimentId) return storage.variants.getAll();
  const experiment = storage.experiments.getById(experimentId);
  if (!experiment) return null;
  if (Array.isArray(experiment.variants)) return experiment.variants;
  return storage.variants.getByExperimentId(experimentId);
}

function getVariant(id) {
  return storage.variants.getById(id);
}

function createVariant(data) {
  if (!data?.experimentId?.trim() || !data?.name?.trim()) {
    const err = new Error('experimentId and name are required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const experiment = storage.experiments.getById(data.experimentId);
  if (!experiment) {
    const err = new Error('Experiment not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  return storage.variants.create({
    experimentId: data.experimentId,
    name: data.name.trim(),
    config: data.config ?? {},
    trafficWeight: data.trafficWeight ?? 50,
  });
}

function updateVariant(id, data) {
  const existing = storage.variants.getById(id);
  if (!existing) return null;
  const payload = {};
  if (data.name !== undefined) payload.name = String(data.name).trim();
  if (data.config !== undefined) payload.config = data.config;
  if (data.trafficWeight !== undefined) payload.trafficWeight = data.trafficWeight;
  return storage.variants.update(id, payload);
}

function deleteVariant(id) {
  const existing = storage.variants.getById(id);
  if (!existing) return null;
  storage.variants.remove(id);
  return { deleted: true, id };
}

module.exports = {
  listVariants,
  getVariant,
  createVariant,
  updateVariant,
  deleteVariant,
};
