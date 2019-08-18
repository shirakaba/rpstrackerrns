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
import { PtTaskViewModel } from '~/shared/view-models/pages/detail/pt-task.vm';
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
import { PtNewTask, PtNewComment } from "~/core/models/dto/backlog";
import { UpdateItemResponse } from "~/core/contracts/responses/backlog";
import { StatusEnum } from '~/core/models/domain/enums';

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
    selectedStatusValue: StatusEnum,
    selectedPriorityValue: PriorityEnum,
    selectedEstimateValue: number,
    itemTypeImage: string,
    /* details form END */

    /* tasks */
    newTaskTitle: string,
    // tasks: Array<PtTask>,
    /* tasks END */

    /* comments */
    currentUserAvatar: string,
    newCommentText: string,
    // comments: Array<PtCommentViewModel>,
    /* comments END */
}

export class DetailPage extends React.Component<Props, State> {
    private readonly formRef: React.RefObject<RadDataForm> = React.createRef<RadDataForm>();

    private readonly authService: PtAuthService = getAuthService();
    private readonly backlogService: PtBacklogService = getBacklogService();
    private readonly taskService: PtTaskService = getTaskService();
    private readonly commentService: PtCommentService = getCommentService();

    constructor(props: Props){
        super(props);

        const itemForm: PtItemDetailsEditFormModel = ptItemToFormModel(props.item);
        const { typeStr, priorityStr, statusStr, estimate } = itemForm;

        const selectedTypeValue: PtItemType = typeStr as PtItemType;
        const selectedStatusValue: StatusEnum = statusStr as StatusEnum;
        const selectedPriorityValue: PriorityEnum = priorityStr as PriorityEnum;
        const selectedEstimateValue: number = estimate as number;

        this.state = {
            selectedScreen: "details",
            selectedAssignee: props.item.assignee,
            
            /* details form */
            itemForm,
            itemTypesProvider: ItemType.List.map(t => t.PtItemType),
            statusesProvider: PT_ITEM_STATUSES,
            prioritiesProvider: PT_ITEM_PRIORITIES,
            selectedTypeValue,
            selectedStatusValue,
            selectedPriorityValue,
            selectedEstimateValue,
            itemTypeImage: ItemType.imageResFromType(selectedTypeValue),
            /* details form END */
            
            /* tasks */
            newTaskTitle: EMPTY_STRING,
            /* tasks END */
            
            /* comments */
            currentUserAvatar: getCurrentUserAvatar(
                getApiEndpoint(),
                /* NOTE: will be undefined if you've hard-coded your way in, rather than gone through the proper login flow. */
                this.authService.getCurrentUserId()
            ),
            newCommentText: EMPTY_STRING,
            // comments: itemForm.comments.map(comment => new PtCommentViewModel(comment)),
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
        const newCommentTxt: string = this.state.newCommentText.trim();
        if (newCommentTxt.length === 0) {
            return;
        }
        
        const newComment: PtNewComment = {
            title: newCommentTxt
        };
        
        this.commentService
            .addNewPtComment(toCreateCommentRequest(
                newComment,
                this.props.item
            ))
            .then(response => {
                return new Promise((resolve, reject) => {                    
                    this.setState((state: State) => {
                        const addedComment = response.createdComment;
                        addedComment.user.avatar = state.currentUserAvatar;

                        return {
                            newCommentText: EMPTY_STRING,

                            itemForm: {
                                ...state.itemForm,
                                comments: [new PtCommentViewModel(addedComment), ...state.itemForm.comments]
                            }
                        };
                    },
                    () => {
                        resolve();
                    });
                });
            })
            .catch((error: any) => {
                console.log('something went wrong when adding comment', error);
            });
    };

    // From detail-page.ts
    private readonly onTaskToggleTap = (task: PtTask) => {
        // const textField = args.object as TextField;
        // const taskVm = textField.bindingContext as PtTaskViewModel;
        // taskVm.onTaskToggleRequested();

        this.setState(
            (state: State) => {
                const currentTasks: PtTask[] = state.itemForm.tasks;

                let matchingTaskIndex: number = -1;
                for(let i = 0; i < currentTasks.length; i++){
                    if(currentTasks[i].id === task.id){
                        matchingTaskIndex = i;
                        break;
                    }
                }

                if(matchingTaskIndex === -1){
                    return;
                }

                const newTasks: PtTask[] = [...currentTasks];
                newTasks[matchingTaskIndex].completed = !newTasks[matchingTaskIndex].completed;

                return {
                    /* We make sure to update the form itself too, otherwise state would be mismatched between the form and the DetailPage component.  */
                    itemForm: {
                        ...state.itemForm,
                        tasks: newTasks,
                    },
                    
                };
            },
            () => {
                new PtTaskViewModel(task, this.props.item).onTaskToggleRequested();
            }
        );
    };

    // private readonly onListItemTap = (itemEventData: ItemEventData) => {
    //     const task: PtTask = this.props.item.tasks[itemEventData.index];
    // };

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
            case 'statusStr':
                this.editorSetupStatus(args.editor);
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
        const selectedTypeValue: PtItemType = getPickerEditorValueText(editor) as PtItemType;
        // CAUTION: this is now async
        this.updateSelectedTypeValue(editor, selectedTypeValue);
    }

    /* details START */
    private readonly updateSelectedTypeValue = (editor: any, selectedTypeValue: PtItemType) => {
        function updatePicker(){
            setPickerEditorImageLocation(editor);
        }

        if(selectedTypeValue === this.state.selectedTypeValue){
            console.log(`[updateSelectedTypeValue] selectedTypeValue: ${selectedTypeValue} (no-op)`);
            updatePicker();

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
            () => {
                updatePicker();
            }
        );
    }

    private readonly editorSetupEstimate = (editor: any) => {
        const editorEstimate: number = editor.value as number;
        console.log(`[editorSetupEstimate] editorEstimate ${editorEstimate}`);
        
        const selectedEstimateValue = this.calculateSelectedEstimateValue(editorEstimate);

        function updateStepper(){
            setStepperEditorContentOffset(editor, -25, 0);
            setStepperEditorTextPostfix(editor, 'point', 'points');
            setStepperEditorColors(editor, COLOR_LIGHT, COLOR_DARK);
        }

        if(selectedEstimateValue === this.state.selectedEstimateValue){
            console.log(`[updateSelectedEstimateValue] selectedEstimateValue: ${selectedEstimateValue} (no-op)`);
            updateStepper();

            // Prevent infinite loop (wherein the very action of setting state prompts the "editorUpdate" event).
            return;
        }
        console.log(`[updateSelectedEstimateValue] selectedEstimateValue: ${selectedEstimateValue} (payload)`);

        this.setState(
            (state: State) => {
                return {
                    /* We make sure to update the form itself too, otherwise state would be mismatched between the form and the DetailPage component.  */
                    itemForm: {
                        ...state.itemForm,
                        estimate: selectedEstimateValue,
                    },
    
                    selectedEstimateValue,
                };
            },
            () => {
                // editor has now likely changed due to the re-render, so may appear to do nothing.
                updateStepper();
            }
        );
    }

    private readonly calculateSelectedPriorityValue = (editorPriority: PriorityEnum): PriorityEnum => {
        return editorPriority ? editorPriority : this.state.itemForm.priorityStr as PriorityEnum;
    }

    private readonly calculateSelectedStatusValue = (editorStatus: StatusEnum): StatusEnum => {
        return editorStatus ? editorStatus : this.state.itemForm.statusStr as StatusEnum;
    }

    private readonly calculateSelectedEstimateValue = (editorEstimate: number): number => {
        return editorEstimate ? editorEstimate : this.state.itemForm.estimate;
    }

    private readonly onNewTaskTextChange = (args: EventData) => {
        this.setState({ newTaskTitle: (args.object as TextField).text });
    }

    private readonly onNewCommentTextChange = (args: EventData) => {
        this.setState({ newCommentText: (args.object as TextField).text });
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
                return new Promise((resolve, reject) => {
                    this.setState((state: State) => {
                        return {
                            newTaskTitle: EMPTY_STRING,

                            itemForm: {
                                ...state.itemForm,
                                tasks: [new PtTaskViewModel(response.createdTask, this.props.item), ...state.itemForm.tasks]
                            }
                        };
                    },
                    () => {
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

        function updateSegmentedEditor(){
            setSegmentedEditorColor(editor, PriorityEnum.getColor(selectedPriorityValue));
        }

        if(selectedPriorityValue === this.state.selectedPriorityValue){
            console.log(`[updateSelectedPriorityValue] selectedPriorityValue: ${selectedPriorityValue} (no-op)`);
            updateSegmentedEditor();

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
                console.log(`[updateSelectedPriorityValue] setSegmentedEditorColor based on: ${selectedPriorityValue}`);
                // editor has now likely changed due to the re-render, so may appear to do nothing.
                updateSegmentedEditor();
            }
        );
    }

    private readonly editorSetupStatus = (editor: any) => {
        const editorStatus: StatusEnum = editor.value as StatusEnum;
        console.log(`[editorSetupStatus] editorStatus ${editorStatus}`);
        
        const selectedStatusValue: StatusEnum = this.calculateSelectedStatusValue(editorStatus);
        if(selectedStatusValue === this.state.selectedStatusValue){
            // Prevent infinite loop (wherein the very action of setting state prompts the "editorUpdate" event).
            return;
        }

        console.log(`[updateSelectedStatusValue] selectedStatusValue: ${selectedStatusValue} (payload)`);

        this.setState(
            (state: State) => {
                return {
                    /* We make sure to update the form itself too, otherwise state would be mismatched between the form and the DetailPage component.  */
                    itemForm: {
                        ...state.itemForm,
                        statusStr: selectedStatusValue,
                    },
    
                    selectedStatusValue,
                };
            },
            () => {
            }
        );
    };

    private readonly onPropertyCommitted = (args: DataFormEventData) => {
        console.log(`[onPropertyCommitted] will call notifyUpdateItem()`);

        this.formRef.current!
        .validateAll()
        .then((ok: boolean) => {
            if(!ok){
                console.log(`[onPropertyCommitted] notifyUpdateItem() found form to be invalid`);
                return;
            }

            this.notifyUpdateItem()
            .then((response: UpdateItemResponse) => {
                // No-op
                console.log(`[onPropertyCommitted] notifyUpdateItem() succeeded`, response.updatedItem);
            })
            .catch((error: any) => {
                console.log(`[ERROR] notifyUpdateItem() failed`, error);
                // Just swalllow the error here.
            })
        })
        .catch((error: any) => {
          console.error(error);
        });
    };

    componentDidMount(){
        this.props.forwardedRef.current!.addCssFile("views/pages/detail/detail-page.css");
    }

    public render(){
        const { forwardedRef, item, ...rest } = this.props;
        const { itemForm, newTaskTitle, newCommentText, selectedScreen, selectedAssignee, itemTypeImage, statusesProvider, itemTypesProvider, prioritiesProvider, currentUserAvatar } = this.state;

        const { tasks, comments, ...itemFormTruncated } = itemForm;

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
                                // id="itemDetailsDataForm"
                                ref={this.formRef}
                                row={1}
                                source={itemFormTruncated}
                                onEditorUpdate={this.onEditorUpdate}
                                onPropertyCommitted={this.onPropertyCommitted}
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
                                <$TextField hint="Enter new task..." text={newTaskTitle} onTextChange={this.onNewTaskTextChange} col={0} className="pt-text-task-add" />
                                <$Button onTap={this.onAddTask} text="Add" col={1} className={newTaskTitle.length > 0 ? 'pt-btn-task-add enabled' : 'pt-btn-task-add' } isEnabled={newTaskTitle.length > 0}/>
                            </$GridLayout>

                            <$StackLayout row={1} className="pt-tasks-scroll">
                                <$StackLayout className="pt-tasks-list-container">
                                    <$ListView
                                        id="tasksList"
                                        items={tasks}
                                        // onItemTap={this.onListItemTap}
                                        cellFactory={(task: PtTask, ref: React.RefObject<any>) => {
                                            const { title, completed, } = task;

                                            /* Aren't closures just great? */
                                            const taskVM: PtTaskViewModel = new PtTaskViewModel(task, this.props.item);
                                            let textFieldFocused: boolean = false;

                                            return (
                                                <$GridLayout
                                                    ref={ref}
                                                    className="pt-task-wrapper"
                                                    columns={[new ItemSpec(30, "pixel"), new ItemSpec(1, "star")]}
                                                    rows={[]}
                                                >
                                                    <$Image
                                                        onTap={(args: GestureEventData) => {
                                                            this.onTaskToggleTap(task);
                                                        }}
                                                        src={completed ? 'res://checkboxchecked' : 'res://checkboxunchecked'}
                                                        className="task-checkbox"
                                                        col={0}
                                                    />
                                                    <$TextField
                                                        col={1}
                                                        text={title}
                                                        onFocus={(args: EventData) => {
                                                            textFieldFocused = true;
                                                            taskVM.onTaskFocused(title);
                                                        }}
                                                        onTextChange={(args: EventData) => {
                                                            if(textFieldFocused){
                                                                taskVM.onTextChange((args.object as TextField).text);
                                                            }
                                                        }}
                                                        onBlur={(args: EventData) => {
                                                            textFieldFocused = false;
                                                            taskVM.onTaskBlurred();
                                                        }}
                                                        className="task-title"
                                                    />
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
                                <$Image src={ currentUserAvatar } stretch="aspectFit" className="pt-img-comment-add" col={0} />
                                <$TextField hint="Enter new comment..." text={newCommentText} onTextChange={this.onNewCommentTextChange} col={1} className="pt-text-comment-add" />
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