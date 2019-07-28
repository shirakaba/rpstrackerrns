import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image, $ActionBar, $ActionItem } from "react-nativescript";
import { $RadSideDrawer, mainContentNodeTreeRole, drawerContentNodeTreeRole } from "~/rns-plugins/RadSideDrawer";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import { Page } from "react-nativescript/dist/client/ElementRegistry";
import { SideDrawerLocation, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";

export class BackLogPage extends React.Component<{ forwardedRef: React.RefObject<Page> }, {}> {
    render(){
        return (
            <$Page ref={this.props.forwardedRef}>
                <$ActionBar>
                    <$ActionItem>
                        <$StackLayout className="navbar_image_wrapper" horizontalAlignment={ isIOS ? "right" : void 0 }>
                            <$Image src="res://iconelipseswhite" onTap={this.onToggleDrawerTap} />
                        </$StackLayout>
                    </$ActionItem>
                </$ActionBar>
                <$RadSideDrawer id={"sideDrawer"} drawerLocation={SideDrawerLocation.Right} drawerTransition={new SlideInOnTopTransition()}>
                    <$Label>You shouldn't see me</$Label>
                    <$StackLayout __rns__nodeTreeRole={mainContentNodeTreeRole}>
                        <$Label>I'm the main content</$Label>
                    </$StackLayout>
                    <$StackLayout __rns__nodeTreeRole={drawerContentNodeTreeRole}>
                        <$Label>I'm the drawer content</$Label>
                    </$StackLayout>
                </$RadSideDrawer>
            </$Page>
        );
    }

    private readonly onToggleDrawerTap = () => {
        // toggleDrawer
    };
}