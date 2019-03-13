import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Button } from 'tns-core-modules/ui/button';
import { ItemEventData } from 'tns-core-modules/ui/list-view';
import { EventData, NavigatedData, Page } from 'tns-core-modules/ui/page';
import { PtItem } from '~/core/models/domain';
import { showModalNewItem } from '~/shared/helpers/modals';
import {
  goToDetailPage,
  goToLoginPage,
  goToSettingsPage
} from '~/shared/helpers/navigation/nav.helper';
import { BacklogViewModel } from '~/shared/view-models/pages/backlog/backlog.page.vm';
import '~/utils/converters';

const backLogVm: BacklogViewModel = new BacklogViewModel();
let drawer: RadSideDrawer = null;

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  page.bindingContext = backLogVm;
}

export function onLoaded(args: EventData) {
  const page = <Page>args.object;
  backLogVm.refresh();
  drawer = page.getViewById('sideDrawer');
}

export function toggleDrawer() {
  drawer.toggleDrawerState();
}

export function onListItemTap(args: ItemEventData) {
  goToDetailPage(args.view.bindingContext);
}

export function onAddTap(args: EventData) {
  const button = <Button>args.object;

  showModalNewItem(button.page).then((newItem: PtItem) =>
    backLogVm.addNewItemHandler(newItem)
  );
}

export function onRefreshRequested(args) {
  // Get reference to the PullToRefresh;
  const pullToRefresh = args.object;
  backLogVm.refresh();
  pullToRefresh.refreshing = false;
}

export function onLogoutTap() {
  backLogVm.onLogoutTapHandler().then(() => goToLoginPage());
}

export function onSettingsTap() {
  goToSettingsPage();
}
