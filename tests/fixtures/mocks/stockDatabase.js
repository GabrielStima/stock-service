const { stocks } = require("../data/stock");

const Stock = {
  findAll: jest.fn().mockResolvedValue(stocks),

  findByPk: jest.fn().mockImplementation((id) => {
    const stock = stocks.find((p) => p.id === parseInt(id));
    return Promise.resolve(stock || null);
  }),

  create: jest.fn().mockImplementation((stockData) => {
    const newStock = {
      id: Math.max(...stocks.map((p) => p.id)) + 1,
      ...stockData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(newStock);
  }),

  update: jest.fn().mockImplementation((data, options) => {
    const id = options.where.id;
    const exists = stocks.some((p) => p.id === parseInt(id));

    return Promise.resolve([exists ? 1 : 0]);
  }),

  destroy: jest.fn().mockResolvedValue(1),
};

module.exports = {
  Stock,
};
