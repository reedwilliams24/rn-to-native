import type { Chapter } from "../types";

export const migration: Chapter = {
  slug: "migration",
  title: "Migrating an RN app to native",
  intro: [
    "Everything so far has been about writing native code. This chapter is about getting there from a React Native app that real users depend on. The hard part of a migration isn't Kotlin or Swift. It's keeping the product shipping while two implementations coexist, and knowing when each screen is really done.",
    "Most teams don't rewrite in one go. They move screen by screen, with RN and native running in the same app for a while. The sections below cover the strategies, the two ways to embed one world in the other, what you can share, and how to prove parity before you delete the old code.",
  ],
  sections: [
    {
      id: "strategy",
      title: "Big bang vs screen-by-screen",
      prose: [
        "A **big bang** rewrite builds the whole native app beside the RN one and switches over in one release. A **screen-by-screen** migration (the *strangler fig* pattern) replaces one screen or flow at a time inside the existing app, and ships each one as soon as it reaches parity.",
        "Screen-by-screen is the default choice for apps with real users. Big bang can make sense for small apps, or when the RN app is so far behind that keeping it alive costs more than the rewrite.",
        "The trade-off is where you take the risk. A big bang ships nothing for months, needs a feature freeze (or every feature gets built twice), and ends in one high-risk switchover release. Screen-by-screen ships the first native screen in weeks and gives every step a rollback, but you carry two runtimes in one app for a while, with a bigger binary and bugs at the boundary between them.",
      ],
      callout:
        "Whichever you choose, decide up front where *new* features get built. If new work keeps landing in RN, the migration never finishes.",
    },
    {
      id: "order",
      title: "Choosing what to migrate first",
      prose: [
        "Start with a screen that is **self-contained**, **low-risk**, and **representative**. Settings, a detail page, or an onboarding step are common first picks. You want something that touches your real networking, auth, and design system, so the first screen builds the foundations every later screen reuses, without risking checkout or the home feed.",
        "Then work along navigation boundaries. A whole tab or a whole flow (such as create todo → pick date → confirm) is easier to switch than half a flow, because every jump between RN and native is a place for bugs. Save the most complex, highest-traffic screens until the team is fluent and the shared layers are solid.",
      ],
    },
    {
      id: "native-in-rn",
      title: "Phase 1: native screens inside the RN app",
      prose: [
        "Early on, the RN app is still the shell. It owns navigation, and you add native screens to it. The cleanest way is a small **Expo module** (or a Turbo Module, without Expo) that exposes an `open()` function. On Android it starts an activity hosting the Compose screen. On iOS it presents a `UIHostingController` wrapping the SwiftUI screen.",
        "This keeps the boundary small: RN calls one function and the native screen takes over until it closes. Embedding a native *view* inside an RN screen also works (Expo's `View` definition, or a Fabric component), but full screens are simpler to reason about and to delete later.",
      ],
      snippet: "native-in-rn",
      notes: {
        rn: ["`requireNativeModule` throws if the module isn't linked, so you'll find out at startup, not on tap."],
        android: [
          "`appContext.currentActivity` is the RN host activity. Starting a new activity puts the native screen on top of it, so the system back button returns to RN.",
          "`runOnQueue(Queues.MAIN)` runs the function on the main thread, which UI work requires.",
        ],
        ios: [
          "`present` shows the native screen modally. To push it onto a navigation stack instead, you need access to the RN navigator's `UINavigationController`, which is more fragile.",
          "`.runOnQueue(.main)` matters here: UIKit calls must happen on the main thread (Chapter 11).",
        ],
      },
    },
    {
      id: "rn-in-native",
      title: "Phase 2: RN screens inside a native app",
      prose: [
        "Once most screens are native, flip it around. Make the native app the shell, using `NavHost` and `NavigationStack` from Chapter 9, and host the remaining RN screens inside it. React Native calls this *integration with existing apps* (brownfield). Each leftover screen is registered as its own root component, and native code opens it like any other screen.",
        "This is the phase where you can finally drop React Navigation. It also sets a clear end state: the migration is done when the last `registerComponent` call is gone and you can remove the RN dependency.",
      ],
      snippet: "rn-in-native",
      notes: {
        rn: [
          "Each registered screen gets its own React root. Shared state across them has to live outside React (see the next section).",
          "Pass parameters as initial props, which arrive as normal component props.",
        ],
        android: [
          "The activity code matches RN's own `MainActivity` template, so upgrades follow the RN upgrade helper.",
          "Keep one `ReactHost` for the whole app (it's created by your `ReactApplication`). Starting it is slow, so warm it up early if the first RN screen feels sluggish.",
        ],
        ios: [
          "`RCTReactNativeFactory` is the current (RN 0.78+) entry point. Older guides use `RCTRootView` and a bridge.",
          "The singleton keeps one JS runtime alive for every embedded screen, so state and caches survive between them.",
        ],
      },
      callout:
        "Pick one owner for navigation in each phase. If RN and native both push screens onto their own stacks, back behavior and deep links get unpredictable fast.",
    },
    {
      id: "boundary",
      title: "Shared state across the boundary",
      prose: [
        "While both worlds coexist, the user must not notice the seams. The user stays logged in, analytics stay continuous, and settings changed in one world show up in the other. Anything that used to live in a JS store now needs a single native owner that RN reads through a module.",
      ],
      compare: [
        {
          label: "Auth session",
          values: {
            rn: "Token in SecureStore / Keychain via JS",
            android: "Move ownership to native (Keystore-backed storage, Chapter 13) and expose it to RN",
            ios: "Move ownership to native (Keychain, Chapter 13) and expose it to RN",
          },
        },
        {
          label: "Analytics",
          values: {
            rn: "JS SDK with its own event names",
            android: "Native SDK, using the **same** event names and properties so dashboards don't break",
            ios: "Native SDK, using the **same** event names and properties",
          },
        },
        {
          label: "Persisted data",
          values: {
            rn: "AsyncStorage / MMKV / SQLite files",
            android: "Read the old files once and migrate to DataStore / Room, or keep the library until RN is gone",
            ios: "Read the old files once and migrate to UserDefaults / SwiftData, or keep the library until RN is gone",
          },
        },
        {
          label: "Feature flags",
          values: {
            rn: "JS SDK",
            android: "One native SDK instance, with values bridged to RN",
            ios: "One native SDK instance, with values bridged to RN",
          },
        },
      ],
      callout:
        "Don't run two SDK instances (JS and native) of the same analytics or flag service. They double-count sessions and can disagree on flag values mid-session.",
    },
    {
      id: "kmp",
      title: "Sharing logic: Kotlin Multiplatform",
      prose: [
        "One thing you lose by leaving RN is one codebase for business logic. Validation rules, formatting, pricing, and sync logic end up written twice, and the two copies drift. **Kotlin Multiplatform** (KMP) is the most common answer. You write plain Kotlin in a shared module, Android uses it directly, and iOS imports it as a compiled framework.",
        "KMP shares logic, not UI. Your screens are still Compose and SwiftUI (Compose Multiplatform can share UI too, but most migrating teams keep SwiftUI on iOS). Start small: share models and pure rules first, then networking (Ktor) and storage (SQLDelight, Room) once the team trusts the setup.",
      ],
      snippet: "kmp",
      notes: {
        android: [
          "Code in `commonMain` can't use Android or JVM APIs. Platform-specific pieces use `expect`/`actual` declarations.",
          "Android depends on the shared module like any other Gradle module, with no bridge or serialization.",
        ],
        ios: [
          "Kotlin types appear through an Objective-C header today, so a Kotlin `object` becomes `TodoRules.shared` and some generics and enums feel less natural. Swift export is improving this.",
          "`suspend` functions are callable with `await` from Swift. SKIE improves how Flows, sealed classes, and enums look from Swift.",
          "iOS engineers will need to build the framework through Gradle. Agree with them on how it's distributed: built locally, via SPM, or via CocoaPods.",
        ],
      },
      callout:
        "KMP is a team decision, not just a technical one. It makes Android engineers the owners of logic iOS depends on. If your iOS developers would rather write Swift, sharing a spec plus golden test cases is a reasonable alternative.",
    },
    {
      id: "flags",
      title: "Feature flags for each screen",
      prose: [
        "Put every migrated screen behind a remote flag, and keep the old implementation working until the new one has proved itself. Ship native to staff first, then to a small percentage of users, while you compare crash rates and key metrics against the RN screen. If something goes wrong you turn the flag off, which matters even more now that there's no OTA fix (Chapter 18).",
        "The flag check lives wherever navigation lives. In phase 1 that's the RN shell, and in phase 2 it's the native shell, choosing between the new screen and the legacy RN one.",
      ],
      snippet: "flags",
      notes: {
        rn: ["Read the flag at navigation time, not at app start, so a flag change takes effect on the next open."],
        android: [
          "The legacy branch is the `ReactActivity` from the previous section, so RN and native routes can be swapped at any time.",
          "Type-safe `@Serializable` routes (Chapter 9) need the kotlinx.serialization plugin.",
        ],
        ios: [
          "`@Environment(FeatureFlags.self)` reads an `@Observable` object injected with `.environment(flags)` at the root (Chapter 10).",
          "`NavigationLink`'s destination closure runs on navigation, so the flag is checked when the user taps.",
        ],
      },
    },
    {
      id: "parity",
      title: "Parity checklists",
      prose: [
        "\"It looks the same\" isn't parity. Write a checklist for each screen *before* building it, by reading the RN code and listing everything it does, including the parts nobody remembers. Review it when the native screen is done, and again before deleting the RN version.",
      ],
      compare: [
        {
          label: "States",
          values: {
            rn: "List every loading, empty, error, and offline branch in the component",
            android: "A `@Preview` for each state (Chapter 1)",
            ios: "A `#Preview` for each state",
          },
        },
        {
          label: "Deep links",
          values: {
            rn: "Every path in the linking config that lands on this screen",
            android: "Intent filters + `deepLinks` on the destination (Chapter 9)",
            ios: "`onOpenURL` / universal links handled for this route",
          },
        },
        {
          label: "Analytics",
          values: {
            rn: "Every `track()` call and its properties",
            android: "Same event names, verified in your analytics debugger",
            ios: "Same event names, verified in your analytics debugger",
          },
        },
        {
          label: "Accessibility",
          values: {
            rn: "Labels, roles, focus order",
            android: "TalkBack pass + font scale 200% (Chapter 16)",
            ios: "VoiceOver pass + largest Dynamic Type size",
          },
        },
        {
          label: "Platform behavior",
          values: {
            rn: "Keyboard handling, back behavior, permissions copy",
            android: "System back and predictive back, rotation and process death (Chapter 6)",
            ios: "Swipe-back, interactive sheet dismissal",
          },
        },
        {
          label: "E2E flow",
          values: {
            rn: "The existing Detox / Maestro flow",
            android: "The same Maestro flow passing against the native build (Chapter 17)",
            ios: "The same Maestro flow passing against the native build",
          },
        },
      ],
    },
    {
      id: "persisted-data",
      title: "Migrating persisted data",
      prose: [
        "Users upgrading from the RN version have data on disk in RN's formats: AsyncStorage (a SQLite database on Android, JSON files on iOS), MMKV files, or a SQLite or WatermelonDB database. A native app that ignores them will log users out and lose their drafts and settings.",
        "There are two safe options. You can keep the RN storage library's native side (MMKV, for example, has native Android and iOS SDKs that read the same files). Or you can write a one-time migration that runs on first launch of the native version, copies values into DataStore, Room, UserDefaults, or SwiftData, and records that it ran. Test it by installing the last RN build, using it, and upgrading in place to the native build.",
      ],
      callout:
        "Upgrade-in-place is the test that catches the worst migration bugs. A fresh install hides them, because a fresh install has no old data to read.",
    },
    {
      id: "ramp-up",
      title: "Team ramp-up plan",
      prose: [
        "RN engineers become productive on native faster than most expect, because the declarative model carries over (Chapter 1). What takes time is the platform layer: lifecycles, threading, build tooling, and signing. Plan for it explicitly.",
        "**Weeks 1–2:** language and UI basics (Chapters 1–5), with each engineer building a small throwaway feature on both platforms. **Weeks 3–4:** pair on the first real migrated screen, with whoever has the most native experience reviewing every PR. **After that:** split by platform if you want depth, but rotate people every few screens so everyone can review both. Keep one RN-fluent reviewer on each migration PR to catch parity gaps.",
        "Write down decisions as you go: architecture, DI, navigation, testing layers, and naming. The first two or three screens set the patterns every later screen copies, so it's worth reviewing them more slowly than usual.",
      ],
    },
  ],
  gotchas: [
    {
      title: "New features keep landing in RN",
      body: "If product work continues in RN during the migration, native is chasing a moving target. Agree that new features are built natively, or behind the same flag, as soon as the relevant area has been migrated.",
    },
    {
      title: "Two navigation owners",
      body: "RN pushing onto React Navigation while native pushes onto its own stack breaks back behavior and deep links. In each phase, one side owns navigation and the other only presents full screens when asked.",
    },
    {
      title: "Fresh installs hide data bugs",
      body: "QA on fresh installs never exercises reading AsyncStorage, MMKV, or SQLite data left by the RN version. Always test upgrading in place from the last RN build to the native one.",
    },
    {
      title: "Duplicate SDK instances",
      body: "Running both the JS and native SDKs for analytics, flags, or crash reporting double-counts sessions and can return different flag values. Keep one native instance and bridge it to RN.",
    },
    {
      title: "Keep the same app identity",
      body: "The native app must keep the same application ID, bundle ID, and signing credentials (Chapter 18). Otherwise it's a new app in the stores, not an update.",
    },
    {
      title: "Bigger binaries in the middle",
      body: "While RN and native coexist you ship both runtimes, so app size and cold start can get worse before they get better. Track them per release, and set a date to remove RN entirely.",
    },
  ],
  cheatsheet: [
    { rn: "Whole app in RN", android: "Phase 1: native screens via a module", ios: "Phase 1: `UIHostingController` via a module" },
    { rn: "Remaining RN screens", android: "Phase 2: `ReactActivity` per screen", ios: "Phase 2: `RCTReactNativeFactory` root view" },
    { rn: "`AppRegistry.registerComponent`", android: "`getMainComponentName()`", ios: "`view(withModuleName:)`" },
    { rn: "`NativeModules` / Expo module", android: "Expo `Module` / Turbo Module (Kotlin)", ios: "Expo `Module` / Turbo Module (Swift)" },
    { rn: "React Navigation", android: "`NavHost` once native is the shell", ios: "`NavigationStack` once native is the shell" },
    { rn: "Shared TS logic", android: "KMP `commonMain`", ios: "KMP framework (`import Shared`)" },
    { rn: "Feature flag JS SDK", android: "One native SDK, bridged to RN", ios: "One native SDK, bridged to RN" },
    { rn: "AsyncStorage data", android: "One-time migration to DataStore / Room", ios: "One-time migration to UserDefaults / SwiftData" },
    { rn: "Detox / Maestro flows", android: "Same Maestro flows as a parity check", ios: "Same Maestro flows as a parity check" },
    { rn: "Storybook stories", android: "`@Preview` per state", ios: "`#Preview` per state" },
    { rn: "Delete the RN screen", android: "After the flag has been at 100% for a while", ios: "After the flag has been at 100% for a while" },
  ],
  quiz: [
    {
      question: "Your app has a million active users and a team still shipping features. Which strategy fits best?",
      options: [
        "Big bang: freeze RN and rewrite everything before the next release",
        "Screen-by-screen: migrate self-contained screens behind flags, starting inside the RN app",
        "Rewrite only iOS first, and keep Android in RN forever",
        "Wrap the RN app in a WebView",
      ],
      answer: 1,
      explanation: "Incremental migration lets each screen ship once it reaches parity, keeps product work moving, and gives you a rollback (the flag) for every step. A big bang delays all value until the end and turns the switchover into one high-risk release.",
    },
    {
      question: "In phase 1 the RN app owns navigation. What's the simplest way to show a new SwiftUI settings screen from RN?",
      options: [
        "Add a `NavigationStack` inside the RN root view",
        "A native module function that presents a `UIHostingController(rootView: SettingsScreen())`",
        "Render SwiftUI views from JSX directly",
        "Rewrite React Navigation in Swift",
      ],
      answer: 1,
      explanation: "A small module with an `open()` function keeps the boundary tiny: RN calls it, and native owns the screen until it's dismissed. Mixing two navigation stacks is where bugs come from.",
    },
    {
      question: "After switching a screen to native, users report being logged out on upgrade. What was most likely missed?",
      options: [
        "The native app used a new bundle ID",
        "The native code didn't read or migrate the session the RN app stored on disk",
        "Fresh installs weren't tested",
        "The screen needed a feature flag",
      ],
      answer: 1,
      explanation: "Upgrading users have data in RN's storage formats. Keep a compatible library or run a one-time migration, and test by upgrading in place from the last RN build.",
    },
    {
      question: "What does Kotlin Multiplatform share between your Android and iOS apps by default?",
      options: [
        "The entire UI, replacing SwiftUI",
        "Business logic compiled to an iOS framework, while UI stays Compose and SwiftUI",
        "The JavaScript bundle",
        "Nothing at runtime; it only shares build scripts",
      ],
      answer: 1,
      explanation: "KMP compiles shared Kotlin into an Apple framework, so iOS calls it from Swift (e.g. `TodoRules.shared.validateTitle(title:)`). Sharing UI is a separate, optional step with Compose Multiplatform.",
    },
    {
      question: "Both the RN and native code initialize the analytics SDK during the migration. What goes wrong?",
      options: [
        "Nothing; the SDKs deduplicate automatically",
        "Sessions get double-counted and events can be split across two identities",
        "The app won't compile",
        "Only iOS is affected",
      ],
      answer: 1,
      explanation: "Two instances means two sessions and possibly two user IDs. Keep one native instance with the same event names, and bridge it to RN.",
    },
    {
      question: "When is it safe to delete the RN implementation of a migrated screen?",
      options: [
        "As soon as the native screen compiles",
        "When it looks the same in a screenshot",
        "After its parity checklist passes and the flag has been at 100% with healthy crash and metric numbers for a while",
        "Never; keep both forever as a fallback",
      ],
      answer: 2,
      explanation: "The flag is your rollback. Keep it until the native screen has proven itself in production against the checklist (states, deep links, analytics, accessibility, platform behavior), then delete the RN code and the flag together.",
    },
  ],
};
