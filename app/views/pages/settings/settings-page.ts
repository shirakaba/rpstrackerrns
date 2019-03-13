export function onNavigatingTo(args) {
    if (args.isBackNavigation) {
        return;
    }
    // do your magic!
}

export function onNavBackTap(args) {
    args.object.page.frame.goBack();
}
