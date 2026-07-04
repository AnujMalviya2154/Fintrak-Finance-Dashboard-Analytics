// Returns the [start, end] window for a named range. Each `start` is normalized to
// local midnight; `now.setDate(...)` is avoided because it mutates `now` in place.
const getDateRange = (range) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  let start;

  switch (range) {
    case "daily":
      start = new Date(y, m, d);
      break;
    case "weekly":
      // Start of the current week (Sunday) at midnight. Negative day-of-month
      // rolls back into the previous month correctly.
      start = new Date(y, m, d - now.getDay());
      break;
    case "monthly":
      start = new Date(y, m, 1);
      break;
    case "yearly":
      start = new Date(y, 0, 1);
      break;
    default:
      start = new Date(y, m, 1); // default: monthly
  }

  return { start, end: new Date() };
};

export default getDateRange;
