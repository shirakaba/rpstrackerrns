# RPS Project Tracker 2.0 (ported to React NativeScript)

This app serves as the real-world sample app for React NativeScript. It's my port of Alex Zisklind's `rpstrackertnsts` app – which is the NativeScript Core incarnation of his series of apps called "RPS Project Tracker 2.0". After setting up the standard boilerplate for a React NativeScript app, I mostly just needed to adjust the [`app/views`](https://github.com/shirakaba/rpstrackerrns/tree/master/app/views) folder to facilitate the port.

## Features

* Registration and login
* Forms (and form validation)
* Exhibits navigation
* Syncs data with a backend
* Has a cool sidebar

This repository is just the front-end. You will also need to run [the backend](https://github.com/alexziskind1/rpsapi) to do anything exciting with it (instructions below).

## Setup

### Backend

```sh
git clone https://github.com/alexziskind1/rpsapi.git
cd rpsapi
npm install
npm run dev
```

### Frontend

```sh
git clone https://github.com/shirakaba/rpstrackerrns.git
cd rpstrackerrns
npm install
# You must now edit app/config/app.config.dev.json to use your own IP address.
tns debug ios --no-hmr --emulator
```

## Highlights

Until I have some time to build a documentation website, this is the closest resource I have for explaining best practices. See the following highlights:

### NativeScript UI plugins ported to React

I had to port three UI plugins to React while making this app; you can find them all in [`app/rns-plugins`](https://github.com/shirakaba/rpstrackerrns/tree/master/app/rns-plugins). I haven't published these ports to the respective plugins' repositories as I haven't completely stabilised the API for making custom plugins yet. Once I've stabilised the API, I'll explain it on the documentation website (which doesn't exist yet).

* [`@nstudio/nativescript-pulltorefresh`](https://github.com/shirakaba/rpstrackerrns/tree/master/app/rns-plugins/@nstudio/nativescript-pulltorefresh)

* [`RadDataForm`](https://github.com/shirakaba/rpstrackerrns/tree/master/app/rns-plugins/RadDataForm)

* [`RadSideDrawer`](https://github.com/shirakaba/rpstrackerrns/tree/master/app/rns-plugins/RadSideDrawer)

### My apologies for RadDataForm

RadDataForm really doesn't map very well to React at all, because it handles so much state internally. Therefore the code required to port the original NativeScript Core usage of RadDataForm for [`app/views/pages/backlog/DetailPage.tsx`](https://github.com/shirakaba/rpstrackerrns/blob/master/app/views/pages/backlog/DetailPage.tsx) may look a bit masochistic and off-putting. For React NativeScript, it may be preferable to do forms without RadDataForm in practice. I leave the task of improving the ergonomics of RadDataForm to the community and core team (as I've had quite enough of it).

### Navigation

There are a few possible navigation patterns, but they're all just different ways of invoking NativeScript Core navigation from React. The key idea is to ensure that the target Page is mounted, and tell the visible Frame to navigate to it. This practically always requires registering references on the React components that wrap the underlying NativeScript Frame/Page instances.

#### Frame to root Page

A Frame is only useful once it has navigated to an initial 'root' page. To navigate your Frame to a Page as early as possible in its lifecycle, see my usage of the `componentDidMount()` method in the Frame components in [`app/AppRootAnonymous.tsx`](https://github.com/shirakaba/rpstrackerrns/blob/master/AppRootAnonymous.tsx) or [`app/AppRootAuthenticated.tsx`](https://github.com/shirakaba/rpstrackerrns/blob/master/app/AppRootAuthenticated.tsx).

#### Page to Page

To be precise, you must ask the *Frame* to navigate to a new Page. When doing so, the NativeScript Core API that React NativeScript makes use of here gives some options about how exactly to do this.

In React NativeScript, I allow Page components to be nested inside other Page components so that it's easier to coordinate the rendering lifecycle of a dependent Page. I welcome the community to build a better solution to improve upon this rather odd state-of-the-art.

I explored an alternative pattern for rendering Pages "out-of-tree" on-demand (shown in [`app/shared/helpers/navigation/nav-react.helper.tsx`](https://github.com/shirakaba/rpstrackerrns/tree/master/app/shared/helpers/navigation/nav-react.helper.tsx)), but it leads to crashes in certain circumstances, so I can't recommend it; instead, please use the pattern of nesting any dependent (target) Pages inside their source Pages.

##### Clearing 'back' history upon navigation

This prevents a 'back' button appearing in the ActionBar (if an ActionBar is visible at all, which it isn't in a few of these cases).

See how `clearHistory` is set to `true` in:

* the `onLoginTap()` and `onGotoRegisterTap()` methods of [`app/views/pages/login/LoginPage.tsx`](https://github.com/shirakaba/rpstrackerrns/tree/master/app/views/pages/login/LoginPage.tsx), and;
* the `onGoToLoginTap()` method of [`app/views/pages/register/RegisterPage.tsx`](https://github.com/shirakaba/rpstrackerrns/blob/master/app/views/pages/register/RegisterPage.tsx), and;
* the `onLogoutTap()` method of [`app/views/pages/backlog/BacklogPage.tsx`](https://github.com/shirakaba/rpstrackerrns/blob/master/app/views/pages/backlog/BacklogPage.tsx).

##### Preserving 'back' history upon navigation

This ensures that a 'back' button will appear in any ActionBar for the given Page (if visible).

See how `clearHistory` is set to `false` or left unspecified in:

* the `onSettingsTap()` and `onListItemTap()` methods of [`app/views/pages/backlog/BacklogPage.tsx`](https://github.com/shirakaba/rpstrackerrns/blob/master/app/views/pages/backlog/BacklogPage.tsx).

##### Taking action upon 'back' navigation

An example of this is left in the comments of `onNavigatedFromDetailPage()` and `onNavigatedFromSettingsPage()` in [`app/views/pages/backlog/BacklogPage.tsx`](https://github.com/shirakaba/rpstrackerrns/blob/master/app/views/pages/backlog/BacklogPage.tsx).

There wasn't much use for it in this particular app.


