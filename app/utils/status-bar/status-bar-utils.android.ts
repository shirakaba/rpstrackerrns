import * as app from 'tns-core-modules/application';
import * as platform from 'tns-core-modules/platform';

declare const android: any;

export function setStatusBarColors() {
    if (platform.device.sdkVersion >= '21') {
        const View = android.view.View;

        const window = app.android.startActivity.getWindow();
        window.setStatusBarColor(0x000000);

        const decorView = window.getDecorView();
        decorView.setSystemUiVisibility(
            // tslint:disable-next-line:no-bitwise
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
}
