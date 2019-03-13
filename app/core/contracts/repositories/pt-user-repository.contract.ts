import { PtUser } from '~/core/models/domain';

export interface PtUserRepository {
  apiEndpoint: string;
  fetchUsers(
    errorHandler: (error: any) => void,
    successHandler: (data: PtUser[]) => void
  ): void;
}
