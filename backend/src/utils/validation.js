/**
 * Express middleware enforcing a strict request-body allowlist.
 *
 * Only the listed fields may be present in the JSON body. Any additional key
 * (user_id, role, is_admin, id, created_at, ...) causes the request to be
 * rejected with 400 *before* it reaches a controller — so client-supplied
 * fields can never silently influence ownership or privileges.
 */
const allowOnlyFields = (allowed) => (req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return next();
  }

  const extra = Object.keys(req.body).filter((k) => !allowed.includes(k));

  if (extra.length > 0) {
    return res.status(400).json({
      message: `Unexpected field(s): ${extra.join(", ")}`,
    });
  }

  next();
};

module.exports = { allowOnlyFields };

