import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { EntityProperty as NativeScriptEntityProperty, PropertyEditor, PropertyValidator } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { ViewBaseComponentProps, RCTViewBase } from "react-nativescript/dist/components/ViewBase";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { CustomNodeHierarchyManager, Type, Container, HostContext, Instance, TextInstance } from "react-nativescript/dist/shared/HostConfigTypes";

class RNSFriendlyEntityProperty extends NativeScriptEntityProperty implements CustomNodeHierarchyManager<RNSFriendlyEntityProperty> {
    public readonly __ImplementsCustomNodeHierarchyManager__: true = true;

    constructor(){
        super();
        // This constructor call is needed for some reason; they must be doing something odd with the constructor.
    }

    public __customHostConfigAppendChild(parent: RNSFriendlyEntityProperty, child: Instance | TextInstance): boolean {
        if(child instanceof PropertyEditor){
            parent.editor = child;
        } else if(child instanceof PropertyValidator){
            parent.validators = [...parent.validators, child];
        }
        // i.e. don't bother deferring to Host Config.
        return true;
    }
    public __customHostConfigRemoveChild(parent: RNSFriendlyEntityProperty, child: Instance | TextInstance): boolean {
        if(child instanceof PropertyEditor){
            // TODO: check whether nullable.
            parent.editor = null;
        } else if(child instanceof PropertyValidator){
            // TODO: check whether nullable.
            parent.validators = null;
        }
        // i.e. don't bother deferring to Host Config.
        return true;
    }
    public __customHostConfigInsertBefore(parent: RNSFriendlyEntityProperty, child: Instance | TextInstance, beforeChild: Instance | TextInstance): boolean {
        return true;
    }
}

const elementKey: string = "radDataFormEntityProperty";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new RNSFriendlyEntityProperty();
    }
);

type EntityPropertyProps = Pick<NativeScriptEntityProperty,
"editor"|
"validators"|
"converter"|
"valuesProvider"|
"autoCompleteDisplayMode"|
"name"|
"displayName"|
"index"|
"columnIndex"|
"hidden"|
"readOnly"|
"required"|
"hintText"|
"imageResource"|
"errorMessage"|
"successMessage">;

interface Props {
}

export type EntityPropertyComponentProps<
    E extends NativeScriptEntityProperty = NativeScriptEntityProperty
> = Props /* & typeof RCTEntityProperty.defaultProps */ & Partial<EntityPropertyProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript EntityProperty component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _EntityProperty<
    P extends EntityPropertyComponentProps<E>,
    S extends {},
    E extends NativeScriptEntityProperty
> extends RCTViewBase<P, S, E> {

    render() {
        const {
            forwardedRef,

            onPropertyChange,

            children,
            // actionView, /* We disallow this at the typings level. */
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<EntityPropertyComponentProps<NativeScriptEntityProperty>>;

export const $EntityProperty: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptEntityProperty>
> = React.forwardRef<NativeScriptEntityProperty, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptEntityProperty>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _EntityProperty,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
