// Small input guards. Ensuring values are strings before they reach a Mongo query
// also closes the NoSQL-injection door (e.g. an `email` of { $gt: "" }).

export const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

// Coerce and validate a monetary amount → positive finite number, else null.
export const parseAmount = (v) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

// Parse a valid Date, else null.
export const parseDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Clamp pagination params to sane bounds so a client can't request the whole table.
export const parsePagination = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
};
