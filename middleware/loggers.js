import winston from 'winston';
import _ from 'underscore';

const loggers = ['init', 'auth', 'api', 'models'];

winston.logLevel = 'verbose';

_.map(loggers, (logger) => {
  const transports = {
    console: {
      level: 'verbose',
      colorize: true,
      label: logger
    }
  };
  winston.loggers.add(logger, transports);
});

module.exports = winston.loggers;
