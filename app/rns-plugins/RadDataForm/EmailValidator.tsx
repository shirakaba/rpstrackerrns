import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { EmailValidator as NativeScriptEmailValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyValidatorComponentProps, _PropertyValidator } from "./PropertyValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormEmailValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptEmailValidator();
    }
);

type EmailValidatorProps = NativeScriptEmailValidator;

interface Props {
}

export type EmailValidatorComponentProps<
    E extends NativeScriptEmailValidator = NativeScriptEmailValidator
> = Props /* & typeof RCTEmailValidator.defaultProps */ & Partial<EmailValidatorProps> & PropertyValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript EmailValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _EmailValidator<
    P extends EmailValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptEmailValidator
> extends _PropertyValidator<P, S, E> {

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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<EmailValidatorComponentProps<NativeScriptEmailValidator>>;

export const EmailValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptEmailValidator>
> = React.forwardRef<NativeScriptEmailValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptEmailValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _EmailValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
