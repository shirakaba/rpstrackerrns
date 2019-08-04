import * as React from "react";
import * as ReactNativeScript from "react-nativescript";
import { ROUTES } from './routes';
import { DetailPageProps } from "~/core/models/page-props/detail-page-props";
import { DetailPage } from "~/views/pages/detail/DetailPage";
import { Page } from "tns-core-modules/ui/page/page";
import { topmost, Frame, NavigationEntry, ViewEntry } from "tns-core-modules/ui/frame/frame";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout/stack-layout";
import { Label } from "tns-core-modules/ui/label/label";

export function goToDetailPageReact(
    props: Omit<DetailPageProps, "renderingRoot"|"forwardedRef">,
    navEntry: Omit<NavigationEntry, keyof ViewEntry> = {},
): void
{
    // TODO: Allow DetailPage to remove itself from the rendering roots upon navigating away again.
    const forwardedRef: React.RefObject<Page> = React.createRef<Page>();
    ReactNativeScript.render(
        (<DetailPage forwardedRef={forwardedRef} renderingRoot={ROUTES.detailPage} {...props}/>),
        null,
        () => {
            console.log(`[goToDetailPageReact] DetailPage top-level render completed!`);
        },
        ROUTES.detailPage,
    );

    const currentFrame: Frame = topmost();
    currentFrame.navigate({
        create: () => {
            const targetPage: Page|null = forwardedRef.current;

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