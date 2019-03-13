import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { PT_ITEM_PRIORITIES, PT_ITEM_STATUSES } from '~/core/constants';
import { ItemType } from '~/core/constants/pt-item-types';
import {
  toCreateCommentRequest,
  toCreateTaskRequest,
  toDeleteItemRequest,
  toUpdateItemRequest
} from '~/core/contracts/requests/backlog';
import {
  PtAuthService,
  PtBacklogService,
  PtCommentService,
  PtTaskService
} from '~/core/contracts/services';
import { PtItem, PtUser } from '~/core/models/domain';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { PriorityEnum } from '~/core/models/domain/enums';
import { PtItemType } from '~/core/models/domain/types';
import { PtNewComment, PtNewTask } from '~/core/models/dto/backlog';
import {
  applyFormModelUpdatesToItem,
  PtItemDetailsEditFormModel,
  ptItemToFormModel
} from '~/core/models/forms';
import { DetailScreenType } from '~/core/models/types';
import { getCurrentUserAvatar } from '~/core/services';
import {
  getApiEndpoint,
  getAuthService,
  getBacklogService,
  getCommentService,
  getTaskService
} from '~/globals/dependencies/locator';
import { back } from '~/shared/helpers/navigation/nav.helper';
import { ObservableProperty } from '~/shared/observable-property-decorator';
import { PtCommentViewModel } from './pt-comment.vm';
import { PtTaskViewModel } from './pt-task.vm';

export class DetailViewModel extends Observable {
  private authService: PtAuthService;
  private backlogService: PtBacklogService;
  private taskService: PtTaskService;
  private commentService: PtCommentService;

  @ObservableProperty() public selectedScreen: DetailScreenType = 'details';
  @ObservableProperty() private selectedAssignee: PtUser;
  public itemTitle: string;

  /* details form */
  public itemForm: PtItemDetailsEditFormModel = null;
  public itemTypesProvider = ItemType.List.map(t => t.PtItemType);
  public statusesProvider = PT_ITEM_STATUSES;
  public prioritiesProvider = PT_ITEM_PRIORITIES;
  public selectedTypeValue: PtItemType;
  public selectedPriorityValue: PriorityEnum;
  public itemTypeImage;
  /* details form END */

  /* tasks */
  public newTaskTitle = EMPTY_STRING;
  public tasks: ObservableArray<PtTaskViewModel>;
  /* tasks END */

  /* comments */
  public currentUserAvatar: string;
  public newCommentText = EMPTY_STRING;
  public comments: ObservableArray<PtCommentViewModel>;
  /* comments END */

  public get itemTypeEditorDisplayName() {
    return 'Type';
  }

  public getSelectedAssignee() {
    return this.selectedAssignee ? this.selectedAssignee : this.ptItem.assignee;
  }

  public setSelectedAssignee(selectedAssignee: PtUser) {
    if (selectedAssignee) {
      // this.set('selectedAssignee', selectedAssignee);
      this.selectedAssignee = selectedAssignee;
      this.notifyUpdateItem();
    }
  }

  constructor(private ptItem: PtItem) {
    super();

    this.authService = getAuthService();
    this.backlogService = getBacklogService();
    this.taskService = getTaskService();
    this.commentService = getCommentService();

    this.itemForm = ptItemToFormModel(ptItem);

    this.currentUserAvatar = getCurrentUserAvatar(
      getApiEndpoint(),
      this.authService.getCurrentUserId()
    );
    this.itemTitle = ptItem.title;
    this.selectedAssignee = ptItem.assignee;

    this.tasks = new ObservableArray<PtTaskViewModel>(
      ptItem.tasks.map(task => new PtTaskViewModel(task, ptItem))
    );
    this.comments = new ObservableArray<PtCommentViewModel>(
      ptItem.comments.map(comment => new PtCommentViewModel(comment))
    );
  }

  public onNavBackTap() {
    back();
  }

  public onTabDetailsTap() {
    // this.set('selectedScreen', 'details');
    this.selectedScreen = 'details';
  }

  public onTabTasksTap() {
    // this.set('selectedScreen', 'tasks');
    this.selectedScreen = 'tasks';
  }

  public onTabChitchatTap() {
    // this.set('selectedScreen', 'chitchat');
    this.selectedScreen = 'chitchat';
  }

  /* details START */
  public updateSelectedTypeValue(selTypeValue: PtItemType) {
    this.set('selectedTypeValue', selTypeValue);
    this.set(
      'itemTypeImage',
      ItemType.imageResFromType(this.selectedTypeValue)
    );
  }

  public updateSelectedPriorityValue(
    editorPriority: PriorityEnum
  ): PriorityEnum {
    const selectedPriorityValue = editorPriority
      ? editorPriority
      : <PriorityEnum>this.itemForm.priorityStr;
    this.set('selectedPriorityValue', selectedPriorityValue);
    return selectedPriorityValue;
  }

  public deleteRequested() {
    const deleteItemRequest = toDeleteItemRequest(this.ptItem);
    this.backlogService
      .deletePtItem(deleteItemRequest)
      .then(() => {})
      .catch(() => {
        console.log('some error occured');
      });
  }
  /* details END */

  /* tasks START */
  public onAddTask() {
    const newTitle = this.newTaskTitle.trim();
    if (newTitle.length === 0) {
      return;
    }

    const newTask: PtNewTask = {
      title: newTitle,
      completed: false
    };

    const createTaskRequest = toCreateTaskRequest(newTask, this.ptItem);

    this.taskService
      .addNewPtTask(createTaskRequest)
      .then(response => {
        this.tasks.unshift(
          new PtTaskViewModel(response.createdTask, this.ptItem)
        );
        this.set('newTaskTitle', EMPTY_STRING);
      })
      .catch(() => {
        console.log('something went wrong when adding task');
      });
  }
  /* tasks END */

  /* comments START */
  public onAddComment() {
    const newCommentTxt = this.newCommentText.trim();
    if (newCommentTxt.length === 0) {
      return;
    }

    const newComment: PtNewComment = {
      title: newCommentTxt
    };

    const createCommentRequest = toCreateCommentRequest(
      newComment,
      this.ptItem
    );

    this.commentService
      .addNewPtComment(createCommentRequest)
      .then(response => {
        const addedComment = response.createdComment;
        addedComment.user.avatar = this.currentUserAvatar;
        this.comments.unshift(new PtCommentViewModel(addedComment));
        this.set('newCommentText', EMPTY_STRING);
      })
      .catch(() => {
        console.log('something went wrong when adding comment');
      });
  }
  /* comments END */

  public notifyUpdateItem() {
    const updatedItem = applyFormModelUpdatesToItem(
      this.ptItem,
      this.itemForm,
      this.selectedAssignee
    );

    const updateItemRequest = toUpdateItemRequest(updatedItem);

    this.backlogService.updatePtItem(updateItemRequest);
  }
}
