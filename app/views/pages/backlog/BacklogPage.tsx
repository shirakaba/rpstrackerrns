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
                    <$Label>You shouldn't see me</$Label>
                    <$StackLayout __rns__nodeTreeRole={mainContentNodeTreeRole}>
                        <$Label>I'm the main content</$Label>
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

    private readonly onLogoutTap = () => {
        // toggleDrawer
    };

    private readonly onToggleDrawerTap = () => {
        // toggleDrawer
    };
}