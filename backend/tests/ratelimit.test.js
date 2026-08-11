jest.mock("../src/config/db", () => {
  const { pool } = require("./setup");
  return pool;
});

process.env.JWT_SECRET = "test-secret-key";
process.env.CORS_ORIGINS = "https://primetrade-assignment-three.vercel.app";
// Deliberately do NOT raise limits — we assert the default strict limits apply.

const request = require("supertest");
const app = require("../src/app");
const { resetState } = require("./setup");

beforeEach(() => {
  resetState();
});

describe("Auth endpoint rate limiting", () => {
  test("login endpoint returns 429 after the limit is exceeded", async () => {
    // Default limit: 5 per 15 minutes per IP
    let last;
    for (let i = 0; i < 6; i++) {
      last = await request(app).post("/api/v1/auth/login").send({
        email: "no-such-user@example.com",
        password: "wrong",
      });
    }
    expect(last.status).toBe(429);
    expect(last.body.message).toMatch(/Too many requests/);
  });

  test("register endpoint returns 429 after the limit is exceeded", async () => {
    // Default limit: 10 per hour per IP.  The login test above runs first and
    // exercises a separate path, so these repeated register calls are
    // dedicated to this bucket.
    const statuses = [];
    for (let i = 0; i < 11; i++) {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: `R${i}`,
        email: `rl${i}@example.com`,
        password: "Passw0rd!",
      });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 10).every((s) => s === 201)).toBe(true);
    expect(statuses[10]).toBe(429);
  });
});
