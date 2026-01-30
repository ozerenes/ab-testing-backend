/**
 * HTTP handlers for variant assignments.
 */
const assignmentsService = require('../services/assignmentsService');

function get(req, res, next) {
  try {
    const { experimentId, userId } = req.params;
    const assignment = assignmentsService.getAssignment(experimentId, userId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ data: assignment });
  } catch (err) {
    next(err);
  }
}

function assign(req, res, next) {
  try {
    const { experimentId, userId } = req.params;
    const assignment = assignmentsService.assignVariant(experimentId, userId);
    if (!assignment) {
      return res.status(404).json({ error: 'Experiment not found or has no variants' });
    }
    res.status(201).json({ data: assignment });
  } catch (err) {
    if (err.code === 'INVALID_STATE') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = {
  get,
  assign,
};
