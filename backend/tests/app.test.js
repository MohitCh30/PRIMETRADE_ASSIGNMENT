jest.mock("../src/config/db", () => {
  const { pool } = require("./setup");
  return pool;
});

process.env.JWT_SECRET = "test-secret-key";
process.env.CORS_ORIGINS = "https://primetrade-assignment-three.vercel.app";
// Integration suite makes many auth calls from one IP — disable the per-IP
// throttles. Rate limiting correctness itself is verified separately.
process.env.LOGIN_RATE_LIMIT_MAX = "100000";
process.env.REGISTER_RATE_LIMIT_MAX = "100000";

const request = require("supertest");
const app = require("../src/app");
const { state, resetState } = require("./setup");
const { registerUser, createTask } = require("./helpers");

beforeEach(() => {
  resetState();
});

describe("Health", () => {
  test("GET /api/v1/health returns OK", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});

describe("Object-level authorization on tasks (BOLA/IDOR)", () => {
  test("User A can read, update and delete their own task", async () => {
    const { token: tokenA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { task } = await createTask(app, tokenA, { title: "A's task" });

    const getRes = await request(app)
      .get(`/api/v1/tasks/${task.id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(task.id);
    expect(getRes.body.user_id).toBe(task.user_id);

    const putRes = await request(app)
      .put(`/api/v1/tasks/${task.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Updated title" });
    expect(putRes.status).toBe(200);
    expect(putRes.body.title).toBe("Updated title");

    const delRes = await request(app)
      .delete(`/api/v1/tasks/${task.id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(delRes.status).toBe(200);

    const afterRes = await request(app)
      .get(`/api/v1/tasks/${task.id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(afterRes.status).toBe(404);
  });

  test("User A cannot read User B's task by ID", async () => {
    const { token: tokenA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { token: tokenB } = await registerUser(app, {
      email: "b@example.com",
    });
    const { task: taskB } = await createTask(app, tokenB, {
      title: "B's private task",
    });

    const res = await request(app)
      .get(`/api/v1/tasks/${taskB.id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
  });

  test("User A cannot update User B's task", async () => {
    const { token: tokenA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { token: tokenB } = await registerUser(app, {
      email: "b@example.com",
    });
    const { task: taskB } = await createTask(app, tokenB, {
      title: "B's private task",
    });

    const res = await request(app)
      .put(`/api/v1/tasks/${taskB.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "HACKED", description: "cross-user write" });
    expect(res.status).toBe(404);

    // Confirm B's task is untouched
    const check = await request(app)
      .get(`/api/v1/tasks/${taskB.id}`)
      .set("Authorization", `Bearer ${tokenB}`);
    expect(check.body.title).toBe("B's private task");
  });

  test("User A cannot delete User B's task", async () => {
    const { token: tokenA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { token: tokenB } = await registerUser(app, {
      email: "b@example.com",
    });
    const { task: taskB } = await createTask(app, tokenB, {
      title: "B's private task",
    });

    const delRes = await request(app)
      .delete(`/api/v1/tasks/${taskB.id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(delRes.status).toBe(404);

    // Still exists for the real owner
    const check = await request(app)
      .get(`/api/v1/tasks/${taskB.id}`)
      .set("Authorization", `Bearer ${tokenB}`);
    expect(check.status).toBe(200);
  });

  test("GET /tasks only ever returns the caller's tasks", async () => {
    const { token: tokenA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { token: tokenB } = await registerUser(app, {
      email: "b@example.com",
    });
    await createTask(app, tokenA, { title: "A1" });
    await createTask(app, tokenA, { title: "A2" });
    await createTask(app, tokenB, { title: "B1" });

    const resA = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${tokenA}`);
    const resB = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(resA.body.map((t) => t.title).sort()).toEqual(["A1", "A2"]);
    expect(resB.body.map((t) => t.title)).toEqual(["B1"]);
  });
});

describe("Authentication & task edge cases", () => {
  test("unauthenticated requests are rejected", async () => {
    const res = await request(app).get("/api/v1/tasks");
    expect(res.status).toBe(401);
  });

  test("tampered / None-style tokens are rejected", async () => {
    const res = await request(app)
      .get("/api/v1/tasks")
      .set(
        "Authorization",
        // alg=none forged payload ("id":1)
        "Bearer eyJhbGciOiJub25lIn0.eyJpZCI6MX0."
      );
    expect(res.status).toBe(401);
  });

  test("nonexistent task ID returns 404, not 200/500", async () => {
    const { token } = await registerUser(app, { email: "a@example.com" });

    const putRes = await request(app)
      .put("/api/v1/tasks/99999")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "x" });
    expect(putRes.status).toBe(404);

    const delRes = await request(app)
      .delete("/api/v1/tasks/99999")
      .set("Authorization", `Bearer ${token}`);
    expect(delRes.status).toBe(404);

    const getRes = await request(app)
      .get("/api/v1/tasks/99999")
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });

  test("malformed task ID does not leak another user's task", async () => {
    const { token: tokenA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { token: tokenB } = await registerUser(app, {
      email: "b@example.com",
    });
    const { task: taskB } = await createTask(app, tokenB, {
      title: "B's private task",
    });

    for (const bogus of ["abc", "1;DROP TABLE tasks", "../1"]) {
      const res = await request(app)
        .get(`/api/v1/tasks/${encodeURIComponent(bogus)}`)
        .set("Authorization", `Bearer ${tokenA}`);
      expect([400, 404]).toContain(res.status);
    }
    // B's real task id is still inaccessible to A even when queried directly
    const res = await request(app)
      .get(`/api/v1/tasks/${taskB.id}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
  });
});

describe("Mass assignment / strict field handling", () => {
  test("client-supplied user_id on creation is ignored — owner is the authenticated user", async () => {
    const { token: tokenA, user: userA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { token: tokenB } = await registerUser(app, {
      email: "b@example.com",
    });
    const { task } = await createTask(app, tokenA, {
      title: "Owned by A",
      extra: { user_id: user_from(tokenB) },
    });
    expect(task.user_id).toBe(userA.id);
  });

  test("client-supplied user_id/role/id on update cannot move ownership", async () => {
    const { token: tokenA, user: userA } = await registerUser(app, {
      email: "a@example.com",
    });
    const { task } = await createTask(app, tokenA, { title: "A's task" });

    const res = await request(app)
      .put(`/api/v1/tasks/${task.id}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        title: "Renamed",
        user_id: 9999,
        role: "admin",
        id: 12345,
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Renamed");
    expect(res.body.user_id).toBe(userA.id);
    expect(res.body.id).toBe(task.id);

    // And the record itself is unchanged w.r.t. ownership
    expect(state.tasks.find((t) => t.id === task.id).user_id).toBe(userA.id);
  });

  test("client-supplied role on registration is ignored", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Sneaky",
        email: "sneaky@example.com",
        password: "Passw0rd!",
        role: "admin",
        is_admin: true,
      });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("user");
  });

  function user_from() {
    return 9999; // arbitrary foreign id
  }
});

describe("Sensitive data serialization", () => {
  test("register response does not leak password_hash", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "NoHash",
        email: "nohash@example.com",
        password: "Passw0rd!",
      });
    expect(res.status).toBe(201);
    expect(res.body.user.password_hash).toBeUndefined();
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.email).toBe("nohash@example.com");
    expect(res.body.token).toBeDefined();
  });

  test("login response does not leak password_hash", async () => {
    await registerUser(app, { email: "login@example.com" });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@example.com",
      password: "Passw0rd!",
    });
    expect(res.status).toBe(200);
    expect(res.body.user.password_hash).toBeUndefined();
    expect(res.body.user.email).toBe("login@example.com");

    // And the rest of the body doesn't accidentally embed the hash elsewhere
    expect(JSON.stringify(res.body)).not.toContain("$2b$");
  });
});

describe("Email normalization", () => {
  test("emails are normalized — duplicate case-variant registration is rejected", async () => {
    const first = await request(app).post("/api/v1/auth/register").send({
      name: "Case",
      email: "Case@Test.com",
      password: "Passw0rd!",
    });
    expect(first.status).toBe(201);
    expect(first.body.user.email).toBe("case@test.com");

    const second = await request(app).post("/api/v1/auth/register").send({
      name: "Case Again",
      email: "CASE@TEST.COM",
      password: "Passw0rd!",
    });
    expect(second.status).toBe(400);
  });

  test("login works regardless of email casing", async () => {
    await registerUser(app, {
      email: "MixedCase@Example.com",
      password: "Passw0rd!",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "mixedcase@example.com",
      password: "Passw0rd!",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("wrong password still rejected with generic message", async () => {
    await registerUser(app, {
      email: "someone@example.com",
      password: "Passw0rd!",
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "someone@example.com",
      password: "wrong-password",
    });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});

describe("CORS", () => {
  test("disallows a random origin on preflight", async () => {
    const res = await request(app)
      .options("/api/v1/tasks")
      .set("Origin", "https://evil.example.com")
      .set("Access-Control-Request-Method", "GET")
      .set("Access-Control-Request-Headers", "Authorization");
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  test("allows the configured frontend origin", async () => {
    const res = await request(app)
      .options("/api/v1/tasks")
      .set("Origin", "https://primetrade-assignment-three.vercel.app")
      .set("Access-Control-Request-Method", "GET")
      .set("Access-Control-Request-Headers", "Authorization");
    expect(res.headers["access-control-allow-origin"]).toBe(
      "https://primetrade-assignment-three.vercel.app"
    );
  });
});
