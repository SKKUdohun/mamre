this.VALUE=1;
const A = function(){
  console.log(this.VALUE);
}
const B = () => {
  console.log(this.VALUE);
}

function init(){
  this.VALUE=5;
  A();
  B();

  const C = function(){
    this.VALUE = 10;
    A();
    B();
  }
  C();
}

init();
