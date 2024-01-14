const logger = require("../log/logger")

function authenticateApi(req,res,next)
{
    const header=req.headers["authorization"];
    const token=header && header.split(" ")[1];
    if(token==null) return res.json({message:"TOKEN NOT FOUND"});

    if(process.env.SERVER_PASSWORD !== undefined && process.env.SERVER_PASSWORD === token )
    {
        logger.info(`Authorised to ${req.ip}`)
        next();
    }
    else
    {   
        logger.info(`Access denied to ${req.ip}`)
       res.status(401).json("API Key in not valid")
       
    }
    
}

module.exports = authenticateApi;