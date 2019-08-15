import * as React from "react";
import { $Page, $StackLayout, $GridLayout, $Label, $ActionBar, $ActionItem, $NavigationButton, $Image, $TextField, $TextView, $ScrollView, $ListView, $FlexboxLayout, $Button } from "react-nativescript";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { goToSettingsPage } from "~/shared/helpers/navigation/nav.helper";
import {
    toCreateCommentRequest,
    toCreateTaskRequest,
    toDeleteItemRequest,
    toUpdateItemRequest,
    UpdateItemRequest
} from '~/core/contracts/requests/backlog';
import { back } from '~/shared/helpers/navigation/nav.helper';
import { Color, Page, TextField, View } from "react-nativescript/dist/client/ElementRegistry";
import { PtItem } from "~/core/models/domain/pt-item.model";
import { ItemEventData } from "react-nativescript/node_modules/tns-core-modules/ui/list-view/list-view";
import { PtTask } from "~/core/models/domain/pt-task.model";
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { PtComment } from "~/core/models/domain/pt-comment.model";
import { dateConverter } from "~/utils/converters";
import { RadDataForm, DataFormEventData, DataFormEditorType, DataFormLabelPosition } from "nativescript-ui-dataform";
import { ConfirmOptions, confirm } from 'tns-core-modules/ui/dialogs';
import { PtUser } from "~/core/models/domain/pt-user.model";
import { getCurrentUserAvatar } from '~/core/services';
import {
    getApiEndpoint,
    getAuthService,
    getBacklogService,
    getCommentService,
    getTaskService
} from '~/globals/dependencies/locator';
import {
    PtAuthService,
    PtBacklogService,
    PtCommentService,
    PtTaskService
} from '~/core/contracts/services';
import {
    applyFormModelUpdatesToItem,
    PtItemDetailsEditFormModel,
    ptItemToFormModel
} from '~/core/models/forms';
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { PtTaskViewModel } from "~/shared/view-models/pages/detail/pt-task.vm";
import { PtCommentViewModel } from "~/shared/view-models/pages/detail/pt-comment.vm";
import { DetailPageProps } from "~/core/models/page-props/detail-page-props";
import { EventData } from "tns-core-modules/ui/text-base/text-base";
import { $RadDataForm, $EntityProperty, $PropertyEditor, $PropertyEditorStyle, $NonEmptyValidator } from "~/rns-plugins/RadDataForm";
import { PtItemType } from "~/core/models/domain/types";
import { COLOR_DARK, COLOR_LIGHT, ItemType, PT_ITEM_STATUSES, PT_ITEM_PRIORITIES } from '~/core/constants';
import {
    getPickerEditorValueText,
    setMultiLineEditorFontSize,
    setPickerEditorImageLocation,
    setSegmentedEditorColor,
    setStepperEditorColors,
    setStepperEditorContentOffset,
    setStepperEditorTextPostfix
  } from '~/shared/helpers/ui-data-form';
import { PriorityEnum } from "~/core/models/domain/enums";
import { showModalAssigneeList } from "~/shared/helpers/modals";
import { PtNewTask } from "~/core/models/dto/backlog";
import { UpdateItemResponse } from "~/core/contracts/responses/backlog";

type Props = DetailPageProps;

interface State {
    selectedScreen: "details"|"tasks"|"chitchat",
    selectedAssignee: PtUser,

    /* details form */
    itemForm: PtItemDetailsEditFormModel|null,
    itemTypesProvider: PtItemType[],
    statusesProvider: typeof PT_ITEM_STATUSES,
    prioritiesProvider: typeof PT_ITEM_PRIORITIES,
    selectedTypeValue: PtItemType,
    selectedPriorityValue: PriorityEnum,
    itemTypeImage: string,
    /* details form END */

    /* tasks */
    newTaskTitle: string,
    tasks: Array<PtTask>,
    /* tasks END */

    /* comments */
    currentUserAvatar: string,
    newCommentText: string,
    comments: Array<PtCommentViewModel>,
    /* comments END */
}

export class DetailPage extends React.Component<Props, State> {
    private readonly formRef: React.RefObject<RadDataForm> = React.createRef<RadDataForm>();

    private readonly authService: PtAuthService = getAuthService();
    private readonly backlogService: PtBacklogService = getBacklogService();
    private readonly taskService: PtTaskService = getTaskService();
    private readonly commentService: PtCommentService = getCommentService();

    private readonly itemDetailsDataForm?: RadDataForm;

    constructor(props: Props){
        super(props);

        const itemForm: PtItemDetailsEditFormModel = ptItemToFormModel(props.item);
        const { typeStr, priorityStr } = itemForm;

        console.log(`Upon constructing DetailPage, typeStr was: ${typeStr}`);
        const selectedTypeValue: PtItemType = typeStr as PtItemType;
        const selectedPriorityValue: PriorityEnum = priorityStr as PriorityEnum;

        this.state = {
            selectedScreen: "details",
            selectedAssignee: props.item.assignee,
            
            /* details form */
            itemForm,
            itemTypesProvider: ItemType.List.map(t => t.PtItemType),
            statusesProvider: PT_ITEM_STATUSES,
            prioritiesProvider: PT_ITEM_PRIORITIES,
            selectedTypeValue,
            selectedPriorityValue,
            itemTypeImage: ItemType.imageResFromType(selectedTypeValue),
            /* details form END */
            
            /* tasks */
            newTaskTitle: EMPTY_STRING,
            // FIXME: Need to derive PtTaskViewModel from itemForm (whose state updates propagate to DetailPage where we track them) rather than item (which is immutable).
            // TODO: Downgrade this to a regular array to reflect that React is managing the state
            tasks: itemForm.tasks, //.map(task => new PtTaskViewModel(task, props.item)),
            /* tasks END */
            
            /* comments */
            currentUserAvatar: getCurrentUserAvatar(
                getApiEndpoint(),
                this.authService.getCurrentUserId()
            ),
            newCommentText: EMPTY_STRING,
            comments: itemForm.comments.map(comment => new PtCommentViewModel(comment)),
            /* comments END */
        };
    }

    private readonly onDeleteTap = (args: GestureEventData) => {
        const options: ConfirmOptions = {
            title: 'Delete Item',
            message: 'Are you sure you want to delete this item?',
            okButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        };

        // confirm with options, with promise
        confirm(options).then((result: boolean) => {
            // result can be true/false/undefined
            if (result) {
                this.deleteRequested();
            }
        });
    };

    private readonly onNavBackTap = (args: GestureEventData) => {
        back();
    };

    private readonly onTabDetailsTap = (args: GestureEventData) => {
        this.setState({ selectedScreen: "details" });
    };
    
    private readonly onTabTasksTap = (args: GestureEventData) => {
        this.setState({ selectedScreen: "tasks" });
        
    };
    
    private readonly onTabChitchatTap = (args: GestureEventData) => {
        this.setState({ selectedScreen: "chitchat" });
    };

    private readonly getSelectedAssignee = () => {
        return this.state.selectedAssignee ? this.state.selectedAssignee : this.props.item.assignee;
    }
    
    private readonly setSelectedAssignee = (selectedAssignee: PtUser): Promise<void> => {
        if(!selectedAssignee){
            return Promise.resolve();
        }

        return new Promise(
            (resolve, reject) => {
                this.setState(
                    {
                        selectedAssignee
                    },
                    () => {
                        resolve(
                            this.notifyUpdateItem()
                            .then((response: UpdateItemResponse) => {
                                // No-op
                            })
                            .catch((error: any) => {
                                console.log(`[ERROR] notifyUpdateItem() failed`, error);
                                // Just swalllow the error here.
                            })
                        );
                    }
                );
            }
        );
    }

    private readonly notifyUpdateItem = (): Promise<UpdateItemResponse> => {
        const updatedItem: PtItem = applyFormModelUpdatesToItem(
            this.props.item,
            this.state.itemForm,
            this.state.selectedAssignee
        );
        
        const updateItemRequest: UpdateItemRequest = toUpdateItemRequest(updatedItem);
    
        return this.backlogService.updatePtItem(updateItemRequest);
    }

    private readonly onAssigneeRowTap = (args: GestureEventData) => {
        console.log(`[onAssigneeRowTap]`);
        const view = args.object as View;

        showModalAssigneeList(view.page, this.getSelectedAssignee())
        .then(
            (selectedAssignee: PtUser) => {
                if(!selectedAssignee){
                    return;
                }
                return this.setSelectedAssignee(selectedAssignee);
            }
        );
    };

    private readonly onAddComment = (args: GestureEventData) => {

    };

    // detail-page.ts
    private readonly onTaskToggleTap = (args: GestureEventData) => {
        // TODO: revisit this.

        // const textField = args.object as TextField;
        // const taskVm = textField.bindingContext as PtTaskViewModel;
        // taskVm.onTaskToggleRequested();
    };

    private readonly onListItemTap = (itemEventData: ItemEventData) => {
        const task: PtTask = this.props.item.tasks[itemEventData.index];

        // stub
    };

    // detail-page.ts
    private readonly onTaskFocused = (args: EventData) => {
        // TODO: revisit this.

        // const textField = args.object as TextField;
        // const taskVm = textField.bindingContext as PtTaskViewModel;
        // taskVm.onTaskFocused(textField.text);

        // textField.on('textChange', () => taskVm.onTextChange(textField.text));
    };

    private readonly onTaskBlurred = (args: EventData) => {
        // const textField = args.object as TextField;
        // const taskVm = textField.bindingContext as PtTaskViewModel;
        // textField.off('textChange');
        // taskVm.onTaskBlurred();
    };

    private readonly onPropertyCommitted = (args: DataFormEventData) => {
        console.log(`[onPropertyCommitted]`);
    };

    private readonly onEditorUpdate = (args: DataFormEventData) => {
        console.log(`[onEditorUpdate] ${args.propertyName}`);

        switch (args.propertyName) {
            case 'description':
                this.editorSetupDescription(args.editor);
                break;
            case 'typeStr':
                this.editorSetupType(args.editor);
                break;
            case 'estimate':
                this.editorSetupEstimate(args.editor);
                break;
            case 'priorityStr':
                this.editorSetupPriority(args.editor);
                break;
          }
    };

    /* I don't know why this is an accessor in the original code, but for consistency... */
    private get itemTypeEditorDisplayName(){
        return "Type";
    }

    private readonly editorSetupDescription = (editor: any) => {
        setMultiLineEditorFontSize(editor, 17);
    }
      
    private readonly editorSetupType = (editor: any) => {
        setPickerEditorImageLocation(editor);
        const selectedTypeValue: PtItemType = getPickerEditorValueText(editor) as PtItemType;
        // CAUTION: this is now async
        this.updateSelectedTypeValue(selectedTypeValue);
    }

    /* details START */
    private readonly updateSelectedTypeValue = (selectedTypeValue: PtItemType) => {
        if(selectedTypeValue === this.state.selectedTypeValue){
            console.log(`[updateSelectedTypeValue] selectedTypeValue: ${selectedTypeValue} (no-op)`);
            // Prevent infinite loop (wherein the very action of setting state prompts the "editorUpdate" event).
            return;
        }
        console.log(`[updateSelectedTypeValue] selectedTypeValue: ${selectedTypeValue} (payload)`);

        this.setState(
            (state: State) => {
                return {
                    /* We make sure to update the form itself too, otherwise state would be mismatched between the form and the DetailPage component.  */
                    itemForm: {
                        ...state.itemForm,
                        typeStr: selectedTypeValue,
                    },
    
                    selectedTypeValue,
                    itemTypeImage: ItemType.imageResFromType(selectedTypeValue),
                };
            },
        );
    }

    private readonly editorSetupEstimate = (editor: any) => {
        setStepperEditorContentOffset(editor, -25, 0);
        setStepperEditorTextPostfix(editor, 'point', 'points');
        setStepperEditorColors(editor, COLOR_LIGHT, COLOR_DARK);
    }

    // private readonly updateSelectedPriorityValue = (editorPriority: PriorityEnum): PriorityEnum => {
    //     console.log(`[updateSelectedPriorityValue] editorPriority: ${editorPriority}`);
    //     const selectedPriorityValue = this.calculateSelectedPriorityValue(editorPriority);

    //     // CAUTION: async
    //     this.setState({ selectedPriorityValue });
    //     return selectedPriorityValue;
    // }

    private readonly calculateSelectedPriorityValue = (editorPriority: PriorityEnum): PriorityEnum => {
        return editorPriority ? editorPriority : this.state.itemForm.priorityStr as PriorityEnum;
    }

    private readonly deleteRequested = (): void => {
        this.backlogService
            .deletePtItem(toDeleteItemRequest(this.props.item))
            .then(() => {})
            .catch(() => {
                console.log('some error occured');
            });
    }
    /* details END */

    /* tasks START */
    private readonly onAddTask = (args: GestureEventData) => {
        const newTitle = this.state.newTaskTitle.trim();
        if (newTitle.length === 0) {
            return;
        }

        const newTask: PtNewTask = {
            title: newTitle,
            completed: false
        };

        this.taskService
            .addNewPtTask(toCreateTaskRequest(newTask, this.props.item))
            .then(response => {
                this.state.tasks.unshift(
                    new PtTaskViewModel(response.createdTask, this.props.item)
                );
                
                return new Promise((resolve, reject) => {
                    this.setState({ newTaskTitle: EMPTY_STRING }, () => {
                        resolve();
                    });
                });
            })
            .catch(() => {
                console.log('something went wrong when adding task');
            });
    }
    /* tasks END */
      
    private readonly editorSetupPriority = (editor: any) => {
        const editorPriority: PriorityEnum = editor.value as PriorityEnum;
        console.log(`[editorSetupPriority] editorPriority ${editorPriority}`);
        
        const selectedPriorityValue = this.calculateSelectedPriorityValue(editorPriority);

        if(selectedPriorityValue === this.state.selectedPriorityValue){
            console.log(`[updateSelectedPriorityValue] selectedPriorityValue: ${selectedPriorityValue} (no-op)`);
            // Prevent infinite loop (wherein the very action of setting state prompts the "editorUpdate" event).
            return;
        }
        console.log(`[updateSelectedPriorityValue] selectedPriorityValue: ${selectedPriorityValue} (payload)`);

        this.setState(
            (state: State) => {
                return {
                    /* We make sure to update the form itself too, otherwise state would be mismatched between the form and the DetailPage component.  */
                    itemForm: {
                        ...state.itemForm,
                        priorityStr: selectedPriorityValue,
                    },
    
                    selectedPriorityValue,
                };
            },
            () => {
                setSegmentedEditorColor(editor, PriorityEnum.getColor(selectedPriorityValue));
            }
        );

        /* The value keeps resetting. I think this is because setState() triggers a re-render (as expected),
         * but we never mutated this.props.item, so the form is rebuilt on the next render from its initial state. */
    }


    componentDidMount(){
        console.log(`[DetailPage.componentDidMount] this.props.forwardedRef: ${this.props.forwardedRef}; this.props.forwardedRef.current: ${this.props.forwardedRef}`);
        this.props.forwardedRef.current!.addCssFile("views/pages/detail/detail-page.css");
    }

    public render(){
        const { forwardedRef, item, ...rest } = this.props;
        const { itemForm, newTaskTitle, newCommentText, selectedScreen, selectedAssignee, itemTypeImage, statusesProvider, itemTypesProvider, prioritiesProvider, tasks, comments } = this.state;
        console.log(`[DetailPage.render] with tasks`, tasks);

        // /* Originally these were derived from this.props.item, but for React we ensure that the state is managed by DetailPage rather than stashed inside ObservableArray. */
        // const observableTasks = new ObservableArray<PtTaskViewModel>(
        //     // FIXME: Need to derive PtTaskViewModel from itemForm (whose state updates propagate to DetailPage where we track them) rather than item (which is immutable).
        //     // TODO: Downgrade this to a regular array to reflect that React is managing the state
        //     itemForm.tasks.map(task => new PtTaskViewModel(task, item))
        // );
        // const observableComments = new ObservableArray<PtCommentViewModel>(
        //     itemForm.comments.map(comment => new PtCommentViewModel(comment))
        // );

        return (
            <$Page ref={forwardedRef} className="page" {...rest}>
                <$ActionBar title="Item">
                    <$NavigationButton text="Back" android={{ systemIcon: "ic_menu_back" }} onTap={this.onNavBackTap}/>

                    <$ActionItem onTap={this.onDeleteTap} ios={{ systemIcon: 16, position: "right" }} text="delete" android={{ systemIcon: "ic_menu_delete", position: "actionBar" }}/>
                </$ActionBar>

                <$StackLayout>
                    <$GridLayout className="pt-item-detail-header" rows={[new ItemSpec(1, "star"), new ItemSpec(40, "pixel")]} columns={[]}>

                        <$GridLayout row={0} columns={[new ItemSpec(1, "star")]} rows={[]} className="pt-item-detail-header-title-row">
                            <$Label text={item.title} className="pt-item-detail-header-title" col={0}/>
                        </$GridLayout>

                        <$StackLayout row={1}>
                            <$FlexboxLayout className="selector">
                                <$GridLayout rows={[]} columns={[]} className={selectedScreen === 'details' ? 'selector-btn-wrapper active' : 'selector-btn-wrapper'}>
                                    <$Button onTap={this.onTabDetailsTap} text="Details" className={selectedScreen === 'details' ? 'selector-btn active' : 'selector-btn'}/>
                                </$GridLayout>
                                <$GridLayout rows={[]} columns={[]} className={selectedScreen === 'tasks' ? 'selector-btn-wrapper active' : 'selector-btn-wrapper'}>
                                    <$Button onTap={this.onTabTasksTap} text="Tasks" className={selectedScreen === 'tasks' ? 'selector-btn active' : 'selector-btn'}/>
                                </$GridLayout>
                                <$GridLayout rows={[]} columns={[]} className={selectedScreen === 'chitchat' ? 'selector-btn-wrapper active' : 'selector-btn-wrapper'}>
                                    <$Button onTap={this.onTabChitchatTap} text="Chitchat" className={selectedScreen === 'chitchat' ? 'selector-btn active' : 'selector-btn'}/>
                                </$GridLayout>
                            </$FlexboxLayout>
                        </$StackLayout>
                    </$GridLayout>

                    <$StackLayout>
                        {/* Details */}
                        <$GridLayout visibility={selectedScreen === 'details' ? 'visible' : 'collapse'} rows={[new ItemSpec(1, "auto"), new ItemSpec(1, "auto")]} columns={[]} className="pt-item-details-container">

                            <$GridLayout row={0} columns={[new ItemSpec(1, "star"), new ItemSpec(1, "star"), new ItemSpec(1, "auto")]} rows={[]} className="assignee-row" onTap={this.onAssigneeRowTap}>
                                <$Label text="Assignee" color={new Color("#4b5833")} col={0} />
                                <$Label text={selectedAssignee.fullName} col={1} />
                                <$Image id="assigneeImg" width={40} height={40} className="pt-item-detail-avatar" src={selectedAssignee.avatar} col={2} />
                            </$GridLayout>

                            <$RadDataForm
                                id="itemDetailsDataForm"
                                row={1}
                                source={itemForm}
                                onPropertyCommitted={this.onPropertyCommitted}
                                onEditorUpdate={this.onEditorUpdate}
                            >
                                <$EntityProperty name="title" displayName="Title" index={1} hintText="Title">
                                    <$PropertyEditor type={DataFormEditorType.Text}>
                                        <$PropertyEditorStyle labelTextColor={new Color("#4b5833")} labelPosition={DataFormLabelPosition.Top}/>
                                    </$PropertyEditor>
                                    <$NonEmptyValidator errorMessage={"Title can't be empty."}/>
                                </$EntityProperty>

                                <$EntityProperty name="description" displayName="Description" index={2} required={true} hintText="description">
                                    <$PropertyEditor type={DataFormEditorType.MultilineText}>
                                        <$PropertyEditorStyle labelTextColor={new Color("#4b5833")} labelPosition={DataFormLabelPosition.Top}/>
                                    </$PropertyEditor>
                                </$EntityProperty>

                                <$EntityProperty name="typeStr" displayName={this.itemTypeEditorDisplayName} index={3} imageResource={itemTypeImage} valuesProvider={itemTypesProvider}>
                                    <$PropertyEditor type={DataFormEditorType.Picker}>
                                        <$PropertyEditorStyle labelTextColor={new Color("#4b5833")}/>
                                    </$PropertyEditor>
                                </$EntityProperty>

                                <$EntityProperty name="statusStr" displayName="Status" index={4} valuesProvider={statusesProvider}>
                                    <$PropertyEditor type={DataFormEditorType.Picker}>
                                        <$PropertyEditorStyle labelTextColor={new Color("#4b5833")}/>
                                    </$PropertyEditor>
                                </$EntityProperty>

                                <$EntityProperty name="estimate" displayName="Estimate" index={5}>
                                    <$PropertyEditor type={DataFormEditorType.Stepper}>
                                        <$PropertyEditorStyle labelTextColor={new Color("#4b5833")}/>
                                    </$PropertyEditor>
                                </$EntityProperty>

                                <$EntityProperty name="priorityStr" displayName="Priority" index={6} valuesProvider={prioritiesProvider}>
                                    <$PropertyEditor type={DataFormEditorType.SegmentedEditor}>
                                        <$PropertyEditorStyle labelTextColor={new Color("#4b5833")} labelPosition={DataFormLabelPosition.Top}/>
                                    </$PropertyEditor>
                                </$EntityProperty>

                                <$EntityProperty name="assigneeName" hidden={true}/>
                            </$RadDataForm>
                        </$GridLayout>

                        {/* Tasks */}
                        <$GridLayout visibility={selectedScreen === 'tasks' ? 'visible' : 'collapse'} rows={[new ItemSpec(70, "pixel"), new ItemSpec(1, "star")]} columns={[]} className="pt-item-tasks-container">
                            <$GridLayout row={0} columns={[new ItemSpec(1, "star"), new ItemSpec(80, "pixel")]} rows={[]} className="pt-tasks-add-row">
                                <$TextField hint="Enter new task..." text={newTaskTitle} col={0} className="pt-text-task-add" />
                                <$Button onTap={this.onAddTask} text="Add" col={1} className="{{ newTaskTitle.length > 0 ? 'pt-btn-task-add enabled' : 'pt-btn-task-add' }}" isEnabled={newTaskTitle.length > 0}/>
                            </$GridLayout>

                            <$StackLayout row={1} className="pt-tasks-scroll">
                                <$StackLayout className="pt-tasks-list-container">
                                    <$ListView
                                        id="tasksList"
                                        // FIXME: convert tasks from TasksViewModel to PtTask[]
                                        items={tasks}
                                        onItemTap={this.onListItemTap}
                                        cellFactory={(task: PtTask, ref: React.RefObject<any>) => {
                                            const { title, completed, } = task;

                                            return (
                                                <$GridLayout
                                                    ref={ref}
                                                    className="pt-task-wrapper"
                                                    columns={[new ItemSpec(30, "pixel"), new ItemSpec(1, "star")]}
                                                    rows={[]}
                                                >
                                                    <$Image onTap={this.onTaskToggleTap} src={completed ? 'res://checkboxchecked' : 'res://checkboxunchecked'} className="task-checkbox" col={0} />
                                                    {/* TODO */}
                                                    <$TextField col={1} text={title} onFocus={this.onTaskFocused} onBlur={this.onTaskBlurred} className="task-title" />
                                                </$GridLayout>
                                            );
                                        }}
                                        separatorColor={new Color("#97a879")}
                                    />
                                </$StackLayout>
                            </$StackLayout>
                        </$GridLayout>

                        {/* Chitchat */}
                        <$GridLayout visibility={selectedScreen === 'chitchat' ? 'visible' : 'collapse'} rows={[new ItemSpec(70, "pixel"), new ItemSpec(1, "star")]} columns={[]}  className="pt-item-chitchat-container">

                            <$GridLayout row={0} columns={[new ItemSpec(60, "pixel"), new ItemSpec(1, "star"), new ItemSpec(80, "pixel")]} rows={[]} className="pt-comments-add-row">
                                <$Image src="{{ currentUserAvatar }}" stretch="aspectFit" className="pt-img-comment-add" col={0} />
                                <$TextField hint="Enter new comment..." text={newCommentText} col={1} className="pt-text-comment-add" />
                                <$Button onTap={this.onAddComment} text="Add" col={2} className={newCommentText.length > 0 ? 'pt-btn-comment-add enabled' : 'pt-btn-comment-add'} isEnabled={newCommentText.length > 0}/>
                            </$GridLayout>

                            <$ScrollView row={1} className="pt-comments-scroll">
                                <$StackLayout className="pt-comments-list-container">
                                    {comments.map((comment: PtComment) => {
                                        const { user, title, dateCreated, id } = comment;
                                        // In the Core version, this was all contained by a Repeater with the id "commentsList"
                                        return (
                                            <$GridLayout key={id} columns={[new ItemSpec(40, "pixel"), new ItemSpec(1, "star")]} rows={[]} className="pt-comment-wrapper">
                                                <$Image src={user.avatar} width={{ value: 40, unit: "dip" }} height={{ value: 40, unit: "dip" }} stretch="aspectFit" className="img-comment-avatar" col={0} />

                                                <$GridLayout col={1} rows={[new ItemSpec(20, "pixel"), new ItemSpec(1, "star")]} columns={[new ItemSpec(1, "star"), new ItemSpec(150, "pixel")]} className="comment-text-wrapper">
                                                    <$Label col={0} row={0} text={user.fullName} className="comment-name"/>
                                                    <$Label col={1} row={0} text={dateConverter(dateCreated)} className="comment-date"/>

                                                    <$TextView colSpan={2} row={1} text={title} editable={false} className="comment-text"/>
                                                </$GridLayout>
                                            </$GridLayout>
                                        );
                                    })}
                                </$StackLayout>
                            </$ScrollView>

                        </$GridLayout>

                    </$StackLayout>

                </$StackLayout>
            </$Page>
        );
    }
}