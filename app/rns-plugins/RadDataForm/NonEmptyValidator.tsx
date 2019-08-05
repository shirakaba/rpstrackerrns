import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { NonEmptyValidator as NativeScriptNonEmptyValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyValidatorComponentProps, _PropertyValidator } from "./PropertyValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormNonEmptyValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptNonEmptyValidator();
    }
);

type NonEmptyValidatorProps = NativeScriptNonEmptyValidator;

interface Props {
}

export type NonEmptyValidatorComponentProps<
    E extends NativeScriptNonEmptyValidator = NativeScriptNonEmptyValidator
> = Props /* & typeof RCTNonEmptyValidator.defaultProps */ & Partial<NonEmptyValidatorProps> & PropertyValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript NonEmptyValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _NonEmptyValidator<
    P extends NonEmptyValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptNonEmptyValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<NonEmptyValidatorComponentProps<NativeScriptNonEmptyValidator>>;

export const NonEmptyValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptNonEmptyValidator>
> = React.forwardRef<NativeScriptNonEmptyValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptNonEmptyValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _NonEmptyValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
