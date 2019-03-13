import { PtBacklogRepository } from '~/core/contracts/repositories';
import {
  CreateTaskRequest,
  UpdateTaskRequest
} from '~/core/contracts/requests/backlog';
import {
  CreateTaskResponse,
  UpdateTaskResponse
} from '~/core/contracts/responses/backlog';
import { PtLoggingService, PtTaskService } from '~/core/contracts/services';
import { PtTask } from '~/core/models/domain';

export class TaskService implements PtTaskService {
  constructor(
    private loggingService: PtLoggingService,
    private backlogRepo: PtBacklogRepository
  ) {}

  public addNewPtTask(
    createTaskRequest: CreateTaskRequest
  ): Promise<CreateTaskResponse> {
    const task: PtTask = {
      id: 0,
      title: createTaskRequest.newTask.title,
      completed: false,
      dateCreated: new Date(),
      dateModified: new Date()
    };

    return new Promise<CreateTaskResponse>((resolve, reject) => {
      this.backlogRepo.insertPtTask(
        task,
        createTaskRequest.currentItem.id,
        error => {
          this.loggingService.error('Adding new task failed');
          reject(error);
        },
        (nextTask: PtTask) => {
          const response: CreateTaskResponse = {
            createdTask: nextTask
          };
          resolve(response);
        }
      );
    });
  }

  public updatePtTask(
    updateTaskRequest: UpdateTaskRequest
  ): Promise<UpdateTaskResponse> {
    const task = updateTaskRequest.taskUpdate.task;
    const newTitle = updateTaskRequest.taskUpdate.newTitle;
    const toggle = updateTaskRequest.taskUpdate.toggle;

    const taskToUpdate: PtTask = {
      id: task.id,
      title: newTitle ? newTitle : task.title,
      completed: toggle ? !task.completed : task.completed,
      dateCreated: task.dateCreated,
      dateModified: new Date()
    };

    return new Promise<UpdateTaskResponse>((resolve, reject) => {
      this.backlogRepo.updatePtTask(
        taskToUpdate,
        updateTaskRequest.currentItem.id,
        error => {
          this.loggingService.error('Updating task failed');
          reject(error);
        },
        (_updatedTask: PtTask) => {
          // do nothing
        }
      );
      const reponse: UpdateTaskResponse = {
        updatedTask: taskToUpdate
      };
      resolve(reponse);
    });
  }
}
