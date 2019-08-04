import { Page } from "tns-core-modules/ui/page/page";
import { PtItem } from "../domain/pt-item.model";
import { PageComponentProps } from "react-nativescript/dist/components/Page";

export interface DetailPageProps extends PageComponentProps {
    // renderingRoot: string,
    forwardedRef: React.RefObject<Page>,
    item: PtItem,
}