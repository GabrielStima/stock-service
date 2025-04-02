jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-token"),
  verify: jest.fn().mockImplementation((token) => {
    if (token === "valid-token") return { id: 1 };
    throw new Error("Invalid token");
  }),
}));

jest.mock("config", () => ({
  get: jest.fn().mockReturnValue("test-secret"),
}));

jest.mock("../../../db/models", () =>
  require("../../fixtures/mocks/authDatabase")
);
jest.mock("../../../api/utils/cryptography", () =>
  require("../../fixtures/mocks/cryptography")
);
jest.mock("../../../api/utils/authentication", () =>
  require("../../fixtures/mocks/authentication")
);

const authController = require("../../../api/controllers/authController")();
const jwt = require("jsonwebtoken");
const database = require("../../../db/models");
const cryptography = require("../../../api/utils/cryptography");
const authentication = require("../../../api/utils/authentication");
const {
  validCredentials,
  invalidCredentials,
  tokens,
} = require("../../fixtures/data/auth");

describe("Auth Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    process.env.SECRET = "test-secret";
  });

  describe("login", () => {
    it("should return a token when credentials are valid", async () => {
      req.body = validCredentials;

      await authController.login(req, res);

      expect(database.User.findOne).toHaveBeenCalledWith({
        where: { email: validCredentials.email },
      });
      expect(cryptography.comparePass).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, "test-secret", {
        expiresIn: "1h",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "login success",
        token: "mock-token",
      });
    });

    it("should return 400 when email is invalid", async () => {
      req.body = invalidCredentials.invalidEmailFormat;

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        })
      );
    });

    it("should return 400 when password is incorrect", async () => {
      req.body = invalidCredentials.wrongPassword;
      cryptography.comparePass.mockResolvedValueOnce(false);

      await authController.login(req, res);

      expect(cryptography.comparePass).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "invalid data",
      });
    });
  });

  describe("validateToken", () => {
    it("should return isValid true for a valid token", () => {
      req.headers["authorization"] = tokens.valid;
      authentication.verifyToken.mockReturnValueOnce(true);

      authController.validateToken(req, res);

      expect(authentication.verifyToken).toHaveBeenCalledWith(tokens.valid);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        isValid: true,
      });
    });

    it("should return 401 for an invalid token", () => {
      req.headers["authorization"] = tokens.expired;
      authentication.verifyToken.mockReturnValueOnce(false);

      authController.validateToken(req, res);

      expect(authentication.verifyToken).toHaveBeenCalledWith(tokens.expired);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        isValid: false,
      });
    });

    it("should return 400 when token is not provided", () => {
      req.headers["authorization"] = undefined;

      authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token not provided",
      });
    });
  });
});
