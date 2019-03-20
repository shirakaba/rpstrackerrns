import { APP_STATE_KEY, PtStorageService, PtAppState, PtAppStateService } from '~/core/contracts/services';

export const INITIAL_STATE: PtAppState = {
  backlogItems: [],
  users: [],
  currentUser: undefined,
  currentSelectedItem: undefined,
  selectedPreset: 'open'
};

export class AppStateService implements PtAppStateService {
  constructor(private storageService: PtStorageService) {
    storageService.setItem<PtAppState>(APP_STATE_KEY, INITIAL_STATE);
  }

  public getStateItem<K extends keyof PtAppState>(name: K): PtAppState[K] {
    const appState = this.storageService.getItem<PtAppState>(APP_STATE_KEY);
    return appState[name];
  }

  public setStateItem<K extends keyof PtAppState>(
    name: K,
    state: PtAppState[K]
  ) {
    this.storageService.setItem(APP_STATE_KEY, {
      ...this.storageService.getItem(APP_STATE_KEY),
      [name]: state
    });
  }
}
