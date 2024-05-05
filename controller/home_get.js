const {JsonResponse} = require("../config/ResponseClass")

module.exports.home_get=(req,res)=>
{
    const resp = new JsonResponse();
    resp.rtype="result";
    resp.rmessage="All system is working well";
    res.status(200).json(resp);
}
