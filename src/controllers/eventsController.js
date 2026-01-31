/**
 * HTTP handlers for event tracking. Thin layer: delegate to services, map responses.
 */
const eventsService = require('../services/eventsService');
const { sendData, handleServiceError } = require('../utils/controllerHelpers');

function track(req, res, next) {
  try {
    const event = eventsService.trackEvent(req.body);
    sendData(res, event, { status: 201 });
  } catch (err) {
    handleServiceError(err, res, next);
  }
}

module.exports = {
  track,
};
