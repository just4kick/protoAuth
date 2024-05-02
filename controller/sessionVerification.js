const {JsonResponse}=require("../config/ResponseClass");
const httpStatusCode= require("../config/httpStatusCode");
const database= require("../config/mysql_config")
const logger = require("../log/logger");

module.exports.sessionVerification=(req,res)=>
{
    const userdata = Object.values(req.body);
    if(userdata.length !== 1)
    {
        const resp = new JsonResponse();
        resp.rmessage="Invalid Input";
        resp.rtype="error";
        res.status(httpStatusCode.BAD_REQUEST).json(resp);
    }
    
    database.query(`select USER_ID from session_ls where SESSION_VALUE=?;`,[userdata],(error,result)=>
         {
            if(error)
            {
                const resp= new JsonResponse();
                resp.rtype="error";
                resp.result=error;
                logger.info(error)
                return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(resp);
            }
            if(result[0]===undefined)
            {
                const resp= new JsonResponse();
                resp.rtype="result";
                resp.rmessage="SESSION NOT VALID"
                return res.status(httpStatusCode.NOT_FOUND).json(resp);
            }
            const resp= new JsonResponse()
            resp.rtype="result";
            resp.result=result[0];
            res.status(httpStatusCode.OK).json(resp)
         }

    )


}