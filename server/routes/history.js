'use strict';

import express from 'express';
import {mysql} from '../modules';

const router = express.Router();

const conn = mysql.getConnection;


// 전체 히스토리 조회
router.get('/all',(req,res) => {

    let sql = 'select * from history';
    conn().query(sql, function(err,historys,fields){
        if(err){
            console.log(err);
            res.status(500).json({error:err, message:'전체 조회 오류'});
        }
        else{
            res.json({list:historys});
        }
    });
});

//전화번호별 history 조회
router.get('/:phone', function(req,res){
  let phone = req.params.phone;
  let sql='select * from history where phone = ?';
  conn().query(sql,[phone],function(err,history,fields){
    if(err){
      console.log(err);
      res.status(500).json({error:err, message:'개별 조회 query 오류'});
    }
    else{
      res.json(history[0]);
    }
  })
});

export default router;
