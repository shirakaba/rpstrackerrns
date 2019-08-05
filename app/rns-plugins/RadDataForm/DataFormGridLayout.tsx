import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { DataFormGridLayout as NativeScriptDataFormGridLayout } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { DataFormLayoutComponentProps, _DataFormLayout } from "./DataFormLayout";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormDataFormGridLayout";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptDataFormGridLayout();
    }
);

type DataFormGridLayoutProps = NativeScriptDataFormGridLayout;

interface Props {
}

export type DataFormGridLayoutComponentProps<
    E extends NativeScriptDataFormGridLayout = NativeScriptDataFormGridLayout
> = Props /* & typeof RCTDataFormGridLayout.defaultProps */ & Partial<DataFormGridLayoutProps> & DataFormLayoutComponentProps<E>;

/**
 * A React wrapper around the NativeScript DataFormGridLayout component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _DataFormGridLayout<
    P extends DataFormGridLayoutComponentProps<E>,
    S extends {},
    E extends NativeScriptDataFormGridLayout
> extends _DataFormLayout<P, S, E> {

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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<DataFormGridLayoutComponentProps<NativeScriptDataFormGridLayout>>;

export const $DataFormGridLayout: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptDataFormGridLayout>
> = React.forwardRef<NativeScriptDataFormGridLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptDataFormGridLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _DataFormGridLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
