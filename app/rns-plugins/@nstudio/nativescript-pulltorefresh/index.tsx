import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { PullToRefresh as NativeScriptPullToRefresh, EventData } from "@nstudio/nativescript-pulltorefresh";
import { _ContentView, ContentViewComponentProps } from "react-nativescript/dist/components/ContentView";
import { updateListener } from "react-nativescript/dist/client/EventHandling";
import { Container, HostContext, Instance } from "react-nativescript/dist/shared/HostConfigTypes";
import { register } from "react-nativescript/dist/client/ElementRegistry";

const elementKey: string = "pullToRefresh";
register(
    elementKey,
    (
        props: Props,
        rootContainerInstance: Container,
        hostContext: HostContext,
    ) => {
        return new NativeScriptPullToRefresh() as Instance;
    }
);

interface Props {
    onRefresh: (args: EventData) => void;
}

type PullToRefreshProps = Props;

export type PullToRefreshComponentProps<
    E extends NativeScriptPullToRefresh = NativeScriptPullToRefresh
> = Props /* & typeof _PullToRefresh.defaultProps */ & Partial<PullToRefreshProps> & ContentViewComponentProps<E>;

/**
 * A React wrapper around the NativeScript PullToRefresh component.
 * See: ui/PullToRefresh/PullToRefresh
 */
class _PullToRefresh<
    P extends PullToRefreshComponentProps<E>,
    S extends {},
    E extends NativeScriptPullToRefresh = NativeScriptPullToRefresh
> extends _ContentView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptPullToRefresh>()
    // };

    // private readonly myRef: React.RefObject<NativeScriptPullToRefresh> = React.createRef<NativeScriptPullToRefresh>();

    /**
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, NativeScriptPullToRefresh.refreshEvent, this.props.onRefresh, nextProps.onRefresh);
        } else {
            const method = (attach ? node.on : node.off).bind(node);

            if (this.props.onRefresh) method(NativeScriptPullToRefresh.refreshEvent, this.props.onRefresh);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

            onRefresh,

            onLoaded,
            onUnloaded,
            onAndroidBackPressed,
            onShowingModally,
            onShownModally,

            onTap,
            onDoubleTap,
            onPinch,
            onPan,
            onSwipe,
            onRotation,
            onLongPress,
            onTouch,

            onPropertyChange,

            children,
            ...rest
        } = this.props;

        return React.createElement(
            elementKey,
            {
                ...rest,
                ref: forwardedRef || this.myRef,
            },
            children
        );
    }
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<PullToRefreshComponentProps<NativeScriptPullToRefresh>>;

export const $PullToRefresh: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptPullToRefresh>
> = React.forwardRef<NativeScriptPullToRefresh, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptPullToRefresh>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _PullToRefresh,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);
