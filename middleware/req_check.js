const hashvalue=require("../config/cryptoconfig");
const jwt=require("jsonwebtoken")
const logger = require("../log/logger")

function req_check(req,res,next){
    
    const userdata = Object.values(req.body);
    if(userdata.length!==2) return res.status(400).json({message:"INVALID REQUEST"})
    const hashed=hashvalue(req.body);
    req.hashed=hashed;
    next();
}

function refress_token_check(req,res,next){
    const header=req.headers["authorization"];
    const token=header && header.split(" ")[1];
    if(token==null) {
        next();
    }else{
    jwt.verify(token,process.env.JWT_REFRESS_PASSWORD,(err,user)=>
    {
        if(err) return res.status(401).json({message:"TOKEN VERIFICATION FAILED" , error:err})
        const payload={id:user.id,username:user.username};
        const acctoken=jwt.sign(payload,process.env.JWT_PASSWORD,{expiresIn:"15s"})
        res.json({accesstoken:acctoken})
        logger.info(`Access token generated : USER ${user.id}`)
    
    })
}
}



module.exports={req_check,refress_token_check};