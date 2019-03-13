// import { appStore } from '~/core/app-store';
import { PtBacklogRepository } from '~/core/contracts/repositories';
import {
  CreateItemRequest,
  DeleteItemRequest,
  FetchItemsRequest,
  FetchSingleItemRequest,
  UpdateItemRequest
} from '~/core/contracts/requests/backlog';
import {
  CreateItemResponse,
  DeleteItemResponse,
  FetchItemsResponse,
  FetchSingleItemResponse,
  UpdateItemResponse
} from '~/core/contracts/responses/backlog';
import {
  PtAppStateService,
  PtBacklogService,
  PtLoggingService
} from '~/core/contracts/services';
import { PtItem } from '~/core/models/domain';
import { PriorityEnum, StatusEnum } from '~/core/models/domain/enums';
import { PresetType } from '~/core/models/types';
import { setUserAvatar } from '~/core/services';

// const SELECTED_PRESET = 'SELECTED_PRESET';
// const BACKLOG_ITEMS = 'BACKLOG_ITEMS';

export class BacklogService implements PtBacklogService {
  constructor(
    private loggingService: PtLoggingService,
    private backlogRepo: PtBacklogRepository,
    private appStateService: PtAppStateService
  ) {}

  public getCurrentPreset(): PresetType {
    const curPre = this.appStateService.getStateItem('selectedPreset');
    if (curPre) {
      return curPre;
    } else {
      return 'open';
    }
  }

  public setPreset(preset): Promise<void> {
    const curPreset = this.appStateService.getStateItem('selectedPreset');
    if (curPreset !== preset) {
      this.appStateService.setStateItem('selectedPreset', preset);
    }
    return Promise.resolve();
  }

  public fetchItems(
    fetchItemsRequest: FetchItemsRequest
  ): Promise<FetchItemsResponse> {
    return new Promise<FetchItemsResponse>((resolve, reject) => {
      this.backlogRepo.fetchPtItems(
        fetchItemsRequest.currentPreset,
        fetchItemsRequest.currentUserId,
        error => {
          this.loggingService.error('Fetch items failed');
          reject(error);
        },
        (ptItems: PtItem[]) => {
          ptItems.forEach(i => {
            setUserAvatar(this.backlogRepo.apiEndpoint, i.assignee);
            i.comments.forEach(c =>
              setUserAvatar(this.backlogRepo.apiEndpoint, c.user)
            );
          });

          // this.storageService.setItem(BACKLOG_ITEMS, ptItems);
          this.appStateService.setStateItem('backlogItems', ptItems);
          const response: FetchItemsResponse = {
            items: ptItems
          };
          resolve(response);
        }
      );
    });
  }

  public getPtItem(
    fetchSingleItemRequest: FetchSingleItemRequest
  ): Promise<FetchSingleItemResponse> {
    return new Promise<FetchSingleItemResponse>((resolve, reject) => {
      this.backlogRepo.getPtItem(
        fetchSingleItemRequest.ptItemId,
        error => {
          this.loggingService.error('Fetch items failed');
          reject(error);
        },
        (ptItem: PtItem) => {
          setUserAvatar(this.backlogRepo.apiEndpoint, ptItem.assignee);
          ptItem.comments.forEach(c =>
            setUserAvatar(this.backlogRepo.apiEndpoint, c.user)
          );

          this.appStateService.setStateItem('currentSelectedItem', ptItem);
          const response: FetchSingleItemResponse = {
            item: ptItem
          };
          resolve(response);
        }
      );
    });
  }

  public getItemFromCacheOrServer(
    fetchSingleItemRequest: FetchSingleItemRequest
  ): Promise<FetchSingleItemResponse> {
    const allLocalItems = this.appStateService.getStateItem('backlogItems');
    const selectedItem = allLocalItems.find(
      i => i.id === fetchSingleItemRequest.ptItemId
    );

    if (selectedItem) {
      this.appStateService.setStateItem('currentSelectedItem', selectedItem);
      const response: FetchSingleItemResponse = {
        item: selectedItem
      };
      return Promise.resolve(response);
    } else {
      return this.getPtItem(fetchSingleItemRequest);
    }
  }

  public addNewPtItem(
    createItemRequest: CreateItemRequest
  ): Promise<CreateItemResponse> {
    const item: PtItem = {
      id: 0,
      title: createItemRequest.newItem.title,
      description: createItemRequest.newItem.description,
      type: createItemRequest.newItem.type,
      estimate: 0,
      priority: PriorityEnum.Medium,
      status: StatusEnum.Open,
      assignee: createItemRequest.assignee,
      tasks: [],
      comments: [],
      dateCreated: new Date(),
      dateModified: new Date()
    };

    return new Promise((resolve, reject) => {
      this.backlogRepo.insertPtItem(
        item,
        error => {
          this.loggingService.error('Adding new item failed');
          reject(error);
        },
        (nextItem: PtItem) => {
          setUserAvatar(this.backlogRepo.apiEndpoint, nextItem.assignee);

          /*
          this.storageService.setItem(BACKLOG_ITEMS, [
            nextItem,
            ...this.storageService.getItem<PtItem[]>(BACKLOG_ITEMS)
          ]);
          */

          this.appStateService.setStateItem('backlogItems', [
            nextItem,
            ...this.appStateService.getStateItem('backlogItems')
          ]);

          const response: CreateItemResponse = {
            createdItem: nextItem
          };

          resolve(response);
        }
      );
    });
  }

  public updatePtItem(
    updateItemRequest: UpdateItemRequest
  ): Promise<UpdateItemResponse> {
    return new Promise<UpdateItemResponse>((resolve, reject) => {
      this.backlogRepo.updatePtItem(
        updateItemRequest.itemToUpdate,
        error => {
          this.loggingService.error('Updating item failed');
          reject(error);
        },
        (updatedItem: PtItem) => {
          const response: UpdateItemResponse = {
            updatedItem: updatedItem
          };
          resolve(response);
        }
      );
    });
  }

  public deletePtItem(
    deleteItemRequest: DeleteItemRequest
  ): Promise<DeleteItemResponse> {
    return new Promise<DeleteItemResponse>((resolve, reject) => {
      this.backlogRepo.deletePtItem(
        deleteItemRequest.itemToDelete.id,
        error => {
          this.loggingService.error('Deleting item failed');
          reject(error);
        },
        () => {
          /*
          const backlogItems = this.storageService.getItem<PtItem[]>(
            BACKLOG_ITEMS
          );
          */
          const backlogItems = this.appStateService.getStateItem(
            'backlogItems'
          );
          const updatedItems = backlogItems.filter(i => {
            return i.id !== deleteItemRequest.itemToDelete.id;
          });
          // this.storageService.setItem(BACKLOG_ITEMS, updatedItems);
          this.appStateService.setStateItem('backlogItems', updatedItems);

          const response: DeleteItemResponse = {
            deleted: true
          };

          resolve(response);
        }
      );
    });
  }
}
