import type { Chapter } from "../types";

export const tooling: Chapter = {
  slug: "tooling",
  title: "Project anatomy & tooling",
  intro: [
    "In React Native, most of the native project is something you avoid. Expo generates `android/` and `ios/`, Metro serves your JavaScript, and npm manages packages. Going native, those folders *are* the app, and the IDE becomes the center of your workflow.",
    "The good news is that each concept still has a counterpart. There's still an entry point, a dependency manifest, a dev loop, and a debugger. They're just owned by Gradle and Android Studio on one side, and by Xcode and Swift Package Manager on the other.",
    "This chapter is a map. It shows where things live, what replaces each tool you know, and the small configuration snippets you'll touch in your first week.",
  ],
  sections: [
    {
      id: "toolchain",
      title: "The toolchain at a glance",
      prose: [
        "An RN project stitches together several tools: an editor, Metro, npm, and the two native build systems underneath. On native, one IDE and one build system per platform cover almost everything.",
      ],
      compare: [
        {
          label: "IDE",
          values: {
            rn: "VS Code, or any editor",
            android: "Android Studio (built on IntelliJ). Runs on macOS, Windows, and Linux.",
            ios: "Xcode. Runs on macOS only.",
          },
        },
        {
          label: "Build system",
          values: {
            rn: "Metro bundles JS. Gradle and Xcode build the native shell.",
            android: "Gradle, with the Android Gradle Plugin (AGP)",
            ios: "Xcode's build system (`xcodebuild` on the command line)",
          },
        },
        {
          label: "Package manager",
          values: {
            rn: "npm / yarn / pnpm, plus CocoaPods for iOS native code",
            android: "Gradle, pulling from Google's Maven repo and Maven Central",
            ios: "Swift Package Manager (CocoaPods in older projects)",
          },
        },
        {
          label: "Dependency manifest",
          values: {
            rn: "`package.json` + lockfile",
            android: "`build.gradle.kts` + `gradle/libs.versions.toml`",
            ios: "The Xcode project (`.xcodeproj`) + `Package.resolved`",
          },
        },
        {
          label: "App config",
          values: {
            rn: "`app.json` / `app.config.ts`",
            android: "`AndroidManifest.xml` + `defaultConfig` in Gradle",
            ios: "Target settings in Xcode + `Info.plist`",
          },
        },
        {
          label: "Dev server",
          values: {
            rn: "Metro serves the JS bundle to the app.",
            android: "None. You build an APK and install it, incrementally.",
            ios: "None. You build an app bundle and install it, incrementally.",
          },
        },
      ],
      callout:
        "There's no JS bundle any more. Every change, even to a string, is compiled into the binary. Builds are incremental, so this is faster than it sounds, but the loop is \"edit, build, run\", not \"edit, save, see\".",
    },
    {
      id: "project-layout",
      title: "Where things live",
      prose: [
        "Android Studio shows an \"Android\" view that groups files logically. Switch to the \"Project\" view when you want to see the real folders. Xcode shows *groups* in its navigator. Since Xcode 16, new projects use folders that mirror the disk, which also means far fewer merge conflicts in `project.pbxproj`.",
      ],
      compare: [
        {
          label: "Source code",
          values: {
            rn: "`src/` or `app/`",
            android: "`app/src/main/java/com/example/todo/` (Kotlin files live here too)",
            ios: "`Todo/` next to `Todo.xcodeproj`",
          },
        },
        {
          label: "App name, ID, permissions",
          values: {
            rn: "`app.json`: `name`, `android.package`, `ios.bundleIdentifier`",
            android: "`applicationId` in `app/build.gradle.kts`, permissions in `AndroidManifest.xml`",
            ios: "Bundle identifier in target settings, permission strings in `Info.plist`",
          },
        },
        {
          label: "Images & icons",
          values: {
            rn: "`assets/` + `require('./icon.png')`",
            android: "`res/drawable/` (prefer vector XML) and `res/mipmap/` for the launcher icon",
            ios: "`Assets.xcassets` asset catalog",
          },
        },
        {
          label: "Strings",
          values: {
            rn: "An i18n library with JSON files",
            android: "`res/values/strings.xml`",
            ios: "`Localizable.xcstrings` (String Catalog)",
          },
        },
        {
          label: "Tests",
          values: {
            rn: "`__tests__/` or `*.test.tsx`",
            android: "`src/test/` (JVM unit tests), `src/androidTest/` (on-device tests)",
            ios: "Separate `TodoTests` and `TodoUITests` targets",
          },
        },
      ],
    },
    {
      id: "entry-point",
      title: "Entry points: index.ts → MainActivity / @main App",
      prose: [
        "In RN, native code boots a JS runtime, which runs `index.ts`, which registers your root component. On native you start one level lower. The OS launches your app and hands control to a class you've declared as the entry point.",
        "On Android, that's an `Activity` marked as the launcher in `AndroidManifest.xml`. `setContent { }` is where Compose takes over. On iOS, it's the type marked `@main`, which conforms to `App` and declares its windows as *scenes*.",
      ],
      snippet: "entry-point",
      notes: {
        android: [
          "A modern Compose app usually has a single `ComponentActivity`. Screens are composables, not separate Activities (Chapter 9).",
          "`enableEdgeToEdge()` draws behind the status and navigation bars, like RN's default with `react-native-safe-area-context`.",
          "Android can destroy and recreate the Activity on rotation or theme change. Chapter 6 covers what that means for your state.",
        ],
        ios: [
          "`WindowGroup` is a scene that hosts your root view. On iPad and Mac, users can open more than one.",
          "Older projects use `AppDelegate` and `SceneDelegate` with UIKit. You can still add an app delegate with `@UIApplicationDelegateAdaptor`.",
          "There's no manifest to register in. `@main` is enough.",
        ],
      },
    },
    {
      id: "dependencies",
      title: "Gradle & version catalogs vs package.json",
      prose: [
        "Gradle build files are Kotlin code (`.gradle.kts`), so they get autocomplete and type checking in the IDE. A typical app has a root `settings.gradle.kts`, a root `build.gradle.kts`, and one `build.gradle.kts` per module (usually just `app/` at first).",
        "Versions live in a **version catalog**, `gradle/libs.versions.toml`. Gradle generates a typed `libs` accessor from it, so `coil-compose` in the TOML becomes `libs.coil.compose` in your build file. It's the closest thing to a single `package.json`.",
      ],
      snippet: "dependencies",
      notes: {
        rn: ["`npx expo install` picks versions compatible with your SDK. On native, the Compose BOM plays a similar role for AndroidX Compose libraries."],
        android: [
          "`implementation` is a normal dependency. `testImplementation` and `androidTestImplementation` are test-only, like `devDependencies`.",
          "`platform(libs.androidx.compose.bom)` pins all Compose library versions together, so individual Compose entries need no version.",
          "After editing a build file, Android Studio asks you to **Sync**. Until you do, the IDE doesn't know about the change.",
        ],
        ios: [
          "For the app itself, add packages in Xcode (File → Add Package Dependencies…). Xcode records them in the project file and pins versions in `Package.resolved`.",
          "Write a `Package.swift` when you split code into local modules (Chapter 10). Like `build.gradle.kts`, it's code, written in Swift.",
          "Commit `Package.resolved`. It's your lockfile.",
        ],
      },
    },
    {
      id: "swift-package-manager",
      title: "Swift Package Manager",
      prose: [
        "SwiftPM is built into Xcode and the Swift toolchain. Packages are fetched straight from Git URLs and resolved by semantic version, so there's no central registry like npm. Most popular iOS libraries support it, and CocoaPods is now in maintenance mode.",
        "You'll touch SwiftPM in two ways. In the Xcode UI, you add remote packages to the app target. In a `Package.swift`, shown in the previous section, you define your own packages. Feature modules are usually local packages that the app target depends on.",
      ],
      compare: [
        {
          label: "Add a dependency",
          values: {
            rn: "`npm install expo-image`",
            android: "Add to `libs.versions.toml`, reference it in `build.gradle.kts`, then Sync",
            ios: "File → Add Package Dependencies…, paste the Git URL",
          },
        },
        {
          label: "Version ranges",
          values: {
            rn: "`^2.0.0`, `~2.0.0`",
            android: "Exact versions are the norm. Update them in the catalog.",
            ios: "\"Up to Next Major\" (`from: \"12.0.0\"`) by default",
          },
        },
        {
          label: "Lockfile",
          values: {
            rn: "`package-lock.json` / `pnpm-lock.yaml`",
            android: "Optional (Gradle dependency locking). Most teams rely on exact versions.",
            ios: "`Package.resolved`",
          },
        },
        {
          label: "Update everything",
          values: {
            rn: "`npm update` / `npx expo install --fix`",
            android: "Android Studio highlights newer versions in the catalog. Dependabot and Renovate also understand it.",
            ios: "File → Packages → Update to Latest Package Versions",
          },
        },
      ],
    },
    {
      id: "commands",
      title: "Everyday commands",
      prose: [
        "You'll mostly use the Run button, but every IDE action has a command-line equivalent, which is what CI uses (Chapter 18). On Android, always use the `./gradlew` wrapper checked into the repo. It downloads the exact Gradle version the project expects.",
      ],
      compare: [
        {
          label: "Run on a device",
          values: {
            rn: "`npx expo run:android` / `npx expo run:ios`",
            android: "Run ▶ in Android Studio, or `./gradlew installDebug`",
            ios: "Run ▶ (⌘R) in Xcode, or `xcodebuild` with a destination",
          },
        },
        {
          label: "Unit tests",
          values: {
            rn: "`npm test`",
            android: "`./gradlew test` (JVM), `./gradlew connectedAndroidTest` (device)",
            ios: "⌘U, or `xcodebuild test`",
          },
        },
        {
          label: "Lint & format",
          values: {
            rn: "ESLint, Prettier",
            android: "`./gradlew lint` (Android Lint), plus ktlint or detekt",
            ios: "SwiftLint, `swift-format`",
          },
        },
        {
          label: "Type check",
          values: {
            rn: "`tsc --noEmit`",
            android: "Part of every build",
            ios: "Part of every build",
          },
        },
        {
          label: "Clean slate",
          values: {
            rn: "`rm -rf node_modules`, `expo start --clear`",
            android: "`./gradlew clean`. File → Invalidate Caches for IDE weirdness.",
            ios: "Product → Clean Build Folder (⇧⌘K). Delete `DerivedData` as a last resort.",
          },
        },
      ],
    },
    {
      id: "build-flags",
      title: "__DEV__ and env vars → build config",
      prose: [
        "RN gives you `__DEV__` and build-time env vars. On native, the switch is the **build type** (Android) or **build configuration** (iOS). Both come with Debug and Release out of the box.",
        "Android generates a `BuildConfig` class with typed constants per build type. iOS uses compile-time `#if DEBUG` blocks. For per-environment values on iOS, teams typically use `.xcconfig` files feeding `Info.plist`. Chapter 18 covers flavors and schemes for staging and production builds.",
      ],
      snippet: "build-flags",
      notes: {
        rn: ["`EXPO_PUBLIC_*` values are inlined into the JS bundle, so anyone can read them. The same is true of native constants. Never ship secrets in the app."],
        android: [
          "`10.0.2.2` is the emulator's alias for your computer. `localhost` on the emulator is the emulator itself.",
          "`buildConfigField` takes a Java type and a Java literal, which is why the string is wrapped in escaped quotes.",
          "`BuildConfig.DEBUG` is generated for you once `buildConfig = true`.",
        ],
        ios: [
          "The iOS Simulator shares your Mac's network, so `localhost` just works.",
          "`#if DEBUG` removes the code from Release builds entirely. It isn't a runtime check.",
          "Plain `http://` URLs are blocked by App Transport Security, except for `localhost`. Other hosts need an exception in `Info.plist`.",
        ],
      },
    },
    {
      id: "fast-refresh",
      title: "Fast Refresh → Previews & Live Edit",
      prose: [
        "Fast Refresh is the thing RN engineers miss most. Native doesn't have an exact equivalent, but between them, previews and live editing cover most of the loop.",
        "The habit to build is **preview-driven development**. Design a component in isolation with previews for each state (Chapter 1), then run the app to check how it fits into the flow. You'll launch the full app far less often than you reload an RN app.",
      ],
      compare: [
        {
          label: "Iterate on one component",
          values: {
            rn: "Storybook, or navigate to it with Fast Refresh",
            android: "`@Preview` in Android Studio's split view, with interactive mode",
            ios: "`#Preview` in Xcode's canvas, live and interactive by default",
          },
        },
        {
          label: "Edit UI in the running app",
          values: {
            rn: "Fast Refresh, keeps state",
            android: "Live Edit updates composables on a running device as you type, within limits",
            ios: "Not built in. Use previews, or third-party tools like InjectionIII.",
          },
        },
        {
          label: "Edit other code",
          values: {
            rn: "Fast Refresh, or a full reload",
            android: "Apply Changes for small edits. Otherwise rebuild and reinstall.",
            ios: "Rebuild and relaunch (⌘R)",
          },
        },
        {
          label: "Native code change",
          values: {
            rn: "Full native rebuild",
            android: "It's all native, so the same incremental build as everything else",
            ios: "It's all native, so the same incremental build as everything else",
          },
        },
      ],
      callout:
        "Previews compile your code, so a broken build anywhere in the module breaks every preview. Keep previews small, and give them fake data rather than real repositories or network calls.",
    },
    {
      id: "logging",
      title: "Logging: console.log → Logcat & Logger",
      prose: [
        "`console.log` becomes `Log.d` on Android and `Logger` on iOS. Both are structured: each message has a level and a tag or category, so you can filter the noise. On Android, logs appear in Android Studio's **Logcat** window. On iOS, they appear in the Xcode console and in the macOS Console app.",
      ],
      snippet: "logging",
      notes: {
        android: [
          "Levels: `Log.v`, `Log.d`, `Log.i`, `Log.w`, `Log.e`. Filter in Logcat with queries like `tag:TodoRepository level:debug`.",
          "Logcat shows every process on the device. Filter by `package:mine` to see only your app.",
          "Many teams wrap `Log` with Timber so debug logs can be stripped from release builds.",
        ],
        ios: [
          "`print` works, but `Logger` (from `OSLog`) adds levels, categories, and near-zero cost when a level is disabled.",
          "Interpolated values are **redacted** as `<private>` outside the debugger unless you mark them `privacy: .public`. Don't mark personal data public.",
          "The Xcode console can filter by category and level. Click a log line to jump to its source.",
        ],
      },
    },
    {
      id: "debugging",
      title: "Debugging & inspection",
      prose: [
        "Both IDEs ship a debugger and inspection tools that replace React Native DevTools, Flipper, and the perf monitor. They're built in and work the same way for every line of code in the app, because there's no JS/native boundary to cross.",
      ],
      compare: [
        {
          label: "Breakpoints",
          values: {
            rn: "React Native DevTools (Hermes debugger)",
            android: "Click the gutter, then Debug 🐞. Or attach to a running app.",
            ios: "Click the gutter. Xcode runs under the LLDB debugger by default.",
          },
        },
        {
          label: "Component tree",
          values: {
            rn: "React DevTools component inspector",
            android: "Layout Inspector, with recomposition counts per composable",
            ios: "Debug View Hierarchy (a 3D exploded view of the UI)",
          },
        },
        {
          label: "Network",
          values: {
            rn: "DevTools Network tab, Flipper, or a proxy",
            android: "App Inspection → Network Inspector",
            ios: "Instruments (Network), or a proxy like Proxyman or Charles",
          },
        },
        {
          label: "Performance",
          values: {
            rn: "Perf monitor, React Profiler",
            android: "Android Studio Profiler, plus Compose tracing",
            ios: "Instruments: Time Profiler, plus the SwiftUI instrument",
          },
        },
        {
          label: "Storage",
          values: {
            rn: "Flipper plugins, or logging",
            android: "App Inspection → Database Inspector (live SQL against Room)",
            ios: "Inspect the simulator's app container in Finder, or log",
          },
        },
      ],
      callout:
        "There's no red box. An uncaught exception or a failed `!` crashes the process. On Android, look for `FATAL EXCEPTION` in Logcat. Under the Xcode debugger, iOS stops on the crashing line.",
    },
  ],
  gotchas: [
    {
      title: "Sync before you trust the IDE",
      body: "After editing `build.gradle.kts` or `libs.versions.toml`, Android Studio shows a \"Sync Now\" banner. Until you sync, new dependencies show as unresolved and autocomplete is stale. In Xcode, package changes resolve on the next build, or via File → Packages → Resolve Package Versions.",
    },
    {
      title: "localhost isn't localhost on the emulator",
      body: "The Android emulator runs its own network stack, so `localhost` is the emulator. Use `10.0.2.2`, or forward the port with `adb reverse tcp:3000 tcp:3000`. The iOS Simulator shares the Mac's network, so `localhost` works there.",
    },
    {
      title: "BuildConfig is off by default",
      body: "Since Android Gradle Plugin 8, the `BuildConfig` class isn't generated unless you set `buildFeatures { buildConfig = true }`. If `BuildConfig` is unresolved, that's why.",
    },
    {
      title: "OSLog hides your values",
      body: "`logger.debug(\"User \\(id)\")` prints the value while you're attached to Xcode, but shows `<private>` in Console.app and in sysdiagnoses. Mark non-sensitive values `privacy: .public` when you need them in production logs.",
    },
    {
      title: "Xcode needs a Mac, and the project file is precious",
      body: "iOS work requires macOS and Xcode. Avoid hand-editing `project.pbxproj`. Let Xcode change it, keep files in folder-backed groups to reduce merge conflicts, and resolve any conflicts carefully.",
    },
    {
      title: "Caches go stale in new ways",
      body: "You're done with `--clear` and deleting `node_modules`. The new rituals are Invalidate Caches / Restart in Android Studio, `./gradlew clean`, and deleting `~/Library/Developer/Xcode/DerivedData`. Try a clean build before you lose an hour to a phantom error.",
    },
  ],
  cheatsheet: [
    { rn: "VS Code", android: "Android Studio", ios: "Xcode" },
    { rn: "Metro", android: "Gradle (no dev server)", ios: "Xcode build system (no dev server)" },
    { rn: "`index.ts` + `registerRootComponent`", android: "`MainActivity` + `setContent { }`", ios: "`@main struct App` + `WindowGroup`" },
    { rn: "`package.json`", android: "`build.gradle.kts` + `libs.versions.toml`", ios: "Xcode packages / `Package.swift`" },
    { rn: "`npm install x`", android: "Catalog entry + `implementation(libs.x)` + Sync", ios: "File → Add Package Dependencies…" },
    { rn: "Lockfile", android: "Exact versions in the catalog", ios: "`Package.resolved`" },
    { rn: "`app.json`", android: "`AndroidManifest.xml` + `defaultConfig`", ios: "Target settings + `Info.plist`" },
    { rn: "`assets/`", android: "`res/drawable`, `res/mipmap`", ios: "`Assets.xcassets`" },
    { rn: "`__DEV__`", android: "`BuildConfig.DEBUG`", ios: "`#if DEBUG`" },
    { rn: "`EXPO_PUBLIC_*`", android: "`buildConfigField`", ios: "`.xcconfig` + `Info.plist`" },
    { rn: "`console.log`", android: "`Log.d(TAG, …)` → Logcat", ios: "`Logger.debug(…)` → Xcode console" },
    { rn: "Fast Refresh", android: "`@Preview`, Live Edit, Apply Changes", ios: "`#Preview`, rebuild" },
    { rn: "React DevTools", android: "Layout Inspector", ios: "Debug View Hierarchy" },
    { rn: "`npm test`", android: "`./gradlew test`", ios: "⌘U / `xcodebuild test`" },
    { rn: "`expo start --clear`", android: "`./gradlew clean`", ios: "Clean Build Folder (⇧⌘K)" },
  ],
  quiz: [
    {
      question: "Your Android app calls `http://localhost:3000` and can't reach the dev server running on your computer. The emulator is running. What's the fix?",
      options: [
        "Add the `INTERNET` permission to `Info.plist`",
        "Use `10.0.2.2:3000`, or run `adb reverse tcp:3000 tcp:3000`",
        "Restart Metro",
        "Switch to a Release build",
      ],
      answer: 1,
      explanation: "Inside the emulator, `localhost` is the emulator itself, and `10.0.2.2` is its alias for the host machine. `adb reverse` forwards the port so `localhost` works too. On the iOS Simulator, `localhost` already reaches your Mac.",
    },
    {
      question: "You add a library to `libs.versions.toml` and `build.gradle.kts`, but its imports show as unresolved in Android Studio. What's the most likely cause?",
      options: [
        "You need to run `npm install`",
        "You haven't synced the Gradle project yet",
        "Kotlin can't use libraries from Maven Central",
        "Version catalogs only work for plugins",
      ],
      answer: 1,
      explanation: "Android Studio only learns about build file changes when you Sync. A command-line build would resolve it, but the IDE's index stays stale until the sync runs.",
    },
    {
      question: "What's the Android equivalent of the code that runs `registerRootComponent(App)` in an RN app?",
      options: [
        "`Application.onCreate()`",
        "A `@Composable fun main()`",
        "`setContent { }` inside the launcher Activity's `onCreate`",
        "The `build.gradle.kts` `defaultConfig` block",
      ],
      answer: 2,
      explanation: "The OS launches the Activity marked as the launcher in `AndroidManifest.xml`, and `setContent` hands Compose your root composable. On iOS, the `@main` type's `WindowGroup` plays the same role.",
    },
    {
      question: "On iOS, you log `logger.info(\"Loaded user \\(user.email)\")`. A tester sends you a Console.app capture. What do you see?",
      options: [
        "The full email address",
        "`Loaded user <private>`",
        "Nothing, because `info` logs are never stored",
        "A compile error, because `Logger` doesn't support interpolation",
      ],
      answer: 1,
      explanation: "OSLog redacts interpolated values by default unless a debugger is attached. Mark values `privacy: .public` only when they're safe to expose. For an email, keep it private.",
    },
    {
      question: "`BuildConfig.API_URL` shows as unresolved in a new Android project with AGP 8, even though `buildConfigField` is set in `build.gradle.kts`. Why?",
      options: [
        "`buildConfigField` only works in Release builds",
        "`BuildConfig` generation is disabled until you set `buildFeatures { buildConfig = true }`",
        "`BuildConfig` was removed in favor of `.env` files",
        "The field name must be lowercase",
      ],
      answer: 1,
      explanation: "AGP 8 turned `BuildConfig` generation off by default to speed up builds. Turn it on per module where you need it.",
    },
    {
      question: "What's the native replacement for the RN habit of saving a file and watching Fast Refresh update a component?",
      options: [
        "There's nothing; you rebuild the whole app for every change",
        "Running Metro alongside the native build",
        "Previews (`@Preview` / `#Preview`), plus Live Edit on Android",
        "Turning on Hot Module Replacement in Gradle",
      ],
      answer: 2,
      explanation: "Previews render a component in the IDE as you edit, which makes them the main fast feedback loop. Android Studio's Live Edit can also update composables in a running app. For non-UI changes on both platforms, you do an incremental rebuild.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "JUnit ends up packaged inside the release APK. Which line is the bug?",
      code: `dependencies {
    implementation(libs.androidx.compose.material3)
    implementation(libs.retrofit)
    implementation(libs.junit)
}`,
      answer: 4,
      explanation: "`implementation` ships the library with the app. Test-only libraries go in `testImplementation` (local JVM tests) or `androidTestImplementation` (instrumented tests). That's the Gradle version of `devDependencies`.",
    },
  ],
};
