export interface PtLoggingRepository {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}
