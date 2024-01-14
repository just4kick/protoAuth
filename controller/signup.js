const logger = require("../log/logger");
const database = require("../config/mysql_config");
const jwt = require("jsonwebtoken")


module.exports.signup=(req,res)=>
{
    const hashed=req.hashed;
    const userdata = Object.values(req.body);
    //checking for existing user
      //inserting record inside loginlist table
      try{
            database.query("insert into loginlist (USERNAME,PASSWDHASH) values (?,?);",[userdata[0],hashed]
            ,(error,result)=>
        {
            if(error) {
                if(error.errno===1062)
                {
                    res.status(409).json({message:"USER ALREADY EXIST"})
                }
                else{
                logger.info(error);
                res.status(401).json({message : "INTERNAL SERVER ERROR",ecode:"s_24",error:{code:error.code,errno:error.errno}});
                }
            }
            else
            {
                const payload={id:result.insertId,username:userdata[0]};
                const refress_token=jwt.sign(payload,process.env.JWT_REFRESS_PASSWORD)
                res.json({id:result.insertId,refresstoken:refress_token})
                logger.info(`User Created ${userdata[0]}`)
            }

        })
    }
        catch(e)
        {
            logger.info(e);
        }
        }

    