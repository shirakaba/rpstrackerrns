import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image, $ActionBar, $ActionItem, $Button, $ListView } from "react-nativescript";
import { $RadSideDrawer, mainContentNodeTreeRole, drawerContentNodeTreeRole } from "~/rns-plugins/RadSideDrawer";
import { $PullToRefresh } from "~/rns-plugins/@nstudio/nativescript-pulltorefresh";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import { Page, Color } from "react-nativescript/dist/client/ElementRegistry";
import { SideDrawerLocation, SlideInOnTopTransition, RadSideDrawer } from "nativescript-ui-sidedrawer";
import { PtItem } from '~/core/models/domain';
import { Menu } from '~/shared/components/menu/menu';
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { PtAuthService, PtBacklogService } from '~/core/contracts/services';
import {
    toCreateItemRequest,
    toFetchItemsRequest
} from '~/core/contracts/requests/backlog';
import {
    CreateItemResponse,
    FetchItemsResponse
} from '~/core/contracts/responses/backlog';
import {
    getAuthService,
    getBacklogService
} from '~/globals/dependencies/locator';
import { showModalNewItem } from '~/shared/helpers/modals';
import {
    goToDetailPage,
    goToLoginPage,
    goToSettingsPage
  } from '~/shared/helpers/navigation/nav.helper';
import { EventData } from "tns-core-modules/data/observable/observable";
import { dateConverter, itemToIndicatorClassConverter } from "~/utils/converters";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { PullToRefresh } from "@nstudio/nativescript-pulltorefresh";
import { goToDetailPageReact } from "~/shared/helpers/navigation/nav-react.helper";

export class BackLogPage extends React.Component<{ forwardedRef: React.RefObject<Page> }, {}> {
    private readonly drawerRef: React.RefObject<RadSideDrawer> = React.createRef<RadSideDrawer>();
    private readonly authService: PtAuthService = getAuthService();
    private readonly backlogService: PtBacklogService = getBacklogService();
    public items: ObservableArray<PtItem> = new ObservableArray<PtItem>();
    
    componentDidMount(){
        // console.log(`BackLogPage.componentDidMount`);
        this.props.forwardedRef.current!.addCssFile("views/pages/backlog/backlog-page.css");
    }

    render(){
        // console.log(`BackLogPage.render`);
        return (
            <$Page ref={this.props.forwardedRef} onLoaded={this.onPageLoaded}>
                <$ActionBar title="Backlog">
                    <$ActionItem ios={{ position: "right" }}>
                        <$StackLayout className="navbar_image_wrapper" horizontalAlignment={ isIOS ? "right" : void 0 }>
                            <$Image src="res://iconelipseswhite" onTap={this.onToggleDrawerTap} />
                        </$StackLayout>
                    </$ActionItem>
                </$ActionBar>
                <$RadSideDrawer ref={this.drawerRef} id={"sideDrawer"} drawerLocation={SideDrawerLocation.Right}>
                    {/* <$Label>You shouldn't see me</$Label> */}
                    <$StackLayout __rns__nodeTreeRole={mainContentNodeTreeRole} className={"mainContent"}>
                        <$GridLayout className="backlog-container" rows={[new ItemSpec(1, "star"), new ItemSpec(1, "auto")]} columns={[]}>
                            <$GridLayout row={0} rows={[]} columns={[]} className="list-container">
                                <$PullToRefresh onRefresh={this.onRefreshRequested}>
                                    <$ListView
                                        id="backlogList"
                                        className="items-list"
                                        items={this.items}
                                        onItemTap={this.onListItemTap}
                                        cellFactory={(item: PtItem, ref: React.RefObject<any>) => {
                                            const { title, estimate, dateCreated, assignee } = item;

                                            return (
                                                <$GridLayout
                                                    ref={ref}
                                                    className="li-wrapper"
                                                    rows={[new ItemSpec(60, "pixel")]}
                                                    columns={[new ItemSpec(10, "pixel"), new ItemSpec(50, "pixel"), new ItemSpec(1, "star"), new ItemSpec(100, "pixel")]}
                                                >
                                                    <$StackLayout className="li-indicator" row={0} col={0}>
                                                        <$Label className={itemToIndicatorClassConverter(item)} />
                                                    </$StackLayout>

                                                    <$GridLayout col={1} rows={[]} columns={[]} className="li-avatar">
                                                        <$Image src={assignee.avatar} stretch="aspectFit" />
                                                    </$GridLayout>

                                                    <$StackLayout className="li-info-wrapper" col={2}>
                                                        <$Label className="li-title" textWrap={true} text={title} />
                                                        <$Label className="li-estimate" text={'estimate: ' + estimate } />
                                                    </$StackLayout>

                                                    <$StackLayout col={3}>
                                                        <$Label text={dateConverter(dateCreated)} className="li-date" />
                                                    </$StackLayout>
                                                </$GridLayout>
                                            );
                                        }}
                                        separatorColor={new Color("#97a879")}
                                    />
                                </$PullToRefresh>
                            </$GridLayout>

                            <$StackLayout row={1} className="btn-add-wrapper">
                                <$Button text="Add" className="btn-add bottom-safe-nav" onTap={this.onAddTap} />
                            </$StackLayout>

                        </$GridLayout>
                    </$StackLayout>
                    <$StackLayout __rns__nodeTreeRole={drawerContentNodeTreeRole}>
                        <$GridLayout
                            className="side-drawer-panel"
                            rows={[new ItemSpec(1, "auto"), new ItemSpec(1, "star"), new ItemSpec(100, "pixel")]}
                            columns={[]}
                        >
                            <$StackLayout row={0}>
                                <$Image src="res://rpslogo" className="slide-out-img" stretch="aspectFit" />
                            </$StackLayout>

                            <$StackLayout row={1} className="menu-container">
                                <Menu onPresetSelected={this.onPresetSelected} onSettingsTap={this.onSettingsTap}/>
                            </$StackLayout>

                            <$StackLayout row={2} className="menu-container">
                                <$Button onTap={this.onLogoutTap} text="LOGOUT" className="btn-inverse" />
                            </$StackLayout>
                        </$GridLayout>
                    </$StackLayout>
                </$RadSideDrawer>
            </$Page>
        );
    }

    private readonly onPresetSelected = (preset: "my"|"open"|"closed") => {
        this.refresh();
    };

    private readonly onPageLoaded = (args: EventData) => {
        this.refresh();
    };

    private readonly onListItemTap = (itemEventData: ItemEventData) => {
        const item: PtItem = this.items.getItem(itemEventData.index);

        // TODO: navigate to React-managed page
        // goToDetailPage(item);
        console.log(`Going to (React) detail page...`);
        goToDetailPageReact({ item });
    };

    private readonly onAddTap = () => {
        const page: Page = this.props.forwardedRef.current!;
        showModalNewItem(page).then((newItem: PtItem) => {
            if (newItem) {
                this.addItem(newItem, this.authService.getCurrentUser());
            }
        });
    };

    private readonly onLogoutTap = () => {
        this.onLogoutTapHandler().then(() => goToLoginPage());
    };

    /* In the original, this was deferred to the menu component, but we'll pass it down as a prop in this version. */
    private readonly onSettingsTap = () => {
        // TODO: navigate to React-managed page
        goToSettingsPage();
    };

    private readonly onToggleDrawerTap = () => {
        this.drawerRef.current!.toggleDrawerState();
    };
    
    private readonly onLogoutTapHandler = () => {
        return this.authService.logout();
    }

    private readonly onRefreshRequested = (args: EventData) => {
        const pullToRefresh: PullToRefresh = args.object as PullToRefresh;
        this.refresh();
        pullToRefresh.refreshing = false;
    };
    
    private readonly refresh = () => {
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
    
    private readonly addItem = (newItem, assignee) => {
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