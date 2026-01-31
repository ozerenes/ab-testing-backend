/**
 * HTTP handlers for event tracking.
 */
const eventsService = require('../services/eventsService');

function track(req, res, next) {
  try {
    const event = eventsService.trackEvent(req.body);
    res.status(201).json({ data: event });
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 'NOT_FOUND') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = {
  track,
};
