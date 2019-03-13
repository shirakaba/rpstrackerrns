// import { appStore } from '~/core/app-store';
import { PtUserRepository } from '~/core/contracts/repositories';
import {
  PtAppStateService,
  PtLoggingService,
  PtUserService
} from '~/core/contracts/services';
import { PtUser } from '~/core/models/domain';

// const LOCAL_USERS = 'LOCAL_USERS';

export class UserService implements PtUserService {
  constructor(
    private loggingService: PtLoggingService,
    private userRepo: PtUserRepository,
    private appStateService: PtAppStateService
  ) {}

  public getLocalUsers() {
    // return this.storageService.getItem<PtUser[]>(LOCAL_USERS);
    return this.appStateService.getStateItem('users');
  }

  public fetchUsers(refresh?: boolean): Promise<PtUser[]> {
    const localUsers = this.getLocalUsers();

    if (localUsers.length === 0 || refresh) {
      return new Promise<PtUser[]>((resolve, reject) => {
        this.userRepo.fetchUsers(
          error => {
            this.loggingService.error('Fetching users failed');
            reject(error);
          },
          (users: PtUser[]) => {
            users.forEach(u => {
              u.avatar = `${this.userRepo.apiEndpoint}/photo/${u.id}`;
            });
            // this.storageService.setItem(LOCAL_USERS, users);
            this.appStateService.setStateItem('users', users);
            resolve(users);
          }
        );
      });
    } else {
      return Promise.resolve(localUsers);
    }
  }
}
