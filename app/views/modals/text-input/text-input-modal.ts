import { Page, ShownModallyData } from 'tns-core-modules/ui/page';
import { TextInputModalViewModel } from '~/shared/view-models/modals/text-input/text-input.modal.vm';

export function onShownModally(args: ShownModallyData) {
  const page = <Page>args.object;
  const textInputModal = new TextInputModalViewModel(
    args.context,
    args.closeCallback
  );
  page.bindingContext = textInputModal;
}
