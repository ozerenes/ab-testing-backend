/**
 * In-memory store for experiments.
 * Model: id, name, variants [{ key, weight }], createdAt.
 */
const experiments = new Map();
let nextId = 1;

function generateId() {
  return String(nextId++);
}

function getAll() {
  return Array.from(experiments.values());
}

function getById(id) {
  return experiments.get(id) ?? null;
}

function create(data) {
  const id = generateId();
  const createdAt = new Date().toISOString();
  const experiment = {
    id,
    name: data.name,
    variants: data.variants ?? [],
    createdAt,
  };
  experiments.set(id, experiment);
  return experiment;
}

function update(id, data) {
  const existing = experiments.get(id);
  if (!existing) return null;
  const updated = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
  };
  experiments.set(id, updated);
  return updated;
}

function remove(id) {
  return experiments.delete(id);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
