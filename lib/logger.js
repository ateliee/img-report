const winston = require('winston');

const prettyPrint = winston.format.printf(info => {
    let msg = `${info.timestamp} [${info.level}]: `
    if(typeof info.message === 'object'){
        msg += JSON.stringify(info.message);
    }else{
        msg += info.message;
    }
    return msg;
})
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        prettyPrint
    ),
    transports: [
        new winston.transports.Console()
    ]
});
module.exports = logger;