const stores = [
  {
    id: 1,
    name: "Main Store",
    address: "123 Main Street, City Center",
    owner_id: 1,
    createdAt: "2024-03-31T00:00:00.000Z",
    updatedAt: "2024-03-31T00:00:00.000Z",
    User: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "owner",
    },
  },
  {
    id: 2,
    name: "Branch Store",
    address: "456 Branch Avenue, Suburb",
    owner_id: 2,
    createdAt: "2024-03-31T00:00:00.000Z",
    updatedAt: "2024-03-31T00:00:00.000Z",
    User: {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "owner",
    },
  },
];

const singleStore = stores[0];

const validStoreData = {
  name: "New Store",
  address: "789 New Street, Downtown",
  owner_id: 3,
};

const updateStoreData = {
  name: "Updated Store",
  address: "321 Update Road, Uptown",
  owner_id: 1,
};

const partialUpdateData = {
  address: "999 Partial Street, Midtown",
};

const invalidStoreData = {
  name: "This is a very long store name that exceeds the maximum length of 25 characters",
  address: "Invalid Address",
  owner_id: "not-a-number",
};

module.exports = {
  stores,
  singleStore,
  validStoreData,
  updateStoreData,
  partialUpdateData,
  invalidStoreData,
};
