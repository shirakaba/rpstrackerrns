import { Page } from "tns-core-modules/ui/page/page";
import { PtItem } from "../domain/pt-item.model";

export interface DetailPageProps {
    renderingRoot: string,
    forwardedRef: React.RefObject<Page>,
    item: PtItem,
}