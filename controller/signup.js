const logger = require("../log/logger");
const database = require("../config/mysql_config");
const hashvalue=require("../config/cryptoconfig");
const responsestructure = require("../config/jsonresponse")
const cntvalue=require("../config/constantvalues")
const userconfig=require("../userconfig/userconfig")
const jwt = require("jsonwebtoken")


module.exports.signup=(req,res)=>
{
    
    // const hashed=req.hashed;
    const userdata = Object.values(req.body);
    const hashed=hashvalue(req.body);
    const randomsalt=(Math.random()*100000000000).toFixed(0)
    const sessionsalt=hashvalue(randomsalt+`${userdata[0]}`)
    //checking for existing user
      //inserting record inside loginlist table
      try{
            database.query("CALL createuser(?,?,?);",[userdata[0],hashed,sessionsalt]
            ,(error,result)=>
        {
            if(error) {
                // if(error.errno===1062)
                // {
                //     // res.status(409).json({message:"USER ALREADY EXIST"})
                //     res.json(error)
                // }
                // else{
                // logger.info(error);
                // res.status(401).json({message : "INTERNAL SERVER ERROR",ecode:"s_24",error:{code:error.code,errno:error.errno}});
                // }
                const resp= new responsestructure();
                resp.rtype="error";
                resp.result=error;
                res.status(401).json(resp);
            }
            else
            {
                // console.log(result);
                const payload={session:result[0][0].SESSION_VALUE,id:result[0][0].USER_ID,username:userdata[0]};
                const token=jwt.sign(payload,process.env.JWT_REFRESS_PASSWORD,{expiresIn:"100s"})
                const resp= new responsestructure(token,Date.now(),Date.now()+(100*userconfig.jwt_token_expireIn))
                resp.rtype="result";
                res.status(cntvalue.usercreated).json(resp)
                // console.log(payload)
                logger.info(`User Created ${userdata[0]}`)
            }

        })
    }
        catch(e)
        {
            logger.info(e);
        }
        }

    