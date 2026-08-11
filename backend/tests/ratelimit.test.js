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
  test("login endpoint allows the first 5 then returns 429", async () => {
    // Default limit: 5 per 15 minutes per IP
    const statuses = [];
    for (let i = 0; i < 6; i++) {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "no-such-user@example.com",
        password: "wrong",
      });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 5)).toEqual([401, 401, 401, 401, 401]);
    expect(statuses[5]).toBe(429);
  });

  test("login 429 response carries the expected message", async () => {
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

  test("register endpoint allows the first 3 then returns 429", async () => {
    // Default limit: 3 per hour per IP.  The login test above runs first and
    // exercises a separate path, so these repeated register calls are
    // dedicated to this bucket.
    const statuses = [];
    for (let i = 0; i < 4; i++) {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: `R${i}`,
        email: `rl${i}@example.com`,
        password: "Passw0rd!",
      });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 3)).toEqual([201, 201, 201]);
    expect(statuses[3]).toBe(429);
    expect(statuses[3]).not.toBe(201);
  });

  test("register 429 response carries the expected message", async () => {
    let last;
    for (let i = 0; i < 4; i++) {
      last = await request(app).post("/api/v1/auth/register").send({
        name: `R${i}`,
        email: `rlx${i}@example.com`,
        password: "Passw0rd!",
      });
    }
    expect(last.status).toBe(429);
    expect(last.body.message).toMatch(/Too many requests/);
  });
});
