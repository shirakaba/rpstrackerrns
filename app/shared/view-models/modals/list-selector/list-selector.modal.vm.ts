import { Observable } from 'tns-core-modules/data/observable';
import { PtModalContext } from '~/shared/helpers/modals';

export class ListSelectorModalViewModel<T, R> extends Observable {
  protected modalContext: PtModalContext<T, R>;
  protected closeCallback: Function;

  public modalTitle: string;
  public okText: string;

  public items;

  constructor(ctx: PtModalContext<T, R>, callback: Function) {
    super();

    this.modalContext = ctx;
    this.closeCallback = callback;

    this.items = this.modalContext.payload;
  }

  public onCancelButtonTap(): void {
    this.closeCallback(this.modalContext.defaultResult);
  }

  public onItemSelected(args) {
    this.closeCallback(this.items[args.index]);
  }
}
