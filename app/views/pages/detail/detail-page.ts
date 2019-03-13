import { DataFormEventData, RadDataForm } from 'nativescript-ui-dataform';
import { ConfirmOptions, confirm } from 'tns-core-modules/ui/dialogs';
import { EventData, NavigatedData, Page, View } from 'tns-core-modules/ui/page';
import { TextField } from 'tns-core-modules/ui/text-field';
import { COLOR_DARK, COLOR_LIGHT } from '~/core/constants';
import { PriorityEnum } from '~/core/models/domain/enums';
import { PtItemType } from '~/core/models/domain/types';
import { showModalAssigneeList } from '~/shared/helpers/modals';
import {
  getPickerEditorValueText,
  setMultiLineEditorFontSize,
  setPickerEditorImageLocation,
  setSegmentedEditorColor,
  setStepperEditorColors,
  setStepperEditorContentOffset,
  setStepperEditorTextPostfix
} from '~/shared/helpers/ui-data-form';
import { DetailViewModel } from '~/shared/view-models/pages/detail/detail.page.vm';
import { PtTaskViewModel } from '~/shared/view-models/pages/detail/pt-task.vm';
import '~/utils/converters';

let detailsVm: DetailViewModel;
let itemDetailsDataForm: RadDataForm;

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  const currentItem = page.navigationContext;
  itemDetailsDataForm = page.getViewById('itemDetailsDataForm');
  detailsVm = new DetailViewModel(currentItem);
  page.bindingContext = detailsVm;
}

export function onDeleteTap() {
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
      detailsVm.deleteRequested();
    }
  });
}

export function onTaskToggleTap(args: EventData) {
  const textField = <TextField>args.object;
  const taskVm = <PtTaskViewModel>textField.bindingContext;
  taskVm.onTaskToggleRequested();
}

export function onTaskFocused(args: EventData) {
  const textField = <TextField>args.object;
  const taskVm = <PtTaskViewModel>textField.bindingContext;
  taskVm.onTaskFocused(textField.text);

  textField.on('textChange', () => taskVm.onTextChange(textField.text));
}

export function onTaskBlurred(args: EventData) {
  const textField = <TextField>args.object;
  const taskVm = <PtTaskViewModel>textField.bindingContext;
  textField.off('textChange');
  taskVm.onTaskBlurred();
}

export function onAssigneeRowTap(args: EventData) {
  const view = <View>args.object;

  showModalAssigneeList(view.page, detailsVm.getSelectedAssignee()).then(
    selectedAssignee => {
      if (selectedAssignee) {
        detailsVm.setSelectedAssignee(selectedAssignee);
      }
    }
  );
}

export function onPropertyCommitted(args: DataFormEventData) {
  const vm = <DetailViewModel>args.object.bindingContext;

  itemDetailsDataForm
    .validateAll()
    .then(ok => {
      if (ok) {
        vm.notifyUpdateItem();
      }
    })
    .catch(err => {
      console.error(err);
    });
}

export function onEditorUpdate(args: DataFormEventData) {
  switch (args.propertyName) {
    case 'description':
      editorSetupDescription(args.editor);
      break;
    case 'typeStr':
      editorSetupType(args.editor);
      break;
    case 'estimate':
      editorSetupEstimate(args.editor);
      break;
    case 'priorityStr':
      editorSetupPriority(args.editor);
      break;
  }
}

function editorSetupDescription(editor) {
  setMultiLineEditorFontSize(editor, 17);
}

function editorSetupType(editor) {
  setPickerEditorImageLocation(editor);
  const selectedTypeValue = <PtItemType>getPickerEditorValueText(editor);
  detailsVm.updateSelectedTypeValue(selectedTypeValue);
}

function editorSetupEstimate(editor) {
  setStepperEditorContentOffset(editor, -25, 0);
  setStepperEditorTextPostfix(editor, 'point', 'points');
  setStepperEditorColors(editor, COLOR_LIGHT, COLOR_DARK);
}

function editorSetupPriority(editor) {
  const editorPriority = <PriorityEnum>editor.value;
  const selectedPriorityValue = detailsVm.updateSelectedPriorityValue(
    editorPriority
  );
  setSegmentedEditorColor(editor, PriorityEnum.getColor(selectedPriorityValue));
}
