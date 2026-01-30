/**
 * In-memory store for user-to-variant assignments.
 * Key: `${experimentId}:${userId}` -> variantId
 */
const assignments = new Map();

function getKey(experimentId, userId) {
  return `${experimentId}:${userId}`;
}

function get(experimentId, userId) {
  return assignments.get(getKey(experimentId, userId)) ?? null;
}

function set(experimentId, userId, variantId) {
  const key = getKey(experimentId, userId);
  assignments.set(key, { experimentId, userId, variantId, assignedAt: new Date().toISOString() });
  return assignments.get(key);
}

function getByExperimentId(experimentId) {
  return Array.from(assignments.values()).filter((a) => a.experimentId === experimentId);
}

module.exports = {
  get,
  set,
  getByExperimentId,
};
