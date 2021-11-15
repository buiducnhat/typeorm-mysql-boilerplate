import * as winston from 'winston';

import config from '@src/config';

const transports = [];
transports.push(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.cli(), winston.format.splat()),
  }),
);
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/app.log',
    }),
  );
}

const vietnameseTimeZone = () => {
  return new Date().toLocaleString('vn-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
};

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: vietnameseTimeZone,
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

export default LoggerInstance;
