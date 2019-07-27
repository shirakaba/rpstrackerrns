import * as React from "react";
import { $Frame } from "react-nativescript";
import { Frame, Page } from "react-nativescript/dist/client/ElementRegistry";
import { LoginPage } from "./views/pages/login/LoginPage";


export class AppRootAnonymous extends React.Component<{ forwardedRef: React.RefObject<Frame> }, {}> {
    private readonly pageRef: React.RefObject<Page> = React.createRef<Page>();

    componentDidMount(){
        this.props.forwardedRef.current!.navigate(() => this.pageRef.current!);
    }

    render(){
        return (
            <$Frame ref={this.props.forwardedRef}>
                <LoginPage forwardedRef={this.pageRef}/>
            </$Frame>
        );
    }
}