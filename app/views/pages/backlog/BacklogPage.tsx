import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image } from "react-nativescript";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import { Page } from "react-nativescript/dist/client/ElementRegistry";

export class BackLogPage extends React.Component<{ forwardedRef: React.RefObject<Page> }, {}> {
    render(){
        return (
            <$Page ref={this.props.forwardedRef} actionBarHidden={true}>
                <$Label>Why oh why did you have to use RadSideDrawer</$Label>
            </$Page>
        );
    }
}