/**
 * Application configuration.
 * Load from environment; defaults for development.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config;
