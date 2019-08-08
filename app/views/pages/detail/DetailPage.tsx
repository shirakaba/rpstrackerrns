import * as React from "react";
import { $Page, $StackLayout, $GridLayout, $Label, $ActionBar, $ActionItem, $NavigationButton, $Image, $TextField, $TextView, $ScrollView, $ListView, $FlexboxLayout, $Button } from "react-nativescript";
import { ItemSpec } from "tns-core-modules/ui/layouts/grid-layout/grid-layout";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { goToSettingsPage } from "~/shared/helpers/navigation/nav.helper";
import {
    toCreateCommentRequest,
    toCreateTaskRequest,
    toDeleteItemRequest,
    toUpdateItemRequest
} from '~/core/contracts/requests/backlog';
import { back } from '~/shared/helpers/navigation/nav.helper';
import { Color, Page } from "react-nativescript/dist/client/ElementRegistry";
import { PtItem } from "~/core/models/domain/pt-item.model";
import { ItemEventData } from "react-nativescript/node_modules/tns-core-modules/ui/list-view/list-view";
import { PtTask } from "~/core/models/domain/pt-task.model";
import { EMPTY_STRING } from '~/core/models/domain/constants/strings';
import { PtComment } from "~/core/models/domain/pt-comment.model";
import { dateConverter } from "~/utils/converters";
import { RadDataForm, DataFormEventData, DataFormEditorType, DataFormLabelPosition } from "nativescript-ui-dataform";
import { ConfirmOptions, confirm } from 'tns-core-modules/ui/dialogs';
import { PtUser } from "~/core/models/domain/pt-user.model";
import { PtItemDetailsEditFormModel, ptItemToFormModel } from "~/core/models/forms/pt-item-details-edit-form.model";
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

type Props = DetailPageProps;

interface State {
    selectedScreen: "details"|"tasks"|"chitchat",
    // selectedAssignee: PtUser, // derived

    /* details form */
    itemForm: PtItemDetailsEditFormModel|null,
    itemTypesProvider: PtItemType[],
    statusesProvider: typeof PT_ITEM_STATUSES,
    prioritiesProvider: typeof PT_ITEM_PRIORITIES,
    selectedTypeValue?: PtItemType,
    selectedPriorityValue?: PriorityEnum,
    itemTypeImage?: string,
    /* details form END */

    /* tasks */
    newTaskTitle: string,
    tasks: ObservableArray<PtTaskViewModel>,
    /* tasks END */

    /* comments */
    currentUserAvatar: string,
    newCommentText: string,
    comments: ObservableArray<PtCommentViewModel>,
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

        this.state = {
            selectedScreen: "details",
            // selectedAssignee: props.item.assignee,
            
            /* details form */
            itemForm: null,
            itemTypesProvider: ItemType.List.map(t => t.PtItemType),
            statusesProvider: PT_ITEM_STATUSES,
            prioritiesProvider: PT_ITEM_PRIORITIES,
            selectedTypeValue: void 0,
            selectedPriorityValue: void 0,
            // itemTypeImage: ItemType.imageResFromType(selectedTypeValue),
            itemTypeImage: void 0,
            /* details form END */
            
            /* tasks */
            newTaskTitle: EMPTY_STRING,
            tasks: new ObservableArray<PtTaskViewModel>(
                props.item.tasks.map(task => new PtTaskViewModel(task, props.item))
            ),
            /* tasks END */
            
            /* comments */
            currentUserAvatar: getCurrentUserAvatar(
                getApiEndpoint(),
                this.authService.getCurrentUserId()
            ),
            newCommentText: EMPTY_STRING,
            comments: new ObservableArray<PtCommentViewModel>(
                props.item.comments.map(comment => new PtCommentViewModel(comment))
            ),
            /* comments END */
        };
    }

    private readonly onDeleteTap = (args: GestureEventData) => {
        // const options: ConfirmOptions = {
        //     title: 'Delete Item',
        //     message: 'Are you sure you want to delete this item?',
        //     okButtonText: 'Yes',
        //     cancelButtonText: 'Cancel'
        // };

        // // confirm with options, with promise
        // confirm(options).then((result: boolean) => {
        //     // result can be true/false/undefined
        //     if (result) {
        //       detailsVm.deleteRequested();
        //     }
        // });
    };

    // private readonly deleteRequested = () => {
    //     const deleteItemRequest = toDeleteItemRequest(this.ptItem);
    //     this.backlogService
    //         .deletePtItem(deleteItemRequest)
    //         .then(() => {})
    //         .catch(() => {
    //             console.log('some error occured');
    //         });
    // }

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

    private readonly onAssigneeRowTap = (args: GestureEventData) => {

    };

    private readonly onAddComment = (args: GestureEventData) => {

    };

    // Might be passed in as prop?
    private readonly onAddTask = (args: GestureEventData) => {

    };

    // Might be passed in as prop?
    private readonly onTaskToggleTap = (args: GestureEventData) => {

    };

    private readonly onListItemTap = (itemEventData: ItemEventData) => {
        const task: PtTask = this.props.item.tasks[itemEventData.index];

        // stub
    };

    private readonly onTaskFocused = (args: EventData) => {

    };

    private readonly onTaskBlurred = (args: EventData) => {

    };

    private readonly onPropertyCommitted = (args: DataFormEventData) => {

    };

    private readonly onEditorUpdate = (args: DataFormEventData) => {
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

    private readonly itemTypeEditorDisplayName = () => {
        return "Type";
    }

    private readonly editorSetupDescription = (editor) => {
        setMultiLineEditorFontSize(editor, 17);
    }
      
    private readonly editorSetupType = (editor) => {
        setPickerEditorImageLocation(editor);
        const selectedTypeValue: PtItemType = getPickerEditorValueText(editor) as PtItemType;
        this.updateSelectedTypeValue(selectedTypeValue);
    }

    // public selectedTypeValue: PtItemType;
    // public selectedPriorityValue: PriorityEnum;
    // public itemTypeImage: string;

    private readonly updateSelectedTypeValue = (selTypeValue: PtItemType) => {
        // TOOD: make sure this is being called in knowledge that it's async
        this.setState({
            selectedTypeValue: selTypeValue,
            itemTypeImage: ItemType.imageResFromType(selTypeValue),
        });
    }

    private readonly updateSelectedPriorityValue = (editorPriority: PriorityEnum): PriorityEnum => {
        const selectedPriorityValue = this.calculateSelectedPriorityValue(editorPriority);

        // TOOD: make sure this is being called in knowledge that it's async
        this.setState({ selectedPriorityValue });
        return selectedPriorityValue;
    }

    private readonly calculateSelectedPriorityValue = (editorPriority: PriorityEnum): PriorityEnum => {
        return editorPriority ? editorPriority : this.state.itemForm.priorityStr as PriorityEnum;
    }
      
    private readonly editorSetupEstimate = (editor) => {
        setStepperEditorContentOffset(editor, -25, 0);
        setStepperEditorTextPostfix(editor, 'point', 'points');
        setStepperEditorColors(editor, COLOR_LIGHT, COLOR_DARK);
    }
      
    private readonly editorSetupPriority = (editor) => {
        const editorPriority: PriorityEnum = editor.value as PriorityEnum;
        const selectedPriorityValue = this.calculateSelectedPriorityValue(editorPriority);
        this.setState({
            selectedPriorityValue,
        }, () => {
            setSegmentedEditorColor(editor, PriorityEnum.getColor(selectedPriorityValue));
        });
    }


    componentDidMount(){
        console.log(`[DetailPage.componentDidMount] this.props.forwardedRef: ${this.props.forwardedRef}; this.props.forwardedRef.current: ${this.props.forwardedRef}`);
        this.props.forwardedRef.current!.addCssFile("views/pages/detail/detail-page.css");
    }

    public render(){
        const { item, ...rest } = this.props;
        const itemForm: PtItemDetailsEditFormModel = ptItemToFormModel(item);
        const { comments, tasks, title, selectedAssignee } = item;
        const observableTasks = new ObservableArray<PtTaskViewModel>(
            item.tasks.map(task => new PtTaskViewModel(task, item))
        );
        const observableComments = new ObservableArray<PtCommentViewModel>(
            item.comments.map(comment => new PtCommentViewModel(comment))
        );
        const { newTaskTitle, newCommentText, selectedScreen } = this.state;

        return (
            <$Page ref={this.props.forwardedRef} className="page" {...rest}>
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
                                        items={observableTasks}
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
                                    {observableComments.map((comment: PtComment) => {
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

    // private readonly onSettingsTap = (args: GestureEventData) => {
    // };
}