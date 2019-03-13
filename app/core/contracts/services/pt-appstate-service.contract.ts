import { PtItem, PtUser } from '~/core/models/domain';
import { PresetType } from '~/core/models/types';

export const APP_STATE_KEY = 'APP_STATE_KEY';

export interface PtAppState {
  backlogItems: PtItem[];
  users: PtUser[];
  currentUser: PtUser;
  currentSelectedItem: PtItem;
  selectedPreset: PresetType;
}

export interface PtAppStateService {
  getStateItem<K extends keyof PtAppState>(name: K): PtAppState[K];
  setStateItem<K extends keyof PtAppState>(name: K, state: PtAppState[K]): void;
}
