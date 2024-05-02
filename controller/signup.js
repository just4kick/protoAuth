const logger = require("../log/logger");
const database = require("../config/mysql_config");
const hashvalue=require("../config/JwtTokenConfig");
const {JsonResponse} = require("../config/ResponseClass")
const httpStatusCode=require("../config/httpStatusCode")
const userconfig=require("../userconfig/userconfig")
const jwt = require("jsonwebtoken");
const sysconfig = require("../config/sysconfig");


module.exports.signup=(req,res)=>
{
    
    // const hashed=req.hashed;
    const userdata = Object.values(req.body);
    const hashed=hashvalue(req.body);
    const randomsalt=(Math.random()*sysconfig.values.random_digit_position).toFixed(0)
    const sessionsalt=hashvalue(randomsalt+`${userdata[0]}`)
    //checking for existing user
      //inserting record inside loginlist table
      try{
            database.query("CALL createuser(?,?,?);",[userdata[0],hashed,sessionsalt]
            ,(error,result)=>
        {
            if(error) {
                const resp= new JsonResponse();
                resp.rtype="error";
                resp.result=error;
                res.status(httpStatusCode.CONFLICT).json(resp);
            }
            else
            {
                const payload={session:result[0][0].SESSION_VALUE,id:result[0][0].USER_ID,username:userdata[0]};
                const token=jwt.sign(payload,process.env.JWT_REFRESS_PASSWORD,{expiresIn:userconfig.jwt_token_expireIn})
                const resp= new JsonResponse(token,Date.now(),Date.now()+(1000*parseInt(userconfig.jwt_token_expireIn)))
                resp.rtype="result";
                res.status(httpStatusCode.OK).json(resp);
                logger.info(`User Created ${userdata[0]}`)
            }

        })
    }
        catch(e)
        {
            logger.info(e);
        }
        }

    