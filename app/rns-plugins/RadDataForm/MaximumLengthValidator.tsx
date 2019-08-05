import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { MaximumLengthValidator as NativeScriptMaximumLengthValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { LengthValidatorComponentProps, _LengthValidator } from "./LengthValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormMaximumLengthValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptMaximumLengthValidator();
    }
);

type MaximumLengthValidatorProps = NativeScriptMaximumLengthValidator;

interface Props {
}

export type MaximumLengthValidatorComponentProps<
    E extends NativeScriptMaximumLengthValidator = NativeScriptMaximumLengthValidator
> = Props /* & typeof RCTMaximumLengthValidator.defaultProps */ & Partial<MaximumLengthValidatorProps> & LengthValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript MaximumLengthValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _MaximumLengthValidator<
    P extends MaximumLengthValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptMaximumLengthValidator
> extends _LengthValidator<P, S, E> {

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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<MaximumLengthValidatorComponentProps<NativeScriptMaximumLengthValidator>>;

export const MaximumLengthValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptMaximumLengthValidator>
> = React.forwardRef<NativeScriptMaximumLengthValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptMaximumLengthValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _MaximumLengthValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
