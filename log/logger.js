const logger=require("pino");

module.exports = logger(
    {
        base :
        {
        pid:false,
        },
        transport:{
            target:"pino-pretty",
            options:
                {
            colorized:true
        }
    },
    timestamp: ()=>`,"time":"${new Date().toLocaleString()}"`

}
)
