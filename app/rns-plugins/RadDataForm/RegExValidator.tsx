import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { RegExValidator as NativeScriptRegExValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyValidatorComponentProps, _PropertyValidator } from "./PropertyValidator";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormRegExValidator";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptRegExValidator();
    }
);

type RegExValidatorProps = Pick<NativeScriptRegExValidator,
"regEx"
>;

interface Props {
}

export type RegExValidatorComponentProps<
    E extends NativeScriptRegExValidator = NativeScriptRegExValidator
> = Props /* & typeof RCTRegExValidator.defaultProps */ & Partial<RegExValidatorProps> & PropertyValidatorComponentProps<E>;

/**
 * A React wrapper around the NativeScript RegExValidator component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _RegExValidator<
    P extends RegExValidatorComponentProps<E>,
    S extends {},
    E extends NativeScriptRegExValidator
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<RegExValidatorComponentProps<NativeScriptRegExValidator>>;

export const $RegExValidator: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptRegExValidator>
> = React.forwardRef<NativeScriptRegExValidator, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptRegExValidator>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _RegExValidator,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
