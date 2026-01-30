/**
 * In-memory store for user-to-variant assignments.
 * Key: `${experimentId}:${userId}` -> { experimentId, userId, variantKey, assignedAt }
 */
const assignments = new Map();

function getKey(experimentId, userId) {
  return `${experimentId}:${userId}`;
}

function get(experimentId, userId) {
  return assignments.get(getKey(experimentId, userId)) ?? null;
}

function set(experimentId, userId, variantKey) {
  const key = getKey(experimentId, userId);
  assignments.set(key, { experimentId, userId, variantKey, assignedAt: new Date().toISOString() });
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
