const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Service",
      version: "1.0.0",
      description: "A simple API for stock",
      contact: {
        name: "Gabriel Stimamiglio",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local server",
        },
      ],
    },
  },
  apis: ["./api/routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
