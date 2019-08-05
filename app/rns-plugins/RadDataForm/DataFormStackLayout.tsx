import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { DataFormStackLayout as NativeScriptDataFormStackLayout } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { DataFormLayoutComponentProps, _DataFormLayout } from "./DataFormLayout";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormDataFormStackLayout";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptDataFormStackLayout();
    }
);

type DataFormStackLayoutProps = Pick<NativeScriptDataFormStackLayout,
"orientation"
>;

interface Props {
}

export type DataFormStackLayoutComponentProps<
    E extends NativeScriptDataFormStackLayout = NativeScriptDataFormStackLayout
> = Props /* & typeof RCTDataFormStackLayout.defaultProps */ & Partial<DataFormStackLayoutProps> & DataFormLayoutComponentProps<E>;

/**
 * A React wrapper around the NativeScript DataFormStackLayout component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _DataFormStackLayout<
    P extends DataFormStackLayoutComponentProps<E>,
    S extends {},
    E extends NativeScriptDataFormStackLayout
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<DataFormStackLayoutComponentProps<NativeScriptDataFormStackLayout>>;

export const $DataFormStackLayout: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptDataFormStackLayout>
> = React.forwardRef<NativeScriptDataFormStackLayout, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptDataFormStackLayout>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _DataFormStackLayout,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
