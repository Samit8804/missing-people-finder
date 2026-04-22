/**
 * asyncHandler — wraps async Express route handlers so any thrown error
 * is automatically passed to the next() error middleware.
 * Replaces 'express-async-errors' (incompatible with Node v23+).
 *
 * Usage:
 *   router.get('/route', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
