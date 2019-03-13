import { Observable } from 'tns-core-modules/data/observable';
import { PtModalContext } from '~/shared/helpers/modals';

export class TextInputModalViewModel extends Observable {
  protected modalContext: PtModalContext<string, string>;
  protected closeCallback: Function;

  public modalTitle: string;
  public theText: string;
  public okText: string;

  constructor(ctx: PtModalContext<string, string>, callback: Function) {
    super();

    this.modalContext = ctx;
    this.closeCallback = callback;

    this.modalTitle = this.modalContext.title;
    this.theText = this.modalContext.payload;
    this.okText = this.modalContext.btnOkText;
  }

  public onOkButtonTap() {
    this.closeCallback(this.theText);
  }

  public onCancelButtonTap(): void {
    this.closeCallback(this.modalContext.payload);
  }
}
