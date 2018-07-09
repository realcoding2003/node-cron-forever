var request = require('request');
var cron = require('node-cron');
var winston = require('winston');
var cfg = require("../config/cfg.json");
require('date-utils');

const fs = require('fs');
const logDir = '../logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new (require('winston-daily-rotate-file'))({
            level: 'info',
            filename: `${logDir}/node-cron-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

cfg.schedule.forEach(function(schedule)
{
    cron.schedule(schedule.time, function() {
        request('http://' + cfg.Url + ':' + cfg.Port + schedule.path, function (err, res, body) {
            if (err)
                logger.error(err);
            logger.info(res && res.statusCode + "path:" + schedule.path);
            logger.debug(body);
        });
    });
});