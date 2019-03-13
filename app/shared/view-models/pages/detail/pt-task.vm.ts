import { Observable } from 'tns-core-modules/data/observable';
import { toUpdateTaskRequest } from '~/core/contracts/requests/backlog';
import { PtTaskService } from '~/core/contracts/services';
import { PtItem, PtTask } from '~/core/models/domain';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { PtTaskUpdate } from '~/core/models/dto/backlog/tasks/pt-task-update.model';
import { getTaskService } from '~/globals/dependencies/locator';
import { ObservableProperty } from '~/shared/observable-property-decorator';

export class PtTaskViewModel extends Observable implements PtTask {
  private taskService: PtTaskService;

  public id: number;
  public dateCreated: Date;
  public dateDeleted?: Date;
  @ObservableProperty() public title?: string;
  @ObservableProperty() public dateModified: Date;
  @ObservableProperty() public completed: boolean;

  private lastUpdatedTitle = EMPTY_STRING;

  constructor(origTask: PtTask, private ptItem: PtItem) {
    super();
    this.id = origTask.id;
    this.title = origTask.title;
    this.dateCreated = origTask.dateCreated;
    this.dateModified = origTask.dateModified;
    this.dateDeleted = origTask.dateDeleted;
    this.completed = origTask.completed;

    this.taskService = getTaskService();
  }

  public onTaskToggleRequested() {
    const taskUpdate: PtTaskUpdate = {
      task: this,
      toggle: true,
      newTitle: this.title
    };

    this.updateTask(taskUpdate).then(response => {
      const updatedTask = response.updatedTask;
      // this.set('title', updatedTask.title);
      // this.set('dateModified', updatedTask.dateModified);
      // this.set('completed', updatedTask.completed);
      this.title = updatedTask.title;
      this.dateModified = updatedTask.dateModified;
      this.completed = updatedTask.completed;
    });
  }

  public onTaskFocused(text: string) {
    this.lastUpdatedTitle = text;
  }

  public onTaskBlurred() {
    this.lastUpdatedTitle = EMPTY_STRING;
  }

  public onTextChange(text: string) {
    const changedTitle = text;

    if (this.lastUpdatedTitle !== changedTitle) {
      this.lastUpdatedTitle = changedTitle;

      const taskUpdate: PtTaskUpdate = {
        task: this,
        toggle: false,
        newTitle: this.lastUpdatedTitle
      };

      this.updateTask(taskUpdate);
    }
  }

  private updateTask(taskUpdate: PtTaskUpdate) {
    const updateTaskRequest = toUpdateTaskRequest(taskUpdate, this.ptItem);
    return this.taskService.updatePtTask(updateTaskRequest);
  }
}
