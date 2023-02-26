const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs')

const logger = () => {
    const logDir = path.join(__dirname, '../logs');

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const transport = new transports.DailyRotateFile({
        filename: path.join(logDir, '%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '2d'
    });

    const myFormat = printf(({ level, message, timestamp }) => {
        return `[${level}] ${timestamp}: ${message}`;
    });

    const logger = createLogger({
        level: 'info',
        format: combine(
            timestamp({ format: "HH:mm:ss" }),
            myFormat
        ),
        transports: [
            new transports.Console(),
            // transport
        ],
        exceptionHandlers: [
            new transports.Console(),
            transport
        ],
        rejectionHandlers: [
            new transports.Console(),
            transport
        ]
    });

    global.logger = logger
}

module.exports = logger
