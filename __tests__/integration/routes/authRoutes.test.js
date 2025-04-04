const request = require("supertest");
const express = require("express");
const authRoutes = require("../../../api/routes/authRoutes");
const authController = require("../../../api/controllers/authController");

jest.mock("../../../db/models", () => ({
  User: {
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.email === "test@test.com") {
        return Promise.resolve({
          id: 1,
          email: "test@test.com",
          password: "$2b$10$test-hash", // This will be compared with "password123"
        });
      }
      return Promise.resolve(null);
    }),
  },
}));

jest.mock("../../../api/utils/cryptography", () => ({
  comparePass: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === "password123");
  }),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-token"),
  verify: jest.fn().mockImplementation((token) => {
    if (token === "valid-token") {
      return { id: 1 };
    }
    throw new Error("Invalid token");
  }),
}));

jest.mock("config", () => ({
  get: jest.fn().mockReturnValue("test-secret"),
}));

const app = express();
app.use(express.json());
app.controllers = {
  authController: authController(app),
};
authRoutes(app);

describe("Auth Routes", () => {
  describe("POST /api/v1/auth/login", () => {
    it("should return 200 status code and token on successful login", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("login success");
      expect(response.body.token).toBeDefined();
    });

    it("should return 400 status code for invalid email format", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "invalid-email",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("email");
    });

    it("should return 400 status code for password too short", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("password");
    });

    it("should return 400 status code for missing required fields", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("password");
    });

    it("should return 400 status code for invalid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@test.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("invalid data");
    });
  });

  describe("GET /api/v1/auth/validate", () => {
    it("should return 200 status code for valid token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/validate")
        .set("Authorization", "valid-token");

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
    });

    it("should return 400 status code when token is not provided", async () => {
      const response = await request(app).get("/api/v1/auth/validate");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Token not provided");
    });

    it("should return 401 status code for invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/validate")
        .set("Authorization", "invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.isValid).toBe(false);
    });
  });
});
