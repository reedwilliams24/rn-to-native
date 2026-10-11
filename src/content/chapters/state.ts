import type { Chapter } from "../types";

export const state: Chapter = {
  slug: "state",
  title: "State",
  intro: [
    "`useState` is the heart of a React component, and both native frameworks have a direct equivalent: `remember { mutableStateOf(…) }` in Compose and `@State` in SwiftUI. Reading state during render subscribes you to it, and writing it schedules an update. That part will feel familiar.",
    "The differences are in the details. There's no setter function, because you assign the value directly. The framework tracks *which* code read a value, so it can update less than React would. And on Android, a screen rotation can wipe state that RN never lost.",
    "This chapter covers local UI state. Shared app state (Context, Redux, Zustand) is Chapter 10.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "In React, state lives in a hook slot that belongs to a component instance. Native works the same way. Compose stores remembered values at the call site's position in the composition. SwiftUI stores `@State` outside the struct, tied to the view's identity in the tree. In both cases, the function or struct is rebuilt all the time but the state outlives it.",
        "The update model is finer-grained than React's. React re-renders the whole component whenever its state changes. Compose and SwiftUI record which values were *read* while building the UI, and only re-run the code that read the value that changed.",
      ],
      compare: [
        {
          label: "Declare state",
          values: {
            rn: "`const [x, setX] = useState(0)`",
            android: "`var x by remember { mutableStateOf(0) }`",
            ios: "`@State private var x = 0`",
          },
        },
        {
          label: "Write",
          values: {
            rn: "`setX(1)` or `setX(prev => prev + 1)`",
            android: "`x = 1` / `x++`",
            ios: "`x = 1` / `x += 1`",
          },
        },
        {
          label: "When the write lands",
          values: {
            rn: "On the next render (batched)",
            android: "Immediately. The new value is readable on the next line, and recomposition happens before the next frame.",
            ios: "Immediately. The new value is readable on the next line, and `body` re-runs before the next frame.",
          },
        },
        {
          label: "What re-runs",
          values: {
            rn: "The component and, by default, its children",
            android: "Only the composable scopes that *read* the state",
            ios: "Only the views whose `body` *read* the state",
          },
        },
        {
          label: "Where it's stored",
          values: {
            rn: "The component's fiber",
            android: "The composition, at the call site's position",
            ios: "SwiftUI's storage, keyed by the view's identity",
          },
        },
      ],
      callout:
        "No stale closures. Because writes land immediately and you read the variable directly, `count++` twice in one handler gives you `+2`. The `setCount(c => c + 1)` updater pattern isn't needed on native.",
    },
    {
      id: "what-reruns",
      title: "See it: what re-runs, and what keeps its state",
      prose: [
        "**React** re-renders the component that owns the changed state and, by default, everything below it. As the docs put it, \"React normally re-renders a component whenever its parent re-renders.\" Wrapping a child in `memo` skips it when every prop is `Object.is`-equal to last time ([React: memo](https://react.dev/reference/react/memo)).",
        "**Compose** re-runs the composables that read the changed state, and skips a child whose inputs haven't changed ([Compose: lifecycle, skipping](https://developer.android.com/develop/ui/compose/lifecycle#skipping)). Without strong skipping, a parameter of an unstable type makes the composable non-skippable, and `List`, `Set` and `Map` count as unstable ([Compose: stability](https://developer.android.com/develop/ui/compose/performance/stability)). Strong skipping is on by default from Kotlin 2.0.20. It compares unstable parameters by instance (`===`) and stable ones with `equals()` ([Compose: strong skipping](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)).",
        "**SwiftUI** treats a view's inputs and its `@State` and environment as its dependencies, and re-runs `body` only for views \"that have new values or other changed dependencies\" ([WWDC23: Demystify SwiftUI performance](https://developer.apple.com/videos/play/wwdc2023/10160/)).",
        "State is tied to *identity*, and that's where RN habits break. React keeps state for the same component type at the same position, so `isFancy ? <Counter isFancy /> : <Counter />` keeps the count ([React: preserving and resetting state](https://react.dev/learn/preserving-and-resetting-state)). Compose identifies each instance by its *call site*, so the calls in `if` and `else` are two different instances ([Compose: lifecycle](https://developer.android.com/develop/ui/compose/lifecycle)). SwiftUI treats each branch of an `if` as a different view with a distinct identity, which can lose state ([WWDC21: Demystify SwiftUI](https://developer.apple.com/videos/play/wwdc2021/10022/)). On both native platforms the fix is one call with a conditional argument or modifier.",
      ],
      diagram: "recomposition",
      callout:
        "To check this in a real app, Android Studio's Layout Inspector shows recomposition and skip counts per composable, and Instruments has a SwiftUI template that records `body` evaluations.",
    },
    {
      id: "use-state",
      title: "useState → remember / @State",
      prose: [
        "Here's the counter, the hello world of state. In Compose, `mutableStateOf` creates an observable box and `remember` keeps the same box across recompositions. Without `remember`, the box would be recreated, and reset, on every recomposition. In SwiftUI, the `@State` property wrapper does both jobs.",
      ],
      snippet: "counter",
      notes: {
        android: [
          "`by` is Kotlin *property delegation*. It lets you read and write `count` directly instead of `count.value`.",
          "`mutableIntStateOf`, `mutableFloatStateOf` and friends avoid boxing primitives. `mutableStateOf(0)` works too, and lint will suggest the specialized version.",
          "The `by` delegate needs `import androidx.compose.runtime.getValue` and `setValue`. Android Studio adds them, but it's a common first compile error.",
        ],
        ios: [
          "Mark `@State` `private`. It's owned by this view, and making it private stops callers from passing in a value that would be ignored after the first render.",
          "`@State` is for value types (`Int`, `String`, structs) and for `@Observable` classes (Chapter 10).",
        ],
      },
    },
    {
      id: "hoisting",
      title: "Lifting state → hoisting & @Binding",
      prose: [
        "Lifting state up works just like in React. In Compose it's called **state hoisting**: the child takes a `value` and an `onValueChange` callback, and the parent owns the state. Most Material components (`Switch`, `TextField`, `Checkbox`) follow this exact shape.",
        "SwiftUI adds a shortcut: a **`@Binding`** is a two-way reference to state owned by someone else. The parent passes `$notifications`, and the child reads and writes it as if it were its own. It's like passing `value` and `onChange` as a single prop.",
      ],
      snippet: "hoisting",
      notes: {
        android: [
          "Hoisted composables are *stateless*, which makes them easy to preview and test. A common pattern is a stateless `SettingRow` plus a thin stateful wrapper.",
          "Compose has no binding type. You always pass value and callback separately, exactly as you do in RN.",
        ],
        ios: [
          "`$name` is the *projected value* of a property wrapper. On `@State` it gives you a `Binding`.",
          "You can still use callbacks in SwiftUI. Use a `@Binding` when the child edits the value, and a closure when it just reports an event.",
          "In previews, `.constant(true)` creates a binding that ignores writes.",
        ],
      },
    },
    {
      id: "objects",
      title: "Objects, arrays & immutability",
      prose: [
        "React wants you to replace objects and arrays, not mutate them, and Compose agrees. A `mutableStateOf` box only notices when you *assign a new value*. Mutating a `MutableList` inside it changes nothing on screen. Use read-only `List`s and `data class`es, and build new ones with `+`, `map`, and `copy()`, the same way you'd use spreads in JS.",
        "Swift turns this around. Arrays and structs are *value types*, so mutating one in place (`todos.append(…)`, `todos[0].done = true`) produces a new value as far as SwiftUI is concerned. You write the mutable-looking code, and you get immutable semantics for free.",
      ],
      snippet: "objects",
      notes: {
        rn: ["`{ ...t, done: !t.done }` is the pattern that `copy()` and Swift structs replace."],
        android: [
          "`it.copy(done = !it.done)` is a `data class` feature that copies with some fields changed.",
          "`mutableStateListOf<Todo>()` is an observable list you *can* mutate in place (`add`, `removeAt`). It's handy, but mixing the two styles is a common source of bugs.",
          "`onCheckedChange = null` makes the `Checkbox` display-only, so the row's `clickable` handles taps.",
        ],
        ios: [
          "`ForEach($todos) { $todo in … }` hands each row a `Binding` to its element, so `Toggle` can flip `done` directly.",
          "This only works with `struct`s. If `Todo` were a `class`, mutating a property wouldn't change the array's value and the UI wouldn't update (unless the class is `@Observable`).",
        ],
      },
    },
    {
      id: "derived",
      title: "useMemo → remember(key) & computed properties",
      prose: [
        "Derived values work the way they do in React: compute them during render, and only cache them when the work is expensive. Compose's `remember(key1, key2) { … }` is `useMemo` with a dependency list. When a key changes, the block re-runs.",
        "SwiftUI has no `useMemo`. Write a computed property and keep it cheap. If it's genuinely expensive, move the work into a model (Chapter 10) or compute it once in `.task` / `.onChange` and store it in `@State`.",
      ],
      snippet: "derived",
      notes: {
        android: [
          "`derivedStateOf` solves a different problem: a value that changes *less often* than its input. `val showTop by remember { derivedStateOf { listState.firstVisibleItemIndex > 0 } }` recomposes when the Boolean flips, not on every scroll pixel.",
          "Don't wrap cheap work in `remember`. It costs memory and makes the code harder to read, just like over-using `useMemo`.",
        ],
        ios: [
          "`localizedStandardContains` is case- and diacritic-insensitive, which is what a search box usually wants.",
          "A computed property is re-evaluated each time `body` reads it. If `body` reads it twice, it runs twice, so bind it to a `let` inside `body` if that matters.",
        ],
      },
    },
    {
      id: "refs",
      title: "useRef → non-state values",
      prose: [
        "`useRef` gives you a mutable box that survives re-renders but doesn't trigger them. In Compose, `remember { … }` of a plain object (not `State`) does exactly that. In SwiftUI, the equivalent is `@State` holding a non-observable class: SwiftUI keeps the same instance, but writing to its properties isn't tracked.",
        "Don't use a plain `var` on a SwiftUI view for this. The struct is recreated whenever its parent's `body` runs, so a plain property is reset to its initial value, and you can't mutate it from `body` anyway.",
      ],
      snippet: "refs",
      notes: {
        rn: ["`useRef` is also how RN gets a handle to a component (`inputRef.current.focus()`). Native handles that with dedicated APIs like `FocusRequester` and `@FocusState` (Chapter 8) and `LazyListState` (Chapter 7)."],
        android: [
          "Compose only tracks reads that happen *during composition*. Reading a `State` inside an `onClick` lambda doesn't subscribe to it, so even `mutableStateOf` would work here. A plain `Ref` makes the intent obvious.",
          "Timers and jobs usually belong in an effect (Chapter 6), not a ref.",
        ],
        ios: [
          "`final class` stops subclassing. It's the default choice for small reference types.",
          "SwiftUI evaluates the `@State` initial value every time the view struct is created, but only uses it the first time. Avoid expensive initializers here.",
        ],
      },
    },
    {
      id: "saveable",
      title: "Surviving rotation & process death",
      prose: [
        "This is the biggest surprise in the chapter. By default, Android **destroys and recreates the Activity** on configuration changes: rotation, dark mode toggles, language changes, and window resizing. Everything held in `remember` is lost. RN apps don't see this because the RN template opts out of recreation in the manifest.",
        "`rememberSaveable` fixes it. It saves the value into the Activity's saved-instance `Bundle`, which also survives *process death*: the system killing your backgrounded app to reclaim memory and restoring it when the user returns. iOS doesn't recreate views on rotation, so `@State` survives. For process death, `@SceneStorage` gives you the same restore behavior.",
      ],
      snippet: "saveable",
      compare: [
        {
          label: "Survives recomposition / body",
          values: {
            rn: "`useState`",
            android: "`remember`",
            ios: "`@State`",
          },
        },
        {
          label: "Survives rotation",
          values: {
            rn: "`useState` (Activity isn't recreated)",
            android: "`rememberSaveable`, or a `ViewModel`",
            ios: "`@State`",
          },
        },
        {
          label: "Survives process death",
          values: {
            rn: "Only what you persist yourself",
            android: "`rememberSaveable`, or `SavedStateHandle` in a `ViewModel`",
            ios: "`@SceneStorage`",
          },
        },
        {
          label: "Survives app restart",
          values: {
            rn: "AsyncStorage / MMKV",
            android: "DataStore / Room (Chapter 13)",
            ios: "`@AppStorage` / SwiftData (Chapter 13)",
          },
        },
      ],
      notes: {
        android: [
          "`rememberSaveable` handles primitives, `String`s, and `Parcelable` types automatically. For anything else, give it a custom `Saver`.",
          "Keep saved state small, such as IDs, text, and scroll positions. The Bundle has a size limit, and exceeding it crashes the app.",
          "Test it: Developer options → *Don't keep activities*, or rotate the emulator.",
        ],
        ios: [
          "`@SceneStorage` supports simple types such as `String`, `Int`, `Bool`, and `URL`. Key names are per scene, so two windows on iPad keep separate values.",
          "Don't use it for sensitive data. Use the Keychain (Chapter 13).",
        ],
      },
    },
    {
      id: "observable",
      title: "State in a class",
      prose: [
        "When state outgrows a component, RN reaches for a custom hook or a store. Native moves it into a class: a `ViewModel` exposing `StateFlow` on Android, and an `@Observable` class on iOS. These get the same fine-grained tracking as local state, so a view only updates when a property it read changes.",
        "This is the main topic of Chapter 10. For now, know the rule of thumb: keep UI-only state (is this menu open?) in the composable or view, and move anything that's business logic, or needs to outlive the screen, into a model.",
      ],
      compare: [
        {
          label: "Custom hook / store",
          values: {
            rn: "`useTodos()` or a Zustand store",
            android: "`class TodosViewModel : ViewModel()` with `StateFlow`",
            ios: "`@Observable final class TodosModel`",
          },
        },
        {
          label: "Read it in UI",
          values: {
            rn: "`const { todos } = useTodos()`",
            android: "`val todos by vm.todos.collectAsStateWithLifecycle()`",
            ios: "`model.todos` (tracked automatically)",
          },
        },
        {
          label: "Own it in a view",
          values: {
            rn: "`useState(() => createStore())`",
            android: "`viewModel()` / `hiltViewModel()`",
            ios: "`@State private var model = TodosModel()`",
          },
        },
      ],
    },
  ],
  gotchas: [
    {
      title: "mutableStateOf without remember resets every time",
      body: "`var count by mutableStateOf(0)` without `remember` creates a fresh box on each recomposition, so the counter snaps back to zero. Android Studio flags it, but it's the most common first bug.",
    },
    {
      title: "Mutating a list in a state box does nothing",
      body: "`mutableStateOf(mutableListOf<Todo>())` followed by `todos.add(x)` doesn't trigger recomposition, because the box still holds the same list. Assign a new list, or use `mutableStateListOf`.",
    },
    {
      title: "Rotation wipes remember on Android",
      body: "The Activity is recreated on configuration changes. Use `rememberSaveable` for user input and scroll position, and a `ViewModel` for loaded data. RN hid this from you.",
    },
    {
      title: "@State is only read from init once",
      body: "If a parent passes a new value into a child's `@State` through `init`, the child ignores it after the first render. That's the same as copying a prop into `useState` in React. Use a plain `let` or a `@Binding` instead.",
    },
    {
      title: "Classes in @State don't update the UI",
      body: "SwiftUI tracks value changes. Mutating a property on a plain `class` held in `@State` isn't a new value, so `body` won't re-run. Use a `struct`, or mark the class `@Observable`.",
    },
    {
      title: "Writes are synchronous",
      body: "On native, the new value is visible on the very next line. Code that relied on React's \"state updates on the next render\" behavior, such as reading the old value after a `setX`, now behaves differently.",
    },
  ],
  cheatsheet: [
    { rn: "`useState(0)`", android: "`remember { mutableIntStateOf(0) }`", ios: "`@State private var x = 0`" },
    { rn: "`setX(v)`", android: "`x = v`", ios: "`x = v`" },
    { rn: "`setX(p => p + 1)`", android: "`x++`", ios: "`x += 1`" },
    { rn: "`value` + `onChange` props", android: "`value` + `onValueChange` params", ios: "`@Binding var value`" },
    { rn: "Pass state to child", android: "Pass value + lambda", ios: "Pass `$x`" },
    { rn: "Constant binding in a story", android: "Pass a literal + `{}`", ios: "`.constant(value)`" },
    { rn: "`{ ...obj, a: 1 }`", android: "`obj.copy(a = 1)`", ios: "`obj.a = 1` (struct)" },
    { rn: "`[...arr, x]`", android: "`list + x`", ios: "`arr.append(x)`" },
    { rn: "`useMemo(fn, [a, b])`", android: "`remember(a, b) { … }`", ios: "Computed property" },
    { rn: "Value that changes less than its input", android: "`derivedStateOf { … }`", ios: "Store it in `@State` via `.onChange`" },
    { rn: "`useRef(x)`", android: "`remember { Ref(x) }`", ios: "`@State` holding a plain class" },
    { rn: "Survive process death", android: "`rememberSaveable`", ios: "`@SceneStorage`" },
    { rn: "Custom hook / store", android: "`ViewModel` + `StateFlow`", ios: "`@Observable` class" },
  ],
  exercises: [
    {
      id: "like-button",
      title: "Lift a like toggle",
      prompt: "The parent owns `liked` and the child flips it. Translate the state and the callback.",
      blanks: {
        android: [
          { hint: "The Kotlin function type for a callback that takes nothing and returns nothing: TypeScript's `() => void`.", distractors: ["() => void", "Unit -> ()", "(Unit) -> Void"] },
          { hint: "The delegation keyword that lets you read and assign `liked` directly instead of `liked.value`.", distractors: ["=", "as", "get"] },
          { hint: "Keeps the state across recompositions, the way `useState` keeps its value across renders.", distractors: ["useState", "lazy", "derivedStateOf"] },
          { hint: "There's no setter. Assign the new value straight to the variable.", distractors: ["setLiked(!liked)", "liked.toggle()", "liked.value = !liked"] },
        ],
        ios: [
          { hint: "The child reads *and writes* the parent's state. One property wrapper replaces the `liked` + `onToggle` prop pair.", distractors: ["@State", "@Published", "@Environment"] },
          { hint: "Flip the `Bool` in place. `Bool` has a method for exactly this.", distractors: ["setLiked(!liked)", "$liked.toggle()", "liked = !$liked"] },
          { hint: "The property wrapper for state the view owns: SwiftUI's `useState`.", distractors: ["@Binding", "@Published", "@StateObject"] },
          { hint: "Prefix the state with `$` to pass a `Binding` instead of a copy of the value.", distractors: ["liked", "&liked", "@liked"] },
        ],
      },
    },
  ],
  quiz: [
    {
      question: "A Compose counter always shows 0, even though the button runs `count++`. The code is `var count by mutableStateOf(0)`. What's wrong?",
      options: [
        "`count++` doesn't work on delegated properties",
        "It isn't wrapped in `remember`, so a new state box is created on every recomposition",
        "It should use `mutableIntStateOf`",
        "The `Text` needs a `key`",
      ],
      answer: 1,
      explanation: "`mutableStateOf` creates the observable box. `remember` keeps the same box across recompositions. Without it, each recomposition starts from 0 again.",
    },
    {
      question: "In Compose, `todos` is `remember { mutableStateOf(mutableListOf<Todo>()) }`. You call `todos.value.add(newTodo)`. What happens?",
      options: [
        "The list updates on screen",
        "Nothing on screen. The state box still holds the same list object, so no change is detected.",
        "It crashes with a concurrent modification error",
        "It recomposes twice",
      ],
      answer: 1,
      explanation: "Compose notices *assignments* to the box. Assign a new list (`todos.value = todos.value + newTodo`) or use `mutableStateListOf`, which is observable itself. It's the same rule as not mutating arrays in React state.",
    },
    {
      question: "A user types into a search field on Android, rotates the phone, and the text disappears. The field uses `remember { mutableStateOf(\"\") }`. What's the smallest fix?",
      options: [
        "Add `android:configChanges` to every Activity",
        "Switch to `rememberSaveable { mutableStateOf(\"\") }`",
        "Store the text in a global `object`",
        "Use `LaunchedEffect` to restore it",
      ],
      answer: 1,
      explanation: "Rotation recreates the Activity and drops `remember`ed state. `rememberSaveable` writes to the saved-instance Bundle, so it survives rotation and process death. Opting out of recreation, the way RN does, is possible but hides problems that still appear after process death.",
    },
    {
      question: "A SwiftUI child view needs to toggle a Boolean owned by its parent. What should the child declare?",
      options: [
        "`@State var isOn: Bool`",
        "`@Binding var isOn: Bool`",
        "`let isOn: Bool`",
        "`@Environment var isOn: Bool`",
      ],
      answer: 1,
      explanation: "A `@Binding` reads and writes state owned elsewhere, and the parent passes `$isOn`. A `@State` would make a private copy that's disconnected from the parent after the first render.",
    },
    {
      question: "What does this SwiftUI handler show? `Button(\"Go\") { count += 1; print(count) }` when `count` starts at 0.",
      options: ["0", "1", "It depends on batching", "It doesn't compile"],
      answer: 1,
      explanation: "State writes land immediately on native, so the next line reads the new value. In React, `setCount(count + 1); console.log(count)` would log the old value.",
    },
    {
      question: "You need a value that survives re-renders but must *not* cause a re-render when it changes, like RN's `useRef`. Which SwiftUI option works?",
      options: [
        "A plain `var` stored property on the view struct",
        "`@State` holding an instance of a plain (non-`@Observable`) class",
        "`@Binding` to a constant",
        "A computed property",
      ],
      answer: 1,
      explanation: "`@State` keeps the same instance for the view's lifetime, and SwiftUI doesn't track property writes on a plain class. A stored `var` on the struct is reset whenever the parent re-creates the view.",
    },
    {
      kind: "predict",
      platform: "android",
      question: "`Screen` is on display. You tap the button once. What prints?",
      code: `@Composable
fun Screen() {
    var count by remember { mutableIntStateOf(0) }
    println("Screen")
    Header("Todos")
    Button(onClick = { count++ }) {
        println("Button content")
        Text("Tapped $count times")
    }
}

@Composable
fun Header(title: String) {
    println("Header")
    Text(title)
}`,
      options: [
        "`Screen`, `Header`, `Button content`",
        "`Screen`, `Button content`",
        "Only `Button content`",
        "Nothing. Writing state in `onClick` doesn't recompose.",
      ],
      answer: 2,
      explanation: "Compose tracks state *reads* per composable scope. `count` is only read inside the `Button` content lambda, so only that lambda re-runs. Even if `Screen` re-ran, `Header` would be skipped because `title` didn't change. React would re-render `Screen` and `Header` unless you add `memo`.",
    },
    {
      kind: "bug",
      platform: "ios",
      question: "Tapping the button never updates its label. Which line is the bug?",
      code: `class Cart {
    var count = 0
}

struct CartButton: View {
    @State private var cart = Cart()

    var body: some View {
        Button("Add (\\(cart.count))") {
            cart.count += 1
        }
    }
}`,
      answer: 1,
      explanation: "SwiftUI only sees property changes on classes marked `@Observable` (iOS 17). `@State` keeps the same `Cart` instance, and `count += 1` changes it without telling SwiftUI. Use `@Observable class Cart`, or make `Cart` a `struct` so writes count as a new value.",
    },
    {
      kind: "order",
      question: "In Compose, put the steps after a tap on a counter button in order.",
      items: [
        "`onClick` runs and writes `count++`",
        "Compose marks the scopes that read `count` as invalid",
        "On the next frame, only those scopes recompose",
        "Layout measures and places anything that changed",
        "Drawing renders the new frame",
      ],
      explanation: "Writing state doesn't re-run anything right away. It invalidates the scopes that read it, and the next frame runs the three phases: composition, then layout, then drawing. That's why `count` already holds the new value on the line after `count++`, unlike React's `setState`.",
    },
  ],
};
