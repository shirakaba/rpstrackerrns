import { Page } from "tns-core-modules/ui/page/page";
import { PageComponentProps } from "react-nativescript/dist/components/Page";

export interface LoginPageProps extends PageComponentProps {
    // renderingRoot: string,
    forwardedRef: React.RefObject<Page>,
}