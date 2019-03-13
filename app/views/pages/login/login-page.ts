import { NavigatedData, Page } from 'tns-core-modules/ui/page';
import {
  goToBacklogPage,
  goToRegisterPage
} from '~/shared/helpers/navigation/nav.helper';
import { LoginViewModel } from '~/shared/view-models/pages/login/login.page.vm';

let loginVm: LoginViewModel;

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;
  loginVm = new LoginViewModel();
  page.bindingContext = loginVm;
}

export function onLoginTap() {
  loginVm
    .onLoginTapHandler()
    .then(() => {
      goToBacklogPage(true);
    })
    .catch(error => {
      console.error(error);
      alert('Sorry, could not log in at this time');
    });
}

export function onGotoRegisterTap() {
  goToRegisterPage();
}
