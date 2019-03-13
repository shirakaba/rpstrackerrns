import { PtComment, PtObjectBase, PtTask, PtUser } from '~/core/models/domain';
import { PtItemType } from '~/core/models/domain/types';
import { PriorityEnum, StatusEnum } from './enums';

export interface PtItem extends PtObjectBase {
  description?: string;
  type: PtItemType;
  estimate: number;
  priority: PriorityEnum;
  status: StatusEnum;
  assignee: PtUser;
  tasks: PtTask[];
  comments: PtComment[];
}
