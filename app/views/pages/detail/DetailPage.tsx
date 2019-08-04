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
import { RadDataForm } from "nativescript-ui-dataform";
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

type Props = DetailPageProps;

interface State {
    newTaskTitle: string,
    newCommentText: string,
    selectedScreen: "details"|"tasks"|"chitchat",
    selectedAssignee: PtUser,
    currentUserAvatar: string,
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
            newTaskTitle: EMPTY_STRING,
            newCommentText: EMPTY_STRING,
            selectedScreen: "details",
            selectedAssignee: props.item.assignee,
            currentUserAvatar: getCurrentUserAvatar(
                getApiEndpoint(),
                this.authService.getCurrentUserId()
            ),
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

    componentDidMount(){
        // console.log(`BackLogPage.componentDidMount`);
        this.props.forwardedRef.current!.addCssFile("views/pages/detail/detail-page.css");
    }

    public render(){
        const { item } = this.props;
        const itemForm: PtItemDetailsEditFormModel = ptItemToFormModel(item);
        const { comments, tasks, title } = item;
        const observableTasks = new ObservableArray<PtTaskViewModel>(
            item.tasks.map(task => new PtTaskViewModel(task, item))
        );
        const observableComments = new ObservableArray<PtCommentViewModel>(
            item.comments.map(comment => new PtCommentViewModel(comment))
        );
        const { newTaskTitle, newCommentText, selectedScreen } = this.state;

        return (
            <$Page className="page">
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
                                <$Label text="{{ selectedAssignee.fullName }}" col={1} />
                                <$Image id="assigneeImg" width={40} height={40} className="pt-item-detail-avatar" src="{{ selectedAssignee.avatar }}" col={2} />
                            </$GridLayout>

                            {/* <df:RadDataForm id="itemDetailsDataForm" row={1} source="{{ itemForm }}" propertyCommitted="onPropertyCommitted" editorUpdate="onEditorUpdate">
                                <df:RadDataForm.properties>
                                    <df:EntityProperty name="title" displayName="Title" index="1" hintText="Title">
                                        <df:EntityProperty.editor>
                                            <df:PropertyEditor type="Text">
                                                <df:PropertyEditor.propertyEditorStyle>
                                                    <df:PropertyEditorStyle labelTextColor="#4b5833" labelPosition="top"></df:PropertyEditorStyle>
                                                </df:PropertyEditor.propertyEditorStyle>
                                            </df:PropertyEditor>
                                        </df:EntityProperty.editor>
                                        <df:EntityProperty.validators>
                                            <df:NonEmptyValidator errorMessage="Title can't be empty."></df:NonEmptyValidator>
                                        </df:EntityProperty.validators>
                                    </df:EntityProperty>

                                    <df:EntityProperty name="description" displayName="Description" index="2" required="true" hintText="description">
                                        <df:EntityProperty.editor>
                                            <df:PropertyEditor type="MultilineText">
                                                <df:PropertyEditor.propertyEditorStyle>
                                                    <df:PropertyEditorStyle labelTextColor="#4b5833" labelPosition="top"></df:PropertyEditorStyle>
                                                </df:PropertyEditor.propertyEditorStyle>
                                            </df:PropertyEditor>
                                        </df:EntityProperty.editor>
                                    </df:EntityProperty>

                                    <df:EntityProperty name="typeStr" displayName="{{ itemTypeEditorDisplayName }}" index="3" imageResource="{{ itemTypeImage }}" valuesProvider="{{ itemTypesProvider }}">
                                        <df:EntityProperty.editor>
                                            <df:PropertyEditor type="Picker">
                                                <df:PropertyEditor.propertyEditorStyle>
                                                    <df:PropertyEditorStyle labelTextColor="#4b5833"></df:PropertyEditorStyle>
                                                </df:PropertyEditor.propertyEditorStyle>
                                            </df:PropertyEditor>
                                        </df:EntityProperty.editor>
                                    </df:EntityProperty>

                                    <df:EntityProperty name="statusStr" displayName="Status" index="4" valuesProvider="{{ statusesProvider }}">
                                        <df:EntityProperty.editor>
                                            <df:PropertyEditor type="Picker">
                                                <df:PropertyEditor.propertyEditorStyle>
                                                    <df:PropertyEditorStyle labelTextColor="#4b5833"></df:PropertyEditorStyle>
                                                </df:PropertyEditor.propertyEditorStyle>
                                            </df:PropertyEditor>
                                        </df:EntityProperty.editor>
                                    </df:EntityProperty>

                                    <df:EntityProperty name="estimate" displayName="Estimate" index="5">
                                        <df:EntityProperty.editor>
                                            <df:PropertyEditor type="Stepper">
                                                <df:PropertyEditor.propertyEditorStyle>
                                                    <df:PropertyEditorStyle labelTextColor="#4b5833"></df:PropertyEditorStyle>
                                                </df:PropertyEditor.propertyEditorStyle>
                                            </df:PropertyEditor>
                                        </df:EntityProperty.editor>
                                    </df:EntityProperty>


                                    <df:EntityProperty name="priorityStr" displayName="Priority" index="6" valuesProvider="{{ prioritiesProvider }}">
                                        <df:EntityProperty.editor>
                                            <df:PropertyEditor type="SegmentedEditor">
                                                <df:PropertyEditor.propertyEditorStyle>
                                                    <df:PropertyEditorStyle labelTextColor="#4b5833" labelPosition="top"></df:PropertyEditorStyle>
                                                </df:PropertyEditor.propertyEditorStyle>
                                            </df:PropertyEditor>
                                        </df:EntityProperty.editor>
                                    </df:EntityProperty>


                                    <df:EntityProperty name="assigneeName" hidden="true">
                                    </df:EntityProperty>

                                </df:RadDataForm.properties>
                            </df:RadDataForm> */}



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
                                                    {/* <$TextField col={1} text={title} onFocus={this.onTaskFocused} onBlur={this.onTaskBlurred} className="task-title" /> */}
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