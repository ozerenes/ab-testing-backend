/**
 * In-memory store for experiments.
 * Production-style: single source of truth, no DB.
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
  const experiment = {
    id,
    name: data.name,
    description: data.description ?? '',
    status: data.status ?? 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    updatedAt: new Date().toISOString(),
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
