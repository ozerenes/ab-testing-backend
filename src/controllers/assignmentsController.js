/**
 * HTTP handlers for variant assignments. Thin layer: delegate to services, map responses.
 */
const assignmentsService = require('../services/assignmentsService');
const { sendData, sendNotFound, handleServiceError } = require('../utils/controllerHelpers');

function get(req, res, next) {
  try {
    const { experimentId, userId } = req.params;
    const assignment = assignmentsService.getAssignment(experimentId, userId);
    if (!assignment) return sendNotFound(res, 'Assignment not found');
    sendData(res, assignment);
  } catch (err) {
    next(err);
  }
}

function assign(req, res, next) {
  try {
    const { experimentId, userId } = req.params;
    const assignment = assignmentsService.assignVariant(experimentId, userId);
    if (!assignment) return sendNotFound(res, 'Experiment not found or has no variants');
    sendData(res, assignment, { status: 201 });
  } catch (err) {
    handleServiceError(err, res, next);
  }
}

module.exports = {
  get,
  assign,
};
