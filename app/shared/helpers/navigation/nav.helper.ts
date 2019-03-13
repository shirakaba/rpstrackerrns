import { Frame, NavigationEntry, topmost } from 'tns-core-modules/ui/frame';
import { Label } from 'tns-core-modules/ui/label';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { Page } from 'tns-core-modules/ui/page';
import { ROUTES } from './routes';

export function getCurrentPage() {
  const currentPage = topmost().currentPage;
  return currentPage;
}

export function navigate(
  pageModuleNameOrNavEntry: string | NavigationEntry,
  otherFrame?: Frame
) {
  const navFrame = otherFrame ? otherFrame : topmost();
  if (typeof pageModuleNameOrNavEntry === 'object') {
    navFrame.navigate(pageModuleNameOrNavEntry);
  } else if (typeof pageModuleNameOrNavEntry === 'string') {
    navFrame.navigate(pageModuleNameOrNavEntry);
  }
}

export function back() {
  topmost().goBack();
}

export function goToLoginPage(animated?: boolean) {
  const navEntry: NavigationEntry = {
    moduleName: ROUTES.loginPage,
    clearHistory: true,
    animated: animated
  };
  navigate(navEntry);
}

export function goToRegisterPage(clearHistory?: boolean) {
  const navEntry: NavigationEntry = {
    moduleName: ROUTES.registerPage,
    clearHistory: clearHistory,
    animated: false
  };
  navigate(navEntry);
}

export function goToBacklogPage(clearHistory?: boolean) {
  const navEntry: NavigationEntry = {
    moduleName: ROUTES.backlogPage,
    clearHistory: clearHistory
  };
  navigate(navEntry);
}

export function goToDetailPage<T>(context: T, clearHistory?: boolean) {
  const navEntry: NavigationEntry = {
    moduleName: ROUTES.detailPage,
    clearHistory: clearHistory,
    context: context
  };
  navigate(navEntry);
}

export function goToSettingsPage2() {
  const navEntry: NavigationEntry = {
    moduleName: ROUTES.settingsPage
  };
  navigate(navEntry);
}

export function goToSettingsPage() {
  navigate({
    create: () => {
      const stack = new StackLayout();
      const label = new Label();
      label.text = 'Hello, world!';
      stack.addChild(label);

      const page = new Page();
      page.content = stack;
      return page;
    }
  });
}
