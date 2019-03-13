import { PtUser } from '~/core/models/domain';

export interface PtUserService {
  getLocalUsers(): PtUser[];
  fetchUsers(refresh?: boolean): Promise<PtUser[]>;
}
