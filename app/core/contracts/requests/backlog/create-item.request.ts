import { PtUser } from '~/core/models/domain';
import { PtNewItem } from '~/core/models/dto/backlog';

export interface CreateItemRequest {
  newItem: PtNewItem;
  assignee: PtUser;
}

export function toCreateItemRequest(
  newItem: PtNewItem,
  assignee: PtUser
): CreateItemRequest {
  return {
    newItem,
    assignee
  };
}
