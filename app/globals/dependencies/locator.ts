import { appConfig } from '~/config/app-config';
import {
  PtAuthRepository,
  PtBacklogRepository,
  PtLoggingRepository,
  PtStorageRepository,
  PtUserRepository
} from '~/core/contracts/repositories';
import {
  PtAppStateService,
  PtAuthService,
  PtBacklogService,
  PtCommentService,
  PtLoggingService,
  PtStorageService,
  PtTaskService,
  PtUserService
} from '~/core/contracts/services';
import { AppConfig } from '~/core/models/config/app-config.model';
import {
  AppStateService,
  LoggingService,
  StorageService,
  UserService
} from '~/core/services';
import { AuthService } from '~/core/services/auth';
import {
  BacklogService,
  CommentService,
  TaskService
} from '~/core/services/backlog';
import { StorageRepository } from '~/infrastructure/local';
import {
  AuthRepository,
  BacklogRepository,
  LoggingRepository,
  UserRepository
} from '~/infrastructure/repositories';

const config = <AppConfig>appConfig;

// Init Repositories
const loggingRepo: PtLoggingRepository = new LoggingRepository(
  config.loggingEnabled,
  config.loggingLevel
);
const backlogRepo: PtBacklogRepository = new BacklogRepository(
  config.apiEndpoint
);
const authRepo: PtAuthRepository = new AuthRepository(config.apiEndpoint);
const storageRepo: PtStorageRepository = new StorageRepository();
const userRepo: PtUserRepository = new UserRepository(config.apiEndpoint);

// Init Services
const loggingService: PtLoggingService = new LoggingService(loggingRepo);
const storageService: PtStorageService = new StorageService(storageRepo);
const appStateService: PtAppStateService = new AppStateService(storageService);
const authService: PtAuthService = new AuthService(
  loggingService,
  authRepo,
  storageService,
  appStateService
);
const backlogService: PtBacklogService = new BacklogService(
  loggingService,
  backlogRepo,
  appStateService
);
const commentService: PtCommentService = new CommentService(
  loggingService,
  backlogRepo,
  authService
);
const taskService: PtTaskService = new TaskService(loggingService, backlogRepo);
const userService: PtUserService = new UserService(
  loggingService,
  userRepo,
  appStateService
);

// Service providers
export function getAuthService(): PtAuthService {
  return authService;
}

export function getBacklogService(): PtBacklogService {
  return backlogService;
}

export function getCommentService(): PtCommentService {
  return commentService;
}

export function getLoggingService(): PtLoggingService {
  return loggingService;
}

export function getStorageService(): PtStorageService {
  return storageService;
}

export function getTaskService(): PtTaskService {
  return taskService;
}

export function getUserService(): PtUserService {
  return userService;
}

export function getApiEndpoint() {
  return config.apiEndpoint;
}
