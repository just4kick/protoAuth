const {JsonResponse} = require("../config/ResponseClass");
const httpStatusCodes = require("../config/httpStatusCode");
const hashvalue= require("../config/JwtTokenConfig");
const database= require("../config/mysql_config");
const sysconfig = require("../config/sysconfig");
const jwt=require("jsonwebtoken");
const userconfig = require("../userconfig/userconfig")
const logger = require("../log/logger")

module.exports.updateUser=(req,res)=>
{
    const resp = new JsonResponse();
    const errormsg=(msg)=>
        {
            resp.rmessage=msg;
            throw Error;
        }

    try{
    const id = (req.body.id)?req.body.id: errormsg("Invalid Request. Id Not Found") ;
    const username = (req.body.username)?req.body.username: errormsg("Invalid Request. username Not Found") ;
    const passwd = (req.body.passwd)?req.body.passwd: errormsg("Invalid Request. passwd Not Found") ;
    const new_username = (req.body.new_username)?req.body.new_username: errormsg("Invalid Request. new_username Not Found") ;
    const new_passwd = (req.body.new_passwd)?req.body.new_passwd: errormsg("Invalid Request. new_passwd Not Found") ;

    const prephash={username:username,passwd:passwd}
    const new_prephash={new_username:new_username,new_passwd:new_passwd}
    const hashed=hashvalue(prephash);
    const new_hashed=hashvalue(new_prephash)

    const randomsalt=(Math.random()*sysconfig.values.random_digit_position).toFixed(0)
    const sessionsalt=hashvalue(randomsalt+`${new_username}`);

        database.query("CALL updateuser(?,?,?,?,?,?);",[id,username,hashed,new_username,new_hashed,sessionsalt],(error,result)=>
        {
            if(error)
                {
                    resp.rmessage="error";
                    resp.result=error;
                    logger.info(error)
                    throw Error;

                }
            
            if(result.affectedRows===undefined)
            {
                resp.rmessage="Credential Not Valid"
                resp.result=result;
                res.status(httpStatusCodes.BAD_REQUEST).json(resp)
            }
            
             if(result.affectedRows===1)
                 {
                 const payload={session:sessionsalt,id:id,username:new_username};
                 const token=jwt.sign(payload,process.env.JWT_PASSWORD,{expiresIn:userconfig.jwt_token_expireIn});
                 const resp1= new JsonResponse(token,Date.now(),Date.now()+(1000*parseInt(userconfig.jwt_token_expireIn)));
                 resp1.rmessage="result"
                 res.status(httpStatusCodes.OK).json(resp1);
                 }

        })
        
    }
    catch(e)
    {
        resp.result=e;
        res.status(httpStatusCodes.BAD_REQUEST).json(resp)
    }
  

}