const {JsonResponse} = require("../config/ResponseClass");
const httpStatusCodes = require("../config/httpStatusCode");
const hashvalue= require("../config/JwtTokenConfig");
const database= require("../config/mysql_config");
const sysconfig = require("../config/sysconfig");
const logger = require("../log/logger")


module.exports.deleteuser=(req,res)=>
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
                    const prephash={username:username,passwd:passwd};
                    const hashed=hashvalue(prephash);

                    database.query("CALL deleteuser(?,?,?);",[id,username,hashed],(error,result)=>
                    {
                        if(error)
                            {

                                errormsg("Database error");

                            }
                            else
                            {
                            if(result.affectedRows!==undefined)
                                {
                                    resp.rtype="result"
                                    resp.rmessage="USER DELETED";
                                    res.status(httpStatusCodes.OK).json(resp);
                                }
                                else{
                                resp.rtype="result";
                                resp.rmessage="Invalid Credential"
                                res.status(httpStatusCodes.CONFLICT).json(resp);
                                }
                            }
                    })

            }
            catch(e)
            {   
                logger.info(e)
                resp.result=e;
                res.status(httpStatusCodes.BAD_REQUEST).json(resp)
            }
    }