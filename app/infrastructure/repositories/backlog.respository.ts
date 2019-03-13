import { PtBacklogRepository } from '~/core/contracts/repositories';
import { PtComment, PtItem, PtTask } from '~/core/models/domain';
import { PresetType } from '~/core/models/types';
import { handleFetchErrors } from '~/infrastructure/fetch-error-handler';

/*
(<any>fetch) = (url: string): Promise<Response> => {
  console.log('calling overridden fetch' + url);
  return Promise.resolve(null);
};
*/

// global['bob'] = function() {
////  console.log('hi bob');
// };

const alex = 1;

export class BacklogRepository implements PtBacklogRepository {
  constructor(public apiEndpoint: string) {}

  private getFilteredBacklogUrl(
    currentPreset: PresetType,
    currentUserId?: number
  ) {
    switch (currentPreset) {
      case 'my':
        if (currentUserId) {
          return `${this.apiEndpoint}/myItems?userId=${currentUserId}`;
        } else {
          return `${this.apiEndpoint}/backlog?i=${alex}`;
        }
      case 'open':
        return `${this.apiEndpoint}/openItems`;
      case 'closed':
        return `${this.apiEndpoint}/closedItems`;
      default:
        return `${this.apiEndpoint}/backlog`;
    }
  }

  private getPtItemUrl(itemId: number) {
    return `${this.apiEndpoint}/item/${itemId}`;
  }

  private postPtItemUrl() {
    return `${this.apiEndpoint}/item`;
  }

  private putPtItemUrl(itemId: number) {
    return `${this.apiEndpoint}/item/${itemId}`;
  }

  private deletePtItemUrl(itemId: number) {
    return `${this.apiEndpoint}/item/${itemId}`;
  }

  private postPtTaskUrl() {
    return `${this.apiEndpoint}/task`;
  }

  private putPtTaskUrl(taskId: number) {
    return `${this.apiEndpoint}/task/${taskId}`;
  }

  private postPtCommentUrl() {
    return `${this.apiEndpoint}/comment`;
  }

  private deletePtCommentUrl(commentId: number) {
    return `${this.apiEndpoint}/comment/${commentId}`;
  }

  public fetchPtItems(
    currentPreset: PresetType,
    currentUserId: number,
    errorHandler: (error: any) => void,
    successHandler: (data: PtItem[]) => void
  ) {
    fetch(this.getFilteredBacklogUrl(currentPreset, currentUserId), {
      method: 'GET'
    })
      .then((response: Response) => {
        console.log('RESPONSE RECEIVED');
        return response.json();
      })
      .then((data: PtItem[]) => {
        console.log(data.length);
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public insertPtItem(
    item: PtItem,
    errorHandler: (error: any) => void,
    successHandler: (nextItem: PtItem) => void
  ) {
    fetch(this.postPtItemUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item: item })
    })
      .then(handleFetchErrors)
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public getPtItem(
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (ptItem: PtItem) => void
  ) {
    fetch(this.getPtItemUrl(ptItemId), {
      method: 'GET'
    })
      .then(handleFetchErrors)
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public updatePtItem(
    item: PtItem,
    errorHandler: (error: any) => void,
    successHandler: (updatedItem: PtItem) => void
  ) {
    fetch(this.putPtItemUrl(item.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item: item })
    })
      .then(handleFetchErrors)
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public deletePtItem(
    itemId: number,
    errorHandler: (error: any) => void,
    successHandler: () => void
  ) {
    fetch(this.deletePtItemUrl(itemId), {
      method: 'DELETE'
    })
      .then(handleFetchErrors)
      .then(() => {
        successHandler();
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public insertPtTask(
    task: PtTask,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (nextTask: PtTask) => void
  ) {
    fetch(this.postPtTaskUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: task, itemId: ptItemId })
    })
      .then(handleFetchErrors)
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public updatePtTask(
    task: PtTask,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (updatedTask: PtTask) => void
  ) {
    fetch(this.putPtTaskUrl(task.id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: task, itemId: ptItemId })
    })
      .then(handleFetchErrors)
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public insertPtComment(
    comment: PtComment,
    ptItemId: number,
    errorHandler: (error: any) => void,
    successHandler: (nextComment: PtComment) => void
  ) {
    fetch(this.postPtCommentUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: comment,
        itemId: ptItemId
      })
    })
      .then(handleFetchErrors)
      .then(data => {
        successHandler(data);
      })
      .catch(er => {
        errorHandler(er);
      });
  }

  public deletePtComment(
    ptCommentId: number,
    errorHandler: (error: any) => void,
    successHandler: () => void
  ) {
    fetch(this.deletePtCommentUrl(ptCommentId), {
      method: 'DELETE'
    })
      .then(handleFetchErrors)
      .then(() => {
        successHandler();
      })
      .catch(er => {
        errorHandler(er);
      });
  }
}
