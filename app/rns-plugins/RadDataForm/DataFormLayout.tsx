import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { DataFormLayout as NativeScriptDataFormLayout } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormDataFormLayout";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptDataFormLayout();
    }
);

type DataFormLayoutProps = NativeScriptDataFormLayout;

interface Props {
}

export type DataFormLayoutComponentProps<
    E extends NativeScriptDataFormLayout = NativeScriptDataFormLayout
> = Props /* & typeof RCTDataFormLayout.defaultProps */ & Partial<DataFormLayoutProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript DataFormLayout component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _DataFormLayout<
    P extends DataFormLayoutComponentProps<E>,
    S extends {},
    E extends NativeScriptDataFormLayout
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<DataFormLayoutComponentProps<NativeScriptDataFormLayout>>;

export const DataFormLayout: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptDataFormLayout>
> = React.forwardRef<NativeScriptDataFormLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptDataFormLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _DataFormLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
