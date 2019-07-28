import * as console from "react-nativescript/dist/shared/Logger";
import * as React from "react";
import { PropsWithoutForwardedRef } from "react-nativescript/dist/shared/NativeScriptComponentTypings";
import { RadSideDrawer as NativeScriptRadSideDrawer, DrawerStateChangingEventArgs, DrawerStateChangedEventArgs } from "nativescript-ui-sidedrawer";
import { ViewComponentProps, RCTView } from "react-nativescript/dist/components/View";
import { updateListener } from "react-nativescript/dist/client/EventHandling";
import { EventData } from "tns-core-modules/data/observable/observable";
import { register } from "react-nativescript/dist/client/ElementRegistry";

const elementKey: string = "radSideDrawer";
register(elementKey, NativeScriptRadSideDrawer);

type RadSideDrawerProps = Pick<NativeScriptRadSideDrawer,
"mainContent"|
"drawerContent"|
"drawerContentSize"|
"drawerTransition"|
"drawerLocation"|
"shadowColor"|
"gesturesEnabled"|
"allowEdgeSwipe">;

interface Props {
    onDrawerOpening?: (args: DrawerStateChangingEventArgs) => void,
    onDrawerOpened?: (args: DrawerStateChangedEventArgs) => void,
    onDrawerClosing?: (args: DrawerStateChangingEventArgs) => void,
    onDrawerClosed?: (args: DrawerStateChangedEventArgs) => void,
    // Not sure what the exact event typings are for this one.
    onDrawerPan?: (args: EventData) => void,
}

export type RadSideDrawerComponentProps<
    E extends NativeScriptRadSideDrawer = NativeScriptRadSideDrawer
> = Props /* & typeof RadSideDrawer.defaultProps */ & Partial<RadSideDrawerProps> & ViewComponentProps<E>;

export class _RadSideDrawer<
    P extends RadSideDrawerComponentProps<E>,
    S extends {},
    E extends NativeScriptRadSideDrawer
> extends RCTView<P, S, E> {
    // static defaultProps = {
    //     forwardedRef: React.createRef<NativeScriptRadSideDrawer>()
    // };

    /**
     *
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(node: E, attach: boolean | null, nextProps?: P): void {
        super.updateListeners(node, attach, nextProps);

        if (attach === null) {
            updateListener(node, NativeScriptRadSideDrawer.drawerOpeningEvent, this.props.onDrawerOpening, nextProps.onDrawerOpening, "onDrawerOpening");
            updateListener(node, NativeScriptRadSideDrawer.drawerOpenedEvent, this.props.onDrawerOpened, nextProps.onDrawerOpened, "onDrawerOpened");
            updateListener(node, NativeScriptRadSideDrawer.drawerClosingEvent, this.props.onDrawerClosing, nextProps.onDrawerClosing, "onDrawerClosing");
            updateListener(node, NativeScriptRadSideDrawer.drawerClosedEvent, this.props.onDrawerClosed, nextProps.onDrawerClosed, "onDrawerClosed");
        } else {
            const method = (attach ? node.on : node.off).bind(node);
            if (this.props.onDrawerOpening) method(NativeScriptRadSideDrawer.drawerOpeningEvent, this.props.onDrawerOpening);
            if (this.props.onDrawerOpened) method(NativeScriptRadSideDrawer.drawerOpenedEvent, this.props.onDrawerOpened);
            if (this.props.onDrawerClosing) method(NativeScriptRadSideDrawer.drawerClosingEvent, this.props.onDrawerClosing);
            if (this.props.onDrawerClosed) method(NativeScriptRadSideDrawer.drawerClosedEvent, this.props.onDrawerClosed);
        }
    }

    render(): React.ReactNode {
        const {
            forwardedRef,

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
            //@ts-ignore - ATLoader not liking this rest operation for some reason.
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

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<RadSideDrawerComponentProps<NativeScriptRadSideDrawer>>;

export const $RadSideDrawer: React.ComponentType<
    OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptRadSideDrawer>
> = React.forwardRef<NativeScriptRadSideDrawer, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptRadSideDrawer>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _RadSideDrawer,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
);