import type { Chapter } from "../types";

export const async: Chapter = {
  slug: "async",
  title: "Async & concurrency",
  intro: [
    "JavaScript gives you one thread and an event loop. You never think about which thread your code runs on, because there's only one. Kotlin and Swift have real threads, so concurrency is a bigger topic. Luckily, both languages hide most of it behind syntax that feels a lot like `async`/`await`.",
    "Kotlin has **coroutines**: `suspend` functions, scopes that own them, and dispatchers that pick a thread. Swift has **Swift concurrency**: `async` functions, tasks, and actors such as `@MainActor`. Both are *structured*, which means every piece of async work has an owner that cancels it. That's the part with no real JS equivalent, and the part that removes a whole class of RN bugs.",
    "This chapter uses the plain language features. Chapter 12 applies them to networking.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "A JS `Promise` starts running as soon as you create it, and nobody owns it. If the component unmounts, the promise keeps going and resolves into the void. Coroutines and Swift tasks always run inside a *scope*. When the scope ends, its work is cancelled.",
      ],
      compare: [
        {
          label: "An async function is…",
          values: {
            rn: "`async function f(): Promise<T>`",
            android: "`suspend fun f(): T`",
            ios: "`func f() async throws -> T`",
          },
        },
        {
          label: "Waiting for it",
          values: {
            rn: "`await f()`",
            android: "Just call `f()`. The compiler knows it suspends.",
            ios: "`try await f()`",
          },
        },
        {
          label: "Starting work from sync code",
          values: {
            rn: "Call it and drop the promise",
            android: "`scope.launch { … }`",
            ios: "`Task { … }` or the `.task` modifier",
          },
        },
        {
          label: "Who owns the work",
          values: {
            rn: "Nobody",
            android: "A `CoroutineScope` (`viewModelScope`, composition, …)",
            ios: "The parent task, or the view for `.task`",
          },
        },
        {
          label: "Threads",
          values: {
            rn: "One JS thread (plus native threads you don't see)",
            android: "Main thread + thread pools, chosen by a `Dispatcher`",
            ios: "Main actor + a cooperative thread pool",
          },
        },
      ],
    },
    {
      id: "promise",
      title: "Promise → suspend fun / async func",
      prose: [
        "A `suspend fun` is Kotlin's `async function`. It can pause without blocking a thread. Calling it looks like a normal call, with no `await` keyword. Swift is closer to JS: you mark the function `async` and write `await` at each call. Swift also makes failure explicit with `throws` and `try`.",
        "There's one rule RN doesn't have: you can only call suspend or async functions from other async code. In plain code, like a click handler, you have to *start* a coroutine or task first.",
      ],
      snippet: "promise",
      notes: {
        rn: ["Nothing stops you calling `loadProfile()` without `await`. It runs anyway, and a rejection becomes an unhandled promise."],
        android: [
          "Android Studio marks each suspending call with an arrow in the gutter. That's your `await`.",
          "Kotlin has no checked exceptions, so nothing forces a `try`. Catch specific types such as `IOException`, not every `Exception` (see the gotchas).",
          "`viewModelScope.launch` runs on the main thread and is cancelled when the `ViewModel` is cleared.",
        ],
        ios: [
          "`try await` marks both possibilities at the call site: this may suspend, and this may throw.",
          "Swift errors are untyped by default, so `catch` with no pattern binds a local `error` constant.",
          "Because the model is `@MainActor`, assigning `profile` after the `await` happens on the main thread.",
        ],
      },
    },
    {
      id: "parallel",
      title: "Promise.all → async / async let",
      prose: [
        "Sequential `await`s run one after another. To run things in parallel, Kotlin uses `async { }` inside a `coroutineScope`, and Swift uses `async let` or a task group.",
        "Unlike `Promise.all`, these are structured. If one child fails, the others are cancelled, and the function doesn't return until every child has finished. With `Promise.all`, the remaining promises keep running after the first rejection.",
      ],
      snippet: "parallel",
      notes: {
        android: [
          "`async` returns a `Deferred<T>`, Kotlin's promise. `await()` gets the value.",
          "`awaitAll()` keeps the input order, like `Promise.all`.",
          "Use `supervisorScope` instead of `coroutineScope` when one failure shouldn't cancel the siblings. That's closer to `Promise.allSettled`.",
        ],
        ios: [
          "`async let` starts the child task immediately. `try await` on the result is where you collect it.",
          "Task groups handle a dynamic number of children. Results arrive as each finishes, so sort them or return `(id, value)` pairs if order matters.",
          "Closures passed to `addTask` must be `Sendable`, so they can only capture thread-safe values. That's why `API` should be a `struct` or an `actor`.",
        ],
      },
    },
    {
      id: "threads",
      title: "Threads: Dispatchers & @MainActor",
      prose: [
        "In RN, heavy JS work blocks the JS thread, and the fix is to move it to native code. On native, you move it to another thread yourself. Both platforms make this one line.",
        "Kotlin uses `withContext(dispatcher)` to run a block on another thread pool and return its result. `Dispatchers.Main` is the UI thread. `Dispatchers.IO` is for blocking I/O like disk and legacy network calls. `Dispatchers.Default` is for CPU work like parsing or sorting. Swift uses *actors* instead. `@MainActor` code runs on the main thread, and the compiler inserts the hop when you `await` across actors.",
      ],
      snippet: "threads",
      notes: {
        android: [
          "Libraries like Retrofit, Room, and DataStore already switch threads internally. You don't need `withContext(Dispatchers.IO)` around their suspend functions.",
          "`withContext` is the Kotlin version of \"run this elsewhere, give me the result\". There's no callback.",
          "The rule: suspend functions should be *main-safe*, meaning safe to call from the main thread. Each function moves its own blocking work off it.",
        ],
        ios: [
          "Since Swift 6.2, a plain `nonisolated async` function runs on the *caller's* actor. On the main actor, that means the main thread. `@concurrent` explicitly sends it to the background pool.",
          "Older Swift (before 6.2) always ran `nonisolated async` functions in the background, so you'll see both behaviors in existing code.",
          "`URLSession`, `FileManager`, and SwiftData's async APIs already do their work off the main thread.",
        ],
      },
    },
    {
      id: "launch",
      title: "Starting async work from the UI",
      prose: [
        "Event handlers are synchronous on every platform, so you need a way to start async work from one. Compose gives you `rememberCoroutineScope()`, which is tied to the composable. SwiftUI uses `Task { }`.",
        "The two differ in an important way. A Compose scope is cancelled when the composable leaves the screen. A Swift `Task { }` started from a button is *unstructured*: nothing cancels it automatically, much like a JS promise. For work tied to a view's lifetime, prefer `.task` (next section). For work that must finish even if the user leaves, start it in a `ViewModel` or a model object instead.",
      ],
      snippet: "launch",
      notes: {
        android: [
          "If the user leaves mid-save, the coroutine is cancelled, and `finally` still runs. To guarantee the save finishes, launch it in `viewModelScope`, or use WorkManager for work that must outlive the app (Chapter 14).",
          "Never use `GlobalScope`. It's the coroutine version of a fire-and-forget promise.",
        ],
        ios: [
          "`Task { }` inherits the actor of the code that created it. A `View` is `@MainActor`, so `saving = true` runs on the main thread.",
          "`defer` runs when the scope exits, like `finally`.",
          "`try?` turns an error into `nil` and ignores it. It's fine for a demo, but show the error in real code.",
        ],
      },
    },
    {
      id: "cancellation",
      title: "Cancellation & structured concurrency",
      prose: [
        "In RN, cancelling means `AbortController`, `clearTimeout`, and an `isMounted` flag, all wired up by hand in effect cleanup. On native, cancellation is built in. `LaunchedEffect(key)` and `.task(id:)` cancel the previous run when the key changes and when the view leaves the screen.",
        "Cancellation is *cooperative*. It doesn't kill a thread. Instead, the next suspension point (`delay`, `Task.sleep`, a network call) throws a cancellation error, which unwinds your code. Any `finally` or `defer` blocks still run.",
      ],
      snippet: "cancellation",
      notes: {
        rn: ["Forgetting the cleanup here causes the classic race: an old, slow response overwrites the newer results."],
        android: [
          "Cancellation throws `CancellationException` at the suspension point. Coroutines treat it as a normal way to finish, not as a crash.",
          "In a long CPU loop with no suspension points, call `ensureActive()` so cancellation can take effect.",
          "In a `ViewModel`, the same debounce is a Flow: `queryFlow.debounce(300).mapLatest { api.search(it) }`.",
        ],
        ios: [
          "`Task.sleep` throws `CancellationError` when cancelled. `URLSession` throws `URLError(.cancelled)`.",
          "In a long loop, check `Task.isCancelled` or call `try Task.checkCancellation()`.",
          "`.task(id:)` is SwiftUI's `useEffect` with one dependency, and cancellation is the cleanup (Chapter 6).",
        ],
      },
    },
    {
      id: "streams",
      title: "Observables → Flow / AsyncSequence",
      prose: [
        "For values over time, RN uses event emitters, RxJS, or subscription callbacks. Kotlin has **Flow** and Swift has **AsyncSequence**. Both are pull-based streams you consume with a loop-like API (`collect` / `for await`), and both clean up automatically when the consumer is cancelled.",
        "The most common job is wrapping a callback-based platform API. `callbackFlow` and `AsyncStream` give you the same subscribe-then-unsubscribe shape as a `useEffect` cleanup.",
      ],
      snippet: "streams",
      notes: {
        android: [
          "`awaitClose { }` is the unsubscribe. It runs when the collector is cancelled, for example when the composable leaves.",
          "`remember(connectivity)` stops a new Flow being created on every recomposition.",
          "This API needs the `ACCESS_NETWORK_STATE` permission in the manifest.",
        ],
        ios: [
          "`continuation.onTermination` is the unsubscribe. It runs when the `for await` loop ends or its task is cancelled.",
          "`.task` cancels the loop when the view disappears, so the monitor is cancelled with it.",
          "Since iOS 17, `NWPathMonitor` is itself an `AsyncSequence`. The wrapper shows the pattern for APIs that aren't.",
        ],
      },
    },
    {
      id: "hot-cold",
      title: "Hot vs cold streams",
      prose: [
        "A *cold* stream does nothing until someone collects it, and each collector gets its own run, like calling a function. A *hot* stream is shared and already running, like an event emitter. You'll meet both in Kotlin. Swift's equivalents are less unified.",
      ],
      compare: [
        {
          label: "Cold stream",
          values: {
            rn: "An RxJS `Observable`, or a function that subscribes on call",
            android: "`Flow` (from `flow { }`, `callbackFlow`, Room queries)",
            ios: "`AsyncStream` created per consumer, most `AsyncSequence`s",
          },
        },
        {
          label: "Current value",
          values: {
            rn: "Zustand state, a `BehaviorSubject`",
            android: "`StateFlow` (always has a value; drops duplicates)",
            ios: "An `@Observable` property",
          },
        },
        {
          label: "One-off events",
          values: {
            rn: "`EventEmitter`, a `Subject`",
            android: "`SharedFlow` or a `Channel`",
            ios: "`AsyncStream` with one consumer, or a callback",
          },
        },
        {
          label: "Cold → hot",
          values: {
            rn: "`share()` / `shareReplay()`",
            android: "`stateIn(scope, SharingStarted.WhileSubscribed(5_000), initial)`",
            ios: "Store the latest value in an `@Observable` model",
          },
        },
        {
          label: "Operators",
          values: {
            rn: "RxJS `map`, `filter`, `debounceTime`, `switchMap`",
            android: "`map`, `filter`, `debounce`, `flatMapLatest`, `combine`",
            ios: "`map`, `filter` built in; `debounce` and `combineLatest` from swift-async-algorithms",
          },
        },
      ],
      callout:
        "`stateIn` with `WhileSubscribed(5_000)` is the standard way to expose a Flow from a `ViewModel`. It keeps the upstream running for 5 seconds after the UI stops collecting, so a rotation doesn't restart it.",
    },
    {
      id: "main-thread",
      title: "Common crash: UI updates off the main thread",
      prose: [
        "RN devs never hit this one, because JS state updates are always on the JS thread. On native, UI frameworks are not thread-safe. Touching UI from a background thread is a bug, and sometimes a crash.",
        "Modern code mostly prevents it by construction. On Android, keep UI state in `StateFlow` (safe to update from any thread) and collect it in Compose. On iOS, mark models `@MainActor`, and the compiler rejects off-main writes in Swift 6 language mode.",
      ],
      compare: [
        {
          label: "Symptom",
          values: {
            rn: "N/A: state updates always run on the JS thread",
            android: "`CalledFromWrongThreadException` when touching Android `View`s off the main thread",
            ios: "Runtime warnings, random crashes, or UI that doesn't update",
          },
        },
        {
          label: "Blocking the main thread",
          values: {
            rn: "Janky JS-driven animations and slow taps",
            android: "\"App Not Responding\" (ANR) dialog after ~5 seconds",
            ios: "Frozen UI; the watchdog kills apps that hang at launch",
          },
        },
        {
          label: "Prevention",
          values: {
            rn: "Move heavy work to native code or a worklet",
            android: "Main-safe suspend functions, `withContext(Dispatchers.IO)`",
            ios: "`@MainActor` models, `@concurrent` for heavy work, Swift 6 checks",
          },
        },
        {
          label: "Debug tool",
          values: {
            rn: "Perf monitor, Flipper",
            android: "StrictMode, Android Studio profiler",
            ios: "Main Thread Checker (on by default in debug), Instruments",
          },
        },
      ],
    },
  ],
  gotchas: [
    {
      title: "Don't swallow CancellationException",
      body: "In Kotlin, cancellation is an exception. `catch (e: Exception)` or `runCatching { }` around a suspend call also catches `CancellationException`, so the coroutine keeps running after it was cancelled. Catch specific types such as `IOException`, or rethrow `CancellationException`.",
    },
    {
      title: "try? Task.sleep hides cancellation",
      body: "In Swift, `try? await Task.sleep(…)` turns cancellation into `nil`, so the code after it runs anyway. Use `try await` inside a `do` block, or check `Task.isCancelled` afterwards.",
    },
    {
      title: "Task { } in SwiftUI isn't cancelled for you",
      body: "A `Task` started in a button action keeps running after the view disappears, like a JS promise. Use `.task` or `.task(id:)` for work tied to the view, and store the `Task` and call `cancel()` if you need manual control.",
    },
    {
      title: "await doesn't mean background",
      body: "Neither `suspend` nor `async` moves work off the main thread by itself. A suspend function that does a blocking file read still blocks Main. Use `withContext(Dispatchers.IO)` in Kotlin and `@concurrent` in Swift 6.2 for blocking or heavy work.",
    },
    {
      title: "Task groups don't keep order",
      body: "`Promise.all` and Kotlin's `awaitAll()` return results in input order. A Swift task group yields results in *completion* order. Collect into a dictionary keyed by ID, or sort the results, if order matters.",
    },
    {
      title: "Sendable errors are the compiler helping",
      body: "Swift 6 rejects code that shares mutable state across concurrent tasks, with errors about `Sendable` and actor isolation. JS never needed this because it had one thread. Fix it by using `struct`s, marking UI models `@MainActor`, or wrapping shared state in an `actor`. Don't silence it with `@unchecked Sendable`.",
    },
  ],
  cheatsheet: [
    { rn: "`async function f(): Promise<T>`", android: "`suspend fun f(): T`", ios: "`func f() async throws -> T`" },
    { rn: "`await f()`", android: "`f()`", ios: "`try await f()`" },
    { rn: "Fire off a promise", android: "`scope.launch { }`", ios: "`Task { }`" },
    { rn: "`Promise.all([a, b])`", android: "`async { }` + `await()` in `coroutineScope`", ios: "`async let` / task group" },
    { rn: "`Promise.allSettled`", android: "`supervisorScope`", ios: "Task group catching per child" },
    { rn: "`setTimeout(fn, ms)` in async code", android: "`delay(ms)`", ios: "`try await Task.sleep(for: .milliseconds(ms))`" },
    { rn: "`AbortController.abort()`", android: "`job.cancel()`", ios: "`task.cancel()`" },
    { rn: "`useEffect` async + cleanup", android: "`LaunchedEffect(key)`", ios: "`.task(id:)`" },
    { rn: "Move work off the JS thread", android: "`withContext(Dispatchers.IO / Default)`", ios: "`@concurrent` / another actor" },
    { rn: "State updates (always JS thread)", android: "`Dispatchers.Main` / `StateFlow`", ios: "`@MainActor`" },
    { rn: "RxJS `Observable`", android: "`Flow`", ios: "`AsyncSequence`" },
    { rn: "`subscribe` / `unsubscribe`", android: "`collect` / cancel the collector", ios: "`for await` / cancel the task" },
    { rn: "Wrap an event emitter", android: "`callbackFlow { awaitClose { } }`", ios: "`AsyncStream { continuation in … }`" },
    { rn: "`BehaviorSubject`", android: "`StateFlow`", ios: "`@Observable` property" },
  ],
  quiz: [
    {
      question: "In Kotlin, how do you wait for a `suspend fun loadUser(): User` inside another suspend function?",
      options: [
        "`await loadUser()`",
        "`loadUser().await()`",
        "`val user = loadUser()`",
        "`runBlocking { loadUser() }`",
      ],
      answer: 2,
      explanation: "Calling a suspend function waits for it. There's no `await` keyword. `.await()` only exists on a `Deferred` returned by `async { }`, and `runBlocking` blocks the thread, which you should never do on Main.",
    },
    {
      question: "This Kotlin code is cancelled during the network call: `try { api.save(todo) } catch (e: Exception) { showError(e) }`. What's the problem?",
      options: [
        "Nothing; cancellation stops the coroutine before `catch` runs",
        "`catch (e: Exception)` also catches `CancellationException`, so a cancelled coroutine shows an error and keeps running",
        "Suspend calls can't be wrapped in `try`",
        "`Exception` doesn't include network errors",
      ],
      answer: 1,
      explanation: "Kotlin implements cancellation as a `CancellationException` thrown at the suspension point. Catching every `Exception` swallows it. Catch specific types like `IOException`, or rethrow `CancellationException`.",
    },
    {
      question: "You run two requests with `async let` in Swift. The first throws. What happens to the second?",
      options: [
        "It keeps running in the background, like `Promise.all`",
        "It's cancelled, and the function waits for it to finish before throwing",
        "Swift crashes, because errors can't cross tasks",
        "It completes and its result is silently dropped",
      ],
      answer: 1,
      explanation: "Structured concurrency guarantees that child tasks never outlive their parent. When one child fails, siblings are cancelled and awaited. With `Promise.all`, the other promises keep running after the first rejection.",
    },
    {
      question: "A SwiftUI search view should cancel the previous request whenever the query changes. What's the simplest correct tool?",
      options: [
        "`.onChange(of: query) { Task { … } }`",
        "`.task(id: query) { … }`",
        "`DispatchQueue.main.asyncAfter`",
        "A `Timer` in `init`",
      ],
      answer: 1,
      explanation: "`.task(id:)` cancels the running task and starts a new one when `id` changes, and cancels it when the view disappears. A bare `Task { }` in `onChange` isn't cancelled, so old responses can overwrite new ones.",
    },
    {
      question: "A suspend function reads a large file with `File.readText()`. It's called from `viewModelScope.launch`. Is the UI safe?",
      options: [
        "Yes, `suspend` functions always run in the background",
        "Yes, `viewModelScope` uses a background thread",
        "No, it runs on `Dispatchers.Main` and blocks it; wrap the read in `withContext(Dispatchers.IO)`",
        "No, files can't be read from coroutines",
      ],
      answer: 2,
      explanation: "`viewModelScope` defaults to the main thread, and `suspend` alone doesn't change threads. Blocking calls need `withContext(Dispatchers.IO)`. Swift has the same trap: use `@concurrent` for heavy work.",
    },
    {
      question: "What's the Kotlin equivalent of wrapping `NetInfo.addEventListener` and returning its unsubscribe function from `useEffect`?",
      options: [
        "`flow { emit(…) }`",
        "`callbackFlow { register(cb); awaitClose { unregister(cb) } }`",
        "`MutableStateFlow` set from a global listener",
        "`LiveData`",
      ],
      answer: 1,
      explanation: "`callbackFlow` turns a listener API into a cold Flow. `awaitClose` runs the unsubscribe when the collector is cancelled. Swift's `AsyncStream` with `onTermination` is the same pattern.",
    },
    {
      kind: "predict",
      platform: "android",
      question: "What does this print?",
      code: `fun main() = runBlocking {
    launch {
        delay(100)
        println("A")
    }
    launch {
        println("B")
    }
    println("C")
}`,
      options: [
        "`A`, `B`, `C`",
        "`C`, `B`, `A`",
        "`B`, `C`, `A`",
        "`C`, `A`, `B`",
      ],
      answer: 1,
      explanation: "`launch` queues a child coroutine and returns right away, so `runBlocking`'s thread prints `C` first. Then the children run: the first suspends in `delay`, the second prints `B`, and `A` prints after 100 ms. It's like JS `.then` callbacks waiting for the current code to finish.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "The search keeps running after the user leaves the screen. Which line is the bug?",
      code: `class SearchViewModel(private val api: Api) : ViewModel() {
    val results = MutableStateFlow<List<String>>(emptyList())
    private var job: Job? = null

    fun onQueryChange(query: String) {
        job?.cancel()
        job = GlobalScope.launch {
            delay(300)
            results.value = api.search(query)
        }
    }
}`,
      answer: 7,
      explanation: "`GlobalScope` isn't tied to anything, so the coroutine outlives the `ViewModel`. Use `viewModelScope.launch`, which is cancelled when the `ViewModel` is cleared. The `job?.cancel()` debounce keeps working either way.",
    },
  ],
};
