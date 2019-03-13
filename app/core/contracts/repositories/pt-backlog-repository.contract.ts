import { PresetType } from '~/core/models/types';
import { PtItem, PtTask, PtComment } from '~/core/models/domain';

export interface PtBacklogRepository {
  apiEndpoint: string;
  fetchPtItems(
    currentPreset: PresetType,
    currentUserId: number,
    errorHandler: (error: any) => void,
    successHandler: (data: PtItem[]) => void
  ): void;

  insertPtItem(
    item: PtItem,
    errorHandler: (error: any) => void,
    successHandler: (nextItem: PtItem) => void
  ): void;

  getPtItem(
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (ptItem: PtItem) => void
  ): void;

  updatePtItem(
    item: PtItem,
    errorHandler: (error: any) => void,
    successHandler: (updatedItem: PtItem) => void
  ): void;

  deletePtItem(
    itemId: number,
    errorHandler: (error: any) => void,
    successHandler: () => void
  ): void;

  insertPtTask(
    task: PtTask,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (nextTask: PtTask) => void
  ): void;

  updatePtTask(
    task: PtTask,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (updatedTask: PtTask) => void
  ): void;

  insertPtComment(
    comment: PtComment,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (nextComment: PtComment) => void
  ): void;

  deletePtComment(
    ptCommentId: number,
    errorHandler: (error: any) => void,
    successHandler: () => void
  ): void;
}
