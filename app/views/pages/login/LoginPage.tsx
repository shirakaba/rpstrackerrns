import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image, $ActivityIndicator, $TextField, $Button } from "react-nativescript";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";
import { Page, Color, TextField } from "react-nativescript/dist/client/ElementRegistry";
import { PtAuthService } from '~/core/contracts/services';
import { getAuthService } from '~/globals/dependencies/locator';
import {
    goToBacklogPage,
    goToRegisterPage
  } from '~/shared/helpers/navigation/nav.helper';
import { localize } from "nativescript-localize";
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import * as emailValidator from 'email-validator';
import { EventData } from "tns-core-modules/ui/editable-text-base/editable-text-base";
import { RegisterPageProps } from "~/core/models/page-props/register-page-props";
import { RegisterPage } from "../register/RegisterPage";
import { goToBacklogPageReact, goToRegisterPageReact } from "~/shared/helpers/navigation/nav-react.helper";
import { LoginPageProps } from "~/core/models/page-props/login-page-props";
import { BacklogPageProps } from "~/core/models/page-props/backlog-page-props";
import { BacklogPage } from "../backlog/BacklogPage";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";

type Props = LoginPageProps;

interface State {
    email: string,
    emailValid: boolean,
    emailEmpty: boolean,
    password: string,
    passwordEmpty: boolean,
    formValid: boolean,
    loggingIn: boolean,
    
    navToRegisterPageArgs: RegisterPageProps|null,
    navToBacklogPageArgs: BacklogPageProps|null,
}

export class LoginPage extends React.Component<Props, State> {
    private readonly registerPageRef: React.RefObject<Page> = React.createRef<Page>();
    private readonly backlogPageRef: React.RefObject<Page> = React.createRef<Page>();
    private readonly authService: PtAuthService = getAuthService();

    public componentDidMount(): void {
        this.props.forwardedRef.current!.addCssFile("views/pages/login/login-page.css");
    }

    constructor(props: Props){
        super(props);

        this.state = {
            password: 'nuvious',
            passwordEmpty: false,
            emailEmpty: false,
            emailValid: true,
            email: "alex@nuvious.com",
            loggingIn: false,
            formValid: true,
            
            navToRegisterPageArgs: null,
            navToBacklogPageArgs: null,
        };
    }

    public render(){
        const { loggingIn, emailEmpty, email, emailValid, password, passwordEmpty, formValid, navToRegisterPageArgs, navToBacklogPageArgs } = this.state;

        return (
            <$Page ref={this.props.forwardedRef} actionBarHidden={true} className={"sanity-test"}>
                <$GridLayout
                    rows={[new ItemSpec(1, "auto"), new ItemSpec(1, "star")]}
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
                            rows={[new ItemSpec(50, "pixel"), new ItemSpec(1, "star"), new ItemSpec(1, "auto")]}
                            columns={[]}
                            className={"login-page-wrapper"}
                        >
                            <$Label className="title" row={0} text={localize('Login')}/>

                            <$StackLayout row={1}>
                                <$StackLayout>
                                    <$StackLayout className="input-field with-validation">
                                        <$GridLayout
                                            rows={[]}
                                            columns={[new ItemSpec(1, "star"), new ItemSpec(25, "pixel")]}
                                            className={"login-field-wrapper"}
                                        >
                                            <$TextField
                                                col={0}
                                                className={!emailEmpty && emailValid ? "login-field valid" : "login-field invalid" }
                                                hint={"Email"}
                                                keyboardType={"email"}
                                                text={email}
                                                onTextChange={this.onEmailTextChange}
                                            />
                                            <$Label col={1} className="fa login-icon" text="&#xf0e0;"/>
                                        </$GridLayout>

                                        <$StackLayout className="login-field-validation-wrapper">
                                            <$Label visibility={ emailEmpty ? 'visible' : 'collapse' } text="email is missing" className="validation"/>
                                            <$Label visibility={ !emailValid ? 'visible' : 'collapse' } text="the email is not in the correct format" className="validation"/>
                                        </$StackLayout>
                                    </$StackLayout>

                                    <$StackLayout className="input-field with-validation">
                                        <$Label col={1} className={"fa login-icon"} text="&#xf023;"/>

                                        <$GridLayout rows={[]} columns={[new ItemSpec(1, "star"), new ItemSpec(25, "pixel")]} className="login-field-wrapper">
                                            <$TextField
                                                col={0}
                                                className={ !passwordEmpty ? 'login-field valid' : 'login-field invalid' }
                                                hint="Password"
                                                secure={true}
                                                text={password}
                                                onTextChange={this.onPasswordTextChange}
                                            />
                                            <$Label col={1} className="fa login-icon" text="&#xf023;"/>
                                        </$GridLayout>

                                        <$StackLayout>
                                            <$StackLayout>
                                                <$Label visibility={ passwordEmpty ? 'visible' : 'collapse' } text="password is required" className="validation"/>
                                            </$StackLayout>
                                        </$StackLayout>
                                    </$StackLayout>

                                    <$Button text={localize('Login')} onTap={this.onLoginTap} isEnabled={ formValid } className={ formValid ? 'btn-login btn-primary' : 'btn-login' }/>

                                    <$Label className="hr"/>
                                </$StackLayout>
                            </$StackLayout>

                            <$StackLayout row={2} className="bottom-safe-nav">
                                <$Label className="smaller">Need an account?</$Label>
                                <$Label
                                    onTap={this.onGotoRegisterTap}
                                    textTransform={"uppercase"}
                                    className="text-center m-20"
                                    color={new Color("white")}
                                    text={localize('Register')}
                                />
                            </$StackLayout>
                        </$GridLayout>
                    </$StackLayout>

                    <$ActivityIndicator row={1} busy={loggingIn} color={new Color("white")}/>
                </$GridLayout>

                {/* === ROUTES THAT WE CAN NAVIGATE ON TO (not visual children of Page, but can be mounted as dependents) === */}
                {/* It's a bit fiddly, but this setup lets us lazily mount a Page. */}
                {/* One day we'll make a navigation framework to produce a simpler approach, but... one thing at a time! */}
                {navToRegisterPageArgs === null ? null : (<RegisterPage {...navToRegisterPageArgs} />)}

                {navToBacklogPageArgs === null ? null : (<BacklogPage {...navToBacklogPageArgs} />)}
            </$Page>
        );
    }

    private readonly onGotoRegisterTap = (args: GestureEventData) => {
        this.setState(
            {
                navToRegisterPageArgs: {
                    forwardedRef: this.registerPageRef,
                }
            },
            () => {
                this.props.forwardedRef.current!.frame.navigate({
                    create: () => {
                        return this.registerPageRef.current!;
                    },
                    animated: false,
                })
            }
        );

        /* No longer recommending this approach. Although it's simple, it leads to crashes. */
        // goToRegisterPageReact({}, { animated: false });
    };

    private readonly onLoginTap = (args: GestureEventData) => {
        new Promise((resolve, reject) => {
            this.setState(
                {
                    loggingIn: true
                },
                () => {
                    this.authService
                    .login({
                        username: this.state.email,
                        password: this.state.password
                    })
                    .then(() => {
                        this.setState({ loggingIn: false }, () => {
                            resolve();
                        });
                    })
                    .catch(er => {
                        this.setState({ loggingIn: false }, () => {
                            reject(er);
                        });
                    });
                }
            );
        })
        .then(() => {
            this.setState(
                {
                    navToBacklogPageArgs: {
                        forwardedRef: this.backlogPageRef,
                    }
                },
                () => {
                    this.props.forwardedRef.current!.frame.navigate({
                        create: () => {
                            return this.backlogPageRef.current!;
                        },
                        clearHistory: true,
                        animated: true,
                    })
                }
            );

            /* No longer recommending this approach. Although it's simple, it leads to crashes. */
            // goToBacklogPageReact({}, { clearHistory: true, animated: true });
        })
        .catch(error => {
            console.error(error);
            alert('Sorry, could not log in at this time');
        });
    };

    private readonly onEmailTextChange = (args: EventData) => {
        const text: string = (args.object as TextField).text;
        // console.log(`onEmailTextChange`, text);
        if (text.trim() === EMPTY_STRING) {
            this.setState({
                email: text,
                emailEmpty: true,
                emailValid: true,
                formValid: false,
            });
        } else if (emailValidator.validate(text)) {
            this.setState((state: State) => ({
                email: text,
                emailEmpty: false,
                emailValid: true,
                formValid: !state.passwordEmpty,
            }));
        } else {
            this.setState({
                email: text,
                emailEmpty: false,
                emailValid: false,
                formValid: false,
            });
        }
    }

    private readonly onPasswordTextChange = (args: EventData) => {
        const text: string = (args.object as TextField).text;
        // console.log(`onPasswordTextChange`, text);
        if (text.trim() === EMPTY_STRING) {
            this.setState({
                password: text,
                passwordEmpty: true,
            });
        } else {
            this.setState({
                password: text,
                passwordEmpty: false,
            });
        }
    }
}