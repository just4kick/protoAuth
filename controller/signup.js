const logger = require("../log/logger");
const database = require("../config/mysql_config");



module.exports.signup=(req,res)=>
{
    const hashed=req.hashed;
    //checking for existing user
    database.query("select PASSWDHASH from loginlist where PASSWDHASH = ?",[hashed],(error,result)=>
    {
        if(error) return res.status(500).json({message : "INTERNAL SERVER ERROR",ecode:"s_13"});

        if(result.length)
        {
            res.status(409).json({message:"Record Already exist. Please Login"})
        }
        else
        {//inserting record inside loginlist table
            database.query("insert into loginlist (USERNAME,PASSWDHASH) values (?,?);",[userdata[0],hashed]
            ,(error,result)=>
        {
            if(error) {
                logger.info(error);
                res.status(501).json({message : "INTERNAL SERVER ERROR",ecode:"s_24",error:{code:error.code,errno:error.errno}});
            }
            else
            {
                res.status(201).json(result.insertId);
                logger.info(`User Created ${userdata[0]}`)
            }

        })
        }

    })

}