const { products } = require("../data/product");

const Product = {
  findAll: jest.fn().mockResolvedValue(products),

  findByPk: jest.fn().mockImplementation((id) => {
    const product = products.find((p) => p.id === parseInt(id));
    return Promise.resolve(product || null);
  }),

  create: jest.fn().mockImplementation((productData) => {
    const newProduct = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(newProduct);
  }),

  update: jest.fn().mockImplementation((data, options) => {
    const id = options.where.id;
    const exists = products.some((p) => p.id === parseInt(id));
    // Return [1] if product exists (affected rows count), [0] if not found
    return Promise.resolve([exists ? 1 : 0]);
  }),

  destroy: jest.fn().mockResolvedValue(1), // 1 row affected
};

module.exports = {
  Product,
};
