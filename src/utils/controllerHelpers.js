/**
 * Shared helpers for thin controllers.
 * Centralizes response and service-error handling so controllers only delegate to services.
 */

function sendData(res, data, options = {}) {
  const { status = 200 } = options;
  res.status(status).json({ data });
}

function sendNoContent(res) {
  res.status(204).send();
}

function sendNotFound(res, message = 'Resource not found') {
  res.status(404).json({ error: message });
}

function sendBadRequest(res, message) {
  res.status(400).json({ error: message });
}

/**
 * Map service errors to HTTP responses; pass through to next() for unknown errors.
 */
function handleServiceError(err, res, next) {
  if (err.code === 'VALIDATION_ERROR') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'NOT_FOUND') {
    return res.status(404).json({ error: err.message });
  }
  if (err.code === 'INVALID_STATE') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
}

module.exports = {
  sendData,
  sendNoContent,
  sendNotFound,
  sendBadRequest,
  handleServiceError,
};
