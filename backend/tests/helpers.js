const request = require("supertest");
const { state, resetState } = require("./setup");

const registerUser = async (app, overrides = {}) => {
  const idx = state.userSeq + 1;
  const body = {
    name: overrides.name || `User ${idx}`,
    email: overrides.email || `user${Date.now()}_${Math.random()}@example.com`,
    password: overrides.password || "Passw0rd!",
  };
  const res = await request(app).post("/api/v1/auth/register").send(body);
  return { res, body, user: res.body.user, token: res.body.token };
};

const createTask = async (app, token, overrides = {}) => {
  const res = await request(app)
    .post("/api/v1/tasks")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: overrides.title || "My task",
      description: overrides.description || "Do the thing",
      ...overrides.extra,
    });
  return { res, task: res.body };
};

module.exports = { registerUser, createTask, resetState };
