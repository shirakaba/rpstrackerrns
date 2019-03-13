import {
  CreateTaskRequest,
  UpdateTaskRequest
} from '~/core/contracts/requests/backlog';
import {
  CreateTaskResponse,
  UpdateTaskResponse
} from '~/core/contracts/responses/backlog';

export interface PtTaskService {
  addNewPtTask(
    createTaskRequest: CreateTaskRequest
  ): Promise<CreateTaskResponse>;

  updatePtTask(
    updateTaskRequest: UpdateTaskRequest
  ): Promise<UpdateTaskResponse>;
}
