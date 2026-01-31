/**
 * HTTP handlers for experiments. Thin layer: delegate to services, map responses.
 */
const experimentsService = require('../services/experimentsService');
const metricsService = require('../services/metricsService');
const { sendData, sendNoContent, sendNotFound, handleServiceError } = require('../utils/controllerHelpers');

function list(req, res, next) {
  try {
    sendData(res, experimentsService.listExperiments());
  } catch (err) {
    next(err);
  }
}

function get(req, res, next) {
  try {
    const experiment = experimentsService.getExperiment(req.params.id);
    if (!experiment) return sendNotFound(res, 'Experiment not found');
    sendData(res, experiment);
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const experiment = experimentsService.createExperiment(req.body);
    sendData(res, experiment, { status: 201 });
  } catch (err) {
    handleServiceError(err, res, next);
  }
}

function update(req, res, next) {
  try {
    const experiment = experimentsService.updateExperiment(req.params.id, req.body);
    if (!experiment) return sendNotFound(res, 'Experiment not found');
    sendData(res, experiment);
  } catch (err) {
    handleServiceError(err, res, next);
  }
}

function remove(req, res, next) {
  try {
    const result = experimentsService.deleteExperiment(req.params.id);
    if (!result) return sendNotFound(res, 'Experiment not found');
    sendNoContent(res);
  } catch (err) {
    next(err);
  }
}

function getStats(req, res, next) {
  try {
    const stats = metricsService.getExperimentMetrics(req.params.id);
    if (!stats) return sendNotFound(res, 'Experiment not found');
    sendData(res, stats);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  getStats,
};
