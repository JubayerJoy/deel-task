const express = require("express");
const swaggerUi = require("swagger-ui-express");

const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { authenticateUser } = require("./middleware/authentication");
const routes = require("./routes");
const swaggerDocument = require("../docs/swagger.json");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(authenticateUser);
app.use(routes);

module.exports = app;
