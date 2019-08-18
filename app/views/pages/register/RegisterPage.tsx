import * as React from "react";
import { $StackLayout, $Label, $Page, $GridLayout, $Image, $TextField, $Button } from "react-nativescript";
import { Color } from "tns-core-modules/color/color";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { Page, isIOS, isAndroid } from "tns-core-modules/ui/page/page";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { RegisterPageProps } from "~/core/models/page-props/register-page-props";
import { localize } from "nativescript-localize";
import * as emailValidator from 'email-validator';
import { PtAuthService } from '~/core/contracts/services';
import { PtRegisterModel } from '~/core/models/domain';
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { getAuthService } from '~/globals/dependencies/locator';
import { goToBacklogPageReact, goToLoginPageReact } from "~/shared/helpers/navigation/nav-react.helper";
import { LoginPage } from "../login/LoginPage";
import { LoginPageProps } from "~/core/models/page-props/login-page-props";
import { BacklogPage } from "../backlog/BacklogPage";
import { BacklogPageProps } from "~/core/models/page-props/backlog-page-props";

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
    /* I've changed the 'loggingIn' property from the original to 'registering' - maybe a misunderstanding though */
    registering: boolean,

    navToLoginPageArgs: LoginPageProps|null,
    navToBacklogPageArgs: BacklogPageProps|null,
}

export class RegisterPage extends React.Component<Props, State> {
    private readonly loginPageRef: React.RefObject<Page> = React.createRef<Page>();
    private readonly backlogPageRef: React.RefObject<Page> = React.createRef<Page>();
    private readonly authService: PtAuthService = getAuthService();

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
            registering: false,

            navToLoginPageArgs: null,
            navToBacklogPageArgs: null,
        };
    }

    public componentDidUpdate(prevProps: Props, prevState: State): void {
        const { fullName, email, password } = this.state;

        if(fullName !== prevState.fullName){
            this.validate("fullName");
        }

        if(email !== prevState.email){
            this.validate("email");
        }

        if(password !== prevState.password){
            this.validate("password");
        }
    }

    public componentDidMount(){
        this.props.forwardedRef.current!.addCssFile("views/pages/register/register-page.css");
    }

    public render(){
        const { forwardedRef } = this.props;
        const { fullName, nameEmpty, email, emailValid, emailEmpty, password, passwordEmpty, formValid, registering, navToLoginPageArgs, navToBacklogPageArgs } = this.state;

        return (
            <$Page ref={forwardedRef} className="page" actionBarHidden={true}>

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

                {/* === ROUTES THAT WE CAN NAVIGATE ON TO (not visual children of Page, but can be mounted as dependents) === */}
                {/* It's a bit fiddly, but this setup lets us lazily mount a Page. */}
                {/* One day we'll make a navigation framework to produce a simpler approach, but... one thing at a time! */}
                {navToLoginPageArgs === null ? null : (<LoginPage {...navToLoginPageArgs} />)}

                {navToBacklogPageArgs === null ? null : (<BacklogPage {...navToBacklogPageArgs} />)}
                </$GridLayout>

            </$Page>
        );
    }

    private readonly validate = (changedPropName: string) => {
        switch (changedPropName) {
            case 'fullName':
                {
                    this.setState(
                        (state: State) => {
                            const { fullName, emailValid, emailEmpty, passwordEmpty } = state;
                            const nameEmpty: boolean = fullName.trim() === EMPTY_STRING;

                            return {
                                nameEmpty,
                                formValid: !nameEmpty && emailValid && !emailEmpty && !passwordEmpty
                            };
                        }
                    );
                }
                break;
    
            case 'email':
                {
                    this.setState(
                        (state: State) => {
                            const { email, nameEmpty, passwordEmpty } = state;
                            const emailEmpty: boolean = email.trim() === EMPTY_STRING;
                            /* Apparently empty emails are valid too */
                            const emailValid: boolean = emailEmpty || emailValidator.validate(email);

                            return {
                                passwordEmpty,
                                emailValid,
                                formValid: !nameEmpty && emailValid && !emailEmpty && !passwordEmpty
                            };
                        }
                    );
                }
                break;
    
            case 'password':
                {
                    this.setState(
                        (state: State) => {
                            const { password, nameEmpty, emailValid, emailEmpty } = state;
                            const passwordEmpty: boolean = password.trim().length === 0;

                            return {
                                passwordEmpty,
                                formValid: !nameEmpty && emailValid && !emailEmpty && !passwordEmpty
                            };
                        }
                    );
                }
                break;
    
            default:
                return;
        }
    }

    private readonly onRegisterTap = (args: GestureEventData) => {
        return new Promise((resolve, reject) => {
            this.setState(
                { registering: true },
                () => {
                    const { email, password, fullName } = this.state;
                    const registerModel: PtRegisterModel = {
                        username: email,
                        password,
                        fullName,
                    };

                    this.authService
                        .register(registerModel)
                        .then(() => {
                            this.setState(
                                { registering: false },
                                () => {
                                    resolve();
                                }
                            );
                        })
                        .catch((error: any) => {
                            this.setState(
                                { registering: false },
                                () => {
                                    reject(error);
                                }
                            );
                        });
                }
            )
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
            alert('Sorry, could not register you at this time');
        });
    };

    private readonly onGoToLoginTap = (args: GestureEventData) => {
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
                    animated: false,
                })
            }
        );

        /* No longer recommending this approach. Although it's simple, it leads to crashes. */
        // goToLoginPageReact({}, { animated: false });
    };
}