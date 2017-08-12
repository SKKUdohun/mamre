'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = void 0;

function makeConnection(params) {
    var connectionInfo = void 0;
    var connection = void 0;

    if (params['uri']) connectionInfo = params.uri;else {
        var properties = ['host', 'user', 'password', 'database'];

        var p = [];
        for (var i in params) {
            p.push(i);
        }
        var _loop = function _loop(_i) {
            if (!p.find(function (o) {
                return o === _i;
            })) throw new Error('DB 입력 정보가 잘못되었습니다. - ' + _i);
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _i = _step.value;

                _loop(_i);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        connectionInfo = params;
    }

    connection = _mysql2.default.createPool(connectionInfo);

    /*connection.connect((err) => {
        if(err) {
            console.log('error when connecting to db :', err);
            setTimeout(()=>{makeConnection(params)}, 2000);
        }
    });
    */
    /*
    connection.on('error', (err) => {
        if(err.code === 'PROTOCOL_CONNECTION_LOST')
          else{
            throw err;
        }
    });
    */

    conn = connection;
}

function getConnection() {
    return conn;
}

exports.default = {
    makeConnection: makeConnection,
    getConnection: getConnection
};