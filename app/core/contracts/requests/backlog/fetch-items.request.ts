import { PresetType } from '~/core/models/types';

/*
export interface FetchItemsRequest {
  getCurrentPreset: () => PresetType;
  getCurrentUserId: () => number;
}

export function toFetchItemsRequest(
  getCurrentPreset: () => PresetType,
  getCurrentUserId: () => number
): FetchItemsRequest {
  return {
    getCurrentPreset,
    getCurrentUserId
  };
}

*/

export interface FetchItemsRequest {
  currentPreset: PresetType;
  currentUserId: number;
}

export function toFetchItemsRequest(
  currentPreset: PresetType,
  currentUserId: number
): FetchItemsRequest {
  return {
    currentPreset,
    currentUserId
  };
}
