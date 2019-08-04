import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image, $ActionBar, $ActionItem, $Button, $ListView, $NavigationButton } from "react-nativescript";
import { Page } from "tns-core-modules/ui/page/page";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { SettingsPageProps } from "~/core/models/page-props/settings-page-props";

type Props = SettingsPageProps;

export class SettingsPage extends React.Component<Props, {}> {
    componentDidMount(){
        this.props.forwardedRef.current!.addCssFile("views/pages/backlog/backlog-page.css");
    }

    render(){
        return (
            <$Page ref={this.props.forwardedRef} className="page">
                <$ActionBar title="Settings">
                    <$NavigationButton text="Back" android={{ systemIcon: "ic_menu_back"}} onTap={this.onNavBackTap}/>
                </$ActionBar>

                <$StackLayout>
                    <$Label className="text-center" text="Settings Page Works" />
                </$StackLayout>

            </$Page>
        );
    }

    private readonly onNavBackTap = (args: GestureEventData) => {
        this.props.forwardedRef.current!.frame.goBack();
    };
}