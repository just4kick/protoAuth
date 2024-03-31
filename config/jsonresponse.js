const sysconfig=require("./sysconfig")
class jsonresponse{
    constructor(sessiontoken=null,sessionIssued=null,sessionexpireIn=null){
    this.rcode=null;
    this.rmessage=null;
    this.rtype=null;
    this.result={
        sessiontoken:sessiontoken,
        sessionIssued:sessionIssued,
        sessionexpireIn:sessionexpireIn,
    };
    this.about={
        versions:sysconfig.info.versions
    }
    }
    
}


module.exports=jsonresponse;