'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _configure = require('./configure');

var _configure2 = _interopRequireDefault(_configure);

var _modules = require('./modules');

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//server setting
var app = (0, _express2.default)();
var port = _configure2.default.PORT;

_modules.mysql.makeConnection({
    host: _configure2.default.DB_HOSTNAME,
    user: _configure2.default.DB_USER,
    password: _configure2.default.DB_PASSWORD,
    database: _configure2.default.DB_NAME
});

/*
배포판이 아니면 HTTP 접근 제어 (CORS)를 허용한다.
 */
if (_configure2.default.NODE_ENV !== 'production') app.use((0, _cors2.default)());

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.set('trust proxy', true);

//routes api
app.use('/api', _routes2.default);

//index 라우팅
app.get('/', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, './../public/index.html'));
});

//
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));

//
app.use(function (req, res) {
    res.status(404).send('NOT FOUND');
});

// Basic error handler
app.use(function (err, req, res, next) {
    console.error(err);
    // If our routes specified a specific response, then send that. Otherwise,
    // send a generic message so as not to leak anything.
    res.status(500).send(err.response || 'Something broke!');
});

app.listen(port, function () {
    console.log('SERVER PORT', port);
});