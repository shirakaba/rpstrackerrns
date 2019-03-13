import { DataFormEventData, RadDataForm } from 'nativescript-ui-dataform';
import { Page, ShownModallyData } from 'tns-core-modules/ui/page';
import { PtItemType } from '~/core/models/domain/types';
import {
  getPickerEditorValueText,
  setMultiLineEditorFontSize,
  setPickerEditorImageLocation
} from '~/shared/helpers/ui-data-form';
import { NewItemModalViewModel } from '~/shared/view-models/modals/new-item/new-item.modal.vm';

let textInputModalVm: NewItemModalViewModel = null;
let itemDetailsDataForm: RadDataForm;

export function onShownModally(args: ShownModallyData): void {
  const page = <Page>args.object;
  itemDetailsDataForm = page.getViewById('itemDetailsDataForm');
  textInputModalVm = new NewItemModalViewModel(args.closeCallback);
  page.bindingContext = textInputModalVm;
}

export function onCancelButtonTap(): void {
  textInputModalVm.onCancelButtonTapHandler();
}

export function onOkButtonTap(): void {
  itemDetailsDataForm.validateAndCommitAll().then(ok => {
    if (ok) {
      textInputModalVm.onOkButtonTapHandler();
    }
  });
}

export function onEditorUpdate(args: DataFormEventData) {
  switch (args.propertyName) {
    case 'title':
      editorSetupMultiLine(args.editor);
      break;
    case 'description':
      editorSetupMultiLine(args.editor);
      break;
    case 'typeStr':
      editorSetupType(args.editor);
      break;
  }
}

function editorSetupMultiLine(editor) {
  setMultiLineEditorFontSize(editor, 17);
}

function editorSetupType(editor) {
  setPickerEditorImageLocation(editor);
  const selectedTypeValue = <PtItemType>getPickerEditorValueText(editor);
  textInputModalVm.updateSelectedTypeValue(selectedTypeValue);
}
