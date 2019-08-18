import * as React from "react";
import * as ReactNativeScript from "react-nativescript";
import { ROUTES } from './routes';
import { DetailPageProps } from "~/core/models/page-props/detail-page-props";
import { BacklogPageProps } from "~/core/models/page-props/backlog-page-props";
import { DetailPage } from "~/views/pages/detail/DetailPage";
import { BacklogPage } from "~/views/pages/backlog/BacklogPage";
import { Page } from "tns-core-modules/ui/page/page";
import { topmost, Frame, NavigationEntry, ViewEntry } from "tns-core-modules/ui/frame/frame";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { Label } from "tns-core-modules/ui/label/label";
import { RegisterPageProps } from "~/core/models/page-props/register-page-props";
import { RegisterPage } from "~/views/pages/register/RegisterPage";
import { LoginPage } from "~/views/pages/login/LoginPage";
import { LoginPageProps } from "~/core/models/page-props/login-page-props";

// Because at-loader can't find this type for some reason...
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * WARNING: This navigation method makes use of undocumented React internals and may be prone to 
 * failure due to race conditions in the render queue. I don't really know.
 * 
 * I'll try to get in touch with a React team member to better define any limitations of this.
 * 
 * @param PageJSXElement The JSX element contructor for the target page.
 * @param props The props for the target page (excluding forwardedRef, which we pass in ourselves)
 * @param routeName The name of the route, which will be used as a unique key for the component
 *                  tree by the React renderer. 
 * @param navEntry An options object for configuring the navigation.
 */
function goToPageReact<T extends PageComponentProps<Page>>(
    PageJSXElement: React.JSXElementConstructor<T>,
    props: Omit<T, "forwardedRef">,
    routeName: keyof typeof ROUTES,
    navEntry: Omit<NavigationEntry, keyof ViewEntry> = {},
): void {
    // TODO: Allow DetailPage to remove itself from the rendering roots upon navigating away again.
    const forwardedRef: React.RefObject<Page> = React.createRef<Page>();

    // Really complicated overkill TypeScript compiler complaint here; I'll just suppress it with a type assertion.
    const propsWithForwardedRef: T = {
        forwardedRef,
        ...props
    } as T;

    ReactNativeScript.render(
        (<PageJSXElement {...propsWithForwardedRef}/>),
        null,
        () => {
            console.log(`[goToPageReact] top-level render of routeName "${routeName}" completed! forwardedRef.current:`, forwardedRef.current);
        },
        ROUTES[routeName],
    );

    const currentFrame: Frame = topmost();
    currentFrame.navigate({
        create: () => {
            const targetPage: Page|null = forwardedRef.current;

            console.log(`[goToPageReact] targetPage was:`, targetPage);
            if(targetPage === null){
                const stack = new StackLayout();
                const label = new Label();
                label.text = `Unable to navigate to target page, as it didn't mount in time and therefore its ref wasn't populated.`;
                stack.addChild(label);
          
                const page = new Page();
                page.content = stack;
                return page;
            }

            return targetPage;
        },
        ...navEntry,
    });
}

export function goToBacklogPageReact(
    props: Omit<BacklogPageProps, "forwardedRef">,
    navEntry: Omit<NavigationEntry, keyof ViewEntry> = {},
): void
{
    goToPageReact(BacklogPage, props, "backlogPage", navEntry);
}

export function goToDetailPageReact(
    props: Omit<DetailPageProps, "forwardedRef">,
    navEntry: Omit<NavigationEntry, keyof ViewEntry> = {},
): void
{
    goToPageReact(DetailPage, props, "detailPage", navEntry);
}

export function goToRegisterPageReact(
    props: Omit<RegisterPageProps, "forwardedRef">,
    navEntry: Omit<NavigationEntry, keyof ViewEntry> = {},
): void
{
    goToPageReact(RegisterPage, props, "registerPage", navEntry);
}
export function goToLoginPageReact(
    props: Omit<LoginPageProps, "forwardedRef">,
    navEntry: Omit<NavigationEntry, keyof ViewEntry> = {},
): void
{
    goToPageReact(LoginPage, props, "loginPage", navEntry);
}

// interface LazyMountedPageProps<P extends {}> {
//     props: P|null;
// }

// class LazyMountedDetailPage extends React.Component<LazyMountedPageProps<DetailPageProps>, {}>{
//     render(){
//         const { props, children, ...rest } = this.props;

//         return props === null ? null : (<DetailPage {...props}/>);
//     }
// }