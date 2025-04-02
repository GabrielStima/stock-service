const stocks = [
  {
    id: 1,
    product_id: 1,
    store_id: 1,
    quantity: 10,
    createdAt: "2024-03-31T00:00:00.000Z",
    updatedAt: "2024-03-31T00:00:00.000Z",
    Product: {
      id: 1,
      name: "Keyboard",
      description: "Mechanical keyboard",
      price: 100,
    },
    Store: {
      id: 1,
      name: "Main Store",
      address: "123 Main St",
    },
  },
  {
    id: 2,
    product_id: 2,
    store_id: 1,
    quantity: 15,
    createdAt: "2024-03-31T00:00:00.000Z",
    updatedAt: "2024-03-31T00:00:00.000Z",
    Product: {
      id: 2,
      name: "Mouse",
      description: "Wireless mouse",
      price: 50,
    },
    Store: {
      id: 1,
      name: "Main Store",
      address: "123 Main St",
    },
  },
];

const singleStock = stocks[0];

const validStockData = {
  product_id: 3,
  store_id: 1,
  quantity: 20,
};

const updateStockData = {
  product_id: 1,
  store_id: 2,
  quantity: 25,
};

const partialUpdateData = {
  quantity: 30,
};

const invalidStockData = {
  product_id: "invalid",
  store_id: "invalid",
  quantity: "invalid",
};

module.exports = {
  stocks,
  singleStock,
  validStockData,
  updateStockData,
  partialUpdateData,
  invalidStockData,
};
