const database=require("../config/mysql_config");
const hashvalue=require("../config/JwtTokenConfig")
const sysconfig = require("../config/sysconfig");
const {JsonResponse}=require("../config/ResponseClass");
const httpStatusCode=require("../config/httpStatusCode")

module.exports.newSession =(req,res)=>
{
    const userdata = Object.values(req.body);

    if(userdata.length !== 1)
    {
        const resp = new JsonResponse();
        resp.rmessage="Invalid Input";
        resp.rtype="error";
        res.status(httpStatusCode.BAD_REQUEST).json(resp);
    }

    const randomsalt=(Math.random()*sysconfig.values.random_digit_position).toFixed(0)
    const sessionsalt=hashvalue(randomsalt+`${userdata[0]}`)
    
    database.query("UPDATE session_ls SET session_value = ? WHERE USER_ID = ?;",[sessionsalt,userdata[0]],(error,result)=>
 {
    
    if(error) {
        const resp= new JsonResponse();
        resp.rtype="error";
        resp.result=error;
        res.status(httpStatusCode.CONFLICT).json(resp);
    }
    const resp = new JsonResponse();
    resp.result=result;
    resp.rtype="result";
    res.json(resp)

 })

}