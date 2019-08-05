import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropertyEditorStyle as NativeScriptPropertyEditorStyle } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { DataFormStyleBaseComponentProps, _DataFormStyleBase } from "./DataFormStyleBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormPropertyEditorStyle";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptPropertyEditorStyle();
    }
);

type PropertyEditorStyleProps = Pick<NativeScriptPropertyEditorStyle,
"editorHorizontalOffset"|
"editorVerticalOffset"|
"labelHorizontalOffset"|
"labelVerticalOffset"|
"labelHidden"|
"labelPosition"|
"labelWidth"
>;

interface Props {
}

export type PropertyEditorStyleComponentProps<
    E extends NativeScriptPropertyEditorStyle = NativeScriptPropertyEditorStyle
> = Props /* & typeof RCTPropertyEditorStyle.defaultProps */ & Partial<PropertyEditorStyleProps> & DataFormStyleBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript PropertyEditorStyle component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _PropertyEditorStyle<
    P extends PropertyEditorStyleComponentProps<E>,
    S extends {},
    E extends NativeScriptPropertyEditorStyle
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PropertyEditorStyleComponentProps<NativeScriptPropertyEditorStyle>>;

export const $PropertyEditorStyle: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPropertyEditorStyle>
> = React.forwardRef<NativeScriptPropertyEditorStyle, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPropertyEditorStyle>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _PropertyEditorStyle,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
