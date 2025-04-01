const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Service API",
      version: "1.0.0",
      description:
        "A RESTful API for inventory and stock management across multiple stores",
      contact: {
        name: "Gabriel Stimamiglio",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Unauthorized",
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "The requested resource was not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Resource not found",
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Field is required",
                  },
                },
              },
            },
          },
        },
      },
      schemas: {
        Stock: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            product_id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            store_id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            quantity: {
              type: "integer",
              example: 100,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            name: {
              type: "string",
              example: "Widget",
            },
            description: {
              type: "string",
              example: "A high quality widget",
            },
            price: {
              type: "number",
              format: "float",
              example: 19.99,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
          },
        },
        Store: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            name: {
              type: "string",
              example: "Downtown Store",
            },
            address: {
              type: "string",
              example: "123 Main St, Anytown, USA",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "manager", "employee"],
              example: "manager",
            },
            store_id: {
              type: "integer",
              format: "int64",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
          },
        },
      },
    },
    paths: {},
  },
  apis: ["./api/routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
