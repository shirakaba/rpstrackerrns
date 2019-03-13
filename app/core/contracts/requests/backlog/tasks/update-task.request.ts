import { PtTaskUpdate } from '~/core/models/dto/backlog';
import { PtItem } from '~/core/models/domain';

export interface UpdateTaskRequest {
  taskUpdate: PtTaskUpdate;
  currentItem: PtItem;
}

export function toUpdateTaskRequest(
  taskUpdate: PtTaskUpdate,
  currentItem: PtItem
): UpdateTaskRequest {
  return {
    taskUpdate,
    currentItem
  };
}
