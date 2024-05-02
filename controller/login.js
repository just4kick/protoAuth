const logger = require("../log/logger");
const database = require("../config/mysql_config")
const jwt=require("jsonwebtoken");
const hashvalue=require("../config/JwtTokenConfig")
const httpStatusCode = require("../config/httpStatusCode");
const {JsonResponse} = require("../config/ResponseClass")
const userconfig = require("../userconfig/userconfig")

module.exports.login=(req,res)=>
{
    const userdata = Object.values(req.body);
    const hashed=hashvalue(req.body);
    
    database.query("CALL loginuser(?,?)",[userdata[0],hashed],(error,result)=>
    {
        if(error)
        {
            const resp= new JsonResponse();
            resp.rtype="error";
            resp.result=error;
            logger.info(error)
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(resp);
        }
        if(result[0][0].USER_ID===null)
        {
            const resp= new JsonResponse();
            resp.rtype="result";
            resp.rmessage="User not found"
            return res.status(httpStatusCode.NOT_FOUND).json(resp);
        }
        
        const payload={session:result[0][0].SESSION_VALUE,id:result[0][0].USER_ID,username:userdata[0]};
        const token=jwt.sign(payload,process.env.JWT_PASSWORD,{expiresIn:userconfig.jwt_token_expireIn});
        const resp= new JsonResponse(token,Date.now(),Date.now()+(1000*parseInt(userconfig.jwt_token_expireIn)));
        res.status(httpStatusCode.OK).json(resp); 
        

    })

}
