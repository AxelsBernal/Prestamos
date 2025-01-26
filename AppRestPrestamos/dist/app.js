"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cors = _interopRequireDefault(require("cors"));
var _config = _interopRequireDefault(require("./config/config.js"));
var _index = _interopRequireDefault(require("./api/v1/routes/index.js"));
var app = (0, _express["default"])();

// Configuración global de CORS
app.use((0, _cors["default"])({
  origin: 'https://prestamos-0104.web.app',
  // Frontend en Firebase Hosting
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares generales
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));

// Rutas principales
var api = _config["default"].API_URL;
app.get("".concat(api), function (req, res) {
  res.send("<h1>RESTful running in root</h1> <p>API documentation: <b>".concat(api, "/api-docs</b></p>"));
});

// Monta las rutas desde el archivo principal
(0, _index["default"])(app);
var _default = exports["default"] = app;