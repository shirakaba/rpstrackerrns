import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { RadDataForm as NativeScriptRadDataForm, CustomPropertyEditor as NativeScriptCustomPropertyEditor, DataFormCustomPropertyEditorEventData } from "nativescript-ui-dataform";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PropertyEditorComponentProps, _PropertyEditor } from "./PropertyEditor";
import { register } from "react-nativescript/dist/client/ElementRegistry";
import { updateListener } from "react-nativescript/dist/client/EventHandling";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataFormCustomPropertyEditor";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptCustomPropertyEditor();
    }
);

type CustomPropertyEditorProps = NativeScriptCustomPropertyEditor;

interface Props {
    onEditorNeedsView?: (args: DataFormCustomPropertyEditorEventData) => void,
    onEditorHasToApplyValue?: (args: DataFormCustomPropertyEditorEventData) => void,
    onEditorNeedsValue?: (args: DataFormCustomPropertyEditorEventData) => void,
}

export type CustomPropertyEditorComponentProps<
    E extends NativeScriptCustomPropertyEditor = NativeScriptCustomPropertyEditor
> = Props /* & typeof RCTCustomPropertyEditor.defaultProps */ & Partial<CustomPropertyEditorProps> & PropertyEditorComponentProps<E>;

/**
 * A React wrapper around the NativeScript CustomPropertyEditor component.
 *
 * See: ui/action-bar/action-bar
 * See: https://docs.nativescript.org/ui/action-bar#action-items
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/tree/master/app/ns-ui-widgets-category/action-bar/items-actionbar
 */
export class _CustomPropertyEditor<
    P extends CustomPropertyEditorComponentProps<E>,
    S extends {},
    E extends NativeScriptCustomPropertyEditor
> extends _PropertyEditor<P, S, E> {

    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, NativeScriptCustomPropertyEditor.editorNeedsViewEvent, this.props.onEditorNeedsView, nextProps.onEditorNeedsView);
            updateListener(node, NativeScriptCustomPropertyEditor.editorHasToApplyValueEvent, this.props.onEditorHasToApplyValue, nextProps.onEditorHasToApplyValue);
            updateListener(node, NativeScriptCustomPropertyEditor.editorNeedsValueEvent, this.props.onEditorNeedsValue, nextProps.onEditorNeedsValue);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if(this.props.onEditorNeedsView) method(NativeScriptCustomPropertyEditor.editorNeedsViewEvent, this.props.onEditorNeedsView);
            if(this.props.onEditorHasToApplyValue) method(NativeScriptCustomPropertyEditor.editorHasToApplyValueEvent, this.props.onEditorHasToApplyValue);
            if(this.props.onEditorNeedsValue) method(NativeScriptCustomPropertyEditor.editorNeedsValueEvent, this.props.onEditorNeedsValue);
        }
    }

    render() {
        const {
            forwardedRef,

            /* Doesn't like omitting these props when extending PropertyEditor */
            // onEditorNeedsView,
            // onEditorHasToApplyValue,
            // onEditorNeedsValue,

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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<CustomPropertyEditorComponentProps<NativeScriptCustomPropertyEditor>>;

export const CustomPropertyEditor: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptCustomPropertyEditor>
> = React.forwardRef<NativeScriptCustomPropertyEditor, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptCustomPropertyEditor>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _CustomPropertyEditor,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
