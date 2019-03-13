import { PtLoggingRepository } from '~/core/contracts/repositories';
import { PtLoggingService } from '~/core/contracts/services';

export class LoggingService implements PtLoggingService {
  constructor(private loggingRepo: PtLoggingRepository) {}

  public log(message: string) {
    this.loggingRepo.log(message);
  }

  public warn(message: string) {
    this.loggingRepo.warn(message);
  }

  public error(message: string) {
    this.loggingRepo.error(message);
  }
}
