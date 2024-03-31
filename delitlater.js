// // const dotenv = require("dotenv").config();
// const d=require("./config/cryptoconfig")

// const a={
//     usernames:"hulk",
//     password:"robin"
//   }


//   k=Object.values(a);


// const j=(Math.random()*100000000000).toFixed(0)
// console.log(j+`${k[0]}`)
// h=d(j+"superman")

// console.log(h);

class jsonresponse{
  usercreated=201;
  constructor(sessiontoken=null,sessionIssued=null,sessionexpireIn=null){
  this.rcode=null;
  this.rmessage=null;
  this.rtype=null;
  this.result={
      sessiontoken:sessiontoken,
      sessionIssued:sessionIssued,
      sessionexpireIn:sessionexpireIn,
  };
  }
}

const k= new jsonresponse();

console.log(k)
