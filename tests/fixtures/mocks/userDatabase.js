const { users } = require("../data/user");

const User = {
  findAll: jest.fn().mockResolvedValue(users),

  findByPk: jest.fn().mockImplementation((id) => {
    const user = users.find((p) => p.id === parseInt(id));
    return Promise.resolve(user || null);
  }),

  findOne: jest.fn().mockImplementation((query) => {
    const { where } = query;
    if (where && where.id) {
      const user = users.find((s) => s.id === parseInt(where.id));
      return Promise.resolve(user || null);
    }
    return Promise.resolve(null);
  }),

  create: jest.fn().mockImplementation((userData) => {
    const newUser = {
      id: Math.max(...users.map((p) => p.id)) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(newUser);
  }),

  update: jest.fn().mockImplementation((data, options) => {
    const id = options.where.id;
    const exists = users.some((p) => p.id === parseInt(id));

    return Promise.resolve([exists ? 1 : 0]);
  }),

  destroy: jest.fn().mockResolvedValue(1),
};

module.exports = {
  User,
};
