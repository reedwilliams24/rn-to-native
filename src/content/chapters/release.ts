import type { Chapter } from "../types";

export const release: Chapter = {
  slug: "release",
  title: "Builds, signing & release",
  intro: [
    "In Expo, `eas build` and `eas submit` hide a lot of work: build variants, version numbers, keystores, certificates, provisioning profiles, store uploads, and over-the-air updates. On native, each of those is a separate piece you own. None of it is hard, but there are more pieces, and a mistake with a signing key can cost you far more than a broken build.",
    "This chapter goes through the pipeline in order: configure variants, version and sign the build, upload it to each store, automate it on CI, and plan for life without OTA updates.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "What EAS was doing for you",
      prose: [
        "Every row in this table used to be one line in `eas.json` or `app.config.ts`. Now each one lives in a specific file or console.",
      ],
      compare: [
        {
          label: "Environments",
          values: {
            rn: "EAS build profiles + `APP_VARIANT` in `app.config.ts`",
            android: "Product flavors × build types in `build.gradle.kts`",
            ios: "Build configurations + schemes, with values in `.xcconfig` files",
          },
        },
        {
          label: "Build command",
          values: {
            rn: "`eas build --profile production`",
            android: "`./gradlew bundleProductionRelease` → `.aab`",
            ios: "`xcodebuild archive` + `-exportArchive` → `.ipa`",
          },
        },
        {
          label: "Signing credentials",
          values: {
            rn: "Stored and managed by EAS",
            android: "An upload keystore (`.jks`) you create and keep safe",
            ios: "A distribution certificate + provisioning profile from the Apple Developer portal",
          },
        },
        {
          label: "Submit",
          values: {
            rn: "`eas submit`",
            android: "Upload to Play Console (by hand, Gradle Play Publisher, or fastlane `supply`)",
            ios: "Upload to App Store Connect (Xcode Organizer, `xcrun altool`, or fastlane `pilot`)",
          },
        },
        {
          label: "Hotfix without review",
          values: {
            rn: "`eas update` (OTA JS bundle)",
            android: "Not possible for code. Remote config and feature flags only.",
            ios: "Not possible for code. Remote config and feature flags only.",
          },
        },
      ],
    },
    {
      id: "variants",
      title: "Build variants & schemes",
      prose: [
        "Expo builds variants from one dynamic config. Android builds them from a grid: **build types** (`debug`, `release`) describe *how* to build, and **product flavors** (`staging`, `production`) describe *what* to build. Gradle multiplies them into variants like `stagingDebug` and `productionRelease`, each with its own app ID, name, and constants.",
        "iOS splits this into two ideas. A **build configuration** (Debug, Release, or ones you add like Staging) is a set of build settings, best kept in an `.xcconfig` file. A **scheme** picks which configuration to use for Run, Test, and Archive. A common setup is one scheme per environment, such as \"Todos (Staging)\" and \"Todos (Production)\".",
      ],
      snippet: "variants",
      notes: {
        rn: ["`extra` values are baked into the JS bundle at build time, much like `BuildConfig` fields."],
        android: [
          "Since AGP 8, `buildConfig = true` must be enabled explicitly, or `BuildConfig.API_URL` won't exist.",
          "`applicationIdSuffix` lets staging and production sit side by side on one device.",
          "In Android Studio, pick the active variant in the *Build Variants* panel. That's the closest thing to choosing an EAS profile.",
        ],
        ios: [
          "`//` starts a comment in `.xcconfig` files, so URLs need the `https:/$()/` trick. Forgetting this silently truncates the value to `https:`.",
          "`INFOPLIST_KEY_*` settings write keys into the generated Info.plist without editing the plist by hand.",
          "`SWIFT_ACTIVE_COMPILATION_CONDITIONS` defines flags for `#if STAGING`. `DEBUG` is already set for the Debug configuration.",
        ],
      },
      callout:
        "Keep secrets out of `BuildConfig` and Info.plist. Both ship inside the app and can be read by anyone who downloads it, exactly like `EXPO_PUBLIC_` variables.",
    },
    {
      id: "versioning",
      title: "Version numbers",
      prose: [
        "Each platform has two numbers: a human-readable version shown in the store, and an internal build number the store uses to order uploads. EAS's `autoIncrement` managed the second one. Now your CI does, usually from the CI run number.",
      ],
      compare: [
        {
          label: "User-visible version",
          values: {
            rn: "`version` in `app.config.ts`",
            android: "`versionName` (e.g. `\"1.4.0\"`)",
            ios: "`MARKETING_VERSION` → `CFBundleShortVersionString`",
          },
        },
        {
          label: "Build number",
          values: {
            rn: "`android.versionCode` / `ios.buildNumber`, or EAS remote versioning",
            android: "`versionCode`: an integer that must increase with every upload, across all tracks",
            ios: "`CURRENT_PROJECT_VERSION` → `CFBundleVersion`: must be unique and increasing within a version",
          },
        },
        {
          label: "Read at runtime",
          values: {
            rn: "`expo-application` `nativeApplicationVersion`",
            android: "`BuildConfig.VERSION_NAME` / `VERSION_CODE`",
            ios: "`Bundle.main.infoDictionary?[\"CFBundleShortVersionString\"]`",
          },
        },
      ],
    },
    {
      id: "signing",
      title: "Signing: keystores, certificates & provisioning",
      prose: [
        "Both stores require every build to be signed, so they can prove an update came from the same developer. The two platforms do this in very different ways.",
        "Android is simple: one keystore file holds your **upload key**. With Play App Signing (required for new apps), Google holds the real app signing key and re-signs your uploads. If you lose the upload key, Google can reset it. If you sign with your own app signing key and lose it, you can never update the app again.",
        "iOS has more moving parts. A **distribution certificate** identifies your team. An **App ID** (bundle ID) identifies the app and its capabilities, like push or Sign in with Apple. A **provisioning profile** ties the certificate, the App ID, and (for development) specific devices together. Xcode's *Automatically manage signing* handles this locally. On CI, most teams use fastlane `match` to share certificates and profiles from an encrypted git repo.",
      ],
      snippet: "signing",
      notes: {
        rn: ["`eas credentials` shows what EAS is holding for you. Download these before leaving EAS, especially the Android keystore."],
        android: [
          "Debug builds are signed automatically with a shared debug key in `~/.android/debug.keystore`.",
          "Google Sign-In, Maps, and Firebase often need your keys' SHA-1/SHA-256 fingerprints. Register both the upload key and Play's app signing key.",
        ],
        ios: [
          "A capability added in Xcode (push, App Groups, Associated Domains) changes the entitlements and needs a new provisioning profile.",
          "\"No profiles for 'com.acme.todos' were found\" almost always means the bundle ID, team, or capabilities don't match the profile.",
        ],
      },
      callout:
        "If you're migrating an existing app, you must keep the **same** Android application ID and signing key, and the **same** iOS bundle ID and team. Otherwise the stores treat your native app as a different app, and users won't get it as an update. Export your keystore from EAS before anything else.",
    },
    {
      id: "release-builds",
      title: "Release builds behave differently",
      prose: [
        "RN release builds mostly differ from debug builds in the JS bundle. Native release builds change the compiled code itself. Test a release build before every launch, not just debug.",
      ],
      compare: [
        {
          label: "Optimization",
          values: {
            rn: "Hermes bytecode, minified JS",
            android: "R8 shrinks, optimizes, and renames classes (`isMinifyEnabled = true`)",
            ios: "Swift `-O` optimization, dead code stripping",
          },
        },
        {
          label: "Typical release-only bug",
          values: {
            rn: "A missing env var in the production profile",
            android: "R8 removed or renamed a class used through reflection, e.g. a JSON model. Fix it with keep rules or `@Keep`.",
            ios: "A crash in code behind `#if DEBUG`, or a missing entitlement",
          },
        },
        {
          label: "Readable crash stacks",
          values: {
            rn: "Upload source maps to Sentry and similar tools",
            android: "Upload `mapping.txt` (R8) and native symbols to Play Console / Crashlytics",
            ios: "Upload dSYMs to Crashlytics / Sentry. App Store Connect symbolicates its own reports.",
          },
        },
      ],
    },
    {
      id: "stores",
      title: "Play Console & App Store Connect",
      prose: [
        "The store consoles barely change after the migration. You upload different artifacts, but the tracks, testers, and review process are the same ones EAS Submit fed into.",
      ],
      compare: [
        {
          label: "Artifact",
          values: {
            rn: "Whatever EAS built",
            android: "Android App Bundle (`.aab`). Play builds per-device APKs from it.",
            ios: "Archive exported as `.ipa`",
          },
        },
        {
          label: "Internal testing",
          values: {
            rn: "EAS internal distribution / Expo dev builds",
            android: "Internal testing track: up to 100 testers, available within minutes",
            ios: "TestFlight internal testers: up to 100 team members, no review",
          },
        },
        {
          label: "Wider beta",
          values: {
            rn: "Same as native",
            android: "Closed and open testing tracks",
            ios: "TestFlight external testers (needs a short beta review)",
          },
        },
        {
          label: "Gradual rollout",
          values: {
            rn: "Same as native, plus OTA channels",
            android: "Staged rollout by percentage. You can halt it.",
            ios: "Phased release over 7 days. You can pause it.",
          },
        },
      ],
    },
    {
      id: "ci",
      title: "CI: GitHub Actions + Gradle / fastlane",
      prose: [
        "EAS Build was a hosted CI just for mobile. On native you usually run your own CI. Android builds run on any Linux runner with a JDK. iOS builds need a **macOS runner** with the right Xcode version, which costs more and is slower to start, so iOS jobs are often only run on `main` or release branches.",
        "fastlane is the common glue for both: `match` for iOS signing, `gym` (`build_app`) to build, and `pilot` / `supply` to upload. Gradle tasks alone are enough for Android if you prefer to skip fastlane there.",
      ],
      compare: [
        {
          label: "Runner",
          values: {
            rn: "EAS build servers",
            android: "`ubuntu-latest` + `actions/setup-java`",
            ios: "`macos-*` + a pinned Xcode version (`xcode-select` or `setup-xcode`)",
          },
        },
        {
          label: "Secrets",
          values: {
            rn: "EAS secrets",
            android: "Base64-encoded keystore + passwords in CI secrets, decoded at build time",
            ios: "`match` repo passphrase + App Store Connect API key in CI secrets",
          },
        },
        {
          label: "Cache",
          values: {
            rn: "Handled by EAS",
            android: "Gradle cache (`gradle/actions/setup-gradle`)",
            ios: "SPM packages and DerivedData",
          },
        },
      ],
    },
    {
      id: "ota",
      title: "OTA updates: what you lose",
      prose: [
        "This is the change your team will feel most. With `expo-updates` or CodePush you could ship a JS fix in minutes. Native apps are compiled code, and both stores forbid downloading new executable code. **Every code fix is a store release.**",
        "Plan for it with three tools. First, **feature flags and remote config** (Firebase Remote Config, LaunchDarkly, or your own API), so you can switch off a broken feature without a release. Second, a **minimum supported version** check, so you can force users off a badly broken build. Third, **staged rollouts**, so a bad build only reaches a small slice of users before you halt it.",
      ],
      snippet: "forced-update",
      notes: {
        rn: ["`expo-updates` only replaces JS and assets. Native code changes always needed a store build, even in RN."],
        android: [
          "Play's In-App Updates API can show a full-screen *immediate* update flow, or download in the background with a *flexible* one.",
          "In-app updates only work for apps installed from Play. Test them with internal app sharing.",
        ],
        ios: [
          "There's no API to install an update from inside the app. The best you can do is block the UI and link to the App Store.",
          "`compare(_:options: .numeric)` compares `\"1.10.0\"` and `\"1.9.0\"` correctly. A plain string comparison doesn't.",
        ],
      },
      callout:
        "Ship the minimum-version check in your **first** native release. You can't add a kill switch to builds that are already on users' phones.",
    },
  ],
  gotchas: [
    {
      title: "Losing the signing identity means a new app",
      body: "If a migrated Android build is signed with a different key, or the iOS build uses a different bundle ID or team, the store treats it as a different app. Users won't get it as an update, and you lose reviews and rankings. Export credentials from EAS first and keep the same IDs.",
    },
    {
      title: "versionCode must always go up",
      body: "Play rejects any upload whose `versionCode` isn't higher than every previous upload, on any track. Coming from EAS remote versioning, start your native `versionCode` above the last one EAS used.",
    },
    {
      title: "BuildConfig is off by default",
      body: "AGP 8 no longer generates `BuildConfig` unless you set `buildFeatures { buildConfig = true }`. If `BuildConfig.API_URL` doesn't resolve, check this first.",
    },
    {
      title: "// is a comment in .xcconfig",
      body: "`API_URL = https://api.acme.com` becomes `https:`. Write `https:/$()/api.acme.com`, where the empty `$()` breaks up the slashes.",
    },
    {
      title: "R8 breaks reflection",
      body: "A release build can crash on code that works in debug, because R8 renamed or removed classes that a library loads by name. Prefer kotlinx.serialization (no reflection), add keep rules where needed, and test release builds before shipping.",
    },
    {
      title: "No OTA safety net",
      body: "A bad release can't be patched in minutes anymore. Use staged rollouts, feature flags, and a minimum-version gate, and add them before your first native release.",
    },
  ],
  cheatsheet: [
    { rn: "EAS build profile", android: "Product flavor (+ build type)", ios: "Scheme → build configuration" },
    { rn: "`app.config.ts` per-env values", android: "`buildConfigField` / `resValue`", ios: "`.xcconfig` + Info.plist keys" },
    { rn: "`Constants.expoConfig.extra`", android: "`BuildConfig.API_URL`", ios: "`Bundle.main.object(forInfoDictionaryKey:)`" },
    { rn: "`__DEV__`", android: "`BuildConfig.DEBUG`", ios: "`#if DEBUG`" },
    { rn: "`android.package` / `ios.bundleIdentifier`", android: "`applicationId`", ios: "`PRODUCT_BUNDLE_IDENTIFIER`" },
    { rn: "`version`", android: "`versionName`", ios: "`MARKETING_VERSION`" },
    { rn: "`versionCode` / `buildNumber`", android: "`versionCode`", ios: "`CURRENT_PROJECT_VERSION`" },
    { rn: "`eas credentials`", android: "Upload keystore + Play App Signing", ios: "Certificate + provisioning profile (fastlane `match`)" },
    { rn: "`eas build`", android: "`./gradlew bundleProductionRelease`", ios: "`xcodebuild archive` / fastlane `build_app`" },
    { rn: "`eas submit`", android: "Play Console / fastlane `supply`", ios: "App Store Connect / fastlane `pilot`" },
    { rn: "Internal distribution", android: "Internal testing track", ios: "TestFlight" },
    { rn: "`eas update`", android: "None. Use flags + In-App Updates.", ios: "None. Use flags + a version gate." },
    { rn: "Source maps", android: "`mapping.txt`", ios: "dSYMs" },
  ],
  quiz: [
    {
      question: "Your team ships its first native Android build, signed with a newly generated key. Play rejects the upload. Why?",
      options: [
        "The `versionName` wasn't changed",
        "Updates must be signed with the app's existing upload key. A new key looks like a different developer.",
        "Native builds need a new application ID",
        "Play doesn't accept `.aab` files from Gradle",
      ],
      answer: 1,
      explanation: "The store checks that every update is signed by the same identity. Export the keystore from EAS (`eas credentials`) and sign with it, or ask Google to reset the upload key if you use Play App Signing.",
    },
    {
      question: "What replaces an EAS build profile like `staging` on Android?",
      options: [
        "A separate Git branch",
        "A product flavor, combined with a build type to make variants like `stagingRelease`",
        "An `.env` file read at runtime",
        "A different `AndroidManifest.xml` committed per environment",
      ],
      answer: 1,
      explanation: "Flavors define *what* you build (IDs, constants, resources) and build types define *how* (debuggable, minified). Gradle combines them into variants.",
    },
    {
      question: "In `Staging.xcconfig` you write `API_URL = https://staging.api.acme.com`. At runtime the value is `https:`. What happened?",
      options: [
        "Info.plist values can't contain URLs",
        "`//` starts a comment in xcconfig files, so the rest of the line was dropped",
        "The Staging configuration wasn't selected",
        "URLs must be percent-encoded",
      ],
      answer: 1,
      explanation: "Write `https:/$()/staging.api.acme.com`. The empty variable reference breaks up the slashes so they aren't parsed as a comment.",
    },
    {
      question: "A crash ships in your native iOS release. What's the fastest safe response?",
      options: [
        "Push an OTA update with `expo-updates`",
        "Download a patched Swift module at launch",
        "Disable the feature with a remote flag, pause the phased release, and submit a fixed build",
        "Edit the binary in App Store Connect",
      ],
      answer: 2,
      explanation: "Native code can't be updated over the air, and the stores forbid downloading executable code. Flags, phased or staged rollouts, and a quick fixed release are the tools you have.",
    },
    {
      question: "A screen that works in debug crashes in the Android release build with a missing class error. What's the likely cause?",
      options: [
        "The release build uses a different Kotlin version",
        "R8 removed or renamed a class that's accessed by reflection",
        "Release builds don't include resources",
        "`BuildConfig.DEBUG` is false",
      ],
      answer: 1,
      explanation: "With `isMinifyEnabled = true`, R8 strips and renames code it thinks is unused. Libraries that use reflection need keep rules. Always test a release build.",
    },
    {
      question: "Why add a minimum-version check in your very first native release?",
      options: [
        "Both stores require it",
        "It's the only way to force users off a broken build later, and older builds can't gain it after the fact",
        "It makes app review faster",
        "It enables OTA updates",
      ],
      answer: 1,
      explanation: "Only builds that already contain the check can be blocked. If v1.0 ships without it, you can never force v1.0 users to update.",
    },
  ],
};
