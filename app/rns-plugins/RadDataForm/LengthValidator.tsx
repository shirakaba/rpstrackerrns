import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { LengthValidator as NativeScriptLengthValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyValidatorComponentProps, _PropertyValidator } from "./PropertyValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormLengthValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptLengthValidator();
    }
);

type LengthValidatorProps = Pick<NativeScriptLengthValidator,
"length">;

interface Props {
}

export type LengthValidatorComponentProps<
    E extends NativeScriptLengthValidator = NativeScriptLengthValidator
> = Props /* & typeof RCTLengthValidator.defaultProps */ & Partial<LengthValidatorProps> & PropertyValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript LengthValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _LengthValidator<
    P extends LengthValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptLengthValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<LengthValidatorComponentProps<NativeScriptLengthValidator>>;

export const LengthValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptLengthValidator>
> = React.forwardRef<NativeScriptLengthValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptLengthValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _LengthValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
