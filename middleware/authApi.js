const {JsonResponse}=require("../config/ResponseClass")
const httpStatusCode=require("../config/httpStatusCode")
const logger = require("../log/logger")

function authenticateApi(req,res,next)
{
   
    const header=req.headers["authorization"];
    const resp=new JsonResponse();
    const token=header && header.split(" ")[1];
    if(token==null){
        resp.rtype="error";
        resp.rmessage="Token not found";
        return res.status(httpStatusCode.NOT_FOUND).json(resp);
    } 

    if(process.env.SERVER_PASSWORD !== undefined && process.env.SERVER_PASSWORD === token )
    {   
        logger.info(`Access granted to IP: ${req.ip}`)
        next();
    }
    else
    {   
        logger.info(`Access denied to IP: ${req.ip}`)
        resp.rmessage="Invalid API key"
        resp.rtype="error";
       res.status(httpStatusCode.NOT_FOUND).json(resp);
       
    }
    
}

module.exports = authenticateApi;