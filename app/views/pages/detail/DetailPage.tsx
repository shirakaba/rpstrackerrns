import * as React from "react";
import { $Page, $StackLayout, $GridLayout, $Label, $ActionBar, $ActionItem, $NavigationButton, $Image, $TextField, $TextView, $ScrollView, $ListView, $FlexboxLayout, $Button } from "react-nativescript";
import { GestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { getBacklogService } from "~/globals/dependencies/locator";
import { goToSettingsPage } from "~/shared/helpers/navigation/nav.helper";
import { PtBacklogService } from "~/core/contracts/services";
import { Color } from "react-nativescript/dist/client/ElementRegistry";

interface Props {
}

interface State {
}

export class DetailPage extends React.Component<Props, State> {
    public render(){
        return (
            <$Page
                className="page"
                onNavigatingTo={this.onNavigatingTo}
                // xmlns:df="nativescript-ui-dataform" 
                // xmlns="http://schemas.nativescript.org/tns.xsd"
            >
                <$ActionBar title="Item">
                    <$NavigationButton text="Back" android={{ systemIcon: "ic_menu_back" }} onTap={this.onNavBackTap}/>

                    <$ActionItem onTap={this.onDeleteTap} ios={{ systemIcon: 16, position: "right" }} text="delete" android={{ systemIcon: "ic_menu_delete", position: "actionBar" }}/>
                </$ActionBar>

                <$StackLayout>

                    <$GridLayout className="pt-item-detail-header" rows="*, 40">

                        <$GridLayout row={0} columns="*" className="pt-item-detail-header-title-row">

                            <$Label text="{{ itemTitle }}" className="pt-item-detail-header-title" col={0}/>
                        </$GridLayout>

                        <$StackLayout row={1}>
                            <$FlexboxLayout className="selector">
                                <$GridLayout className="{{ selectedScreen === 'details' ? 'selector-btn-wrapper active' : 'selector-btn-wrapper' }}">
                                    <$Button onTap="{{ onTabDetailsTap }}" text="Details" className="{{ selectedScreen === 'details' ? 'selector-btn active' : 'selector-btn' }}"/>
                                </$GridLayout>
                                <$GridLayout className="{{ selectedScreen === 'tasks' ? 'selector-btn-wrapper active' : 'selector-btn-wrapper' }}">
                                    <$Button onTap="{{ onTabTasksTap }}" text="Tasks" className="{{ selectedScreen === 'tasks' ? 'selector-btn active' : 'selector-btn' }}"/>
                                </$GridLayout>
                                <$GridLayout className="{{ selectedScreen === 'chitchat' ? 'selector-btn-wrapper active' : 'selector-btn-wrapper' }}">
                                    <$Button onTap="{{ onTabChitchatTap }}" text="Chitchat" className="{{ selectedScreen === 'chitchat' ? 'selector-btn active' : 'selector-btn' }}"/>
                                </$GridLayout>
                            </$FlexboxLayout>
                        </$StackLayout>
                    </$GridLayout>

                    <$StackLayout>
                        {/* Details */}
                        <$GridLayout visibility="{{ selectedScreen === 'details' ? 'visible' : 'collapsed' }}" rows="auto, auto" className="pt-item-details-container">

                            <$GridLayout row={0} columns="*, *, auto" className="assignee-row" onTap="onAssigneeRowTap">
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
                        <$GridLayout visibility="{{ selectedScreen === 'tasks' ? 'visible' : 'collapsed' }}" rows="70, *" className="pt-item-tasks-container">
                            <$GridLayout row={0} columns="*, 80" className="pt-tasks-add-row">
                                <$TextField hint="Enter new task..." text="{{ newTaskTitle }}" col={0} className="pt-text-task-add" />
                                <$Button onTap="{{ onAddTask }}" text="Add" col={1} className="{{ newTaskTitle.length > 0 ? 'pt-btn-task-add enabled' : 'pt-btn-task-add' }}" isEnabled="{{ newTaskTitle.length > 0 }}"/>
                            </$GridLayout>

                            <$StackLayout row={1} className="pt-tasks-scroll">
                                <$StackLayout className="pt-tasks-list-container">
                                    <$ListView id="tasksList" items="{{ tasks }}">
                                        <ListView.itemTemplate>
                                            <$GridLayout columns="30, *" className="pt-task-wrapper">
                                                <$Image onTap="onTaskToggleTap" src="{{ completed ? 'res://checkboxchecked' : 'res://checkboxunchecked' }}" className="task-checkbox" col={0} />
                                                <$TextField col={1} text="{{ title }}" focus="onTaskFocused" blur="onTaskBlurred" className="task-title" />
                                            </$GridLayout>
                                        </ListView.itemTemplate>
                                    </$ListView>
                                </$StackLayout>
                            </$StackLayout>
                        </$GridLayout>

                        {/* Chitchat */}
                        <$GridLayout visibility="{{ selectedScreen === 'chitchat' ? 'visible' : 'collapsed' }}" rows="70, *" className="pt-item-chitchat-container">

                            <$GridLayout row={0} columns="60, *, 80" className="pt-comments-add-row">
                                <$Image src="{{ currentUserAvatar }}" stretch="aspectFit" className="pt-img-comment-add" col={0} />
                                <$TextField text="" hint="Enter new comment..." text="{{ newCommentText }}" col={1} className="pt-text-comment-add" />
                                <$Button onTap="{{ onAddComment }}" text="Add" col={2} className="{{ newCommentText.length > 0 ? 'pt-btn-comment-add enabled' : 'pt-btn-comment-add' }}" isEnabled="{{ newCommentText.length > 0 }}"/>
                            </$GridLayout>

                            <$ScrollView row={1} className="pt-comments-scroll">
                                <$StackLayout className="pt-comments-list-container">
                                    {/* <Repeater id="commentsList" items="{{ comments }}">
                                        <Repeater.itemTemplate>
                                            <$GridLayout columns="40, *" className="pt-comment-wrapper">
                                                <Image src="{{ user.avatar }}" width="40" height="40" stretch="aspectFit" className="img-comment-avatar" col={0} />

                                                <$GridLayout col={1} rows="20, *" columns="*, 150" className="comment-text-wrapper">
                                                    <$Label col={0} row={0} text="{{ user.fullName }}" className="comment-name"/>
                                                    <$Label col={1} row={0} text="{{ dateCreated | dateConverter }}" className="comment-date"/>

                                                    <$TextView colSpan={2} row={1} text="{{ title }}" editable="false" className="comment-text"/>
                                                </$GridLayout>
                                            </$GridLayout>
                                        </Repeater.itemTemplate>
                                    </Repeater> */}
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