import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropertyEditor as NativeScriptPropertyEditor, PropertyEditorStyle, PropertyEditorParams } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { CustomNodeHierarchyManager, Type, Container, HostContext, Instance, TextInstance } from "react-nativescript/dist/shared/HostConfigTypes";

type Constructor<T = {}> = new (...args: any[]) => T;

export function RNSFriendly<TBase extends Constructor<NativeScriptPropertyEditor>>(Base: TBase) {
  return class extends Base implements CustomNodeHierarchyManager<NativeScriptPropertyEditor> {
    __ImplementsCustomNodeHierarchyManager__: true = true;

    constructor(...args: any[]){
        super(...args);
        // This constructor call is needed for some reason; they must be doing something odd with the constructor.
    }

    __customHostConfigAppendChild(parent: NativeScriptPropertyEditor, child: Instance | TextInstance): boolean {
        if(child instanceof PropertyEditorStyle){
            parent.propertyEditorStyle = child;
        } else if(child instanceof PropertyEditorParams){
            parent.params = child;
        }
        // i.e. don't bother deferring to Host Config.
        return true;
    }

    __customHostConfigRemoveChild(parent: NativeScriptPropertyEditor, child: Instance | TextInstance): boolean {
        if(child instanceof PropertyEditorStyle){
            // TODO: check whether nullable.
            parent.propertyEditorStyle = null;
        } else if(child instanceof PropertyEditorParams){
            // TODO: check whether nullable.
            parent.params = null;
        }
        // i.e. don't bother deferring to Host Config.
        return true;
    }

    __customHostConfigInsertBefore(parent: NativeScriptPropertyEditor, child: Instance | TextInstance, beforeChild: Instance | TextInstance): boolean {
        return true;
    }
  };
}

const RNSFriendlyPropertyEditor = RNSFriendly(NativeScriptPropertyEditor);

const elementKey: string = "radDataFormPropertyEditor";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new RNSFriendlyPropertyEditor();
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
