import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropertyValidator as NativeScriptPropertyValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormPropertyValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptPropertyValidator();
    }
);

type PropertyValidatorProps = Pick<NativeScriptPropertyValidator,
"errorMessage"|
"successMessage">;

interface Props {
}

export type PropertyValidatorComponentProps<
    E extends NativeScriptPropertyValidator = NativeScriptPropertyValidator
> = Props /* & typeof RCTPropertyValidator.defaultProps */ & Partial<PropertyValidatorProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript PropertyValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _PropertyValidator<
    P extends PropertyValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptPropertyValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PropertyValidatorComponentProps<NativeScriptPropertyValidator>>;

export const PropertyValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPropertyValidator>
> = React.forwardRef<NativeScriptPropertyValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPropertyValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _PropertyValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
