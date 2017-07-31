'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var file_location = _path2.default.join('./', 'config.json');
var config = JSON.parse(_fs2.default.readFileSync(file_location, 'utf8'));
var config_key = ['DB_HOSTNAME', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'PORT', 'NODE_ENV'];

var this_module = {
    'DB_HOSTNAME': '',
    'DB_USER': '',
    'DB_PASSWORD': '',
    'DB_NAME': '',
    'PORT': '',
    'NODE_ENV': ''
};
(function () {
    for (var i = 0; i < config_key.length; i++) {
        if (config[config_key[i]]) this_module[config_key[i]] = config[config_key[i]];
    }

    if (process.env.DB) {
        this_module.DB_HOSTNAME = process.env.DB;
    }

    this_module.PORT = process.env.PORT || 4000;
    this_module.NODE_ENV = process.env.NODE_ENV || 'development';
})();

exports.default = this_module;