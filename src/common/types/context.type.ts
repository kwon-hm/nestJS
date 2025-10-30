export interface LogContext {
  timestamp: string;
  url: string;
  ip: string;
}

export interface RequestContext {
  req?: {
    logContext?: LogContext;
  };
}
