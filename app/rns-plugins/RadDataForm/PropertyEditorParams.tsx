import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropertyEditorParams as NativeScriptPropertyEditorParams } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormPropertyEditorParams";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptPropertyEditorParams();
    }
);

type PropertyEditorParamsProps = Pick<NativeScriptPropertyEditorParams,
"minimum"|
"maximum"|
"step"
>;

interface Props {
}

export type PropertyEditorParamsComponentProps<
    E extends NativeScriptPropertyEditorParams = NativeScriptPropertyEditorParams
> = Props /* & typeof RCTPropertyEditorParams.defaultProps */ & Partial<PropertyEditorParamsProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript PropertyEditorParams component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _PropertyEditorParams<
    P extends PropertyEditorParamsComponentProps<E>,
    S extends {},
    E extends NativeScriptPropertyEditorParams
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PropertyEditorParamsComponentProps<NativeScriptPropertyEditorParams>>;

export const $PropertyEditorParams: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPropertyEditorParams>
> = React.forwardRef<NativeScriptPropertyEditorParams, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPropertyEditorParams>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _PropertyEditorParams,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
