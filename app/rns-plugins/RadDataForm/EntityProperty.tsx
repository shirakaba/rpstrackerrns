import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { EntityProperty as NativeScriptEntityProperty } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormEntityProperty";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptEntityProperty();
    }
);

type EntityPropertyProps = Pick<NativeScriptEntityProperty,
"editor"|
"validators"|
"converter"|
"valuesProvider"|
"autoCompleteDisplayMode"|
"name"|
"displayName"|
"index"|
"columnIndex"|
"hidden"|
"readOnly"|
"required"|
"hintText"|
"imageResource"|
"errorMessage"|
"successMessage">;

interface Props {
}

export type EntityPropertyComponentProps<
    E extends NativeScriptEntityProperty = NativeScriptEntityProperty
> = Props /* & typeof RCTEntityProperty.defaultProps */ & Partial<EntityPropertyProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript EntityProperty component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _EntityProperty<
    P extends EntityPropertyComponentProps<E>,
    S extends {},
    E extends NativeScriptEntityProperty
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<EntityPropertyComponentProps<NativeScriptEntityProperty>>;

export const $EntityProperty: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptEntityProperty>
> = React.forwardRef<NativeScriptEntityProperty, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptEntityProperty>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _EntityProperty,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
