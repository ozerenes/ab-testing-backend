/**
 * Business logic for experiment event tracking.
 * Tracks view, click, and conversion events per experiment and variant.
 */
const storage = require('../storage');

function trackEvent(payload) {
  const { experimentId, variantKey, eventType } = payload ?? {};
  if (!experimentId || !variantKey || !eventType) {
    const err = new Error('experimentId, variantKey, and eventType are required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  if (!storage.events.isValidEventType(eventType)) {
    const err = new Error(
      `eventType must be one of: ${[...storage.events.ALLOWED_EVENT_TYPES].join(', ')}`
    );
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const experiment = storage.experiments.getById(experimentId);
  if (!experiment) {
    const err = new Error('Experiment not found');
    err.code = 'NOT_FOUND';
    throw err;
  }
  const variantExists = (experiment.variants ?? []).some(
    (v) => String(v.key) === String(variantKey)
  );
  if (!variantExists) {
    const err = new Error('Variant not found for this experiment');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  return storage.events.create({
    experimentId,
    variantKey,
    eventType: String(eventType).toLowerCase(),
    userId: payload.userId,
    sessionId: payload.sessionId,
    metadata: payload.metadata,
    timestamp: payload.timestamp,
  });
}

function getEventsByExperiment(experimentId) {
  return storage.events.getByExperimentId(experimentId);
}

module.exports = {
  trackEvent,
  getEventsByExperiment,
};
