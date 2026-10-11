import type { Chapter } from "../types";

export const effects: Chapter = {
  slug: "effects",
  title: "Side effects & lifecycle",
  intro: [
    "`useEffect` is how React components reach outside render: fetching data, starting timers, subscribing to events. Compose and SwiftUI have the same need and the same rule. Never do side effects in the body of a composable or in `body`. Use an effect API instead.",
    "The good news is that native effects are built on **coroutines** (Kotlin) and **structured concurrency** (Swift). Effects are async by default, and they're *cancelled automatically* when their key changes or the UI goes away. Most of the `let cancelled = false` and cleanup code you write in RN simply disappears.",
    "This chapter also covers app lifecycle (`AppState`), and the Android behavior most likely to surprise you: Activity recreation. Coroutines and Swift concurrency get a full treatment in Chapter 11.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "React runs an effect after commit, then runs its cleanup before the next run or on unmount. Native effects follow the same lifecycle, but the unit of work is an async task rather than a callback. When the effect is torn down, the task is cancelled, and any `await` or suspension point inside it stops.",
      ],
      compare: [
        {
          label: "Run on mount and when deps change",
          values: {
            rn: "`useEffect(fn, [a, b])`",
            android: "`LaunchedEffect(a, b) { … }`",
            ios: "`.task(id: a) { … }`",
          },
        },
        {
          label: "Run once on mount",
          values: {
            rn: "`useEffect(fn, [])`",
            android: "`LaunchedEffect(Unit) { … }`",
            ios: "`.task { … }`",
          },
        },
        {
          label: "Effect body is…",
          values: {
            rn: "A synchronous function. Async work is fire-and-forget.",
            android: "A suspend lambda (a coroutine)",
            ios: "An `async` closure (a Swift `Task`)",
          },
        },
        {
          label: "Cleanup",
          values: {
            rn: "Return a function",
            android: "Automatic cancellation, or `onDispose { }` in a `DisposableEffect`",
            ios: "Automatic cancellation, or `.onDisappear { }`",
          },
        },
        {
          label: "Mount / unmount means…",
          values: {
            rn: "The component enters / leaves the tree",
            android: "The composable enters / leaves the composition",
            ios: "The view appears / disappears on screen",
          },
        },
      ],
      callout:
        "\"Appears\" isn't \"mounted\" on iOS. A view pushed under another screen in a `NavigationStack`, or scrolled off a `List`, gets `onDisappear` and its `.task` is cancelled, even though the view still exists. Compose's effects follow the composition, which is closer to React.",
    },
    {
      id: "deps",
      title: "useEffect with deps → LaunchedEffect & .task(id:)",
      prose: [
        "Fetching when a prop changes is the classic effect. In RN you guard against stale responses yourself. On native, changing the key **cancels the previous run** before starting a new one, so a slow response for the old `userId` can never overwrite the new one.",
        "The keys play the same role as the dependency array. Compose takes any number of keys. SwiftUI's `.task(id:)` takes one `Equatable` value, so combine several into a tuple-like struct if you need to.",
      ],
      snippet: "fetch-on-change",
      notes: {
        rn: ["Without the `cancelled` flag, switching users quickly can show the wrong profile. That's the bug native cancellation prevents."],
        android: [
          "`fetchUser` is a `suspend fun`. You can call it directly inside `LaunchedEffect` because the block is already a coroutine.",
          "Kotlin can't smart-cast a delegated `var` (it could change between the check and the use), so copy it into a local `val` first.",
          "For loading data, a `ViewModel` is usually the better home (Chapter 10). It survives rotation, while a `LaunchedEffect` restarts.",
        ],
        ios: [
          "`.task(id:)` runs on the main actor, so assigning `user` directly is safe.",
          "Swift's `URLSession` checks for cancellation and throws `CancellationError`. The `if let … try?` pattern ignores both cancellation and failures.",
        ],
      },
    },
    {
      id: "cleanup",
      title: "Cleanup → cancellation",
      prose: [
        "`setInterval` plus `clearInterval` is the textbook cleanup case. On native, you write the loop as ordinary async code with a `delay` or `sleep`, and cancellation ends it. There's no handle to store and nothing to clear.",
        "This works because cancellation is *cooperative*. `delay` and `Task.sleep` check for it and stop. A tight loop that never suspends wouldn't be cancelled, but in UI code you rarely write one.",
      ],
      snippet: "interval",
      notes: {
        android: [
          "`while (true)` is safe here. `delay` throws `CancellationException` when the effect is cancelled, which ends the coroutine.",
          "`1_000` uses an underscore as a digit separator, like `1_000` in JS.",
        ],
        ios: [
          "`Task.sleep(for:)` throws when the task is cancelled. That's why the loop sits in `do`/`catch`.",
          "For a ticking clock, `TimelineView(.periodic(from: .now, by: 1))` redraws on a schedule without any state.",
        ],
      },
    },
    {
      id: "disposable",
      title: "Non-async cleanup → DisposableEffect & onDisappear",
      prose: [
        "Some effects aren't async at all: registering a listener, setting a flag, attaching a callback. For these, Compose has `DisposableEffect`, which is the closest thing to a `useEffect` that returns a cleanup function. Its block must end with `onDispose { }`.",
        "SwiftUI splits the same thing into `.onAppear` and `.onDisappear`. Remember that these follow *visibility*, not existence.",
      ],
      snippet: "keep-awake",
      notes: {
        android: [
          "`onDispose` is required. Forgetting it is a compile error, which is stricter than React.",
          "Keys work like `LaunchedEffect`: if `view` changed, the old effect is disposed and the new one runs.",
          "`LocalView.current` is the Android `View` hosting your composables. It's a common escape hatch to platform APIs.",
        ],
        ios: [
          "For async subscriptions, prefer `.task` with a `for await` loop over a notification sequence. Cancellation ends the loop, so there's nothing to unsubscribe.",
        ],
      },
    },
    {
      id: "events",
      title: "Async work in event handlers",
      prose: [
        "In RN you can make `onPress` an `async` function and it just works. On native, click handlers are ordinary synchronous lambdas, so you start async work explicitly.",
        "Compose gives you `rememberCoroutineScope()`, a scope tied to the composable. Launch from it in the handler, and the job is cancelled if the composable leaves. SwiftUI uses `Task { }`, which is *not* tied to the view, so it keeps running after the view disappears, the way an RN promise does.",
      ],
      snippet: "event-async",
      notes: {
        android: [
          "Don't use `LaunchedEffect` for event handling. Effects run because state changed, not because a user tapped something.",
          "Avoid `GlobalScope.launch`. It's never cancelled and leaks work. If the work must outlive the screen, run it in a `ViewModel`'s `viewModelScope`.",
        ],
        ios: [
          "A `Task` created from a view inherits the main actor, so updating `saving` is safe.",
          "`defer` runs when the scope exits, like `finally`.",
          "If you need cancel-on-disappear, store the task in `@State` and cancel it in `.onDisappear`, or drive the work from `.task(id:)`.",
        ],
      },
    },
    {
      id: "latest",
      title: "Stale callbacks & the latest value",
      prose: [
        "A long-running effect captures the values from the composition that started it. If a callback prop changes later, the effect still holds the old one. That's the same stale-closure problem React solves with a ref (or `useEffectEvent`).",
        "Compose's answer is `rememberUpdatedState`. It wraps a value in a state that is always current, so the effect can read the latest without restarting.",
      ],
      compare: [
        {
          label: "Read the latest callback in a long effect",
          values: {
            rn: "`const cb = useRef(onTimeout); cb.current = onTimeout`",
            android: "`val current by rememberUpdatedState(onTimeout)`",
            ios: "Usually not needed. Move the logic into an `@Observable` model the task reads from.",
          },
        },
        {
          label: "Turn state into a stream",
          values: {
            rn: "An effect that depends on the value",
            android: "`snapshotFlow { listState.firstVisibleItemIndex }` inside `LaunchedEffect`",
            ios: "`.onChange(of: value) { old, new in … }`",
          },
        },
        {
          label: "Run after every update",
          values: {
            rn: "`useEffect(fn)` (no deps)",
            android: "`SideEffect { … }`",
            ios: "Rarely needed. Use `.onChange(of:)` for the specific value.",
          },
        },
        {
          label: "Async value as state",
          values: {
            rn: "`useState` + `useEffect` fetch",
            android: "`val user by produceState<User?>(null, userId) { value = fetchUser(userId) }`",
            ios: "`@State` + `.task(id:)`",
          },
        },
      ],
    },
    {
      id: "app-state",
      title: "AppState → lifecycle & scenePhase",
      prose: [
        "RN's `AppState` has three values: `active`, `background`, and `inactive`. Android tracks lifecycle per screen with **Lifecycle** events (`ON_START`, `ON_RESUME`, `ON_PAUSE`, `ON_STOP`). In Compose you react to them with `LifecycleEventEffect`. SwiftUI exposes `scenePhase` in the environment, with the same `active`, `inactive`, and `background` values as RN.",
      ],
      snippet: "app-state",
      compare: [
        {
          label: "Foreground, interactive",
          values: { rn: "`'active'`", android: "`RESUMED` (`ON_RESUME`)", ios: "`.active`" },
        },
        {
          label: "Visible but not focused",
          values: { rn: "`'inactive'` (iOS only)", android: "`STARTED` (`ON_PAUSE`, e.g. a dialog from another app)", ios: "`.inactive` (app switcher, incoming call)" },
        },
        {
          label: "Not visible",
          values: { rn: "`'background'`", android: "`CREATED` (`ON_STOP`)", ios: "`.background`" },
        },
        {
          label: "Whole app, not one screen",
          values: { rn: "`AppState` is always app-wide", android: "`ProcessLifecycleOwner`", ios: "`scenePhase` read in your `App` struct" },
        },
      ],
      notes: {
        android: [
          "Unlike RN's `change` event, `ON_RESUME` also fires the first time the screen appears. Guard against it if you only want returns from background.",
          "Use `collectAsStateWithLifecycle()` for flows. It stops collecting when the app is in the background, which is the most common reason RN apps listen to `AppState`.",
        ],
        ios: [
          "`.onChange(of:)` doesn't fire for the initial value. Pass `initial: true` if you want it to.",
          "The two-parameter closure (`{ old, new in }`) is the iOS 17 form. The single-parameter form is deprecated.",
        ],
      },
    },
    {
      id: "recreation",
      title: "Activity recreation: why Android is different",
      prose: [
        "On Android, a **configuration change** (rotation, dark mode, language, font size, resizing on a foldable or in split screen) destroys the Activity and builds a new one. The entire composition is thrown away and rebuilt. Every `remember` resets, and every `LaunchedEffect` is cancelled and started again.",
        "RN hides this by declaring `configChanges` in the manifest, so the Activity survives and JS handles the change. Native apps usually embrace recreation instead, because the same restore path also covers **process death**. Put data loading in a `ViewModel` (which survives recreation), and UI input in `rememberSaveable` (which survives both). iOS has nothing comparable: rotation just re-runs `body`.",
      ],
      compare: [
        {
          label: "On rotation",
          values: {
            rn: "Nothing restarts. `Dimensions` updates.",
            android: "Activity recreated. `remember` lost, effects restart.",
            ios: "Size classes change and `body` re-runs. State and tasks continue.",
          },
        },
        {
          label: "What survives recreation",
          values: {
            rn: "Everything in JS",
            android: "`ViewModel`, `rememberSaveable`, `SavedStateHandle`",
            ios: "n/a",
          },
        },
        {
          label: "What survives process death",
          values: {
            rn: "Only what you persisted",
            android: "`rememberSaveable`, `SavedStateHandle`, and the navigation back stack",
            ios: "`@SceneStorage`, plus whatever you persisted",
          },
        },
      ],
      callout:
        "A `LaunchedEffect(Unit)` that fetches data will fetch again on every rotation. If that surprises your users or your backend, move the fetch into a `ViewModel`'s `init` or `viewModelScope`. Chapter 10 shows the pattern.",
    },
  ],
  gotchas: [
    {
      title: "Never start work in the body",
      body: "Calling `fetchUser()` directly in a composable or in `body` runs it on every recomposition or body evaluation, which can happen many times a second. That's the same as fetching in render in React, except native calls render far more often.",
    },
    {
      title: "Wrong keys, wrong behavior",
      body: "`LaunchedEffect(Unit)` never restarts, even when the `userId` it uses changes. That's the native version of a missing dependency, and there's no lint rule to catch it. List every value the effect reads that should restart it.",
    },
    {
      title: ".task stops when the view is covered",
      body: "Pushing a new screen onto a `NavigationStack` makes the old one disappear, which cancels its `.task`. When you come back, the task runs again. Plan for re-runs, or move long-lived work into a model.",
    },
    {
      title: "Task { } isn't cancelled for you",
      body: "SwiftUI's `.task` modifier is cancelled automatically, but a `Task { }` you create in a button action isn't. It's unstructured, and keeps running after the view goes away, like an RN promise.",
    },
    {
      title: "Rotation restarts effects on Android",
      body: "Recreation tears down the composition, so effects run again and `remember` resets. Use a `ViewModel` for loading and `rememberSaveable` for input.",
    },
    {
      title: "ON_RESUME fires on first display",
      body: "RN's `AppState` `change` event only fires on transitions. `LifecycleEventEffect(ON_RESUME)` also fires when the screen first appears, and when you return from another Activity like the camera or a permission dialog.",
    },
  ],
  cheatsheet: [
    { rn: "`useEffect(fn, [a])`", android: "`LaunchedEffect(a) { … }`", ios: "`.task(id: a) { … }`" },
    { rn: "`useEffect(fn, [])`", android: "`LaunchedEffect(Unit) { … }`", ios: "`.task { … }`" },
    { rn: "Cleanup function", android: "Cancellation / `onDispose { }`", ios: "Cancellation / `.onDisappear { }`" },
    { rn: "Listener add/remove", android: "`DisposableEffect(key) { …; onDispose { … } }`", ios: "`.onAppear` / `.onDisappear`" },
    { rn: "`let cancelled = false`", android: "Not needed", ios: "Not needed" },
    { rn: "`setInterval`", android: "`while (true) { delay(1000) }`", ios: "`while true { try await Task.sleep(…) }`" },
    { rn: "`async` onPress", android: "`scope.launch { }` from `rememberCoroutineScope()`", ios: "`Task { }`" },
    { rn: "Latest-callback ref", android: "`rememberUpdatedState(cb)`", ios: "Read from a model" },
    { rn: "Effect on value change", android: "`snapshotFlow { }` / keyed `LaunchedEffect`", ios: "`.onChange(of:)`" },
    { rn: "`useEffect(fn)` (every render)", android: "`SideEffect { }`", ios: "Avoid" },
    { rn: "`AppState` change", android: "`LifecycleEventEffect(Lifecycle.Event.ON_RESUME)`", ios: "`@Environment(\\.scenePhase)` + `.onChange`" },
    { rn: "App-wide lifecycle", android: "`ProcessLifecycleOwner`", ios: "`scenePhase` in `App`" },
    { rn: "Rotation (no-op in RN)", android: "Activity recreated", ios: "`body` re-runs" },
  ],
  quiz: [
    {
      question: "A Compose screen shows a user profile with `LaunchedEffect(Unit) { user = fetchUser(userId) }`. The parent changes `userId`. What happens?",
      options: [
        "The effect re-runs with the new `userId`",
        "Nothing. The key `Unit` never changes, so the old profile stays on screen.",
        "The app crashes because `userId` changed",
        "Compose warns about missing dependencies at compile time",
      ],
      answer: 1,
      explanation: "Keys are the dependency array. Use `LaunchedEffect(userId)`. There's no exhaustive-deps lint for effect keys, so you have to get this right yourself.",
    },
    {
      question: "With `LaunchedEffect(userId)`, the user switches profiles quickly and the first request is slow. Which profile ends up on screen?",
      options: [
        "Whichever response arrives last",
        "The latest `userId`. Changing the key cancels the previous coroutine before starting a new one.",
        "Both, one after another",
        "The first one, because effects are queued",
      ],
      answer: 1,
      explanation: "Restarting a keyed effect cancels the old run, so the stale response is never applied. In RN you'd need a `cancelled` flag or an `AbortController` to get the same guarantee.",
    },
    {
      question: "In SwiftUI, a list screen loads data in `.task { }`. The user taps a row, a detail screen is pushed, then they go back. What happens to the task?",
      options: [
        "It ran once and never runs again",
        "It was cancelled when the list disappeared, and runs again when it reappears",
        "It keeps running in the background the whole time",
        "It's paused and resumed where it left off",
      ],
      answer: 1,
      explanation: "`.task` follows appear and disappear, not mount and unmount. Being covered by a pushed screen counts as disappearing. Make the load idempotent, or keep the data in a model that outlives the view.",
    },
    {
      question: "Which Compose API is the right fit for registering a listener and unregistering it later?",
      options: ["`LaunchedEffect`", "`SideEffect`", "`DisposableEffect` with `onDispose { }`", "`remember { }`"],
      answer: 2,
      explanation: "`DisposableEffect` is for non-suspending setup with a matching teardown, just like returning a cleanup function from `useEffect`. The compiler requires the `onDispose` block.",
    },
    {
      question: "A Compose button needs to call a `suspend fun save()`. What do you do inside `onClick`?",
      options: [
        "Call `save()` directly",
        "Wrap it in `LaunchedEffect(Unit) { save() }`",
        "Call `scope.launch { save() }` with a scope from `rememberCoroutineScope()`",
        "Use `runBlocking { save() }`",
      ],
      answer: 2,
      explanation: "Click handlers aren't coroutines, and you can't call composables like `LaunchedEffect` from them. A remembered scope launches the work and cancels it if the composable leaves. `runBlocking` would freeze the UI.",
    },
    {
      question: "Your Android screen refetches its data every time the user rotates the phone. Why?",
      options: [
        "`LaunchedEffect` always runs on layout changes",
        "Rotation recreates the Activity, so the composition is rebuilt and the effect runs again",
        "The network library retries on rotation",
        "Compose re-runs every effect on recomposition",
      ],
      answer: 1,
      explanation: "Configuration changes destroy and recreate the Activity by default. Load data in a `ViewModel`, which survives recreation, instead of in a composable effect.",
    },
    {
      kind: "predict",
      platform: "android",
      question: "The user types `a`, then `ab` 100 ms later, then stops typing. What prints?",
      code: `@Composable
fun SearchResults(query: String) {
    LaunchedEffect(query) {
        delay(300)
        println("search $query")
    }
}`,
      options: [
        "`search a`, then `search ab`",
        "Only `search ab`",
        "`search ab` twice",
        "Nothing. The effect only ran on first composition.",
      ],
      answer: 1,
      explanation: "A new key cancels the running coroutine while it's suspended in `delay`, then starts a fresh one. That's a free debounce. In RN you'd need `setTimeout` plus a `clearTimeout` cleanup in `useEffect` to get the same thing.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "This composable logs every time the screen resumes. Which line is the bug?",
      code: `@Composable
fun ResumeLogger() {
    val owner = LocalLifecycleOwner.current
    DisposableEffect(owner) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) {
                Log.d("Screen", "resumed")
            }
        }
        owner.lifecycle.addObserver(observer)
        onDispose { }
    }
}`,
      answer: 11,
      explanation: "`onDispose` is the cleanup function you'd return from `useEffect`. Leaving it empty keeps the observer registered after the composable leaves, so it leaks and keeps logging. It should be `onDispose { owner.lifecycle.removeObserver(observer) }`.",
    },
    {
      kind: "order",
      question: "An Android Activity opens, then the user presses Back to close it. Put its lifecycle callbacks in the order they run.",
      items: [
        "`onCreate`",
        "`onStart`",
        "`onResume`",
        "`onPause`",
        "`onStop`",
        "`onDestroy`",
      ],
      explanation: "Going up: created, started (visible), resumed (interactive). Leaving reverses it: paused, stopped, destroyed. Compose's `Lifecycle.Event.ON_*` values follow the same order, so `ON_RESUME` is the closest match to RN's `AppState` becoming `active`.",
    },
  ],
};
