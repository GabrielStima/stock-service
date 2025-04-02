jest.mock("../../../db/models", () =>
  require("../../fixtures/mocks/productDatabase")
);
jest.mock("../../../api/validators/productValidator", () => ({
  createProduct: {
    validate: jest.fn().mockImplementation((data) => {
      // Basic validation mocking
      if (!data.name || !data.description || data.price === undefined) {
        return {
          error: {
            details: [{ message: "Validation error: Required fields missing" }],
          },
        };
      }
      if (data.name && data.name.length > 25) {
        return {
          error: {
            details: [{ message: "Validation error: Name too long" }],
          },
        };
      }
      if (data.price && typeof data.price !== "number") {
        return {
          error: {
            details: [{ message: "Validation error: Price must be a number" }],
          },
        };
      }
      return { value: data };
    }),
  },
  updateProduct: {
    validate: jest.fn().mockImplementation((data) => {
      // Similar validation but accepts partial data
      if (data.name && data.name.length > 25) {
        return {
          error: {
            details: [{ message: "Validation error: Name too long" }],
          },
        };
      }
      if (data.price !== undefined && typeof data.price !== "number") {
        return {
          error: {
            details: [{ message: "Validation error: Price must be a number" }],
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

const productController =
  require("../../../api/controllers/productController")();
const database = require("../../../db/models");
const productValidator = require("../../../api/validators/productValidator");
const {
  products,
  singleProduct,
  validProductData,
  updateProductData,
  partialUpdateData,
  invalidProductData,
} = require("../../fixtures/data/product");

describe("Product Controller", () => {
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

  describe("listProducts", () => {
    it("should return all products with status 200", async () => {
      await productController.listProducts(req, res);

      expect(database.Product.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });
  });

  describe("findProduct", () => {
    it("should return a product when given a valid ID", async () => {
      req.params.id = "1";

      await productController.findProduct(req, res);

      expect(database.Product.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(singleProduct);
    });

    it("should return 404 when product is not found", async () => {
      req.params.id = "999";
      database.Product.findByPk.mockResolvedValueOnce(null);

      await productController.findProduct(req, res);

      expect(database.Product.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Product not found");
    });
  });

  describe("createProduct", () => {
    it("should create a product with valid data", async () => {
      req.body = validProductData;

      await productController.createProduct(req, res);

      expect(productValidator.createProduct.validate).toHaveBeenCalledWith(
        validProductData
      );
      expect(database.Product.create).toHaveBeenCalledWith(validProductData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 400 when validation fails", async () => {
      req.body = invalidProductData.nameOnly;

      await productController.createProduct(req, res);

      expect(productValidator.createProduct.validate).toHaveBeenCalledWith(
        invalidProductData.nameOnly
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe("updateProduct", () => {
    it("should update a product with valid data", async () => {
      req.params.id = "1";
      req.body = updateProductData;

      await productController.updateProduct(req, res);

      expect(productValidator.updateProduct.validate).toHaveBeenCalledWith(
        updateProductData
      );
      expect(database.Product.update).toHaveBeenCalledWith(updateProductData, {
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Product updated successfully");
    });

    it("should allow partial updates", async () => {
      req.params.id = "1";
      req.body = partialUpdateData;

      await productController.updateProduct(req, res);

      expect(productValidator.updateProduct.validate).toHaveBeenCalledWith(
        partialUpdateData
      );
      expect(database.Product.update).toHaveBeenCalledWith(partialUpdateData, {
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when product does not exist", async () => {
      req.params.id = "999";
      req.body = updateProductData;
      database.Product.update.mockResolvedValueOnce([0]); // 0 rows affected

      await productController.updateProduct(req, res);

      expect(database.Product.update).toHaveBeenCalledWith(updateProductData, {
        where: { id: "999" },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Product not found");
    });

    it("should return 400 when validation fails", async () => {
      req.params.id = "1";
      req.body = invalidProductData.invalidPrice;

      await productController.updateProduct(req, res);

      expect(productValidator.updateProduct.validate).toHaveBeenCalledWith(
        invalidProductData.invalidPrice
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product and return 204", async () => {
      req.params.id = "1";

      await productController.deleteProduct(req, res);

      expect(database.Product.destroy).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith("");
    });
  });
});
