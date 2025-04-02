const request = require("supertest");
const express = require("express");
const hasAuth = require("../../../api/middlewares/hasAuth");
const authentication = require("../../../api/utils/authentication");

jest.mock("../../../api/utils/authentication");
jest.mock("config", () => ({
  get: jest.fn().mockReturnValue("test-secret"),
}));

describe("HasAuth Middleware", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(hasAuth);
    app.get("/api/v1/test", (req, res) => res.status(200).send("Success"));
    app.post("/api/v1/auth/login", (req, res) =>
      res.status(200).send("Login Success")
    );
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should allow access to login endpoint without token", async () => {
      const response = await request(app).post("/api/v1/auth/login").send();

      expect(response.status).toBe(200);
      expect(response.text).toBe("Login Success");
      expect(authentication.validateToken).not.toHaveBeenCalled();
    });

    it("should allow access with valid token", async () => {
      authentication.validateToken.mockReturnValue(true);

      const response = await request(app)
        .get("/api/v1/test")
        .set("Authorization", "valid-token");

      expect(response.status).toBe(200);
      expect(response.text).toBe("Success");
      expect(authentication.validateToken).toHaveBeenCalledWith("valid-token");
    });

    it("should deny access with invalid token", async () => {
      authentication.validateToken.mockReturnValue(false);

      const response = await request(app)
        .get("/api/v1/test")
        .set("Authorization", "invalid-token");

      expect(response.status).toBe(401);
      expect(response.text).toBe("Unauthorized");
      expect(authentication.validateToken).toHaveBeenCalledWith(
        "invalid-token"
      );
    });

    it("should deny access with empty token", async () => {
      const response = await request(app)
        .get("/api/v1/test")
        .set("Authorization", "")
        .send();

      expect(response.status).toBe(401);
      expect(response.text).toBe("Unauthorized");
      expect(authentication.validateToken).toHaveBeenCalledWith("");
    });

    it("should deny access with null token", async () => {
      const response = await request(app)
        .get("/api/v1/test")
        .set("Authorization", null)
        .send();

      expect(response.status).toBe(401);
      expect(response.text).toBe("Unauthorized");
      expect(authentication.validateToken).toHaveBeenCalledWith("null");
    });
  });
});
