jest.mock("../../../db/models", () => require("../../mocks/userDatabase"));
jest.mock("../../../api/validators/userValidator", () => ({
  createUser: {
    validate: jest.fn().mockImplementation((data) => {
      if (
        !data.first_name ||
        !data.last_name ||
        !data.email ||
        !data.password ||
        !data.role_id
      ) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: first_name, last_name, email, password, and role are required",
              },
            ],
          },
        };
      }
      if (data.first_name.length > 25) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: first_name must be less than or equal to 25 characters",
              },
            ],
          },
        };
      }
      if (data.last_name.length > 25) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: last_name must be less than or equal to 25 characters",
              },
            ],
          },
        };
      }
      if (
        data.role_id !== undefined &&
        (typeof data.role_id !== "number" || !Number.isInteger(data.role_id))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: role_id must be an integer" },
            ],
          },
        };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          error: {
            details: [
              { message: "Validation error: email must be a valid email" },
            ],
          },
        };
      }
      if (data.password.length < 8 || data.password.length > 16) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: password must be between 8 and 16 characters",
              },
            ],
          },
        };
      }
      if (
        data.store_id !== undefined &&
        (typeof data.store_id !== "number" || !Number.isInteger(data.store_id))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: store_id must be an integer" },
            ],
          },
        };
      }
      return { value: data };
    }),
  },
  updateUser: {
    validate: jest.fn().mockImplementation((data) => {
      if (data.first_name !== undefined && data.first_name.length > 25) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: first_name must be less than or equal to 25 characters",
              },
            ],
          },
        };
      }
      if (data.last_name !== undefined && data.last_name.length > 25) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: last_name must be less than or equal to 25 characters",
              },
            ],
          },
        };
      }
      if (
        data.role_id !== undefined &&
        (typeof data.role_id !== "number" || !Number.isInteger(data.role_id))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: role_id must be an integer" },
            ],
          },
        };
      }
      if (data.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return {
            error: {
              details: [
                { message: "Validation error: email must be a valid email" },
              ],
            },
          };
        }
      }
      if (
        data.password !== undefined &&
        (data.password.length < 8 || data.password.length > 16)
      ) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: password must be between 8 and 16 characters",
              },
            ],
          },
        };
      }
      if (
        data.store_id !== undefined &&
        (typeof data.store_id !== "number" || !Number.isInteger(data.store_id))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: store_id must be an integer" },
            ],
          },
        };
      }
      return { value: data };
    }),
  },
}));
jest.mock("config", () => ({
  get: jest.fn().mockReturnValue("test-secret"),
}));

const userController = require("../../../api/controllers/userController")();
const database = require("../../../db/models");
const userValidator = require("../../../api/validators/userValidator");
const {
  users,
  singleUser,
  validUserData,
  updateUserData,
  partialUpdateData,
  updatePasswordData,
  invalidUserData,
} = require("../../data/user");

describe("User Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("listUsers", () => {
    it("should return all users", async () => {
      await userController.listUsers(req, res);

      expect(database.User.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe("findUser", () => {
    it("should return a user when given a valid ID", async () => {
      req.params.id = "1";

      await userController.findUser(req, res);

      expect(database.User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(singleUser);
    });

    it("should return 404 when user is not found", async () => {
      req.params.id = "999";
      database.User.findOne.mockResolvedValueOnce(null);

      await userController.findUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("User not found");
    });
  });

  describe("createUser", () => {
    it("should create a new user with valid data", async () => {
      req.body = validUserData;

      await userController.createUser(req, res);

      expect(userValidator.createUser.validate).toHaveBeenCalledWith(
        validUserData
      );
      expect(database.User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 400 when validation fails", async () => {
      req.body = invalidUserData;

      await userController.createUser(req, res);

      expect(userValidator.createUser.validate).toHaveBeenCalledWith(
        invalidUserData
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });

  describe("updateUser", () => {
    it("should update a user with valid data", async () => {
      req.params.id = "1";
      req.body = updateUserData;

      await userController.updateUser(req, res);

      expect(userValidator.updateUser.validate).toHaveBeenCalledWith(
        updateUserData
      );
      expect(database.User.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("User updated successfully");
    });

    it("should allow partial updates", async () => {
      req.params.id = "1";
      req.body = partialUpdateData;

      await userController.updateUser(req, res);

      expect(userValidator.updateUser.validate).toHaveBeenCalledWith(
        partialUpdateData
      );
      expect(database.User.update).toHaveBeenCalledWith(partialUpdateData, {
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when store does not exist", async () => {
      req.params.id = "999";
      req.body = updateUserData;
      database.User.update.mockResolvedValueOnce([0]);

      await userController.updateUser(req, res);

      expect(database.User.update).toHaveBeenCalledWith(updateUserData, {
        where: { id: "999" },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("User not found");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user with valid data", async () => {
      req.params.id = "1";

      await userController.deleteUser(req, res);

      expect(database.User.destroy).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
