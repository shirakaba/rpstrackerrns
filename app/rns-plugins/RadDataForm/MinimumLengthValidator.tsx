import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { MinimumLengthValidator as NativeScriptMinimumLengthValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { LengthValidatorComponentProps, _LengthValidator } from "./LengthValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormMinimumLengthValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptMinimumLengthValidator();
    }
);

type MinimumLengthValidatorProps = NativeScriptMinimumLengthValidator;

interface Props {
}

export type MinimumLengthValidatorComponentProps<
    E extends NativeScriptMinimumLengthValidator = NativeScriptMinimumLengthValidator
> = Props /* & typeof RCTMinimumLengthValidator.defaultProps */ & Partial<MinimumLengthValidatorProps> & LengthValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript MinimumLengthValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _MinimumLengthValidator<
    P extends MinimumLengthValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptMinimumLengthValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<MinimumLengthValidatorComponentProps<NativeScriptMinimumLengthValidator>>;

export const $MinimumLengthValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptMinimumLengthValidator>
> = React.forwardRef<NativeScriptMinimumLengthValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptMinimumLengthValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _MinimumLengthValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
