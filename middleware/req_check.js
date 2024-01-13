const hashvalue=require("../config/cryptoconfig");

function req_check(req,res,next){
    
    const userdata = Object.values(req.body);
    if(userdata.length!==2) return res.status(400).json({message:"INVALID REQUEST"})
    const hashed=hashvalue(req.body);
    req.hashed=hashed;
    next();
}

module.exports=req_check;