/**
 * Experiment routes.
 */
const express = require('express');
const controller = require('../controllers/experimentsController');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id/stats', controller.getStats);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
