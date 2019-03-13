export interface PtModalContext<T, R> {
    title: string;
    payload: T;
    defaultResult: R;
    btnOkText: string;
    btnCancelText: string;
}
