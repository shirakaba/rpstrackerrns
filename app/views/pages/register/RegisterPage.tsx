import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image, $TextField, $Button } from "react-nativescript";
import { Color } from "tns-core-modules/color/color";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { Page, isIOS, isAndroid } from "tns-core-modules/ui/page/page";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { RegisterPageProps } from "~/core/models/page-props/register-page-props";
import { localize } from "nativescript-localize";

import * as emailValidator from 'email-validator';
import {
  Observable,
  PropertyChangeData
} from 'tns-core-modules/data/observable';
import { PtAuthService } from '~/core/contracts/services';
import { PtRegisterModel } from '~/core/models/domain';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { getAuthService } from '~/globals/dependencies/locator';
import { ObservableProperty } from '~/shared/observable-property-decorator';

type Props = RegisterPageProps;

interface State {
    fullName: string,
    nameEmpty: boolean,
    email: string,
    emailValid: boolean,
    emailEmpty: boolean,
    password: string,
    passwordEmpty: boolean,
    formValid: boolean,
    loggingIn: boolean,
}

/* TODO: set state from register.page.vm.ts
 * TODO: determine any props from navigation binding context (passed into register-page.ts) */

export class RegisterPage extends React.Component<Props, State> {
    private readonly authService: PtAuthService;

    constructor(props: Props) {
        super(props);

        this.state = {
            fullName: EMPTY_STRING,
            nameEmpty: false,
            email: EMPTY_STRING,
            emailValid: true,
            emailEmpty: false,
            password: EMPTY_STRING,
            passwordEmpty: false,
            formValid: false,
            loggingIn: false,
        };
    }

    componentDidMount(){
        this.props.forwardedRef.current!.addCssFile("views/pages/backlog/backlog-page.css");
    }

    render(){
        const { fullName, nameEmpty, email, emailValid, emailEmpty, password, passwordEmpty, formValid, loggingIn } = this.state;

        return (
            <$Page
                className="page"
                // navigatingTo="onNavigatingTo" 
                actionBarHidden={true}
            >

                <$GridLayout rows={[new ItemSpec(1, "auto"), new ItemSpec(1, "star")]} columns={[]} className={isIOS ? "auth-container top-safe-full-screen-margin" : isAndroid ? "auth-container pull-up" : ""}>

                    <$StackLayout row={0} className="logo-container">
                        <$Image src="res://rpslogo" stretch="aspectFit"/>
                    </$StackLayout>

                    <$StackLayout row={1}>
                        <$GridLayout columns={[]} rows={[new ItemSpec(50, "pixel"), new ItemSpec(1, "star"), new ItemSpec(1, "auto")]} className="register-page-wrapper">
                            <$Label className="title" row={0} text={localize('Register')}/>
                            <$StackLayout row={1}>
                                <$StackLayout>

                                    <$StackLayout className="input-field with-validation">
                                        <$GridLayout columns={[new ItemSpec(1, "star"), new ItemSpec(25, "pixel")]} rows={[]} className="login-field-wrapper">
                                            <$TextField col={0}  
                                                className={!nameEmpty ? 'login-field valid' : 'login-field invalid'}
                                                hint="Name" text={fullName} />
                                            <$Label col={1} 
                                                className="fa login-icon" 
                                                text="&#xf007;" />
                                        </$GridLayout>

                                        <$StackLayout>
                                            <$Label visibility={nameEmpty ? 'visible' : 'collapse' }
                                                text="full name is missing" className="validation"/>
                                        </$StackLayout>
                                    </$StackLayout>


                                    <$StackLayout className="input-field with-validation">
                                        <$GridLayout columns={[new ItemSpec(1, "star"), new ItemSpec(25, "pixel")]} rows={[]} className="login-field-wrapper">
                                            <$TextField col={0}
                                                className={!emailEmpty && emailValid ? 'login-field valid' : 'login-field invalid'}
                                                keyboardType="email"
                                                hint="Email" text={email} />
                                            <$Label col={1}
                                                className="fa login-icon" 
                                                text="&#xf0e0;" />
                                        </$GridLayout>

                                        <$StackLayout>
                                            <$Label visibility={emailEmpty ? 'visible' : 'collapse'}
                                                text="email is missing" className="validation"/>
                                            <$Label visibility={!emailValid ? 'visible' : 'collapse'}
                                                text="the email is not in the correct format" className="validation"/>
                                        </$StackLayout>
                                    </$StackLayout>

                                    <$StackLayout className="input-field with-validation">
                                        <$GridLayout columns={[new ItemSpec(1, "star"), new ItemSpec(25, "pixel")]} rows={[]} className="login-field-wrapper">
                                            <$TextField col={0}
                                                className={!passwordEmpty ? 'login-field valid' : 'login-field invalid'}
                                                hint="Password" secure={true} 
                                                text={password} />
                                            <$Label className="fa login-icon" text="&#xf023;" col={1}/>
                                        </$GridLayout>

                                        <$StackLayout>
                                            <$StackLayout>
                                                <$Label visibility={passwordEmpty ? 'visible' : 'collapse'}
                                                    text="password is required" className="validation"/>
                                            </$StackLayout>
                                        </$StackLayout>
                                    </$StackLayout>


                                    <$Button text={localize('Register')} onTap={this.onRegisterTap}
                                        isEnabled={formValid}
                                        className={formValid ? 'btn-login btn-primary' : 'btn-login'}/>

                                </$StackLayout>

                            </$StackLayout>
                            <$StackLayout row={2} className="bottom-safe-nav">
                                <$Label text="Already have an account?" className="smaller"/>
                                <$Label onTap={this.onGoToLoginTap}
                                    textTransform="uppercase" 
                                    className="text-center m-20" 
                                    color={new Color("white")} text={localize('Login')}/>
                            </$StackLayout>
                        </$GridLayout>
                    </$StackLayout>

                </$GridLayout>

            </$Page>
        );
    }

    private readonly onRegisterTap = (args: GestureEventData) => {

    };

    private readonly onGoToLoginTap = (args: GestureEventData) => {

    };

    private readonly onNavBackTap = (args: GestureEventData) => {
        this.props.forwardedRef.current!.frame.goBack();
    };
}