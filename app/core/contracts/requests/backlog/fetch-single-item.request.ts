export interface FetchSingleItemRequest {
  ptItemId: number;
}

export function toFetchSingleItemRequest(
  ptItemId: number
): FetchSingleItemRequest {
  return {
    ptItemId
  };
}
