/**
 * HTTP handlers for experiments.
 */
const experimentsService = require('../services/experimentsService');

function list(req, res, next) {
  try {
    const experiments = experimentsService.listExperiments();
    res.json({ data: experiments });
  } catch (err) {
    next(err);
  }
}

function get(req, res, next) {
  try {
    const experiment = experimentsService.getExperiment(req.params.id);
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    res.json({ data: experiment });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const experiment = experimentsService.createExperiment(req.body);
    res.status(201).json({ data: experiment });
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

function update(req, res, next) {
  try {
    const experiment = experimentsService.updateExperiment(req.params.id, req.body);
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    res.json({ data: experiment });
  } catch (err) {
    if (err.code === 'VALIDATION_ERROR') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

function remove(req, res, next) {
  try {
    const result = experimentsService.deleteExperiment(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Experiment not found' });
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
