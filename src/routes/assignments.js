/**
 * Assignment routes (get or assign variant for user).
 */
const express = require('express');
const controller = require('../controllers/assignmentsController');

const router = express.Router();

router.get('/:experimentId/users/:userId', controller.get);
router.post('/:experimentId/users/:userId', controller.assign);

module.exports = router;
