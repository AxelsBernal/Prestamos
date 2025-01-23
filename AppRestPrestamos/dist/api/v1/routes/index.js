"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = require("express");
var _config = _interopRequireDefault(require("../../../config/config"));
var _prestamo = _interopRequireDefault(require("./prestamo.routes"));
var _cliente = _interopRequireDefault(require("./cliente.routes"));
var _user = _interopRequireDefault(require("./user.routes"));
// Importa las rutas de usuario

var routerAPI = function routerAPI(app) {
  var router = (0, _express.Router)();
  var api = _config["default"].API_URL; // '/api/v1'

  app.use(api, router);

  // Rutas para usuarios
  router.use('/users', _user["default"]);

  // Rutas para préstamos
  router.use('/prestamos', _prestamo["default"]);

  // Rutas para clientes
  router.use('/clientes', _cliente["default"]);
  return router;
};
module.exports = routerAPI;