const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { authenticateUser } = require("./middleware/authentication");
const routes = require("./routes");

const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

app.use(authenticateUser);
app.use(routes);

/**
 * FIX ME!
 * @returns contract by id
 */
// app.get("/contracts/:id", async (req, res) => {
//   const { Contract } = req.app.get("models");
//   const { id } = req.params;
//   const contract = await Contract.findOne({ where: { id } });
//   if (!contract) return res.status(404).end();
//   res.json(contract);
// });
module.exports = app;
