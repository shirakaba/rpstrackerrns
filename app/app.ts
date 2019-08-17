import * as localize from 'nativescript-localize';
import * as application from 'tns-core-modules/application';
import { appConfig } from '~/config/app-config';
import { setAppEvents } from '~/globals/app-events/app-events';
import '~/globals/dependencies/locator';

(global as any).__DEV__ = true;

import * as React from "react";
import * as ReactNativeScript from "react-nativescript/dist/index";
import { AppRootAuthenticated } from './AppRootAuthenticated';
import { AppRootAnonymous } from './AppRootAnonymous';
import { Frame } from "react-nativescript/dist/client/ElementRegistry";

export const rootRef: React.RefObject<Frame> = React.createRef<Frame>();

global.__assign = Object.assign;

application.setResources({ L: localize });

setAppEvents();

const isLoggedIn = false;

const app = isLoggedIn ?
    React.createElement(AppRootAuthenticated, { forwardedRef: rootRef }, null) :
    React.createElement(AppRootAnonymous, { forwardedRef: rootRef }, null);

ReactNativeScript.start(app, rootRef);

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
