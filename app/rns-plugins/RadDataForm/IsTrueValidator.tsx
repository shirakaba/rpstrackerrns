import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { IsTrueValidator as NativeScriptIsTrueValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyValidatorComponentProps, _PropertyValidator } from "./PropertyValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormIsTrueValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptIsTrueValidator();
    }
);

type IsTrueValidatorProps = NativeScriptIsTrueValidator;

interface Props {
}

export type IsTrueValidatorComponentProps<
    E extends NativeScriptIsTrueValidator = NativeScriptIsTrueValidator
> = Props /* & typeof RCTIsTrueValidator.defaultProps */ & Partial<IsTrueValidatorProps> & PropertyValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript IsTrueValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _IsTrueValidator<
    P extends IsTrueValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptIsTrueValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<IsTrueValidatorComponentProps<NativeScriptIsTrueValidator>>;

export const $IsTrueValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptIsTrueValidator>
> = React.forwardRef<NativeScriptIsTrueValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptIsTrueValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _IsTrueValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
