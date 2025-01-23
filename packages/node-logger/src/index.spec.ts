/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from 'pino';
import { getLogger } from './';

jest.mock('pino');

describe('getLogger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.LOGGER_NAME;
    delete process.env.LOGGER_LEVEL;
  });

  it('should create logger with default options', () => {
    const mockPino = pino as jest.MockedFunction<typeof pino>;
    const originalEnv = process.env;
    process.env = { ...originalEnv };
    getLogger();

    const callArgs = mockPino.mock.calls[0][0];
    expect(callArgs.name).toBe('node-app');
    expect(callArgs.level).toBe('trace');
    expect(callArgs.messageKey).toBe('message');
    expect(typeof callArgs.timestamp).toBe('function');
    expect(typeof (callArgs.formatters as any).bindings).toBe('function');
    expect(typeof (callArgs.formatters as any).level).toBe('function');
  });

  it('should use environment variables if provided', () => {
    process.env.LOGGER_NAME = 'test-app';
    process.env.LOGGER_LEVEL = 'info';

    const mockPino = pino as jest.MockedFunction<typeof pino>;
    getLogger();

    expect(mockPino).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-app',
        level: 'info'
      })
    );
  });

  it('should override defaults with provided options', () => {
    const customOptions = {
      name: 'custom-app',
      level: 'error',
      customField: 'value'
    };

    const mockPino = pino as jest.MockedFunction<typeof pino>;
    getLogger(customOptions);

    expect(mockPino).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'custom-app',
        level: 'error',
        customField: 'value'
      })
    );
  });

  it('should format bindings correctly', () => {
    const mockPino = pino as jest.MockedFunction<typeof pino>;
    getLogger();

    const formatters = mockPino.mock.calls[0][0].formatters as any;
    const result = formatters.bindings({ pid: 123, hostname: 'test-host' });

    expect(result).toEqual({
      pid: 123,
      host: 'test-host'
    });
  });

  it('should format level correctly', () => {
    const mockPino = pino as jest.MockedFunction<typeof pino>;
    getLogger();

    const formatters = mockPino.mock.calls[0][0].formatters as any;
    const result = formatters.level('debug');

    expect(result).toEqual({
      level: 'DEBUG'
    });
  });

  it('should generate ISO timestamp', () => {
    const mockPino = pino as jest.MockedFunction<typeof pino>;
    getLogger();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const timestamp = mockPino.mock.calls[0][0].timestamp as Function;
    const result = timestamp();

    expect(result).toMatch(
      /,"timestamp":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"/
    );
  });

  it('should merge custom formatters with defaults', () => {
    const customFormatters = {
      log: (object: any) => ({ ...object, custom: true })
    };

    const mockPino = pino as jest.MockedFunction<typeof pino>;
    getLogger({ formatters: customFormatters });

    expect(mockPino).toHaveBeenCalledWith(
      expect.objectContaining({
        formatters: {
          bindings: expect.any(Function),
          level: expect.any(Function),
          log: expect.any(Function)
        }
      })
    );
  });
});
