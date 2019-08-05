import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PhoneValidator as NativeScriptPhoneValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyValidatorComponentProps, _PropertyValidator } from "./PropertyValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormPhoneValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptPhoneValidator();
    }
);

type PhoneValidatorProps = NativeScriptPhoneValidator;

interface Props {
}

export type PhoneValidatorComponentProps<
    E extends NativeScriptPhoneValidator = NativeScriptPhoneValidator
> = Props /* & typeof RCTPhoneValidator.defaultProps */ & Partial<PhoneValidatorProps> & PropertyValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript PhoneValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _PhoneValidator<
    P extends PhoneValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptPhoneValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PhoneValidatorComponentProps<NativeScriptPhoneValidator>>;

export const PhoneValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPhoneValidator>
> = React.forwardRef<NativeScriptPhoneValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPhoneValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _PhoneValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
