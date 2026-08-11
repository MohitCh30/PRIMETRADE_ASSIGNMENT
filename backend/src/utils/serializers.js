/**
 * Explicitly map a database/ORM user record to the fields that are safe to
 * expose over the API. This is the single place that decides what a "public"
 * user looks like — sensitive fields (password_hash, reset tokens, internal
 * auth secrets, etc.) are never copied across, by construction.
 */
const toSafeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
};

module.exports = { toSafeUser };
