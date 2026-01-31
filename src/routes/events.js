/**
 * Event tracking routes.
 */
const express = require('express');
const controller = require('../controllers/eventsController');

const router = express.Router();

router.post('/', controller.track);

module.exports = router;
