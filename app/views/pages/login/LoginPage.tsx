import * as React from "react";
import { $TabView, $TabViewItem, $StackLayout, $Label, $Page, $GridLayout, $Image, $ActivityIndicator, $TextField } from "react-nativescript";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import { Page, Color } from "react-nativescript/dist/client/ElementRegistry";

interface State {
    loggingIn: boolean,
    email: string,
    emailEmpty: boolean,
    emailValid: boolean,
}

export class LoginPage extends React.Component<{ forwardedRef: React.RefObject<Page> }, State> {
    constructor(props){
        super(props);

        this.state = {
            emailEmpty: false,
            emailValid: true,
            email: "alex@nuvious.com",
            loggingIn: false,
        };
    }

    render(){
        const { loggingIn, emailEmpty, email, emailValid } = this.state;

        return (
            <$Page ref={this.props.forwardedRef} actionBarHidden={true}>
                <$GridLayout
                    rows={[new ItemSpec(0, "auto"), new ItemSpec(0, "star")]}
                    columns={[]}
                    className={
                        isIOS ? "auth-container top-safe-full-screen-margin" : 
                            isAndroid ? "auth-container pull-up" : ""
                    }
                >
                    <$StackLayout row={0} className="logo-container">
                        <$Image src="res://rpslogo" stretch="aspectFit"></$Image>
                    </$StackLayout>

                    <$StackLayout row={1} visibility={!loggingIn ? "visible" : "collapse"}>
                        <$GridLayout
                            rows={[new ItemSpec(50, "pixel"), new ItemSpec(0, "star"), new ItemSpec(0, "auto")]}
                            columns={[]}
                            className={"login-page-wrapper"}
                        >
                            <$Label className="title" row={0}>L('Login') would go in here</$Label>

                            <$StackLayout row={1}>
                                <$StackLayout className="input-field with-validation">
                                    <$GridLayout
                                        rows={[]}
                                        columns={[new ItemSpec(0, "star"), new ItemSpec(25, "pixel")]}
                                        className={"login-field-wrapper"}
                                    >
                                        {/* TODO: TextField */}
                                        <$TextField
                                            col={0}
                                            className={!emailEmpty && emailValid ? "login-field valid" : "login-field invalid" }
                                            text={email}
                                        />
                                        <$Label
                                            col={1}
                                            className="fa login-icon"
                                            text={`TODO: unescape &#xf0e0;`}
                                        />
                                    </$GridLayout>
                                </$StackLayout>
                            </$StackLayout>

                            <$StackLayout row={2} className="bottom-safe-nav">
                                <$Label className="smaller">Need an account?</$Label>
                                <$Label
                                    onTap={this.onGotoRegisterTap}
                                    textTransform={"uppercase"}
                                    className="text-center m-20"
                                    color={new Color("white")}
                                    text={`L('Register') would go here`}
                                />
                            </$StackLayout>
                        </$GridLayout>
                    </$StackLayout>

                    <$ActivityIndicator row={1} busy={loggingIn} color={new Color("white")}/>
                </$GridLayout>
            </$Page>
        );
    }

    private readonly onGotoRegisterTap = () => {
        console.log(`STUB: onGotoRegisterTap()`);
    };
}