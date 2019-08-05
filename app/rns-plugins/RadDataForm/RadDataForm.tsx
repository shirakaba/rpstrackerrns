import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { RadDataForm as NativeScriptRadDataForm, DataFormEventData } from "nativescript-ui-dataform";
import { ViewComponentProps, RCTView } from "react-nativescript/dist/components/View";
import { updateListener } from "react-nativescript/dist/client/EventHandling";
import { EventData } from "tns-core-modules/data/observable/observable";
import { register, View } from "react-nativescript/dist/client/ElementRegistry";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";

const elementKey: string = "radDataForm";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptRadDataForm();
    }
);

type RadDataFormProps = Pick<NativeScriptRadDataForm,
"isReadOnly"|
"commitMode"|
"validationMode"|
"source"|
"metadata"|
"groups"|
"properties">;

interface Props {
    onEditorSelected?: (args: DataFormEventData) => void,
    onEditorDeselected?: (args: DataFormEventData) => void,
    onPropertyEdited?: (args: DataFormEventData) => void,
    onPropertyValidate?: (args: DataFormEventData) => void,
    onPropertyValidated?: (args: DataFormEventData) => void,
    onEditorSetup?: (args: DataFormEventData) => void,
    onEditorUpdate?: (args: DataFormEventData) => void,
    onGroupUpdate?: (args: DataFormEventData) => void,
    onPropertyCommit?: (args: DataFormEventData) => void,
    onPropertyCommitted?: (args: DataFormEventData) => void,
    onGroupExpanded?: (args: DataFormEventData) => void,
    onGroupCollapsed?: (args: DataFormEventData) => void,
}

export type RadDataFormComponentProps<
    E extends NativeScriptRadDataForm = NativeScriptRadDataForm
    // @ts-ignore RadDataForm DOES extend View!
> = Props /* & typeof RadDataForm.defaultProps */ & Partial<RadDataFormProps> & ViewComponentProps<E>;

export class _RadDataForm<
    P extends RadDataFormComponentProps<E>,
    S extends {},
    E extends NativeScriptRadDataForm
    // @ts-ignore RadDataForm DOES extend View!
> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptRadDataForm>()
    // };

    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, NativeScriptRadDataForm.editorSelectedEvent, this.props.onEditorSelected, nextProps.onEditorSelected);
            updateListener(node, NativeScriptRadDataForm.editorDeselectedEvent, this.props.onEditorDeselected, nextProps.onEditorDeselected);
            updateListener(node, NativeScriptRadDataForm.propertyEditedEvent, this.props.onPropertyEdited, nextProps.onPropertyEdited);
            updateListener(node, NativeScriptRadDataForm.propertyValidateEvent, this.props.onPropertyValidate, nextProps.onPropertyValidate);
            updateListener(node, NativeScriptRadDataForm.propertyValidatedEvent, this.props.onPropertyValidated, nextProps.onPropertyValidated);
            updateListener(node, NativeScriptRadDataForm.editorSetupEvent, this.props.onEditorSetup, nextProps.onEditorSetup);
            updateListener(node, NativeScriptRadDataForm.editorUpdateEvent, this.props.onEditorUpdate, nextProps.onEditorUpdate);
            updateListener(node, NativeScriptRadDataForm.groupUpdateEvent, this.props.onGroupUpdate, nextProps.onGroupUpdate);
            updateListener(node, NativeScriptRadDataForm.propertyCommitEvent, this.props.onPropertyCommit, nextProps.onPropertyCommit);
            updateListener(node, NativeScriptRadDataForm.propertyCommittedEvent, this.props.onPropertyCommitted, nextProps.onPropertyCommitted);
            updateListener(node, NativeScriptRadDataForm.groupExpandedEvent, this.props.onGroupExpanded, nextProps.onGroupExpanded);
            updateListener(node, NativeScriptRadDataForm.groupCollapsedEvent, this.props.onGroupCollapsed, nextProps.onGroupCollapsed);
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if(this.props.onEditorSelected) method(NativeScriptRadDataForm.editorSelectedEvent, this.props.onEditorSelected);
            if(this.props.onEditorDeselected) method(NativeScriptRadDataForm.editorDeselectedEvent, this.props.onEditorDeselected);
            if(this.props.onPropertyEdited) method(NativeScriptRadDataForm.propertyEditedEvent, this.props.onPropertyEdited);
            if(this.props.onPropertyValidate) method(NativeScriptRadDataForm.propertyValidateEvent, this.props.onPropertyValidate);
            if(this.props.onPropertyValidated) method(NativeScriptRadDataForm.propertyValidatedEvent, this.props.onPropertyValidated);
            if(this.props.onEditorSetup) method(NativeScriptRadDataForm.editorSetupEvent, this.props.onEditorSetup);
            if(this.props.onEditorUpdate) method(NativeScriptRadDataForm.editorUpdateEvent, this.props.onEditorUpdate);
            if(this.props.onGroupUpdate) method(NativeScriptRadDataForm.groupUpdateEvent, this.props.onGroupUpdate);
            if(this.props.onPropertyCommit) method(NativeScriptRadDataForm.propertyCommitEvent, this.props.onPropertyCommit);
            if(this.props.onPropertyCommitted) method(NativeScriptRadDataForm.propertyCommittedEvent, this.props.onPropertyCommitted);
            if(this.props.onGroupExpanded) method(NativeScriptRadDataForm.groupExpandedEvent, this.props.onGroupExpanded);
            if(this.props.onGroupCollapsed) method(NativeScriptRadDataForm.groupCollapsedEvent, this.props.onGroupCollapsed);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onEditorSelected,
            onEditorDeselected,
            onPropertyEdited,
            onPropertyValidate,
            onPropertyValidated,
            onEditorSetup,
            onEditorUpdate,
            onGroupUpdate,
            onPropertyCommit,
            onPropertyCommitted,
            onGroupExpanded,
            onGroupCollapsed,

            onLoaded,
            onUnloaded,
            onAndroidBackPressed,
            onShowingModally,
            onShownModally,

            onTap,
            onDoubleTap,
            onPinch,
            onPan,
            onSwipe,
            onRotation,
            onLongPress,
            onTouch,

            onPropertyChange,

            children,
            //@ts-ignore - ATLoader not liking this rest operation for some reason.
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<RadDataFormComponentProps<NativeScriptRadDataForm>>;

export const $RadDataForm: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptRadDataForm>
> = React.forwardRef<NativeScriptRadDataForm, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptRadDataForm>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _RadDataForm,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);