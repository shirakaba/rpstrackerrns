import { PtItem, PtUser } from '~/core/models/domain';

export interface PtItemDetailsEditFormModel {
  title: string;
  description: string;
  typeStr: string;
  statusStr: string;
  estimate: number;
  priorityStr: string;
  assigneeName: string;
}

export function ptItemToFormModel(item: PtItem): PtItemDetailsEditFormModel {
  return {
    title: item.title,
    description: item.description,
    typeStr: item.type,
    statusStr: item.status,
    estimate: item.estimate,
    priorityStr: item.priority,
    assigneeName: item.assignee ? item.assignee.fullName : 'unassigned'
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
    assignee: updatedAssignee
  });
  return updatedItem;
}
