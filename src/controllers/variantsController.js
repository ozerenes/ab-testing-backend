/**
 * HTTP handlers for variants. Thin layer: delegate to services, map responses.
 */
const variantsService = require('../services/variantsService');
const { sendData, sendNoContent, sendNotFound, handleServiceError } = require('../utils/controllerHelpers');

function list(req, res, next) {
  try {
    const experimentId = req.query.experimentId;
    const variants = variantsService.listVariants(experimentId);
    if (experimentId && variants === null) return sendNotFound(res, 'Experiment not found');
    sendData(res, variants);
  } catch (err) {
    next(err);
  }
}

function get(req, res, next) {
  try {
    const variant = variantsService.getVariant(req.params.id);
    if (!variant) return sendNotFound(res, 'Variant not found');
    sendData(res, variant);
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const variant = variantsService.createVariant(req.body);
    sendData(res, variant, { status: 201 });
  } catch (err) {
    handleServiceError(err, res, next);
  }
}

function update(req, res, next) {
  try {
    const variant = variantsService.updateVariant(req.params.id, req.body);
    if (!variant) return sendNotFound(res, 'Variant not found');
    sendData(res, variant);
  } catch (err) {
    next(err);
  }
}

function remove(req, res, next) {
  try {
    const result = variantsService.deleteVariant(req.params.id);
    if (!result) return sendNotFound(res, 'Variant not found');
    sendNoContent(res);
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
};
