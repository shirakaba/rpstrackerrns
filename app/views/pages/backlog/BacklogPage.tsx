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
import { DetailPageProps } from "~/core/models/page-props/detail-page-props";
import { DetailPage } from "../detail/DetailPage";
import { NavigatedData } from "tns-core-modules/ui/page/page";
import { SettingsPage } from "../settings/SettingsPage";
import { SettingsPageProps } from "~/core/models/page-props/settings-page-props";
import { BacklogPageProps } from "~/core/models/page-props/backlog-page-props";
import { LoginPageProps } from "~/core/models/page-props/login-page-props";
import { LoginPage } from "../login/LoginPage";
// import { goToDetailPageReact } from "~/shared/helpers/navigation/nav-react.helper";

type Props = BacklogPageProps;

interface State {
    navToLoginPageArgs: LoginPageProps|null,
    navToDetailPageArgs: DetailPageProps|null,
    navToSettingsPageArgs: SettingsPageProps|null,
}

export class BacklogPage extends React.Component<Props, State> {
    private readonly drawerRef: React.RefObject<RadSideDrawer> = React.createRef<RadSideDrawer>();
    private readonly loginPageRef: React.RefObject<Page> = React.createRef<Page>();
    private readonly detailPageRef: React.RefObject<Page> = React.createRef<Page>();
    private readonly settingsPageRef: React.RefObject<Page> = React.createRef<Page>();

    private readonly authService: PtAuthService = getAuthService();
    private readonly backlogService: PtBacklogService = getBacklogService();
    public items: ObservableArray<PtItem> = new ObservableArray<PtItem>();

    constructor(props: Props){
        super(props);

        this.state = {
            navToLoginPageArgs: null,
            navToDetailPageArgs: null,
            navToSettingsPageArgs: null,
        };
    }
    
    componentDidMount(){
        this.props.forwardedRef.current!.addCssFile("views/pages/backlog/backlog-page.css");
    }

    render(){
        const { navToDetailPageArgs, navToSettingsPageArgs, navToLoginPageArgs } = this.state;

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
                                {/* Setting any % height on btn-add, or exact height of 60, is somehow screwing up the hitbox; seems like an {N} bug */}
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

                {/* === ROUTES THAT WE CAN NAVIGATE ON TO (not visual children of Page, but can be mounted as dependents) === */}
                {/* It's a bit fiddly, but this setup lets us lazily mount a Page. */}
                {/* One day we'll make a navigation framework to produce a simpler approach, but... one thing at a time! */}
                {navToLoginPageArgs === null ? null : (<LoginPage {...navToLoginPageArgs}/>)}

                {navToDetailPageArgs === null ? null : (<DetailPage {...navToDetailPageArgs}/>)}

                {navToSettingsPageArgs === null ? null : (<SettingsPage {...navToSettingsPageArgs}/>)}
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
        console.log(`[onListItemTap] Viewing item ID`, item.id);

        /* No longer recommending this approach. Although it's simple, it leads to crashes. */
        // goToDetailPageReact({ item });

        this.setState(
            {
                navToDetailPageArgs: {
                    forwardedRef: this.detailPageRef,
                    item,
                    onNavigatedFrom: this.onNavigatedFromDetailPage,
                }
            },
            () => {
                this.props.forwardedRef.current!.frame.navigate({
                    create: () => {
                        return this.detailPageRef.current!;
                    }
                })
            }
        );
    };

    /* From rigor789: Pages are loaded in only upon first navigation (lazily).
     * Pages are not unloaded if they're in the back-stack, and they get cleaned up if:
     * - you set clearHistory in the NavigationEntry, or;
     * - you navigate away whilst backStackVisible is false  */
    private readonly onNavigatedFromDetailPage = (args: NavigatedData) => {
        if(args.isBackNavigation){
            // console.log(`[onNavigatedFromDetailPage]`);
            this.setState({ navToDetailPageArgs: null }, () => {
                // console.log(`[onNavigatedFromDetailPage] refreshing`);

                /* Seems that refreshing isn't necessary. e.g. Estimate gets updated in list after altering on Detail page. */
                // this.refresh();
            });
        }
    };

    private readonly onNavigatedFromSettingsPage = (args: NavigatedData) => {
        if(args.isBackNavigation){
            this.setState({ navToSettingsPageArgs: null }, () => {
                /* Settings page doesn't have a purpose at the moment, so I'm unsure whether we'll want to refresh upon return from it at the moment. */
                // this.refresh();
            });
        }
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
        this.authService.logout()
        .then(() => {
            /* No longer recommending this approach. Although it's simple, it leads to crashes. */
            // goToLoginPageReact();

            this.setState(
                {
                    navToLoginPageArgs: {
                        forwardedRef: this.loginPageRef,
                    }
                },
                () => {
                    this.props.forwardedRef.current!.frame.navigate({
                        create: () => {
                            return this.loginPageRef.current!;
                        },
                        clearHistory: true,
                    })
                }
            );
        });
    };

    /* In the original, this was deferred to the menu component, but we'll pass it down as a prop in this version. */
    private readonly onSettingsTap = () => {
        /* No longer recommending this approach. Although it's simple, it leads to crashes. */
        // goToSettingsPageReact({});

        this.setState(
            {
                navToSettingsPageArgs: {
                    forwardedRef: this.settingsPageRef,
                    onNavigatedFrom: this.onNavigatedFromSettingsPage,
                }
            },
            () => {
                this.props.forwardedRef.current!.frame.navigate({
                    create: () => {
                        return this.settingsPageRef.current!;
                    }
                })
            }
        );
    };

    private readonly onToggleDrawerTap = () => {
        this.drawerRef.current!.toggleDrawerState();
    };

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