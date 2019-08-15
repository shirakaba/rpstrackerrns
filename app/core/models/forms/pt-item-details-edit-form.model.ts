import { PtItem, PtUser, PtTask, PtComment } from '~/core/models/domain';

export interface PtItemDetailsEditFormModel {
  title: string;
  description: string;
  typeStr: string;
  statusStr: string;
  estimate: number;
  priorityStr: string;
  assigneeName: string;

  /* Added to support React (so as not to conceal the state inside ObservableArrays) */
  tasks: PtTask[],
  comments: PtComment[],
}

export function ptItemToFormModel(item: PtItem): PtItemDetailsEditFormModel {
  return {
    title: item.title,
    description: item.description,
    typeStr: item.type,
    statusStr: item.status,
    estimate: item.estimate,
    priorityStr: item.priority,
    assigneeName: item.assignee ? item.assignee.fullName : 'unassigned',

    /* Added to support React (so as not to conceal the state inside ObservableArrays) */
    tasks: item.tasks,
    comments: item.comments,
  };
}

export function applyFormModelUpdatesToItem(
  origPtItem: PtItem,
  itemForm: PtItemDetailsEditFormModel,
  reselectedAssignee: PtUser
): PtItem {
  const updatedAssignee = reselectedAssignee
    ? reselectedAssignee
    : origPtItem.assignee;

  const updatedItem = Object.assign({}, origPtItem, {
    title: itemForm.title,
    description: itemForm.description,
    type: itemForm.typeStr,
    status: itemForm.statusStr,
    priority: itemForm.priorityStr,
    estimate: itemForm.estimate,
    assignee: updatedAssignee,

    // tasks: itemForm.tasks,
    // comments: itemForm.comments,
  });
  return updatedItem;
}
