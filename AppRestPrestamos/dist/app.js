"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cors = _interopRequireDefault(require("cors"));
var _config = _interopRequireDefault(require("./config/config"));
var _database = require("./config/database.config");
var _index = _interopRequireDefault(require("./api/v1/routes/index"));
//FIC: imports Swagger
//FIC: imports Routes
//FIC: imports Middlewares
//FIC: Config para variables de entorno

//FIC: Declaramos la constante app igualandola a express
var app = (0, _express["default"])();

//FIC: Establece la conexion a la BD

//FIC: Settings
app.set('port', _config["default"].PORT);
//FIC: Middlewares generales
app.use((0, _cors["default"])());
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
//FIC: Routes
// Import Routes

var api = _config["default"].API_URL;
app.get("".concat(api), function (req, res) {
  res.send("<h1>RESTful running in root</h1> <p> Shipping: <b>".concat(api, "/api-docs</b> for more information.</p>"));
});
app.get('/DrFIC', function (req, res) {
  res.send("<h1>RESTful running in DrFIC</h1> <p> Shipping: <b>".concat(api, "/api-docs</b> for more information.</p>"));
});
// Routes
// Swagger Docs
// Middleware para el manejo de errores
// Routes

(0, _index["default"])(app);

// Export App
var _default = exports["default"] = app;