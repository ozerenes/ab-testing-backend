/**
 * HTTP handlers for variants.
 */
const variantsService = require('../services/variantsService');

function list(req, res, next) {
  try {
    const experimentId = req.query.experimentId;
    const variants = variantsService.listVariants(experimentId);
    if (experimentId && variants === null) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    res.json({ data: variants });
  } catch (err) {
    next(err);
  }
}

function get(req, res, next) {
  try {
    const variant = variantsService.getVariant(req.params.id);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    res.json({ data: variant });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const variant = variantsService.createVariant(req.body);
    res.status(201).json({ data: variant });
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

function update(req, res, next) {
  try {
    const variant = variantsService.updateVariant(req.params.id, req.body);
    if (!variant) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    res.json({ data: variant });
  } catch (err) {
    next(err);
  }
}

function remove(req, res, next) {
  try {
    const result = variantsService.deleteVariant(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Variant not found' });
    }
    res.status(204).send();
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
