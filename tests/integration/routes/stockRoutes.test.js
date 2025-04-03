const request = require("supertest");
const express = require("express");
const stockRoutes = require("../../../api/routes/stockRoutes");
const stockController = require("../../../api/controllers/stockController");

jest.mock("../../../db/models", () => ({
  Stock: {
    findAll: jest.fn().mockImplementation((options) => {
      if (options.include) {
        return Promise.resolve([
          {
            id: 1,
            product_id: 1,
            store_id: 1,
            quantity: 10,
            Product: {
              id: 1,
              name: "Test Product",
              description: "Test Description",
              price: 100,
            },
            Store: {
              id: 1,
              name: "Test Store",
              address: "Test Address",
            },
          },
        ]);
      }
      if (options.where) {
        if (options.where.product_id) {
          return Promise.resolve([
            {
              id: 1,
              product_id: 1,
              store_id: 1,
              quantity: 10,
            },
          ]);
        }
        if (options.where.store_id) {
          return Promise.resolve([
            {
              id: 1,
              product_id: 1,
              store_id: 1,
              quantity: 10,
            },
          ]);
        }
      }
      return Promise.resolve([]);
    }),
    findByPk: jest.fn().mockImplementation((id) => {
      if (id === "1") {
        return Promise.resolve({
          id: 1,
          product_id: 1,
          store_id: 1,
          quantity: 10,
        });
      }
      return Promise.resolve(null);
    }),
    create: jest.fn().mockResolvedValue({
      id: 1,
      product_id: 1,
      store_id: 1,
      quantity: 10,
    }),
    update: jest.fn().mockImplementation((data, options) => {
      if (options.where.id === "999") {
        return Promise.resolve([0]);
      }
      return Promise.resolve([1]);
    }),
    destroy: jest.fn().mockResolvedValue(1),
  },
  Product: {
    id: 1,
    name: "Test Product",
    description: "Test Description",
    price: 100,
  },
  Store: {
    id: 1,
    name: "Test Store",
    address: "Test Address",
  },
}));

const app = express();
app.use(express.json());
app.controllers = {
  stockController: stockController(app),
};
stockRoutes(app);

describe("Stock Routes", () => {
  describe("GET /api/v1/stocks", () => {
    it("should return 200 status code and list of stocks with product and store details", async () => {
      const response = await request(app).get("/api/v1/stocks");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("product_id");
      expect(response.body[0]).toHaveProperty("store_id");
      expect(response.body[0]).toHaveProperty("quantity");
      expect(response.body[0]).toHaveProperty("Product");
      expect(response.body[0]).toHaveProperty("Store");
    });
  });

  describe("GET /api/v1/stocks/product/:product_id", () => {
    it("should return 200 status code and list of stocks for a specific product", async () => {
      const response = await request(app).get("/api/v1/stocks/product/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("product_id", 1);
      expect(response.body[0]).toHaveProperty("store_id");
      expect(response.body[0]).toHaveProperty("quantity");
    });
  });

  describe("GET /api/v1/stocks/store/:store_id", () => {
    it("should return 200 status code and list of stocks for a specific store", async () => {
      const response = await request(app).get("/api/v1/stocks/store/1");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("product_id");
      expect(response.body[0]).toHaveProperty("store_id", 1);
      expect(response.body[0]).toHaveProperty("quantity");
    });
  });

  describe("GET /api/v1/stock/:id", () => {
    it("should return 200 status code and stock details for valid id", async () => {
      const response = await request(app).get("/api/v1/stock/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("product_id", 1);
      expect(response.body).toHaveProperty("store_id", 1);
      expect(response.body).toHaveProperty("quantity", 10);
    });

    it("should return 404 status code for non-existent stock", async () => {
      const response = await request(app).get("/api/v1/stock/999");

      expect(response.status).toBe(404);
      expect(response.text).toBe("Stock not found");
    });
  });

  describe("POST /api/v1/stock", () => {
    it("should return 201 status code and create stock with valid data", async () => {
      const stockData = {
        product_id: 1,
        store_id: 1,
        quantity: 10,
      };

      const response = await request(app).post("/api/v1/stock").send(stockData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.product_id).toBe(stockData.product_id);
      expect(response.body.store_id).toBe(stockData.store_id);
      expect(response.body.quantity).toBe(stockData.quantity);
    });

    it("should return 400 status code for missing required fields", async () => {
      const response = await request(app).post("/api/v1/stock").send({
        product_id: 1,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("quantity");
    });

    it("should return 400 status code for invalid quantity", async () => {
      const response = await request(app).post("/api/v1/stock").send({
        product_id: 1,
        store_id: 1,
        quantity: "invalid",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("quantity");
    });
  });

  describe("PATCH /api/v1/stock/:id", () => {
    it("should return 200 status code and update stock with valid data", async () => {
      const updateData = {
        product_id: 1,
        store_id: 1,
        quantity: 20,
      };

      const response = await request(app)
        .patch("/api/v1/stock/1")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.text).toBe("Stock updated successfully");
    });

    it("should return 404 status code for non-existent stock", async () => {
      const response = await request(app).patch("/api/v1/stock/999").send({
        quantity: 20,
      });

      expect(response.status).toBe(404);
      expect(response.text).toBe("Stock not found");
    });

    it("should return 400 status code for invalid quantity", async () => {
      const response = await request(app).patch("/api/v1/stock/1").send({
        quantity: "invalid",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("quantity");
    });
  });

  describe("DELETE /api/v1/stock/:id", () => {
    it("should return 204 status code and delete stock", async () => {
      const response = await request(app).delete("/api/v1/stock/1");

      expect(response.status).toBe(204);
    });
  });
});
