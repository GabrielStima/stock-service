const request = require("supertest");
const express = require("express");
const productRoutes = require("../../../api/routes/productRoutes");
const productController = require("../../../api/controllers/productController");

jest.mock("../../../db/models", () => ({
  Product: {
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: "Test Product",
        description: "Test Description",
        price: 100,
      },
    ]),
    findByPk: jest.fn().mockImplementation((id) => {
      if (id === "1") {
        return Promise.resolve({
          id: 1,
          name: "Test Product",
          description: "Test Description",
          price: 100,
        });
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: "New Product",
      description: "New Description",
      price: 200,
    }),
    update: jest.fn().mockImplementation((data, options) => {
      if (options.where.id === "999") {
        return Promise.resolve([0]);
      }
      return Promise.resolve([1]);
    }),
    destroy: jest.fn().mockResolvedValue(1),
  },
}));

const app = express();
app.use(express.json());
app.controllers = {
  productController: productController(app),
};
productRoutes(app);

describe("Product Routes", () => {
  describe("GET /api/v1/products", () => {
    it("should return 200 status code and list of products", async () => {
      const response = await request(app).get("/api/v1/products");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("description");
      expect(response.body[0]).toHaveProperty("price");
    });
  });

  describe("GET /api/v1/product/:id", () => {
    it("should return 200 status code and product details for valid id", async () => {
      const response = await request(app).get("/api/v1/product/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("name", "Test Product");
      expect(response.body).toHaveProperty("description", "Test Description");
      expect(response.body).toHaveProperty("price", 100);
    });

    it("should return 404 status code for non-existent product", async () => {
      const response = await request(app).get("/api/v1/product/999");

      expect(response.status).toBe(404);
      expect(response.text).toBe("Product not found");
    });
  });

  describe("POST /api/v1/product", () => {
    it("should return 201 status code and create product with valid data", async () => {
      const productData = {
        name: "New Product",
        description: "New Description",
        price: 200,
      };

      const response = await request(app)
        .post("/api/v1/product")
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(productData.name);
      expect(response.body.description).toBe(productData.description);
      expect(response.body.price).toBe(productData.price);
    });

    it("should return 400 status code for missing required fields", async () => {
      const response = await request(app).post("/api/v1/product").send({
        name: "New Product",
      });

      expect(response.status).toBe(400);
    });

    it("should return 400 status code for invalid price", async () => {
      const response = await request(app).post("/api/v1/product").send({
        name: "New Product",
        description: "New Description",
        price: "invalid",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("price");
    });
  });

  describe("PATCH /api/v1/product/:id", () => {
    it("should return 200 status code and update product with valid data", async () => {
      const updateData = {
        name: "Updated Product",
        description: "Updated Description",
        price: 300,
      };

      const response = await request(app)
        .patch("/api/v1/product/1")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.text).toBe("Product updated successfully");
    });

    it("should return 404 status code for non-existent product", async () => {
      const response = await request(app).patch("/api/v1/product/999").send({
        name: "Updated Product",
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe("Product not found");
    });

    it("should return 400 status code for invalid price", async () => {
      const response = await request(app).patch("/api/v1/product/1").send({
        price: "invalid",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("price");
    });
  });

  describe("DELETE /api/v1/product/:id", () => {
    it("should return 204 status code and delete product", async () => {
      const response = await request(app).delete("/api/v1/product/1");

      expect(response.status).toBe(204);
      expect(response.text).toBe("");
    });
  });
});
