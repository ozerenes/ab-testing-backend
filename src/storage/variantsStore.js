/**
 * In-memory store for experiment variants (A/B/C).
 */
const variants = new Map();
let nextId = 1;

function generateId() {
  return String(nextId++);
}

function getAll() {
  return Array.from(variants.values());
}

function getById(id) {
  return variants.get(id) ?? null;
}

function getByExperimentId(experimentId) {
  return getAll().filter((v) => v.experimentId === experimentId);
}

function create(data) {
  const id = generateId();
  const variant = {
    id,
    experimentId: data.experimentId,
    name: data.name,
    config: data.config ?? {},
    trafficWeight: data.trafficWeight ?? 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  variants.set(id, variant);
  return variant;
}

function update(id, data) {
  const existing = variants.get(id);
  if (!existing) return null;
  const updated = {
    ...existing,
    ...data,
    id: existing.id,
    experimentId: existing.experimentId,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  variants.set(id, updated);
  return updated;
}

function remove(id) {
  return variants.delete(id);
}

function removeByExperimentId(experimentId) {
  getByExperimentId(experimentId).forEach((v) => variants.delete(v.id));
}

module.exports = {
  getAll,
  getById,
  getByExperimentId,
  create,
  update,
  remove,
  removeByExperimentId,
};
