'use strict';

import express from 'express';
import {mysql} from '../modules';

const router = express.Router();

const conn = mysql.getConnection;


function changedate(member){

  let newmember={};

  newmember.name= member.name;
  newmember.phone= member.phone;
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
    console.log('a');
    let phone = req.body.phone;
    let datetime = new Date(req.body.datetime);
    if(isNaN(phone)) {
      res.status(500).json({error:err,message:'phone 입력값이 숫자가 아닙니다.'});
    }else if(phone.length!=11 ) {
      res.status(500).json({error:err,message:'phone 입력값이 11자리가 아닙니다.'});
    }
    // phone 형식이 제대로 들어오면
    else {
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
                        let sql_history = 'insert into history (datetime, phone, point, pointChange, mode) values(?, ?, ?, ?, ?)';

                        let sql2='select * from customer where phone=?';
                        conn().query(sql2,[phone],function(err, member,fields){
                          conn().query(sql_history, [datetime, phone,member[0].point, 1, 0],function(err, history, fields){
                            if(err){
                              console.log(err);
                              res.status(500).json({error:err, message:'History insert 오류'});
                            }
                          });
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
                          let sql_history = 'insert into history (datetime, phone, point ,pointChange, mode) values(?, ?, ?,?,?)';
                          let sql2='select * from customer where phone=?';
                          conn().query(sql2,[phone],function(err, member,fields){
                            conn().query(sql_history,[datetime,phone,member[0].point,1,0],function(err,history,fields){
                              if(err){
                                console.log(err);
                                res.status(500).json({error:err, message:'History insert 오류'});
                              }
                            })
                            res.json(member[0]);
                          });
                      }
                  });
              }
          }
      });
    }
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

// point 사용
router.post('/use',(req,res)=>{
    let phone = req.body.phone;
    let usedPoint = req.body.usedPoint;
    let datetime = new Date(req.body.datetime);
    let newPt;
    let sql = 'select * from customer where phone = ?';
    conn().query(sql,[phone],function(err,member,fields){
      if(err){
        console.log(err);
        res.status(500).json({error:err, message:'select query 오류'});
      }
      else {
        // phone 이 존재하고
        if(member.length===1){
          // 가진 포인트가 usedPoint보다 많거나 같을경우 정상 use 실행
          if(member[0].point >= usedPoint){
            newPt = member[0].point - usedPoint;
            let sql_use = 'update customer set point = ? where phone = ?'
            let sql_history = 'insert into history (datetime, phone, point ,pointChange, mode) values(?, ?, ?,?,?)';
            conn().query(sql_use,[newPt, phone],function(err,result,fields){
              if(err){
                console.log(err);
                res.staus(500).json({error:err, message:'update query 오류'})
              }
              else{
                conn().query(sql_history,[datetime, phone, newPt, usedPoint, 1], function(err,history,fields){
                  if(err){
                    console.log(err);
                    res.status(500).json({error:err, message:'history insert 오류'});
                  }
                })
                res.json({newPoint:newPt});
              }
            })
          }
          // 포인트가 usedPoint 보다 적을경우
          else{
            res.status(500),json({error:err, message:'포인트가 부족합니다.'});
          }
        }
        else{
          //phone이 존재하지 않으면
          res.status(500).json({error:err, message:'해당 번호가 존재하지 않습니다.'})
        }
      }
    })
})

// 회원정보 수정 : 포인트 변경, 이름, 생일, 메모  변경
router.post('/edit',function(req,res){
  let phone = req.body.phone;
  if(isNaN(phone)) {
    res.status(500).json({error:err,message:'phone 입력값이 숫자가 아닙니다.'});
  }else if(phone.length!=11 ) {
    res.status(500).json({error:err,message:'phone 입력값이 11자리가 아닙니다.'});
  } else {

    // phone 형식이 제대로 들어오면 실행될 기능들
    //let point = req.body.point;
    let birth;

    if(req.body.birth){
      birth = new Date(req.body.birth)
    }else{
      birth = undefined;
    };
    let name = req.body.name;
    let memo = req.body.memo;
    let pointChange;
    if(req.body.pointChange){
      pointChange = req.body.pointChange
    }else{
      pointChange=0;
    }
    let datetime = new Date(req.body.datetime);

    let sql = 'update customer set point= point + ?,birth =?,name=?, memo = ?  where phone = ?';
    let sql_history = 'insert into history (datetime, phone, point ,pointChange, mode) values(?, ?, ?,?,?)';

    conn().query(sql,[pointChange,birth,name,memo,phone],function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).json({error:err, message:'Edit DB query 오류'});
        }
        else{
          if(pointChange!=0){
            let sql_getpoint = 'select * from customer where phone=?';
            conn().query(sql_getpoint,[phone],function(err,getpoint,fields){
              conn().query(sql_history, [datetime, phone, getpoint[0].point, pointChange, 2], function(err,history,fields){
                if(err){
                  console.log(err);
                  res.status(500).json({error:err, message:'History insert 오류'});
                }
              })
            });
          }
            res.json({success:true});
        }
    });
  }
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
            res.json(changedate(member[0]));
        }
    })
});

export default router;
