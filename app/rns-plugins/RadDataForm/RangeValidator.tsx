import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { RangeValidator as NativeScriptRangeValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyValidatorComponentProps, _PropertyValidator } from "./PropertyValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormRangeValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptRangeValidator();
    }
);

type RangeValidatorProps = Pick<NativeScriptRangeValidator,
"minimum"|
"maximum"
>;

interface Props {
}

export type RangeValidatorComponentProps<
    E extends NativeScriptRangeValidator = NativeScriptRangeValidator
> = Props /* & typeof RCTRangeValidator.defaultProps */ & Partial<RangeValidatorProps> & PropertyValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript RangeValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _RangeValidator<
    P extends RangeValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptRangeValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<RangeValidatorComponentProps<NativeScriptRangeValidator>>;

export const RangeValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptRangeValidator>
> = React.forwardRef<NativeScriptRangeValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptRangeValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _RangeValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
