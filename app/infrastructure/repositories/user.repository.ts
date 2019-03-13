import { PtUserRepository } from '~/core/contracts/repositories';
import { PtUser } from '~/core/models/domain';
import { handleFetchErrors } from '~/infrastructure/fetch-error-handler';

export class UserRepository implements PtUserRepository {
  constructor(public apiEndpoint: string) {}

  private getUsersUrl() {
    return `${this.apiEndpoint}/users`;
  }

  public fetchUsers(
    errorHandler: (error: any) => void,
    successHandler: (data: PtUser[]) => void
  ): void {
    fetch(this.getUsersUrl(), {
      method: 'GET'
    })
      .then(handleFetchErrors)
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }
}
