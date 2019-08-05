import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropertyGroup as NativeScriptPropertyGroup } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormPropertyGroup";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptPropertyGroup();
    }
);

type PropertyGroupProps = Pick<NativeScriptPropertyGroup,
"name"|
"hidden"|
"titleHidden"|
"collapsible"|
"collapsed"|
"titleStyle"|
"layout"|
"properties"
>;

interface Props {
}

export type PropertyGroupComponentProps<
    E extends NativeScriptPropertyGroup = NativeScriptPropertyGroup
> = Props /* & typeof RCTPropertyGroup.defaultProps */ & Partial<PropertyGroupProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript PropertyGroup component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _PropertyGroup<
    P extends PropertyGroupComponentProps<E>,
    S extends {},
    E extends NativeScriptPropertyGroup
> extends RCTViewBase<P, S, E> {

    render() {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            // actionView, /* We disallow this at the typings level. */
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PropertyGroupComponentProps<NativeScriptPropertyGroup>>;

export const PropertyGroup: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPropertyGroup>
> = React.forwardRef<NativeScriptPropertyGroup, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPropertyGroup>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _PropertyGroup,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
