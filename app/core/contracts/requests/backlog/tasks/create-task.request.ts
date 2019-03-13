import { PtNewTask } from '~/core/models/dto/backlog';
import { PtItem } from '~/core/models/domain';

export interface CreateTaskRequest {
  newTask: PtNewTask;
  currentItem: PtItem;
}

export function toCreateTaskRequest(
  newTask: PtNewTask,
  currentItem: PtItem
): CreateTaskRequest {
  return {
    newTask,
    currentItem
  };
}
