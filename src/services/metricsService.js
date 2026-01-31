/**
 * Metrics aggregation for experiments.
 * Aggregates events into views, clicks, and conversions per variant and experiment.
 */
const storage = require('../storage');

function aggregateEventsByVariant(events) {
  const byVariant = new Map();
  for (const e of events) {
    const key = e.variantKey;
    if (!byVariant.has(key)) {
      byVariant.set(key, { views: 0, clicks: 0, conversions: 0 });
    }
    const row = byVariant.get(key);
    if (e.eventType === 'view') row.views += 1;
    else if (e.eventType === 'click') row.clicks += 1;
    else if (e.eventType === 'conversion') row.conversions += 1;
  }
  return byVariant;
}

/**
 * Get aggregated metrics for an experiment: views, clicks, conversions per variant and totals.
 * Returns { experimentId, variants: [{ variantKey, views, clicks, conversions, conversionRate }], totals }.
 */
function getExperimentMetrics(experimentId) {
  const experiment = storage.experiments.getById(experimentId);
  if (!experiment) return null;
  const events = storage.events.getByExperimentId(experimentId);
  const byVariant = aggregateEventsByVariant(events);
  const variantKeys = (experiment.variants ?? []).map((v) => v.key);
  const variants = variantKeys.map((variantKey) => {
    const row = byVariant.get(variantKey) ?? { views: 0, clicks: 0, conversions: 0 };
    const conversionRate =
      row.views > 0 ? Math.round((row.conversions / row.views) * 10000) / 100 : 0;
    return {
      variantKey,
      views: row.views,
      clicks: row.clicks,
      conversions: row.conversions,
      conversionRate,
    };
  });
  const totals = variants.reduce(
    (acc, v) => ({
      views: acc.views + v.views,
      clicks: acc.clicks + v.clicks,
      conversions: acc.conversions + v.conversions,
    }),
    { views: 0, clicks: 0, conversions: 0 }
  );
  const overallConversionRate =
    totals.views > 0
      ? Math.round((totals.conversions / totals.views) * 10000) / 100
      : 0;
  return {
    experimentId,
    experimentName: experiment.name,
    variants,
    totals: { ...totals, conversionRate: overallConversionRate },
  };
}

module.exports = {
  getExperimentMetrics,
  aggregateEventsByVariant,
};
