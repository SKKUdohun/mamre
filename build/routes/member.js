'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _modules = require('../modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var conn = _modules.mysql.getConnection;

// 번호 입력후 가입 or 포인트 적립
router.post('/save', function (req, res) {
    console.log('a');
    var phone = req.body.phone;
    var yesno = 0;
    var sql = 'select * from customer where phone=?';
    conn().query(sql, [phone], function (err, member, fields) {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err, message: 'save 오류' });
        }
        // 폰 번호가 DB에 있으면 포인트 추가
        else {
                if (member.length === 1) {
                    var _sql = 'update customer set point = point + 1 where phone = ?';
                    conn().query(_sql, [phone], function (err, result, fields) {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            res.send({ phone: phone, point: result.point });
                        }
                    });
                }
                // 폰 번호가 DB에 없으면 회원 등록, 포인트 1 적립
                else {
                        var point = 1;
                        var _sql2 = 'insert into customer (phone, point) values (?,?)';
                        conn().query(_sql2, [phone, point], function (err, result, fields) {
                            if (err) {
                                console.log(err);
                                res.status(500).send('Internal Server Error');
                            } else {
                                // 적립 완료
                                res.send({ phone: phone, point: result.point });
                            }
                        });
                    }
            }
    });
});

// 전화번호 정보 전체 조회
router.get('/all', function (req, res) {

    var sql = 'select * from customer';
    conn().query(sql, function (err, members, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(members);
        }
    });
});

// 삭제
router.post('/delete', function (req, res) {
    var phone = req.body.phone;
    var sql = 'delete from customer where phone=?';
    conn().query(sql, [phone], function (err, result) {
        //삭제완료
        res.send('삭제완료');
    });
});

// 회원정보 수정 : 포인트 변경, 이름, 생일, 메모  변경
router.post('/edit', function (req, res) {
    var point = req.body.point;
    var phone = req.body.phone;
    var birth = req.body.birth;
    var name = req.body.name;
    var discribe = req.body.discribe;

    var sql = 'update customer set point = ?,birth =?,name=?, memo = ?  where phone = ?';
    conn().query(sql, [point, birth, name, discribe, phone], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('edit complete');
        }
    });
});

// 전화번호 정보 개별 조회
router.get('/:phone', function (req, res) {
    var phone = req.params.phone;
    var sql = 'select * from customer where phone=?';
    conn().query(sql, [phone], function (err, member, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(member[0]);
            //res.send({phone:member[0].phone, point:member[0].point});
        }
    });
});

exports.default = router;