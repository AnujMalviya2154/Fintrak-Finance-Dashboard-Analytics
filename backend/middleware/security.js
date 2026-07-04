// Dependency-free security hardening. For multi-instance production you'd swap these
// for `helmet` (headers) and a Redis-backed `express-rate-limit` (so limits are shared
// across instances), but these cover the essentials for a single-instance API.

// Sensible default response headers.
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff'); // stop MIME sniffing
  res.setHeader('X-Frame-Options', 'DENY'); // clickjacking protection
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.removeHeader('X-Powered-By'); // don't advertise Express
  next();
};

// Fixed-window in-memory rate limiter, keyed by client IP.
export const createRateLimiter = ({
  windowMs,
  max,
  message = 'Too many requests, please try again later.',
}) => {
  const hits = new Map(); // ip -> { count, resetAt }

  const sweep = (now) => {
    for (const [ip, entry] of hits) if (now > entry.resetAt) hits.delete(ip);
  };

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      if (hits.size > 5000) sweep(now); // bound memory
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ success: false, message });
    }
    next();
  };
};
