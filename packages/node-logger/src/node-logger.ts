import pino, {
  type LoggerOptions,
  type Logger,
  type DestinationStream
} from 'pino';

const formatters: LoggerOptions['formatters'] = {
  bindings: (bindings) => {
    const { pid, hostname } = bindings;

    return { pid, host: hostname };
  },
  level: (label: string) => ({ level: label.toUpperCase() })
};

export const getLogger = (
  opt: Partial<LoggerOptions> = {},
  stream?: DestinationStream
): Logger =>
  pino(
    {
      name: opt.name || process.env['LOGGER_NAME'] || 'node-app',
      level: opt.level || process.env['LOGGER_LEVEL'] || 'trace',
      messageKey: 'message',
      timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
      ...opt,
      formatters: {
        ...formatters,
        ...(opt.formatters || {})
      }
    },
    stream
  );
