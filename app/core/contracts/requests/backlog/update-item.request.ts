import { PtItem } from '~/core/models/domain';

export interface UpdateItemRequest {
  itemToUpdate: PtItem;
}

export function toUpdateItemRequest(itemToUpdate: PtItem): UpdateItemRequest {
  return {
    itemToUpdate
  };
}
