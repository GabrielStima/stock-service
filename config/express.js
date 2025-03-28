const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const consign = require("consign");
const cors = require("cors");
const helmet = require("helmet");

module.exports = () => {
  const app = express();

  app.set("port", process.env.PORT || config.get("server.port"));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(helmet());

  consign({ cwd: "api" }).then("controllers").then("routes").into(app);

  app.get("/status", (req, res) => res.send("Server is running!"));

  return app;
};
