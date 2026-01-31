/**
 * Business logic for experiments.
 */
const storage = require('../storage');

function validateVariants(variants) {
  if (!Array.isArray(variants)) {
    const err = new Error('variants must be an array');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  return variants.map((v, i) => {
    if (v == null || typeof v !== 'object') {
      const err = new Error(`variants[${i}]: must be an object with key and weight`);
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    const key = v.key != null ? String(v.key).trim() : '';
    if (!key) {
      const err = new Error(`variants[${i}]: key is required`);
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    const weight = Number(v.weight);
    if (Number.isNaN(weight) || weight < 0) {
      const err = new Error(`variants[${i}]: weight must be a non-negative number`);
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    return { key, weight };
  });
}

function listExperiments() {
  return storage.experiments.getAll();
}

function getExperiment(id) {
  return storage.experiments.getById(id);
}

function createExperiment(data) {
  const name = data?.name != null ? String(data.name).trim() : '';
  if (!name) {
    const err = new Error('name is required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const variants = validateVariants(data?.variants ?? []);
  const payload = {
    name,
    variants,
    description: data?.description != null ? String(data.description).trim() : undefined,
    status: data?.status ?? 'draft',
    startDate: data?.startDate ?? undefined,
    endDate: data?.endDate ?? undefined,
  };
  return storage.experiments.create(payload);
}

function updateExperiment(id, data) {
  const existing = storage.experiments.getById(id);
  if (!existing) return null;
  const payload = {};
  if (data.name !== undefined) {
    const name = String(data.name).trim();
    if (!name) {
      const err = new Error('name cannot be empty');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }
    payload.name = name;
  }
  if (data.variants !== undefined) payload.variants = validateVariants(data.variants);
  if (data.description !== undefined) payload.description = data.description === '' ? undefined : String(data.description).trim();
  if (data.status !== undefined) payload.status = data.status;
  if (data.startDate !== undefined) payload.startDate = data.startDate || undefined;
  if (data.endDate !== undefined) payload.endDate = data.endDate || undefined;
  return storage.experiments.update(id, payload);
}

function deleteExperiment(id) {
  const existing = storage.experiments.getById(id);
  if (!existing) return null;
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
