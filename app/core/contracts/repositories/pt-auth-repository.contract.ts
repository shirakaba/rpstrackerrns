import {
  PtAuthToken,
  PtLoginModel,
  PtRegisterModel,
  PtUser
} from '~/core/models/domain';

export interface PtAuthRepository {
  apiEndpoint: string;
  login(
    loginModel: PtLoginModel,
    errorHandler: (error: any) => void,
    successHandler: (data: { authToken: PtAuthToken; user: PtUser }) => void
  ): void;

  register(
    registerModel: PtRegisterModel,
    errorHandler: (error: any) => void,
    successHandler: (data: { authToken: PtAuthToken; user: PtUser }) => void
  ): void;
}
