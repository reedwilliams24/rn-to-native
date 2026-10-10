import type { OutlineChapter, OutlinePart } from "./types";

export const OUTLINE: OutlinePart[] = [
  {
    title: "Part I: Thinking natively",
    chapters: [
      {
        slug: "components",
        number: 1,
        title: "Components & declarative UI",
        summary: "Your React mental model already works. Here is how components, props, children, and conditionals look in Compose and SwiftUI.",
        topics: ["How rendering works on each platform", "Props → parameters / stored properties", "children → slots / @ViewBuilder", "Conditional & enum rendering", "Styling with modifiers", "Events", "Previews"],
      },
      {
        slug: "languages",
        number: 2,
        title: "TypeScript → Kotlin & Swift",
        summary: "The language features RN devs reach for daily, and their Kotlin and Swift counterparts.",
        topics: ["let/const → val/var, let/var", "Null safety: ?, ?., ?:, ??, !!, if let / guard let", "Object types → data class / struct", "Union types → sealed interface / enum with associated values", "Lambdas, trailing lambdas, closures", "Extension functions", "Collections: map/filter/reduce", "Value vs reference semantics (struct vs class)"],
      },
      {
        slug: "tooling",
        number: 3,
        title: "Project anatomy & tooling",
        summary: "Where things live and what replaces Metro, Expo, and npm.",
        topics: ["Android Studio & Xcode tours", "Entry points: index.js → MainActivity / @main App", "Gradle & version catalogs vs package.json", "Swift Package Manager", "Fast Refresh → Previews & Live Edit", "Debugging, logs, and the layout inspector"],
      },
    ],
  },
  {
    title: "Part II: Building UI",
    chapters: [
      {
        slug: "layout",
        number: 4,
        title: "Layout & styling",
        summary: "Flexbox to Row/Column/Box and HStack/VStack/ZStack, plus theming.",
        topics: ["flexDirection, justify/align → Arrangement & Alignment", "flex: 1 → weight() / frame(maxWidth: .infinity)", "Absolute positioning → Box/ZStack & offset", "Spacing, padding, margins", "Theming & design tokens: MaterialTheme / Environment", "Dark mode & dynamic type"],
      },
      {
        slug: "state",
        number: 5,
        title: "State",
        summary: "useState and friends, and the rules of recomposition and body updates.",
        topics: ["useState → remember { mutableStateOf() } / @State", "Lifting state → state hoisting / @Binding", "useMemo → remember(key) / derivedStateOf / computed properties", "useRef → remember without state / non-@State properties", "Surviving rotation & process death: rememberSaveable / @SceneStorage"],
      },
      {
        slug: "effects",
        number: 6,
        title: "Side effects & lifecycle",
        summary: "useEffect and AppState, translated.",
        topics: ["useEffect(fn, [deps]) → LaunchedEffect(key) / .task(id:)", "Cleanup → DisposableEffect / onDisappear & task cancellation", "AppState → Lifecycle observers / scenePhase", "Activity recreation and why Android is different"],
      },
      {
        slug: "lists",
        number: 7,
        title: "Lists & performance",
        summary: "FlatList and SectionList, and keeping scrolling fast.",
        topics: ["FlatList → LazyColumn / List & LazyVStack", "keyExtractor → key / Identifiable", "SectionList → stickyHeader / Section", "Pull to refresh, infinite scroll", "React.memo → stability & skipping / Equatable views"],
      },
      {
        slug: "input",
        number: 8,
        title: "Input & forms",
        summary: "TextInput, keyboards, focus, and validation.",
        topics: ["TextInput → TextField / OutlinedTextField", "Controlled inputs on each platform", "Keyboard types, IME actions, submit", "Focus management: FocusRequester / @FocusState", "KeyboardAvoidingView → imePadding / automatic insets"],
      },
      {
        slug: "navigation",
        number: 9,
        title: "Navigation",
        summary: "React Navigation stacks, tabs, and modals, mapped to native.",
        topics: ["Stack → NavHost / NavigationStack", "Params & type-safe routes", "Tabs → NavigationBar / TabView", "Modals & sheets", "Deep links", "Back handling"],
      },
    ],
  },
  {
    title: "Part III: Architecture & data",
    chapters: [
      {
        slug: "architecture",
        number: 10,
        title: "App state & architecture",
        summary: "What replaces Context, Redux, and Zustand.",
        topics: ["Context → CompositionLocal / @Environment", "Stores → ViewModel + StateFlow / @Observable", "Unidirectional data flow on native", "Dependency injection: Hilt / Koin / environment", "Folder structure & modularization"],
      },
      {
        slug: "async",
        number: 11,
        title: "Async & concurrency",
        summary: "Promises and async/await become coroutines and Swift concurrency.",
        topics: ["Promise → suspend fun / async func", "Threads: Dispatchers & @MainActor", "Cancellation & structured concurrency", "Observables → Flow / AsyncSequence", "Common crash: UI updates off the main thread"],
      },
      {
        slug: "networking",
        number: 12,
        title: "Networking",
        summary: "fetch, axios, and React Query on native.",
        topics: ["fetch → Retrofit/Ktor / URLSession", "JSON: kotlinx.serialization / Codable", "Error handling & retries", "Caching & React Query-style patterns", "Auth headers & token refresh"],
      },
      {
        slug: "persistence",
        number: 13,
        title: "Persistence",
        summary: "AsyncStorage, MMKV, and SQLite equivalents.",
        topics: ["AsyncStorage → DataStore / UserDefaults", "SQLite/WatermelonDB → Room / SwiftData & Core Data", "Secure storage: Keystore / Keychain", "Files & caches"],
      },
    ],
  },
  {
    title: "Part IV: Platform",
    chapters: [
      {
        slug: "native-apis",
        number: 14,
        title: "Native APIs & permissions",
        summary: "Doing directly what Expo modules used to do for you.",
        topics: ["Permissions models compared", "Camera, location, notifications", "Background work: WorkManager / BGTaskScheduler", "Push notifications: FCM / APNs"],
      },
      {
        slug: "animation",
        number: 15,
        title: "Animations & gestures",
        summary: "Reanimated & Gesture Handler on native.",
        topics: ["Animated / Reanimated → animate*AsState / withAnimation", "Transitions & shared elements", "Gestures: pointerInput / gesture modifiers", "Haptics"],
      },
      {
        slug: "accessibility",
        number: 16,
        title: "Accessibility & localization",
        summary: "accessibilityLabel and i18n libraries, natively.",
        topics: ["accessibilityLabel → semantics / accessibilityLabel", "TalkBack vs VoiceOver", "Dynamic type & font scaling", "strings.xml / String Catalogs"],
      },
    ],
  },
  {
    title: "Part V: Shipping & migrating",
    chapters: [
      {
        slug: "testing",
        number: 17,
        title: "Testing",
        summary: "Jest, RNTL, and Detox equivalents.",
        topics: ["Jest → JUnit / Swift Testing", "RN Testing Library → Compose UI tests / ViewInspector", "Detox/Maestro → Espresso / XCUITest (Maestro still works)", "Snapshot & screenshot testing"],
      },
      {
        slug: "release",
        number: 18,
        title: "Builds, signing & release",
        summary: "What EAS did for you, done by hand.",
        topics: ["Build variants & schemes", "Signing: keystores / certificates & provisioning", "Play Console & App Store Connect", "CI: GitHub Actions + Gradle / Fastlane", "OTA updates: what you lose"],
      },
      {
        slug: "migration",
        number: 19,
        title: "Migrating an RN app to native",
        summary: "Strategies for teams converting an existing RN codebase.",
        topics: ["Big bang vs screen-by-screen", "Embedding native screens in RN (and RN in native)", "Sharing logic: Kotlin Multiplatform", "Parity checklists & feature flags", "Team ramp-up plan"],
      },
    ],
  },
];

export const ALL_CHAPTERS: OutlineChapter[] = OUTLINE.flatMap((p) => p.chapters);
