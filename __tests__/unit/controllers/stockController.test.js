jest.mock("../../../db/models", () => require("../../mocks/stockDatabase"));
jest.mock("../../../api/validators/stockValidator", () => ({
  createStock: {
    validate: jest.fn().mockImplementation((data) => {
      // Validate required fields
      if (!data.product_id || !data.quantity) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: product_id and quantity are required",
              },
            ],
          },
        };
      }

      if (
        typeof data.product_id !== "number" ||
        !Number.isInteger(data.product_id)
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: product_id must be an integer" },
            ],
          },
        };
      }
      if (
        typeof data.quantity !== "number" ||
        !Number.isInteger(data.quantity)
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: quantity must be an integer" },
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
  updateStock: {
    validate: jest.fn().mockImplementation((data) => {
      if (
        data.product_id !== undefined &&
        (typeof data.product_id !== "number" ||
          !Number.isInteger(data.product_id))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: product_id must be an integer" },
            ],
          },
        };
      }
      if (
        data.quantity !== undefined &&
        (typeof data.quantity !== "number" || !Number.isInteger(data.quantity))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: quantity must be an integer" },
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

const stockController = require("../../../api/controllers/stockController")();
const database = require("../../../db/models");
const stockValidator = require("../../../api/validators/stockValidator");
const {
  stocks,
  singleStock,
  validStockData,
  updateStockData,
  partialUpdateData,
  invalidStockData,
} = require("../../data/stock");

describe("Stock Controller", () => {
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

  describe("listStocks", () => {
    it("should return all stocks with status 200", async () => {
      await stockController.listStocks(req, res);

      expect(database.Stock.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(stocks);
    });
  });

  describe("findStock", () => {
    it("should return a stock when given a valid ID", async () => {
      req.params.id = "1";

      await stockController.findStock(req, res);

      expect(database.Stock.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(singleStock);
    });

    it("should return 404 when stock is not found", async () => {
      req.params.id = "999";
      database.Stock.findByPk.mockResolvedValueOnce(null);

      await stockController.findStock(req, res);

      expect(database.Stock.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Stock not found");
    });
  });

  describe("createStock", () => {
    it("should create a stock with valid data", async () => {
      req.body = validStockData;

      await stockController.createStock(req, res);

      expect(stockValidator.createStock.validate).toHaveBeenCalledWith(
        validStockData
      );
      expect(database.Stock.create).toHaveBeenCalledWith(validStockData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 400 when validation fails", async () => {
      req.body = invalidStockData;

      await stockController.createStock(req, res);

      expect(stockValidator.createStock.validate).toHaveBeenCalledWith(
        invalidStockData
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });

  describe("updateStock", () => {
    it("should update a stock with valid data", async () => {
      req.params.id = "1";
      req.body = updateStockData;

      await stockController.updateStock(req, res);

      expect(stockValidator.updateStock.validate).toHaveBeenCalledWith(
        updateStockData
      );
      expect(database.Stock.update).toHaveBeenCalledWith(updateStockData, {
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Stock updated successfully");
    });

    it("should allow partial updates", async () => {
      req.params.id = "1";
      req.body = partialUpdateData;

      await stockController.updateStock(req, res);

      expect(stockValidator.updateStock.validate).toHaveBeenCalledWith(
        partialUpdateData
      );
      expect(database.Stock.update).toHaveBeenCalledWith(partialUpdateData, {
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when stock does not exist", async () => {
      req.params.id = "999";
      req.body = updateStockData;
      database.Stock.update.mockResolvedValueOnce([0]);

      await stockController.updateStock(req, res);

      expect(database.Stock.update).toHaveBeenCalledWith(updateStockData, {
        where: { id: "999" },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Stock not found");
    });
  });

  describe("deleteStock", () => {
    it("should delete a stock and return 204", async () => {
      req.params.id = "1";

      await stockController.deleteStock(req, res);

      expect(database.Stock.destroy).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith("Stock deleted successfully");
    });
  });
});
