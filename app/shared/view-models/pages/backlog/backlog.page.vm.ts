import { Observable } from 'tns-core-modules/data/observable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import {
  toCreateItemRequest,
  toFetchItemsRequest
} from '~/core/contracts/requests/backlog';
import {
  CreateItemResponse,
  FetchItemsResponse
} from '~/core/contracts/responses/backlog';
import { PtAuthService, PtBacklogService } from '~/core/contracts/services';
import { PtItem } from '~/core/models/domain';
import {
  getAuthService,
  getBacklogService
} from '~/globals/dependencies/locator';

export class BacklogViewModel extends Observable {
  private authService: PtAuthService;
  private backlogService: PtBacklogService;

  public items: ObservableArray<PtItem> = new ObservableArray<PtItem>();

  constructor() {
    super();

    this.authService = getAuthService();
    this.backlogService = getBacklogService();
  }

  public onPresetSelected() {
    this.refresh();
  }

  public addNewItemHandler(newItem: PtItem) {
    if (newItem) {
      this.addItem(newItem, this.authService.getCurrentUser());
    }
  }

  public onLogoutTapHandler() {
    return this.authService.logout();
  }

  public refresh() {
    const fetchReq = toFetchItemsRequest(
      this.backlogService.getCurrentPreset(),
      this.authService.getCurrentUserId()
    );

    this.backlogService.fetchItems(fetchReq).then((r: FetchItemsResponse) => {
      // empty the array
      this.items.length = 0;

      // push the result into the array
      this.items.push(r.items);
    });
  }

  private addItem(newItem, assignee) {
    const createItemRequest = toCreateItemRequest(newItem, assignee);

    this.backlogService
      .addNewPtItem(createItemRequest)
      .then((r: CreateItemResponse) => {
        this.items.unshift(r.createdItem);
      })
      .catch(() => {
        console.log('some error occured');
      });
  }
}
