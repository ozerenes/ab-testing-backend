/**
 * Storage layer - in-memory only.
 * Single export point for all stores.
 */
const experimentsStore = require('./experimentsStore');
const variantsStore = require('./variantsStore');
const assignmentsStore = require('./assignmentsStore');
const eventsStore = require('./eventsStore');

module.exports = {
  experiments: experimentsStore,
  variants: variantsStore,
  assignments: assignmentsStore,
  events: eventsStore,
};
