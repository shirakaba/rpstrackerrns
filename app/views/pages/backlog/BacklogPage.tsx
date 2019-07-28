import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image, $ActionBar, $ActionItem, $Button } from "react-nativescript";
import { $RadSideDrawer, mainContentNodeTreeRole, drawerContentNodeTreeRole } from "~/rns-plugins/RadSideDrawer";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import { Page } from "react-nativescript/dist/client/ElementRegistry";
import { SideDrawerLocation, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";

export class BackLogPage extends React.Component<{ forwardedRef: React.RefObject<Page> }, {}> {
    componentDidMount(){
        console.log(`BackLogPage.componentDidMount`);
    }

    render(){
        console.log(`BackLogPage.render`);
        return (
            <$Page ref={this.props.forwardedRef}>
                <$ActionBar>
                    <$ActionItem>
                        <$StackLayout className="navbar_image_wrapper" horizontalAlignment={ isIOS ? "right" : void 0 }>
                            <$Image src="res://iconelipseswhite" onTap={this.onToggleDrawerTap} />
                        </$StackLayout>
                    </$ActionItem>
                </$ActionBar>
                <$RadSideDrawer id={"sideDrawer"} drawerLocation={SideDrawerLocation.Right}>
                    {/* <$Label>You shouldn't see me</$Label> */}
                    <$StackLayout __rns__nodeTreeRole={mainContentNodeTreeRole} className={"mainContent"}>
                        <$GridLayout className="backlog-container" rows={[new ItemSpec(1, "star"), new ItemSpec(1, "auto")]} columns={[]}>
                            <$GridLayout row={0} rows={[]} columns={[]} className="list-container">
                                {/* <nsRefresh:PullToRefresh refresh="onRefreshRequested">
                                    <$ListView
                                        id="backlogList"
                                        className="items-list"
                                        items="{{ items }}"
                                        itemTap="onListItemTap"
                                        separatorColor="#97a879"
                                    >
                                        <ListView.itemTemplate>
                                            <$GridLayout className="li-wrapper" rows={[new ItemSpec(60, "pixel")]} columns={[new ItemSpec(10, "pixel"), new ItemSpec(50, "pixel"),  new ItemSpec(1, "star"), new ItemSpec(100, "pixel")]}>
                                                <$StackLayout className="li-indicator" row={0} col={0}>
                                                    <$Label className="{{ $value | itemToIndicatorClassConverter }}" />
                                                </$StackLayout>

                                                <$GridLayout col={1} rows={[]} columns={[]} className="li-avatar">
                                                    <$Image src="{{ assignee.avatar }}" stretch="aspectFit" />
                                                </$GridLayout>

                                                <$StackLayout className="li-info-wrapper" col={2}>
                                                    <$Label className="li-title" textWrap={true} text="{{ title }}" />
                                                    <$Label className="li-estimate" text="{{ 'estimate: ' + estimate }}" />
                                                </$StackLayout>

                                                <$StackLayout col={3}>
                                                    <$Label text="{{ dateCreated | dateConverter }}" className="li-date" />
                                                </$StackLayout>

                                            </$GridLayout>
                                        </ListView.itemTemplate>
                                    </$ListView>
                                </nsRefresh:PullToRefresh> */}
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
                                {/* <menu:menu presetSelected="{{ onPresetSelected }}"/> */}
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

    private readonly onAddTap = () => {
        // toggleDrawer
    };

    private readonly onLogoutTap = () => {
        // toggleDrawer
    };

    private readonly onToggleDrawerTap = () => {
        // toggleDrawer
    };
}