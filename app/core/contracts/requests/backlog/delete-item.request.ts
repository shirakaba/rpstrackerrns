import { PtItem } from '~/core/models/domain';

export interface DeleteItemRequest {
  itemToDelete: PtItem;
}

export function toDeleteItemRequest(itemToDelete: PtItem): DeleteItemRequest {
  return {
    itemToDelete
  };
}
