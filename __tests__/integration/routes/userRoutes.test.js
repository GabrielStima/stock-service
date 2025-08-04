const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../api/routes/userRoutes");
const userController = require("../../../api/controllers/userController");

jest.mock("../../../db/models", () => ({
  User: {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        role_id: 1,
        store_id: 1,
        Store: {
          id: 1,
          name: "Main Store",
          address: "123 Main Street",
        },
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        role_id: 1,
        store_id: 2,
        Store: {
          id: 2,
          name: "Branch Store",
          address: "456 Branch Avenue",
        },
      },
    ]),
    findByPk: jest.fn().mockImplementation((id) => {
      if (id === "1") {
        return Promise.resolve({
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "hashed_password123",
          role_id: 1,
          store_id: 1,
          save: jest.fn().mockResolvedValue(true),
        });
      }
      return Promise.resolve(null);
    }),
    findOne: jest.fn().mockImplementation((query) => {
      const { where } = query;
      if (where && where.id) {
        if (where.id === "1") {
          return Promise.resolve({
            id: 1,
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            role_id: 1,
            store_id: 1,
            Store: {
              id: 1,
              name: "Main Store",
              address: "123 Main Street",
            },
          });
        }
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((userData) => {
      return Promise.resolve({
        id: 3,
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }),
    update: jest.fn().mockImplementation((data, options) => {
      const id = options.where.id;
      if (id === "999") {
        return Promise.resolve([0]);
      }
      return Promise.resolve([1]);
    }),
    destroy: jest.fn().mockResolvedValue(1),
  },
  Store: {
    id: 1,
    name: "Main Store",
    address: "123 Main Street",
  },
}));

jest.mock("../../../api/utils/cryptography", () => ({
  createHash: jest.fn().mockImplementation((password) => `hashed_${password}`),
  comparePass: jest.fn().mockImplementation((password, hashedPassword) => {
    if (password === "password123" && hashedPassword === "hashed_password123") {
      return Promise.resolve(true);
    }
    return Promise.resolve(password === "password123");
  }),
}));

const app = express();
app.use(express.json());
app.controllers = {
  userController: userController(app),
};
userRoutes(app);

describe("User Routes", () => {
  describe("GET /api/v1/users", () => {
    it("should return 200 status code and list of users with store details", async () => {
      const response = await request(app).get("/api/v1/users");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("first_name");
      expect(response.body[0]).toHaveProperty("last_name");
      expect(response.body[0]).toHaveProperty("email");
      expect(response.body[0]).toHaveProperty("role_id");
      expect(response.body[0]).toHaveProperty("store_id");
      expect(response.body[0]).toHaveProperty("Store");
      expect(response.body[0]).not.toHaveProperty("password");
    });
  });

  describe("GET /api/v1/users/:store_id", () => {
    it("should return 200 status code and list of users for a specific store", async () => {
      const response = await request(app).get("/api/v1/users/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("store_id", 1);
      expect(response.body[0]).toHaveProperty("Store");
      expect(response.body[0]).not.toHaveProperty("password");
    });
  });

  describe("GET /api/v1/user/:id", () => {
    it("should return 200 status code and user details for valid id", async () => {
      const response = await request(app).get("/api/v1/user/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("first_name", "John");
      expect(response.body).toHaveProperty("last_name", "Doe");
      expect(response.body).toHaveProperty("email", "john.doe@example.com");
      expect(response.body).toHaveProperty("role_id", 1);
      expect(response.body).toHaveProperty("store_id", 1);
      expect(response.body).toHaveProperty("Store");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 404 status code for non-existent user", async () => {
      const response = await request(app).get("/api/v1/user/999");

      expect(response.status).toBe(404);
      expect(response.text).toBe("User not found");
    });
  });

  describe("POST /api/v1/user", () => {
    it("should return 201 status code and create user with valid data", async () => {
      const userData = {
        first_name: "John",
        last_name: "Doe",
        email: "john@test.com",
        password: "password123",
        role_id: 1,
        store_id: 1,
      };

      const response = await request(app).post("/api/v1/user").send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.first_name).toBe(userData.first_name);
      expect(response.body.last_name).toBe(userData.last_name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.role_id).toBe(userData.role_id);
      expect(response.body.store_id).toBe(userData.store_id);
    });

    it("should return 400 status code for missing required fields", async () => {
      const response = await request(app).post("/api/v1/user").send({
        first_name: "Jane",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("last_name");
    });

    it("should return 400 status code for invalid email format", async () => {
      const response = await request(app).post("/api/v1/user").send({
        first_name: "Jane",
        last_name: "Doe",
        email: "invalid-email",
        password: "password123",
        role_id: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("email");
    });

    it("should return 400 status code for invalid password length", async () => {
      const response = await request(app).post("/api/v1/user").send({
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@test.com",
        password: "short",
        role_id: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("password");
    });
  });

  describe("PATCH /api/v1/user/:id", () => {
    it("should return 200 status code and update user with valid data", async () => {
      const updateData = {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@test.com",
        role_id: 1,
        store_id: 2,
      };

      const response = await request(app)
        .patch("/api/v1/user/1")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.text).toBe("User updated successfully");
    });

    it("should return 404 status code for non-existent user", async () => {
      const response = await request(app).patch("/api/v1/user/999").send({
        first_name: "Jane",
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe("User not found");
    });

    it("should return 400 status code for invalid email format", async () => {
      const response = await request(app).patch("/api/v1/user/1").send({
        email: "invalid-email",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("email");
    });

    it("should return 400 status code for invalid password length", async () => {
      const response = await request(app).patch("/api/v1/user/1").send({
        password: "short",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("password");
    });
  });

  describe("PATCH /api/v1/user/password/:id", () => {
    it("should return 200 status code and update user password with valid data", async () => {
      const passwordData = {
        password: "password123",
        new_password: "newpassword123",
      };

      const response = await request(app)
        .patch("/api/v1/user/password/1")
        .send(passwordData);

      expect(response.status).toBe(200);
      expect(response.text).toBe("Password updated successfully");
    });

    it("should return 404 status code for non-existent user", async () => {
      const response = await request(app)
        .patch("/api/v1/user/password/999")
        .send({
          password: "password123",
          new_password: "newpassword123",
        });

      expect(response.status).toBe(404);
      expect(response.text).toBe("User not found");
    });

    it("should return 400 status code for incorrect current password", async () => {
      const response = await request(app)
        .patch("/api/v1/user/password/1")
        .send({
          password: "wrongpassword",
          new_password: "newpassword123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("invalid data");
    });

    it("should return 400 status code for missing required fields", async () => {
      const response = await request(app)
        .patch("/api/v1/user/password/1")
        .send({
          password: "password123",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("new_password");
    });
  });

  describe("DELETE /api/v1/user/:id", () => {
    it("should return 204 status code and delete user", async () => {
      const response = await request(app).delete("/api/v1/user/1");

      expect(response.status).toBe(204);
    });
  });
});
