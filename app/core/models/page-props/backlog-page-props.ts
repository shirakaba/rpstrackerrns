import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { Page } from "tns-core-modules/ui/page/page";

export interface BacklogPageProps extends PageComponentProps {
    // renderingRoot: string,
    forwardedRef: React.RefObject<Page>,
}