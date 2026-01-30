/**
 * Business logic for experiments.
 */
const storage = require('../storage');

function listExperiments() {
  return storage.experiments.getAll();
}

function getExperiment(id) {
  const experiment = storage.experiments.getById(id);
  if (!experiment) return null;
  const variants = storage.variants.getByExperimentId(id);
  return { ...experiment, variants };
}

function createExperiment(data) {
  if (!data?.name?.trim()) {
    const err = new Error('Experiment name is required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  return storage.experiments.create({
    name: data.name.trim(),
    description: data.description ?? '',
    status: data.status ?? 'draft',
  });
}

function updateExperiment(id, data) {
  const existing = storage.experiments.getById(id);
  if (!existing) return null;
  const payload = {};
  if (data.name !== undefined) payload.name = String(data.name).trim();
  if (data.description !== undefined) payload.description = data.description;
  if (data.status !== undefined) payload.status = data.status;
  return storage.experiments.update(id, payload);
}

function deleteExperiment(id) {
  const existing = storage.experiments.getById(id);
  if (!existing) return null;
  storage.variants.removeByExperimentId(id);
  storage.experiments.remove(id);
  return { deleted: true, id };
}

module.exports = {
  listExperiments,
  getExperiment,
  createExperiment,
  updateExperiment,
  deleteExperiment,
};
