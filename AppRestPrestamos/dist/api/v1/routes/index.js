"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _config = _interopRequireDefault(require("../../../config/config.js"));
var _prestamoRoutes = _interopRequireDefault(require("./prestamo.routes.js"));
var _clienteRoutes = _interopRequireDefault(require("./cliente.routes.js"));
var _userRoutes = _interopRequireDefault(require("./user.routes.js"));
var routerAPI = function routerAPI(app) {
  var router = (0, _express.Router)();
  var api = _config["default"].API_URL;
  app.use(api, router);
  router.use('/users', _userRoutes["default"]);
  router.use('/prestamos', _prestamoRoutes["default"]);
  router.use('/clientes', _clienteRoutes["default"]);
  return router;
};
var _default = exports["default"] = routerAPI;