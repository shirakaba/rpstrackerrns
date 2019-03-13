import { Observable } from 'tns-core-modules/data/observable';
import { ItemType } from '~/core/constants';
import { PtItemType } from '~/core/models/domain/types';
import { PtNewItem } from '~/core/models/dto/backlog';
import { PtNewItemForm, initializeNewItemForm } from '~/core/models/forms';
import { ObservableProperty } from '~/shared/observable-property-decorator';

export class NewItemModalViewModel extends Observable {
  protected closeCallback: Function;
  public newItemForm: PtNewItemForm;
  public itemTypesProvider = ItemType.List.map(t => t.PtItemType);
  public btnOkText = 'Save';
  @ObservableProperty() public itemTypeImage;
  @ObservableProperty() private selectedTypeValue: PtItemType = 'Bug';

  constructor(callback: Function) {
    super();

    this.closeCallback = callback;
    this.newItemForm = initializeNewItemForm();
  }

  public updateSelectedTypeValue(selTypeValue: PtItemType) {
    /*
    this.set('selectedTypeValue', selTypeValue);
    this.set(
      'itemTypeImage',
      ItemType.imageResFromType(this.selectedTypeValue)
    );
    */

    this.selectedTypeValue = selTypeValue;
    this.itemTypeImage = ItemType.imageResFromType(this.selectedTypeValue);
  }

  public onOkButtonTapHandler() {
    const newItem: PtNewItem = {
      title: this.newItemForm.title,
      description: this.newItemForm.description,
      type: <PtItemType>this.newItemForm.typeStr
    };

    this.closeCallback(newItem);
  }

  public onCancelButtonTapHandler(): void {
    this.closeCallback(null);
  }
}
