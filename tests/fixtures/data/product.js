module.exports = {
  products: [
    {
      id: 1,
      name: "Keyboard",
      description: "Mechanical keyboard with RGB",
      price: 12999,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      name: "Mouse",
      description: "Wireless gaming mouse",
      price: 7999,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
  ],

  singleProduct: {
    id: 1,
    name: "Keyboard",
    description: "Mechanical keyboard with RGB",
    price: 12999,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },

  validProductData: {
    name: "Monitor",
    description: "27-inch 4K display",
    price: 29999,
  },

  updateProductData: {
    name: "Updated Keyboard",
    description: "Mechanical keyboard with custom keycaps",
    price: 14999,
  },

  partialUpdateData: {
    price: 11999,
  },

  invalidProductData: {
    nameOnly: {
      name: "Invalid Product",
    },
    invalidPrice: {
      name: "Budget Keyboard",
      description: "Cheap keyboard",
      price: "not-a-number",
    },
    longName: {
      name: "This name is too long and exceeds the maximum length of twenty-five characters",
      description: "Valid description",
      price: 5999,
    },
  },
};
