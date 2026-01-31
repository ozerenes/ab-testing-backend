/**
 * In-memory store for experiments.
 * Model: id, name, variants [{ key, weight }], createdAt.
 */
const experiments = new Map();
let nextId = 1;

const SEED_EXPERIMENTS = [
  {
    id: '1',
    name: 'Homepage CTA Button',
    description: 'Test different call-to-action button colors and copy.',
    status: 'active',
    variants: [
      { key: 'control', weight: 50 },
      { key: 'variant-green', weight: 50 },
    ],
    startDate: '2025-01-15T00:00:00.000Z',
    endDate: '2025-02-28T23:59:59.000Z',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: '2',
    name: 'Pricing Page Headline',
    description: 'Compare conversion with short vs long headline.',
    status: 'active',
    variants: [
      { key: 'control', weight: 33 },
      { key: 'short', weight: 33 },
      { key: 'long', weight: 34 },
    ],
    startDate: '2025-01-20T00:00:00.000Z',
    createdAt: '2025-01-18T14:30:00.000Z',
    updatedAt: '2025-01-18T14:30:00.000Z',
  },
  {
    id: '3',
    name: 'Checkout Flow - Single Step',
    description: 'Single-page checkout vs multi-step. Draft for review.',
    status: 'draft',
    variants: [
      { key: 'multi-step', weight: 50 },
      { key: 'single-page', weight: 50 },
    ],
    createdAt: '2025-01-25T11:00:00.000Z',
    updatedAt: '2025-01-25T11:00:00.000Z',
  },
];

function seedIfEmpty() {
  if (experiments.size > 0) return;
  SEED_EXPERIMENTS.forEach((exp) => {
    experiments.set(exp.id, exp);
  });
  nextId = 4;
}

function generateId() {
  return String(nextId++);
}

function getAll() {
  seedIfEmpty();
  return Array.from(experiments.values());
}

function getById(id) {
  seedIfEmpty();
  return experiments.get(id) ?? null;
}

function create(data) {
  const id = generateId();
  const now = new Date().toISOString();
  const experiment = {
    id,
    name: data.name,
    variants: data.variants ?? [],
    createdAt: now,
    updatedAt: now,
    ...(data.description != null && { description: data.description }),
    ...(data.status != null && { status: data.status }),
    ...(data.startDate != null && { startDate: data.startDate }),
    ...(data.endDate != null && { endDate: data.endDate }),
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
