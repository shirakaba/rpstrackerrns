import { Page } from "tns-core-modules/ui/page/page";
import { PageComponentProps } from "react-nativescript/dist/components/Page";

export interface RegisterPageProps extends PageComponentProps {
    forwardedRef: React.RefObject<Page>,
}