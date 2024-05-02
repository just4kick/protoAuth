const jwt=require("jsonwebtoken")
const logger = require("../log/logger")
const httpStatusCode=require("../config/httpStatusCode");
const {JsonResponse} = require("../config/ResponseClass");

function req_check(req,res,next){
    
    const userdata = Object.values(req.body);
    const resp= new JsonResponse();
    if(userdata.length!==2) 
    {   
        resp.rtype="error";
        resp.rmessage="Invalid Request"
        return res.status(httpStatusCode.BAD_REQUEST).json(resp)
    }
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