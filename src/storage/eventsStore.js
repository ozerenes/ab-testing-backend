/**
 * In-memory store for experiment events.
 * Model: experimentId, variantKey, eventType (view | click | conversion), userId?, sessionId?, metadata?, timestamp.
 */
const events = [];
let nextId = 1;

const ALLOWED_EVENT_TYPES = new Set(['view', 'click', 'conversion']);

function isValidEventType(type) {
  return type && ALLOWED_EVENT_TYPES.has(String(type).toLowerCase());
}

function create(payload) {
  const id = String(nextId++);
  const event = {
    id,
    experimentId: String(payload.experimentId),
    variantKey: String(payload.variantKey),
    eventType: String(payload.eventType).toLowerCase(),
    userId: payload.userId != null ? String(payload.userId) : undefined,
    sessionId: payload.sessionId != null ? String(payload.sessionId) : undefined,
    metadata: payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : undefined,
    timestamp: payload.timestamp || new Date().toISOString(),
  };
  events.push(event);
  return event;
}

function getByExperimentId(experimentId) {
  return events.filter((e) => e.experimentId === String(experimentId));
}

function getByExperimentAndVariant(experimentId, variantKey) {
  return events.filter(
    (e) => e.experimentId === String(experimentId) && e.variantKey === String(variantKey)
  );
}

function getAll() {
  return [...events];
}

module.exports = {
  create,
  getByExperimentId,
  getByExperimentAndVariant,
  getAll,
  isValidEventType,
  ALLOWED_EVENT_TYPES,
};
