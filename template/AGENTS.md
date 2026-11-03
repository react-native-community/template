# AGENTS.md

This is a React Native app created with the React Native Community CLI.

It does not include Expo: `npx expo` commands and `expo-*` packages need `npx install-expo-modules` first, so don't use them unless asked.

## Commands

Use the package manager whose lockfile is present. With npm:

```sh
npm start         # Start Metro; runs in the foreground until stopped
npm run ios       # Build and launch the iOS app
npm run android   # Build and launch the Android app
npm test          # Run Jest
npm run lint      # Run ESLint
npx tsc --noEmit  # Typecheck
```

Run lint, typecheck and tests before considering a change done.

Clean commands, only for a build that fails from stale state, such as after an upgrade or branch switch:

```sh
(cd android && ./gradlew clean)    # Clean the Android build
rm -rf ios/Pods                    # Remove CocoaPods; `npm run ios` reinstalls them
npm run ios:clear-prebuild-caches  # Clear cached React Native iOS prebuilds
npm start -- --reset-cache         # Start Metro with its cache cleared
```

## Rules

- `ios/` and `android/` are source code, edited directly and committed, not generated.
- JavaScript and TypeScript changes reach a running app through Fast Refresh. Native changes, and adding or removing packages with native code, need a rebuild.
- Check APIs against the docs for the React Native version in `package.json` ([reactnative.dev](https://reactnative.dev/docs/getting-started)). Many examples online use deprecated APIs, such as `SafeAreaView` from `react-native`; use `react-native-safe-area-context` instead.
- Write native code as [Turbo Native Modules](https://reactnative.dev/docs/turbo-native-modules-introduction) or [Fabric Native Components](https://reactnative.dev/docs/fabric-native-components-introduction), not the legacy `NativeModules` or `requireNativeComponent` APIs. Use Nitro Modules or the Expo Modules API only when asked.

## Native libraries

- Find third-party libraries on [React Native Directory](https://reactnative.directory/), and prefer maintained ones that support the New Architecture.
- Never downgrade React Native, or install with `--force` or `--legacy-peer-deps`, to fit a library. Choose a library version whose `react-native` peer dependency matches, or tell the user when none does.

## Upgrading

- To upgrade React Native, apply the diff from the [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/), or use the [upgrade-react-native](https://www.skills.sh/react-native-community/skills/upgrade-react-native) skill (recommended), not only the version bumps in `package.json`.
