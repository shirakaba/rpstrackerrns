import * as React from "react";
import * as ReactNativeScript from "react-nativescript";
import { ROUTES } from './routes';
import { DetailPageProps } from "~/core/models/page-props/detail-page-props";
import { DetailPage } from "~/views/pages/detail/DetailPage";
import { Page } from "tns-core-modules/ui/page/page";
import { topmost, Frame, NavigationEntry, ViewEntry } from "tns-core-modules/ui/frame/frame";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Label } from "tns-core-modules/ui/label/label";

// Because at-loader can't find this type for some reason...
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export function goToDetailPageReact(
    props: Omit<DetailPageProps, "forwardedRef">,
    navEntry: Omit<NavigationEntry, keyof ViewEntry> = {},
): void
{
    // TODO: Allow DetailPage to remove itself from the rendering roots upon navigating away again.
    const forwardedRef: React.RefObject<Page> = React.createRef<Page>();
    ReactNativeScript.render(
        (<DetailPage forwardedRef={forwardedRef} {...props}/>),
        null,
        () => {
            console.log(`[goToDetailPageReact] DetailPage top-level render completed! forwardedRef.current:`, forwardedRef.current);
        },
        ROUTES.detailPage,
    );

    const currentFrame: Frame = topmost();
    currentFrame.navigate({
        create: () => {
            const targetPage: Page|null = forwardedRef.current;

            console.log(`[goToDetailPageReact] targetPage was:`, targetPage);
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

// interface LazyMountedPageProps<P extends {}> {
//     props: P|null;
// }

// class LazyMountedDetailPage extends React.Component<LazyMountedPageProps<DetailPageProps>, {}>{
//     render(){
//         const { props, children, ...rest } = this.props;

//         return props === null ? null : (<DetailPage {...props}/>);
//     }
// }