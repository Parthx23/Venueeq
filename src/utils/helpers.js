/**
 * Calculates the trend of queue growth
 * @param {Array} history - Array of headcounts
 * @returns {string} - 'rising', 'falling', or 'stable'
 */
export const calculateTrend = (history) => {
  if (!history || history.length < 2) return 'stable';
  const last = history[history.length - 1];
  const secondLast = history[history.length - 2];
  if (last > secondLast) return 'rising';
  if (last < secondLast) return 'falling';
  return 'stable';
};

/**
 * Formats duration in minutes to a human readable string
 */
export const formatDuration = (mins) => {
  if (mins < 1) return 'Immediate';
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
