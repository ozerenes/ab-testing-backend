/**
 * Route aggregation.
 */
const express = require('express');
const experimentsRouter = require('./experiments');
const variantsRouter = require('./variants');
const assignmentsRouter = require('./assignments');
const eventsRouter = require('./events');

const router = express.Router();

router.use('/experiments', experimentsRouter);
router.use('/variants', variantsRouter);
router.use('/assignments', assignmentsRouter);
router.use('/events', eventsRouter);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
