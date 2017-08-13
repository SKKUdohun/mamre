
let mysql = require('mysql');

var sql = "SELECT * FROM mamre SET ?" ;
var ab={a:123,
  b:undefined}
  console.log(ab);
var inserts = [['abc','dsfasf']];
sql = mysql.format(sql, inserts);
console.log(sql);

let a = JSON.stringify({ C: null});
console.log(a);
console.log(undefined+4);
let bsdd = new Date()
console.log(typeof bsdd);