const logger = require("../log/logger");
const database = require("../config/mysql_config")
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv").config();



function aut(req,res,next){
    const header=req.headers["authorization"];
    const token=header && header.split(" ")[1];
    if(token==null) return res.json({message:"null"})

    jwt.verify(token,"supermancantbeatbatman",(err,user)=>
    {
        if(err) return res.json({message:"error inside verify"})
        req.user=user;
    next();
    })
}


module.exports.login=(req,res)=>
{

    const hashed=req.hashed;

    database.query("select ID,USERNAME from loginlist where PASSWDHASH = ?",[hashed],(error,result)=>
    {
        if(error) return res.status(500).json({message : "INTERNAL SERVER ERROR",ecode:"s_12",error:{code:error.code,errno:error.errno}});

        if(result.length)
        {
            const payload={id:result[0].ID,username:result[0].USERNAME};
            const token=jwt.sign(payload,process.env.JWT_PASSWORD)
            res.json({token:token})
        }
        else{
            res.send("no usr found")
        }

    })

}
