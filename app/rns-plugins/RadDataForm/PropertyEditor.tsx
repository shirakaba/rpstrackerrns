import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropertyEditor as NativeScriptPropertyEditor } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormPropertyEditor";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptPropertyEditor();
    }
);

type PropertyEditorProps = Pick<NativeScriptPropertyEditor,
"propertyEditorStyle"|
"type"|
"params">;

interface Props {
}

export type PropertyEditorComponentProps<
    E extends NativeScriptPropertyEditor = NativeScriptPropertyEditor
> = Props /* & typeof RCTPropertyEditor.defaultProps */ & Partial<PropertyEditorProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript PropertyEditor component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _PropertyEditor<
    P extends PropertyEditorComponentProps<E>,
    S extends {},
    E extends NativeScriptPropertyEditor
> extends RCTViewBase<P, S, E> {

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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PropertyEditorComponentProps<NativeScriptPropertyEditor>>;

export const $PropertyEditor: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPropertyEditor>
> = React.forwardRef<NativeScriptPropertyEditor, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPropertyEditor>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _PropertyEditor,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
