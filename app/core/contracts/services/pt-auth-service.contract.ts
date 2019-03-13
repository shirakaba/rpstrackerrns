import { PtLoginModel, PtRegisterModel, PtUser } from '~/core/models/domain';

export interface PtAuthService {
  getCurrentUser(): PtUser;
  getCurrentUserId(): number | undefined;
  isLoggedIn(): boolean;
  login(loginModel: PtLoginModel): Promise<PtUser>;
  register(registerModel: PtRegisterModel): Promise<PtUser>;
  logout(): Promise<void>;
}
