const request = require("supertest");
const express = require("express");
const storeRoutes = require("../../../api/routes/storeRoutes");
const storeController = require("../../../api/controllers/storeController");

jest.mock("../../../db/models", () => ({
  Store: {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: "Test Store",
        address: "Test Address",
        owner_id: 1,
        User: {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@test.com",
          role_id: 1,
        },
      },
    ]),
    findOne: jest.fn().mockImplementation((options) => {
      if (options.where.id === "1") {
        return Promise.resolve({
          id: 1,
          name: "Test Store",
          address: "Test Address",
          owner_id: 1,
          User: {
            id: 1,
            first_name: "John",
            last_name: "Doe",
            email: "john@test.com",
            role_id: 1,
          },
        });
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: "Test Store",
      address: "Test Address",
      owner_id: 1,
    }),
    update: jest.fn().mockImplementation((data, options) => {
      if (options.where.id === "999") {
        return Promise.resolve([0]);
      }
      return Promise.resolve([1]);
    }),
    destroy: jest.fn().mockResolvedValue(1),
  },
  User: {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@test.com",
    role_id: 1,
  },
}));

const app = express();
app.use(express.json());
app.controllers = {
  storeController: storeController(app),
};
storeRoutes(app);

describe("Store Routes", () => {
  describe("GET /api/v1/stores", () => {
    it("should return 200 status code and list of stores with user details", async () => {
      const response = await request(app).get("/api/v1/stores");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("address");
      expect(response.body[0]).toHaveProperty("owner_id");
      expect(response.body[0]).toHaveProperty("User");
      expect(response.body[0].User).not.toHaveProperty("password");
    });
  });

  describe("GET /api/v1/store/:id", () => {
    it("should return 200 status code and store details for valid id", async () => {
      const response = await request(app).get("/api/v1/store/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("name", "Test Store");
      expect(response.body).toHaveProperty("address", "Test Address");
      expect(response.body).toHaveProperty("owner_id", 1);
      expect(response.body).toHaveProperty("User");
      expect(response.body.User).not.toHaveProperty("password");
    });

    it("should return 404 status code for non-existent store", async () => {
      const response = await request(app).get("/api/v1/store/999");

      expect(response.status).toBe(404);
      expect(response.text).toBe("Store not found");
    });
  });

  describe("POST /api/v1/store", () => {
    it("should return 201 status code and create store with valid data", async () => {
      const storeData = {
        name: "Test Store",
        address: "Test Address",
        owner_id: 1,
      };

      const response = await request(app).post("/api/v1/store").send(storeData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(storeData.name);
      expect(response.body.address).toBe(storeData.address);
      expect(response.body.owner_id).toBe(storeData.owner_id);
    });

    it("should return 400 status code for missing required fields", async () => {
      const response = await request(app).post("/api/v1/store").send({
        name: "New Store",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("address");
    });

    it("should return 400 status code for invalid name length", async () => {
      const response = await request(app).post("/api/v1/store").send({
        name: "This is a very long store name that exceeds the maximum length of 25 characters",
        address: "New Address",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("name");
    });

    it("should return 400 status code for invalid address length", async () => {
      const response = await request(app).post("/api/v1/store").send({
        name: "New Store",
        address:
          "This is a very long address that exceeds the maximum length of 255 characters. This is a very long address that exceeds the maximum length of 255 characters. This is a very long address that exceeds the maximum length of 255 characters. This is a very long address that exceeds the maximum length of 255 characters.",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("address");
    });
  });

  describe("PATCH /api/v1/store/:id", () => {
    it("should return 200 status code and update store with valid data", async () => {
      const updateData = {
        name: "Updated Store",
        address: "Updated Address",
        owner_id: 2,
      };

      const response = await request(app)
        .patch("/api/v1/store/1")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.text).toBe("Store updated successfully");
    });

    it("should return 404 status code for non-existent store", async () => {
      const response = await request(app).patch("/api/v1/store/999").send({
        name: "Updated Store",
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe("Store not found");
    });

    it("should return 400 status code for invalid name length", async () => {
      const response = await request(app).patch("/api/v1/store/1").send({
        name: "This is a very long store name that exceeds the maximum length of 25 characters",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("name");
    });

    it("should return 400 status code for invalid address length", async () => {
      const response = await request(app).patch("/api/v1/store/1").send({
        address:
          "This is a very long address that exceeds the maximum length of 255 characters. This is a very long address that exceeds the maximum length of 255 characters. This is a very long address that exceeds the maximum length of 255 characters. This is a very long address that exceeds the maximum length of 255 characters.",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("address");
    });
  });

  describe("DELETE /api/v1/store/:id", () => {
    it("should return 204 status code and delete store", async () => {
      const response = await request(app).delete("/api/v1/store/1");

      expect(response.status).toBe(204);
    });
  });
});
