'use strict';

import express from 'express';
import {mysql} from '../modules';

const router = express.Router();

const conn = mysql.getConnection;


function changedate(member){
  let newmember = {};

  newmember.name= member.name;
  newmember.phone= member.name;

  if(member.birth){
    newmember.birth = member.birth.getTime();
  }
  else{
    newmember.birth = undefined;
  }

  newmember.memo= member.memo;
  newmember.point= member.point;

  return newmember;
}

// 번호 입력후 가입 or 포인트 적립
router.post('/save',function(req,res){
    let phone = req.body.phone;
    let yesno = 0;
    let sql = 'select * from customer where phone=?';
    conn().query(sql, [phone],function(err, member, fields){
        if(err){
            console.log(err);
            res.status(500).json({error:err, message:'save 오류'});
        }
        // 폰 번호가 DB에 있으면 포인트 추가
        else {
            if(member.length===1){
                let sql='update customer set point = point + 1 where phone = ?';
                conn().query(sql,[phone],function(err, result, fields){
                    if(err){
                        console.log(err);
                        res.status(500).json({error:err, message:'DB query 실행 오류(phone 정보 존재 할 때)'});
                    }
                    else{
                      let sql2='select * from customer where phone=?';
                      conn().query(sql2,[phone],function(err, member,fields){

                        res.json(member[0]);
                      });
                    }
                });
            }
            // 폰 번호가 DB에 없으면 회원 등록, 포인트 1 적립
            else{
                let point = 1;
                let sql = 'insert into customer (phone, point) values (?,?)';
                conn().query(sql, [phone, point],function(err,result,fields){
                    if(err){
                        console.log(err);
                        res.status(500).json({error:err, message:'DB query 실행 오류(phone 정보 없을 때)'});
                    }
                    else{
                        // 적립
                        let sql2='select * from customer where phone=?';
                        conn().query(sql2,[phone],function(err, member,fields){

                          res.json(member[0]);
                        });
                    }
                });
            }
        }
    });
});

// 전화번호 정보 전체 조회
router.get('/all',(req,res) => {

    let sql = 'select * from customer';
    conn().query(sql, function(err,members,fields){
        if(err){
            console.log(err);
            res.status(500).json({error:err, message:'전체 조회 오류'});
        }
        else{
            res.json({list:members});
        }
    });
});

// 삭제
router.post('/delete',function(req,res){
    let phone=req.body.phone;
    let sql='delete from customer where phone=?';
    conn().query(sql,[phone],function(err,result){
      if(err){
          console.log(err);
          res.status(500).json({error:err, message:'삭제 오류'});
      }
      //삭제 완료
      else{
          res.json({success:true})
      }
    });
});

// 회원정보 수정 : 포인트 변경, 이름, 생일, 메모  변경
router.post('/edit',function(req,res){
    let point = req.body.point;
    let phone = req.body.phone;
    let birth;
    if(req.body.birth)
      birth = new Date(req.body.birth);

    let name = req.body.name;
    let memo = req.body.memo;

    let sql = 'update customer set point=?,birth =?,name=?, memo = ?  where phone = ?';
    conn().query(sql,[point,birth,name,memo,phone],function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).json({error:err, message:'Edit DB query 오류'});
        }
        else{
            res.json({success:true});
        }
    });
});

// 전화번호 정보 개별 조회
router.get('/:phone',function(req,res){
    let phone = req.params.phone;
    let sql='select * from customer where phone=?';
    conn().query(sql,[phone],function(err,member,fields){
        if(err){
            console.log(err);
            res.status(500).json({error:err, message:'개별 조회 query 오류'});
        }
        else{
            res.json(member[0]);
        }
    })
});

export default router;
