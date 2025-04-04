const { stores } = require("../data/store");

const Store = {
  findAll: jest.fn().mockResolvedValue(stores),

  findOne: jest.fn().mockImplementation((query) => {
    const { where } = query;
    if (where && where.id) {
      const store = stores.find((s) => s.id === parseInt(where.id));
      return Promise.resolve(store || null);
    }
    return Promise.resolve(null);
  }),

  create: jest.fn().mockImplementation((storeData) => {
    const newStore = {
      id: Math.max(...stores.map((p) => p.id)) + 1,
      ...storeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(newStore);
  }),

  update: jest.fn().mockImplementation((data, options) => {
    const id = options.where.id;
    const exists = stores.some((p) => p.id === parseInt(id));

    return Promise.resolve([exists ? 1 : 0]);
  }),

  destroy: jest.fn().mockResolvedValue(1),
};

module.exports = {
  Store,
};
