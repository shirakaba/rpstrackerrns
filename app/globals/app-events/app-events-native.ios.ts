import * as app from 'tns-core-modules/application';

class MyDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];

    applicationWillFinishLaunchingWithOptions(
        _application: UIApplication,
        _launchOptions: NSDictionary<any, any>
    ): boolean {
        console.log('applicationWillFinishLaunchingWithOptions');
        return true;
    }

    applicationDidFinishLaunchingWithOptions(
        _application: UIApplication,
        _launchOptions: NSDictionary<any, any>
    ): boolean {
        console.log('applicationDidFinishLaunchingWithOptions');
        return true;
    }

    applicationDidBecomeActive(_application: UIApplication): void {
        console.log('applicationDidBecomeActive');
    }

    applicationDidEnterBackground(_application: UIApplication): void {
        console.log('applicationDidEnterBackground');
    }

    applicationWillResignActive(_application: UIApplication) {
        console.log('applicationWillResignActive');
    }

    applicationWillEnterForeground(_application: UIApplication) {
        console.log('applicationWillEnterForeground');
    }

    applicationWillTerminate(_application: UIApplication) {
        console.log('applicationWillTerminate');
    }
}

export const setNativeEvents = () => {
    app.ios.delegate = MyDelegate;
};
