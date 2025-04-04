module.exports = {
  validCredentials: {
    email: "test@example.com",
    password: "password123",
  },

  invalidCredentials: {
    wrongEmail: {
      email: "nonexistent@example.com",
      password: "password123",
    },
    wrongPassword: {
      email: "test@example.com",
      password: "wrongpassword",
    },
    emptyEmail: {
      email: "",
      password: "password123",
    },
    emptyPassword: {
      email: "test@example.com",
      password: "",
    },
    invalidEmailFormat: {
      email: "notanemail",
      password: "password123",
    },
    shortPassword: {
      email: "test@example.com",
      password: "short",
    },
  },

  mockUser: {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    password: "$2b$10$X/XZCh3VdBL.P8D.86B7O.D9D7/uPGJ/Z/CFTnUOl0tdQxFwm1R.u",
    role: "manager",
    store_id: 1,
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },

  tokens: {
    valid:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjgwMDAwMDAwLCJleHAiOjE2ODAwMDM2MDB9.Crs2soDP5wT7VzMY7L6P6qVOUS6qG2viEQiFCeeUfzI",
    expired:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTgwMDAwMDAwLCJleHAiOjE1ODAwMDM2MDB9.8M4nCRGbzBNhWXHHarFJ3d6gVewdYjiBw15mzQZ6pxg",
    malformed:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva",
  },
};
