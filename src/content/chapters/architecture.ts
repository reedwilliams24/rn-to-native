import type { Chapter } from "../types";

export const architecture: Chapter = {
  slug: "architecture",
  title: "App state & architecture",
  intro: [
    "In RN, the architecture is mostly up to you. You pick Context, Redux, Zustand, or React Query, and you wire them together however you like. Native platforms are more opinionated. Android has an official recommended architecture built around the `ViewModel`. SwiftUI leans on `@Observable` models and the environment.",
    "The good news is that the ideas carry over. State lives in a store outside the UI. Components read it and send events back. Dependencies get injected so you can swap them in tests. This chapter maps each of those pieces, using the same `Todo` example as Chapter 1.",
    "Chapter 5 covered local state inside one component. This chapter is about state that outlives a component or is shared between several of them.",
  ],
  sections: [
    {
      id: "layers",
      title: "Where state lives",
      prose: [
        "RN apps tend to blur the line between UI state and app state, because everything is just JavaScript objects in one thread. Native apps separate them more strictly. The table shows the usual home for each kind of state.",
      ],
      compare: [
        {
          label: "Local UI state",
          values: {
            rn: "`useState` in the component",
            android: "`remember { mutableStateOf() }` (Chapter 5)",
            ios: "`@State` on the view (Chapter 5)",
          },
        },
        {
          label: "Screen state",
          values: {
            rn: "A custom hook, a Zustand slice, or React Query",
            android: "A `ViewModel` exposing `StateFlow`",
            ios: "An `@Observable` class owned by the screen",
          },
        },
        {
          label: "App-wide values",
          values: {
            rn: "Context",
            android: "`CompositionLocal`, or a singleton injected by Hilt",
            ios: "`@Environment`",
          },
        },
        {
          label: "Data & side effects",
          values: {
            rn: "API modules, React Query, AsyncStorage",
            android: "Repositories (Chapters 12 and 13)",
            ios: "Repositories or services injected into models",
          },
        },
      ],
      callout:
        "The biggest shift on Android: a `ViewModel` *outlives the UI*. When the user rotates the phone, Android destroys and recreates the Activity and every composable in it, but the `ViewModel` survives. RN has no equivalent because the JS runtime never gets torn down on rotation.",
    },
    {
      id: "context",
      title: "Context → CompositionLocal / @Environment",
      prose: [
        "React Context passes a value down the tree without threading it through props. Compose has `CompositionLocal` and SwiftUI has the environment. Both work the same way: a provider sets a value for a subtree, and any descendant can read it.",
        "You already use these without noticing. `MaterialTheme.colorScheme` reads a CompositionLocal. `@Environment(\\.colorScheme)` reads an environment value. Custom ones are for app-wide values that rarely change, such as the signed-in session or a theme.",
      ],
      snippet: "context",
      notes: {
        rn: ["A context value change re-renders every consumer. That's why RN apps split contexts or switch to a store with selectors."],
        android: [
          "`staticCompositionLocalOf` is for values that rarely change. Changing it recomposes the whole subtree under the provider.",
          "`compositionLocalOf` tracks reads, so only the composables that read `.current` recompose. Use it for values that change more often.",
          "By convention, CompositionLocal names start with `Local`.",
        ],
        ios: [
          "`.environment(\\.key, value)` is the provider. `@Environment(\\.key)` is `useContext`.",
          "For an `@Observable` object you can skip the key entirely: `.environment(store)` and `@Environment(TodoStore.self)`.",
          "A missing object injected with `.environment(store)` crashes at runtime. That's the same failure as a missing Provider, minus the nice error message.",
        ],
      },
      callout:
        "Don't use CompositionLocal as a global store. The Compose docs warn against it because it makes data flow implicit. Pass screen state as parameters and keep locals for cross-cutting values like theme or session.",
    },
    {
      id: "stores",
      title: "Stores → ViewModel + StateFlow / @Observable",
      prose: [
        "A Zustand or Redux store holds state outside the component tree and exposes methods to change it. On Android that's a `ViewModel` exposing a `StateFlow`. On iOS it's a class marked `@Observable`.",
        "Both follow the same pattern: keep the mutable state private and expose a read-only view of it. Views read the state and call methods. They never mutate it directly.",
      ],
      snippet: "store",
      notes: {
        android: [
          "`StateFlow` is an observable value that always has a current value, a bit like a store you can `getState()` from and subscribe to.",
          "`_todos.update { … }` is an atomic read-modify-write, like Zustand's `set((s) => …)`.",
          "The `_private` / `public` pair is the standard backing-property pattern. `asStateFlow()` stops callers from casting back to the mutable type.",
          "Collections are immutable (`List`, not `MutableList`), so `it + todo` returns a new list. That's what makes `StateFlow` see a change.",
        ],
        ios: [
          "`@Observable` (iOS 17+) is a macro that tracks which properties each `body` reads. Only views that read `todos` update when it changes, so you don't need selectors.",
          "It's a `class`, because the store needs a single shared identity. `Todo` stays a `struct`, so mutating `todos[i].done` is safe and observed.",
          "`@MainActor` keeps all reads and writes on the main thread, where SwiftUI expects them (Chapter 11).",
          "Older code uses `ObservableObject` with `@Published` and `@StateObject`. It still works, but `@Observable` is simpler and faster.",
        ],
      },
    },
    {
      id: "consuming",
      title: "Reading a store from the UI",
      prose: [
        "Subscribing to the store looks like a hook call on each platform. Compose collects the `StateFlow` into Compose state. SwiftUI just reads the properties, and observation tracking does the rest.",
        "Notice the split into a stateful screen and a stateless list. Compose docs call this *state hoisting*. It's the same container/presentational split many RN codebases use. The stateless half is trivial to preview (Chapter 1) and test (Chapter 17).",
      ],
      snippet: "screen",
      notes: {
        android: [
          "`viewModel()` returns the existing `ViewModel` for this screen, or creates one. It's scoped to the Activity or navigation destination, not to the composable.",
          "`collectAsStateWithLifecycle()` stops collecting when the app is in the background. Prefer it over plain `collectAsState()`.",
          "`viewModel::toggle` is a function reference, the same as passing `toggle` in JS.",
        ],
        ios: [
          "`@State` on a reference type keeps the same instance across `body` updates. It's the `@Observable` replacement for `@StateObject`.",
          "Child views don't need a wrapper to observe the store. Pass it as a plain `let` and reads are still tracked.",
          "`store.toggle` passes the method as a closure. It captures `store` strongly, which is fine here because the view doesn't own itself.",
        ],
      },
    },
    {
      id: "udf",
      title: "Unidirectional data flow",
      prose: [
        "If you've used `useReducer` or Redux, you already know unidirectional data flow (UDF): state flows down, actions flow up, and one place decides how state changes. Google's Android architecture guide recommends exactly this. In Swift, the same idea is behind libraries like The Composable Architecture (TCA).",
        "The idiomatic version is a single immutable UI state object, plus a sealed type or enum of actions. You don't need a library for it.",
      ],
      snippet: "actions",
      notes: {
        rn: ["The discriminated union `Action` is the TypeScript version of a sealed type."],
        android: [
          "`sealed interface` gives you an exhaustive `when` with no `else` branch, just like `switch` on a union with `never` checking.",
          "`copy(…)` is the data-class version of `{ ...state, filter }`.",
          "`visible` is a computed property, like a selector. It's recalculated on each read, so keep it cheap or precompute it.",
        ],
        ios: [
          "Enums with associated values (`case add(String)`) are Swift's discriminated unions.",
          "Mutating `todos` in place is fine. `Array` is a value type, so the observation system still sees a new value.",
          "`self.filter = filter` needs `self.` because the parameter shadows the property.",
        ],
      },
      callout:
        "You don't have to send every event through one `onAction` function. Plain methods like `toggle(id)` are just as unidirectional. What matters is that the view never writes state directly.",
    },
    {
      id: "lifetimes",
      title: "Store lifetimes",
      prose: [
        "In RN, a Zustand store lives as long as the JS module, and component state lives until unmount. Native stores have more specific scopes, and they decide when state resets.",
      ],
      compare: [
        {
          label: "Scoped to one screen",
          values: {
            rn: "A hook or `useState` in the screen",
            android: "`viewModel()` inside a navigation destination. Cleared when the screen is popped.",
            ios: "`@State private var model = Model()` on the screen view",
          },
        },
        {
          label: "Shared by several screens",
          values: {
            rn: "Zustand / Redux store",
            android: "A `ViewModel` scoped to a parent nav graph, or a `@Singleton` repository",
            ios: "An object created higher up and passed down or put in `.environment`",
          },
        },
        {
          label: "Survives rotation",
          values: {
            rn: "Always (JS keeps running)",
            android: "`ViewModel` yes; `remember` no",
            ios: "Always (no recreation on rotation)",
          },
        },
        {
          label: "Survives process death",
          values: {
            rn: "Only what you persisted",
            android: "`SavedStateHandle` in the `ViewModel`, or persisted data",
            ios: "`@SceneStorage`, or persisted data",
          },
        },
        {
          label: "Cleanup hook",
          values: {
            rn: "Effect cleanup on unmount",
            android: "`onCleared()`; `viewModelScope` is cancelled automatically",
            ios: "`deinit`, or the `.task` that started the work is cancelled",
          },
        },
      ],
    },
    {
      id: "di",
      title: "Dependency injection",
      prose: [
        "RN apps rarely use a DI framework. You import a module, or put an implementation in context so tests can swap it. Native codebases inject dependencies through constructors much more often, because it's how you test a `ViewModel` without a real network.",
        "On Android, the standard is **Hilt**, a compile-time DI framework built on Dagger. You annotate constructors with `@Inject`, declare bindings in a `@Module`, and Hilt generates the wiring. Koin is a popular lighter alternative that resolves dependencies at runtime. iOS has no official framework. Most apps pass dependencies through initializers and the environment, and that works fine.",
      ],
      snippet: "di",
      notes: {
        android: [
          "Hilt needs `@HiltAndroidApp` on your `Application` class and `@AndroidEntryPoint` on the Activity. Forget either and the app crashes on launch.",
          "`@Binds` maps an interface to an implementation. Use `@Provides` for things you build yourself, such as a Retrofit instance (Chapter 12).",
          "`hiltViewModel()` replaces `viewModel()` when the `ViewModel` has injected constructor parameters.",
          "With Koin, the same binding is `single<TodoRepository> { HttpTodoRepository(get()) }` and the screen uses `koinViewModel()`.",
        ],
        ios: [
          "Depending on a protocol (`any TodoRepository`) is what makes the fake possible. It's the Swift version of coding to an interface.",
          "The composition root is wherever you create the real objects, usually the `@main App`.",
          "Libraries like swift-dependencies or Factory add environment-style injection outside views, if manual wiring gets painful.",
        ],
      },
    },
    {
      id: "structure",
      title: "Folder structure & modularization",
      prose: [
        "Feature folders work the same way on native, and you should keep them. What's new is that both platforms let you split code into *compiled modules* with enforced boundaries. A feature module literally can't import another feature's internals unless you declare the dependency.",
        "Modules also speed up builds, because Gradle and Xcode only recompile what changed. Start with one app module and split it when build times or team boundaries start to hurt.",
      ],
      compare: [
        {
          label: "Feature code",
          values: {
            rn: "`src/features/todos/`",
            android: "Package `com.app.feature.todos`, later a Gradle module `:feature:todos`",
            ios: "Group `Features/Todos/`, later a local Swift package `TodosFeature`",
          },
        },
        {
          label: "Shared code",
          values: {
            rn: "`src/lib/`, or a workspace package",
            android: "`:core:data`, `:core:ui`, `:core:model` modules",
            ios: "Local Swift packages, such as `Core` and `DesignSystem`",
          },
        },
        {
          label: "Declaring deps",
          values: {
            rn: "Workspace `package.json` dependencies",
            android: "`implementation(project(\":core:data\"))` in `build.gradle.kts`",
            ios: "`dependencies:` in `Package.swift`",
          },
        },
        {
          label: "Visibility",
          values: {
            rn: "Anything exported is public. Lint rules can help.",
            android: "`internal` hides code outside its module",
            ios: "`internal` (the default) hides code outside its module. Use `public` to expose it.",
          },
        },
        {
          label: "Reference project",
          values: {
            rn: "Expo templates, Ignite",
            android: "Google's *Now in Android* sample",
            ios: "Apple sample code, Point-Free's *isowords*",
          },
        },
      ],
    },
  ],
  gotchas: [
    {
      title: "Never hold a Context or View in a ViewModel",
      body: "A `ViewModel` outlives the Activity it was created for. If it holds a reference to that Activity, its `Context`, or a view, the old screen can't be garbage-collected after rotation. If you need a `Context`, inject the application context instead.",
    },
    {
      title: "Composable-scoped state resets on rotation",
      body: "On Android, `remember` state is lost when the Activity is recreated, for example on rotation or a language change. Anything that should survive belongs in a `ViewModel` (or `rememberSaveable`, Chapter 5). RN devs get caught by this because JS state never resets on rotation.",
    },
    {
      title: "@State re-runs your model's init",
      body: "In `@State private var model = TodoStore()`, SwiftUI keeps the first instance, but it still evaluates `TodoStore()` every time the parent recreates the view struct. Keep the initializer cheap, and start loading in `.task` instead of `init`.",
    },
    {
      title: "No selectors needed with @Observable",
      body: "With Zustand you write selectors to avoid extra re-renders. `@Observable` tracks the properties each `body` actually read, so it updates only the views that need it. In Compose, collecting a big state object recomposes everything that reads it, but unchanged child calls get skipped (Chapter 7).",
    },
    {
      title: "StateFlow drops equal values",
      body: "`StateFlow` only emits when the new value isn't `==` the old one. If you mutate a `MutableList` in place and set it again, nothing happens. Always produce a new immutable value, the same rule as React state.",
    },
    {
      title: "Missing injection fails differently",
      body: "Hilt checks the graph at compile time, so a missing binding fails the build. Koin and SwiftUI's `.environment(object)` fail at runtime, the first time something asks for the missing value. Cover your composition root with a smoke test.",
    },
  ],
  cheatsheet: [
    { rn: "`createContext` + Provider", android: "`staticCompositionLocalOf` + `CompositionLocalProvider`", ios: "`@Entry` key + `.environment(\\.key, value)`" },
    { rn: "`useContext(Ctx)`", android: "`LocalX.current`", ios: "`@Environment(\\.key)`" },
    { rn: "Zustand / Redux store", android: "`ViewModel` + `StateFlow`", ios: "`@Observable` class" },
    { rn: "`useStore(selector)`", android: "`collectAsStateWithLifecycle()`", ios: "Read the property in `body`" },
    { rn: "`set((s) => …)`", android: "`_state.update { … }`", ios: "Mutate the property" },
    { rn: "`useReducer` + action union", android: "`sealed interface` actions + `when`", ios: "`enum` actions + `switch`" },
    { rn: "`{ ...state, x }`", android: "`state.copy(x = …)`", ios: "`var s = state; s.x = …`" },
    { rn: "Store per screen", android: "`viewModel()` / `hiltViewModel()`", ios: "`@State private var model = Model()`" },
    { rn: "Inject via context", android: "Hilt `@Inject` / Koin `get()`", ios: "Initializer + `.environment(object)`" },
    { rn: "Interface for a service", android: "`interface` + `@Binds`", ios: "`protocol` + `any Protocol`" },
    { rn: "Workspace package", android: "Gradle module", ios: "Local Swift package" },
    { rn: "Module-private code", android: "`internal`", ios: "`internal` (default)" },
  ],
  quiz: [
    {
      question: "An Android screen keeps its loaded todos in `remember { mutableStateOf(listOf<Todo>()) }`. The user rotates the phone. What happens?",
      options: [
        "Nothing; the list survives like it would in RN",
        "The Activity is recreated and the list resets, so it loads again",
        "The app crashes",
        "Compose pauses until the rotation finishes",
      ],
      answer: 1,
      explanation: "Rotation is a configuration change, so Android recreates the Activity and its composition. `remember` state is lost. A `ViewModel` survives configuration changes, which is why screen data belongs there.",
    },
    {
      question: "You need the signed-in `Session` deep in the tree on Android. It changes only on login and logout. What's the idiomatic tool?",
      options: [
        "A global `var session` in a Kotlin `object`",
        "`staticCompositionLocalOf<Session>` with `CompositionLocalProvider`",
        "Pass it through every composable as a parameter, no exceptions",
        "`LaunchedEffect` that reads it from disk in every screen",
      ],
      answer: 1,
      explanation: "A CompositionLocal is Compose's Context. The `static` variant suits values that rarely change, because it skips per-read tracking and recomposes the subtree on change.",
    },
    {
      question: "Your `ViewModel` holds `private val _items = MutableStateFlow(mutableListOf<Todo>())`. You call `_items.value.add(todo)`. Why doesn't the UI update?",
      options: [
        "`StateFlow` only works with `String` values",
        "You must call `notifyDataSetChanged()`",
        "The list object didn't change, so `StateFlow` has nothing to emit",
        "`collectAsStateWithLifecycle` is paused",
      ],
      answer: 2,
      explanation: "`StateFlow` emits when you assign a new value that isn't equal to the old one. Mutating in place keeps the same object. Use an immutable `List` and `_items.update { it + todo }`, just like you'd never mutate React state.",
    },
    {
      question: "A SwiftUI screen reads only `store.filter`. Another part of the app appends to `store.todos`. Does the screen's `body` re-run?",
      options: [
        "Yes, any change to an `@Observable` object updates every view that holds it",
        "No, `@Observable` tracks per property, and this view never read `todos`",
        "Only if you wrap the read in a selector",
        "Only if the store is an `ObservableObject`",
      ],
      answer: 1,
      explanation: "`@Observable` records which properties each `body` accessed, and updates only those views. Zustand needs selectors for this; the Swift macro does it for you. Older `ObservableObject` stores did update every observer on any `@Published` change.",
    },
    {
      question: "With Hilt, you forget to bind `TodoRepository` to an implementation. When do you find out?",
      options: [
        "At compile time; Hilt validates the dependency graph",
        "When the screen first opens",
        "Never; Hilt passes `null`",
        "Only in release builds",
      ],
      answer: 0,
      explanation: "Hilt and Dagger generate the graph at build time, so a missing binding is a build error. Runtime resolvers like Koin, or SwiftUI's `.environment(object)`, fail only when the missing value is first requested.",
    },
    {
      question: "Why does the guide split `TodoScreen` (reads the store) from `TodoList` (takes `todos` and `onToggle`)?",
      options: [
        "Compose and SwiftUI can't read a store inside a list",
        "So the list is stateless: easy to preview, test, and reuse with fake data",
        "It's required for `LazyColumn` performance",
        "Hilt can only inject into top-level composables",
      ],
      answer: 1,
      explanation: "This is state hoisting, the native name for the container/presentational split. The stateless half takes plain data and callbacks, so you can render it in a preview or test without building a real store.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "Rotating the phone empties the cart. Which line is the bug?",
      code: `@Composable
fun CartScreen() {
    val vm = remember { CartViewModel() }
    val items by vm.items.collectAsState()
    CartList(items, onRemove = vm::remove)
}`,
      answer: 3,
      explanation: "`remember` only lives as long as the composition, and a configuration change like rotation recreates the Activity. `viewModel()` gets the instance from the `ViewModelStore`, which survives that and is cleared only when the screen is gone for good.",
    },
    {
      kind: "bug",
      platform: "ios",
      question: "Every time the parent re-renders, the cart starts empty again. Which line is the bug?",
      code: `struct CartScreen: View {
    var body: some View {
        let model = CartModel()
        CartList(model: model)
    }
}`,
      answer: 3,
      explanation: "`body` runs on every update, so this builds a brand-new model each time, like calling `new Store()` inside a render function. Let the view own it: `@State private var model = CartModel()` with an `@Observable` class.",
    },
  ],
};
