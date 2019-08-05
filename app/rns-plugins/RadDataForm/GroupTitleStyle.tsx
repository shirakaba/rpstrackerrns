import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { GroupTitleStyle as NativeScriptGroupTitleStyle } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { DataFormStyleBaseComponentProps, _DataFormStyleBase } from "./DataFormStyleBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormGroupTitleStyle";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptGroupTitleStyle();
    }
);

type GroupTitleStyleProps = NativeScriptGroupTitleStyle;

interface Props {
}

export type GroupTitleStyleComponentProps<
    E extends NativeScriptGroupTitleStyle = NativeScriptGroupTitleStyle
> = Props /* & typeof RCTGroupTitleStyle.defaultProps */ & Partial<GroupTitleStyleProps> & DataFormStyleBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript GroupTitleStyle component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _GroupTitleStyle<
    P extends GroupTitleStyleComponentProps<E>,
    S extends {},
    E extends NativeScriptGroupTitleStyle
> extends _DataFormStyleBase<P, S, E> {

    render() {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            ...rest
        } = this.props;

        return React.createElement(
            elementKey,
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<GroupTitleStyleComponentProps<NativeScriptGroupTitleStyle>>;

export const GroupTitleStyle: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptGroupTitleStyle>
> = React.forwardRef<NativeScriptGroupTitleStyle, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptGroupTitleStyle>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _GroupTitleStyle,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
