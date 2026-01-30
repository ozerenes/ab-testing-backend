/**
 * Server entry point.
 */
const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(`A/B Testing API listening on port ${config.port} (${config.env})`);
});

module.exports = server;
