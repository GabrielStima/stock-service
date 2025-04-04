jest.mock("../../../db/models", () => require("../../mocks/storeDatabase"));
jest.mock("../../../api/validators/storeValidator", () => ({
  createStore: {
    validate: jest.fn().mockImplementation((data) => {
      // Validate required fields
      if (!data.name || !data.address) {
        return {
          error: {
            details: [
              { message: "Validation error: name and address are required" },
            ],
          },
        };
      }
      // Validate string lengths
      if (data.name.length > 25) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: name must be less than or equal to 25 characters",
              },
            ],
          },
        };
      }
      if (data.address.length > 255) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: address must be less than or equal to 255 characters",
              },
            ],
          },
        };
      }
      // Validate owner_id if provided
      if (
        data.owner_id !== undefined &&
        (typeof data.owner_id !== "number" || !Number.isInteger(data.owner_id))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: owner_id must be an integer" },
            ],
          },
        };
      }
      return { value: data };
    }),
  },
  updateStore: {
    validate: jest.fn().mockImplementation((data) => {
      // Validate string lengths if provided
      if (data.name !== undefined && data.name.length > 25) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: name must be less than or equal to 25 characters",
              },
            ],
          },
        };
      }
      if (data.address !== undefined && data.address.length > 255) {
        return {
          error: {
            details: [
              {
                message:
                  "Validation error: address must be less than or equal to 255 characters",
              },
            ],
          },
        };
      }
      // Validate owner_id if provided
      if (
        data.owner_id !== undefined &&
        (typeof data.owner_id !== "number" || !Number.isInteger(data.owner_id))
      ) {
        return {
          error: {
            details: [
              { message: "Validation error: owner_id must be an integer" },
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

const storeController = require("../../../api/controllers/storeController")();
const database = require("../../../db/models");
const storeValidator = require("../../../api/validators/storeValidator");
const {
  stores,
  singleStore,
  validStoreData,
  updateStoreData,
  partialUpdateData,
  invalidStoreData,
} = require("../../data/store");

describe("Store Controller", () => {
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

  describe("listStores", () => {
    it("should return all stores with status 200", async () => {
      await storeController.listStores(req, res);

      expect(database.Store.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(stores);
    });
  });

  describe("findStore", () => {
    it("should return a store when given a valid ID", async () => {
      req.params.id = "1";

      await storeController.findStore(req, res);

      expect(database.Store.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(singleStore);
    });

    it("should return 404 when store is not found", async () => {
      req.params.id = "999";
      database.Store.findOne.mockResolvedValueOnce(null);

      await storeController.findStore(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Store not found");
    });
  });

  describe("createStore", () => {
    it("should create a store with valid data", async () => {
      req.body = validStoreData;

      await storeController.createStore(req, res);

      expect(storeValidator.createStore.validate).toHaveBeenCalledWith(
        validStoreData
      );
      expect(database.Store.create).toHaveBeenCalledWith(validStoreData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it("should return 400 when validation fails", async () => {
      req.body = invalidStoreData;

      await storeController.createStore(req, res);

      expect(storeValidator.createStore.validate).toHaveBeenCalledWith(
        invalidStoreData
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: expect.any(String),
      });
    });
  });

  describe("updateStore", () => {
    it("should update a store with valid data", async () => {
      req.params.id = "1";
      req.body = updateStoreData;

      await storeController.updateStore(req, res);

      expect(storeValidator.updateStore.validate).toHaveBeenCalledWith(
        updateStoreData
      );
      expect(database.Store.update).toHaveBeenCalledWith(updateStoreData, {
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Store updated successfully");
    });

    it("should allow partial updates", async () => {
      req.params.id = "1";
      req.body = partialUpdateData;

      await storeController.updateStore(req, res);

      expect(storeValidator.updateStore.validate).toHaveBeenCalledWith(
        partialUpdateData
      );
      expect(database.Store.update).toHaveBeenCalledWith(partialUpdateData, {
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when store does not exist", async () => {
      req.params.id = "999";
      req.body = updateStoreData;
      database.Store.update.mockResolvedValueOnce([0]);

      await storeController.updateStore(req, res);

      expect(database.Store.update).toHaveBeenCalledWith(updateStoreData, {
        where: { id: "999" },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Store not found");
    });
  });

  describe("deleteStore", () => {
    it("should delete a store and return 204", async () => {
      req.params.id = "1";

      await storeController.deleteStore(req, res);

      expect(database.Store.destroy).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
