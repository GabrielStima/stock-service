const users = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    password: "hashed_password_1",
    role: "owner",
    store_id: 1,
    createdAt: "2024-03-31T00:00:00.000Z",
    updatedAt: "2024-03-31T00:00:00.000Z",
    Store: {
      id: 1,
      name: "Main Store",
      address: "123 Main Street",
    },
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    password: "hashed_password_2",
    role: "manager",
    store_id: 2,
    createdAt: "2024-03-31T00:00:00.000Z",
    updatedAt: "2024-03-31T00:00:00.000Z",
    Store: {
      id: 2,
      name: "Branch Store",
      address: "456 Branch Avenue",
    },
  },
];

const singleUser = users[0];

const validUserData = {
  first_name: "Alice",
  last_name: "Johnson",
  email: "alice.johnson@example.com",
  password: "securepass123",
  role: "employee",
  store_id: 1,
};

const updateUserData = {
  first_name: "John",
  last_name: "Doe Updated",
  email: "john.doe.updated@example.com",
  password: "newsecurepass123",
  role: "manager",
  store_id: 2,
};

const partialUpdateData = {
  last_name: "Doe Modified",
  email: "john.doe.modified@example.com",
};

const updatePasswordData = {
  password: "currentpass123",
  new_password: "newpass123456",
};

const invalidUserData = {
  first_name:
    "This is a very long first name that exceeds the maximum length of 25 characters",
  last_name:
    "This is a very long last name that exceeds the maximum length of 25 characters",
  email: "invalid-email",
  password: "short", // Too short
  role: "This is a very long role that exceeds the maximum length of 25 characters",
  store_id: "not-a-number",
};

module.exports = {
  users,
  singleUser,
  validUserData,
  updateUserData,
  partialUpdateData,
  updatePasswordData,
  invalidUserData,
};
