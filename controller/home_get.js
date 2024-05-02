const jsonresponse = require("../config/ResponseClass");

module.exports.home_get=(req,res)=>
{
    const resp = new jsonresponse();
    resp.rtype="result";
    resp.rmessage="All system is working well";
    res.status(200).json(resp);
}
