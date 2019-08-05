import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { DataFormStyleBase as NativeScriptDataFormStyleBase } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormDataFormStyleBase";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptDataFormStyleBase();
    }
);

type DataFormStyleBaseProps = Pick<NativeScriptDataFormStyleBase,
"separatorColor"|
"strokeColor"|
"fillColor"|
"strokeWidth"|
"labelTextColor"|
"labelTextSize"|
"labelFontName"|
"labelFontStyle"
>;

interface Props {
}

export type DataFormStyleBaseComponentProps<
    E extends NativeScriptDataFormStyleBase = NativeScriptDataFormStyleBase
> = Props /* & typeof RCTDataFormStyleBase.defaultProps */ & Partial<DataFormStyleBaseProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript DataFormStyleBase component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _DataFormStyleBase<
    P extends DataFormStyleBaseComponentProps<E>,
    S extends {},
    E extends NativeScriptDataFormStyleBase
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<DataFormStyleBaseComponentProps<NativeScriptDataFormStyleBase>>;

export const $DataFormStyleBase: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptDataFormStyleBase>
> = React.forwardRef<NativeScriptDataFormStyleBase, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptDataFormStyleBase>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _DataFormStyleBase,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
