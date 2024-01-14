const logger = require("../log/logger");
const database = require("../config/mysql_config")
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv").config();



module.exports.login=(req,res)=>
{

    const hashed=req.hashed;
    
    database.query("select ID,USERNAME from loginlist where PASSWDHASH = ?",[hashed],(error,result)=>
    {
        if(error) return res.status(500).json({message : "INTERNAL SERVER ERROR",ecode:"s_12",error:{code:error.code,errno:error.errno}});

        if(result.length)
        {   //jwt token creation
            const payload={id:result[0].ID,username:result[0].USERNAME};
            const token=jwt.sign(payload,process.env.JWT_PASSWORD,{expiresIn:"15s"})
            const refress_token=jwt.sign(payload,process.env.JWT_REFRESS_PASSWORD)
            res.json({accesstoken:token,refresstoken:refress_token})
        }
        else{
            res.status(401).json({message:"USER DATA NOT FOUND."})
        }

    })

}
