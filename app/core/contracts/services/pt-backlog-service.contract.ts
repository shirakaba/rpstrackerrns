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
import { PresetType } from '~/core/models/types';

export interface PtBacklogService {
  getCurrentPreset(): PresetType;

  setPreset(preset): Promise<void>;

  fetchItems(fetchItemsRequest: FetchItemsRequest): Promise<FetchItemsResponse>;

  getPtItem(
    fetchSingleItemRequest: FetchSingleItemRequest
  ): Promise<FetchSingleItemResponse>;

  getItemFromCacheOrServer(
    fetchSingleItemRequest: FetchSingleItemRequest
  ): Promise<FetchSingleItemResponse>;

  addNewPtItem(
    createItemRequest: CreateItemRequest
  ): Promise<CreateItemResponse>;

  updatePtItem(
    updateItemRequest: UpdateItemRequest
  ): Promise<UpdateItemResponse>;

  deletePtItem(
    deleteItemRequest: DeleteItemRequest
  ): Promise<DeleteItemResponse>;
}
