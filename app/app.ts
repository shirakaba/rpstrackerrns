import * as application from 'tns-core-modules/application';
import { appConfig } from '~/config/app-config';
import { setAppEvents } from '~/globals/app-events/app-events';
import '~/globals/dependencies/locator';

global.__assign = Object.assign;

setAppEvents();

const isLoggedIn = false;

if (isLoggedIn) {
    application.run({ moduleName: 'app-root-authenticated' });
} else {
    application.run({ moduleName: 'app-root-anonymous' });
}

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
