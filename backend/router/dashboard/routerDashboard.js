const Router = require("express").Router();
const dashController = require("../../controllers/dashboard/controllerDashboard");

Router.get("/", dashController.clienteConMasCitas);

module.exports = Router;
