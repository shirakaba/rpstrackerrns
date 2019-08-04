import { Page } from "tns-core-modules/ui/page/page";
import { PageComponentProps } from "react-nativescript/dist/components/Page";

export interface SettingsPageProps extends PageComponentProps {
    forwardedRef: React.RefObject<Page>,
}