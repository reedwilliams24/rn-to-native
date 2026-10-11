import type { Chapter } from "../types";

export const testing: Chapter = {
  slug: "testing",
  title: "Testing",
  intro: [
    "Testing on native is the same pyramid you know from RN: lots of fast unit tests, fewer component tests, and a handful of end-to-end flows. The names change, and so does one big thing: **where a test runs**. In RN, Jest runs everything in Node. On native, some tests run on your laptop's JVM or Mac, and some need a device or simulator. Picking the right layer decides whether a test takes 50 ms or 50 seconds.",
    "This chapter tests the `TodoRow` from Chapter 1 and a small todo list view model, layer by layer. It assumes the view model shape from Chapter 10 and the coroutines and Swift concurrency basics from Chapter 11.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "Each platform has a built-in test runner and a fixed set of places tests live. You don't pick a runner the way you'd pick Jest or Vitest. The build system already knows about them.",
      ],
      compare: [
        {
          label: "Unit test framework",
          values: {
            rn: "Jest (`describe` / `it` / `expect`)",
            android: "JUnit 4 (`@Test`, `assertEquals`). JUnit 5 and Kotest work with extra setup.",
            ios: "Swift Testing (`@Test`, `#expect`) for new code. XCTest for older code and UI tests.",
          },
        },
        {
          label: "Where tests live",
          values: {
            rn: "Anywhere, matched by `*.test.ts`",
            android: "`src/test/` runs on the JVM. `src/androidTest/` runs on a device or emulator.",
            ios: "Separate test targets, e.g. `TodosTests` (unit) and `TodosUITests` (UI)",
          },
        },
        {
          label: "Run from the CLI",
          values: {
            rn: "`npx jest`",
            android: "`./gradlew test` (JVM) and `./gradlew connectedAndroidTest` (device)",
            ios: "`xcodebuild test -scheme Todos -destination 'platform=iOS Simulator,name=iPhone 16'`",
          },
        },
        {
          label: "Run from the IDE",
          values: {
            rn: "Jest extension or terminal",
            android: "Green gutter arrow next to a test class or function",
            ios: "Diamond in the gutter, or `Cmd+U` for the whole scheme",
          },
        },
        {
          label: "Mocking",
          values: {
            rn: "`jest.mock` swaps modules at import time",
            android: "Interfaces + hand-written fakes. MockK if you need mocks.",
            ios: "Protocols + hand-written fakes. No mainstream mocking library.",
          },
        },
      ],
      callout:
        "Prefer the JVM on Android. `src/test/` runs in seconds with no emulator. Only reach for `src/androidTest/` when you need a real Android framework, such as the full app, real `Context`, or system UI.",
    },
    {
      id: "unit",
      title: "Unit tests: Jest → JUnit / Swift Testing",
      prose: [
        "Pure functions test the same way everywhere: call, then assert. The test is a class with annotated methods in Kotlin, and a struct with `@Test` functions in Swift. There is no global `describe`. The class or struct *is* the group.",
        "Parameterized tests replace `it.each`. Swift Testing has them built in through `arguments:`. In JUnit 4 most teams just write a few asserts in one test, as here, or use JUnit 5's `@ParameterizedTest`.",
      ],
      snippet: "unit",
      notes: {
        rn: ["`toBe` compares with `===`. `toEqual` compares structurally."],
        android: [
          "Backtick-quoted names with spaces are allowed in JVM tests and read well in reports. Avoid them in `androidTest` code: Android only allows spaces in method names from API 30.",
          "`assertEquals(expected, actual)`: the expected value comes *first*. Swapping them gives confusing failure messages.",
          "`assertEquals` on `data class` values compares structurally, like `toEqual`.",
        ],
        ios: [
          "`@testable import Todos` lets tests see `internal` declarations from the app target.",
          "`#expect` is a macro. On failure it prints both sides of the expression, so you rarely need specialized matchers.",
          "Use `#require` when a failure should stop the test, like unwrapping an optional.",
        ],
      },
    },
    {
      id: "fakes",
      title: "jest.mock → interfaces and fakes",
      prose: [
        "This is the biggest habit change. Jest can replace any module at import time, so RN code rarely needs to be designed for testing. Kotlin and Swift can't patch imports. You make code testable by depending on an **interface** (Kotlin) or **protocol** (Swift), and passing the real or fake implementation in from outside.",
        "A hand-written fake is usually a few lines and is easier to read than a mock setup. It also doubles as test data for previews. This is the same dependency injection Chapter 10 covers for architecture reasons. Testing is the payoff.",
      ],
      snippet: "fakes",
      notes: {
        rn: ["`jest.mocked()` only adds types. The mocking itself happens through `jest.mock`'s hoisting."],
        android: [
          "`Result<T>` is the standard library's success-or-failure wrapper. `getOrThrow()` rethrows the failure.",
          "`private set` makes `loadCalls` readable but not writable from tests.",
          "MockK (`every { repo.load() } returns …`) exists if you really need it, but fakes are the Android team's own recommendation.",
        ],
        ios: [
          "The fake is an `actor` so its mutable `loadCalls` is safe under Swift 6 strict concurrency. Reading it from a test needs `await`.",
          "`any TodoRepository` is an *existential*: \"some value conforming to the protocol\", chosen at runtime.",
        ],
      },
    },
    {
      id: "async",
      title: "Testing async code and view models",
      prose: [
        "In Jest you `await` or use `waitFor`. Kotlin uses `runTest`, which runs coroutines on a virtual clock, so `delay(5_000)` finishes instantly. Swift is the simplest: mark the test `async`, then `await` the method under test.",
        "The Android-specific trap is `Dispatchers.Main`. `viewModelScope` launches on the main dispatcher, and there is no Android main thread in a JVM test. The fix is a small JUnit rule that swaps in a test dispatcher. Every Android project ends up with one.",
      ],
      snippet: "viewmodel",
      notes: {
        rn: ["`renderHook` mounts the hook in a throwaway component. You need `act` because state updates outside React's event system must be flushed."],
        android: [
          "`runTest` reuses the test dispatcher's scheduler when `Dispatchers.Main` has been replaced, so `advanceUntilIdle()` drives the view model's coroutines too.",
          "`setMain` and the test dispatchers are marked `@ExperimentalCoroutinesApi`. Expect an opt-in warning, or add `@OptIn`.",
          "For `Flow`s that emit many values, the Turbine library (`flow.test { awaitItem() }`) is the common choice.",
        ],
        ios: [
          "Because `refresh()` is `async`, the test awaits it directly. There's no dispatcher to swap and no `waitFor` polling.",
          "`@MainActor` on the suite matches the `@MainActor` model. Without it, the compiler flags access to the model's state from a non-isolated context.",
        ],
      },
      callout:
        "If a Swift model starts work with a fire-and-forget `Task { }` instead of an `async` method, tests can't await it, and you're back to polling. Expose `async` functions and let the view call them from `.task` (Chapter 6).",
    },
    {
      id: "ui",
      title: "RN Testing Library → Compose UI tests / ViewInspector",
      prose: [
        "React Native Testing Library renders a component, finds nodes by text or label, fires events, and asserts. Compose's test APIs work the same way and are first-party: `setContent`, `onNodeWithText`, `performClick`, then an assertion. They query the **semantics tree**, the same tree TalkBack uses (Chapter 16). So a component that's hard to find in a test is often also hard to use with a screen reader.",
        "SwiftUI has no first-party component test API. Most teams either test the model (previous section) and cover views with snapshots and XCUITest, or add the open-source ViewInspector library, shown here.",
      ],
      snippet: "ui",
      notes: {
        rn: ["`getByText` throws if nothing matches, just like `onNodeWithText` with an assertion."],
        android: [
          "`createComposeRule()` hosts content in a blank activity. These tests live in `androidTest`, or in `test` if you add Robolectric.",
          "Finders: `onNodeWithText`, `onNodeWithContentDescription`, `onNodeWithTag`, or `onNode(matcher)` for anything else.",
          "Compose waits for idle between actions, so you don't need `waitFor` for ordinary recomposition.",
        ],
        ios: [
          "ViewInspector reads SwiftUI's internal view tree. It's widely used, but it can lag behind new iOS releases.",
          "`find(ViewType.Button.self).tap()` invokes the button's action directly. It doesn't simulate a real touch.",
        ],
      },
    },
    {
      id: "e2e",
      title: "Detox → Espresso / XCUITest",
      prose: [
        "End-to-end tests launch the real app and drive it like a user. Detox does this from Node with `by.id`. On Android, Compose apps use the Compose test rule in `androidTest`, and Espresso is the classic API for View-based screens. Both are *gray-box*: the test runs in the same process as the app and waits for it to go idle automatically, which is why they're less flaky than Detox.",
        "XCUITest is *black-box*: it runs in a separate process and talks to your app only through the accessibility tree. It can't read your models or call your code, so any setup you need (a logged-in user, seeded data) has to be passed in with launch arguments or environment variables.",
      ],
      snippet: "e2e",
      notes: {
        rn: ["`testID` maps to the Android resource ID / test tag and to iOS's `accessibilityIdentifier` under the hood."],
        android: [
          "`createAndroidComposeRule<MainActivity>()` launches your real activity. It's a full app test, not an isolated component test.",
          "Use UI Automator alongside it for system UI like permission dialogs and notifications, which the app process can't see.",
        ],
        ios: [
          "UI tests are written as `XCTestCase` subclasses. Swift Testing doesn't cover UI automation.",
          "Read `ProcessInfo.processInfo.arguments` in the app to detect `-ui-testing` and swap in fakes or reset state.",
          "Queries like `app.buttons[\"add-todo\"]` match the accessibility identifier, or the label if there is none.",
        ],
      },
    },
    {
      id: "test-ids",
      title: "testID, and why Maestro still works",
      prose: [
        "If your team uses Maestro, keep it. It drives apps through the platform accessibility layers, not through React, so the same YAML flows can run against your new native app. That makes Maestro a strong parity tool during a migration (Chapter 19): run the same flow against the RN build and the native build.",
        "The catch is IDs. Your `testID`s don't exist anymore, so you have to set the native equivalents, and on Android you have to opt in to exposing them.",
      ],
      compare: [
        {
          label: "Give a node an ID",
          values: {
            rn: "`testID=\"add-todo\"`",
            android: "`Modifier.testTag(\"add-todo\")`",
            ios: "`.accessibilityIdentifier(\"add-todo\")`",
          },
        },
        {
          label: "Visible to in-process tests",
          values: {
            rn: "Yes (Jest, Detox)",
            android: "Yes (`onNodeWithTag`)",
            ios: "XCUITest only, via the accessibility tree",
          },
        },
        {
          label: "Visible to Maestro / UI Automator",
          values: {
            rn: "Yes",
            android: "Only with `Modifier.semantics { testTagsAsResourceId = true }` on a root composable",
            ios: "Yes, as the element's `id`",
          },
        },
        {
          label: "Find by visible text",
          values: {
            rn: "`by.text(…)` / `getByText`",
            android: "`onNodeWithText(…)`",
            ios: "`app.staticTexts[\"…\"]` / `app.buttons[\"…\"]`",
          },
        },
      ],
      callout:
        "Agree on an ID scheme early in a migration and use the same strings on all three platforms. Then one Maestro flow can cover RN, Android, and iOS.",
    },
    {
      id: "snapshot",
      title: "Snapshot & screenshot testing",
      prose: [
        "Jest snapshots serialize the component tree to text. That catches structure changes, but not visual regressions. Native screenshot tests render real pixels and diff them against golden PNGs checked into the repo.",
        "On Android, Paparazzi renders composables on the JVM using Android Studio's layout renderer, so there's no emulator and it's fast enough to run on every PR. Roborazzi (on Robolectric) and Google's Compose Preview Screenshot Testing are alternatives. On iOS, Point-Free's swift-snapshot-testing renders views in the simulator.",
      ],
      snippet: "snapshot",
      notes: {
        rn: ["Text snapshots tend to get approved without reading. Pixel diffs are much easier to review."],
        android: [
          "Wrap content in `MaterialTheme`, and use `Surface` for dark mode so the background is painted too.",
          "`DeviceConfig` controls screen size, font scale, and night mode, so you can cover large-text cases.",
        ],
        ios: [
          "Reference images depend on the simulator model and iOS version. Pin both on CI, or snapshots will fail for no visible reason.",
          "Pass `traits:` or apply `.environment` to cover dark mode and Dynamic Type sizes.",
        ],
      },
      callout:
        "Your previews (Chapter 1) are already a list of states worth snapshotting. Several tools, including Compose Preview Screenshot Testing on Android, can turn previews into screenshot tests directly.",
    },
  ],
  gotchas: [
    {
      title: "You can't mock imports",
      body: "There's no `jest.mock` on native. If a class creates its own `Retrofit` or `URLSession` client, you can't swap it in a test. Design for injection from the start: depend on an interface or protocol, pass it in through the constructor, and fake it in tests.",
    },
    {
      title: "Dispatchers.Main doesn't exist in JVM tests",
      body: "Any view model test that touches `viewModelScope` fails with \"Module with the Main dispatcher is missing\" until you replace `Dispatchers.Main` with a test dispatcher. Add a `MainDispatcherRule` once and reuse it everywhere.",
    },
    {
      title: "test/ and androidTest/ are different worlds",
      body: "`src/test/` runs on your machine's JVM and has no Android framework (unless you add Robolectric). `src/androidTest/` is packaged into a separate APK and run on a device. Putting a test in the wrong folder gives you confusing \"class not found\" or \"method not mocked\" errors.",
    },
    {
      title: "XCUITest can't see inside your app",
      body: "Unlike Detox's gray-box sync or Espresso, XCUITest runs in a separate process and only sees the accessibility tree. Pass setup through `launchArguments` or `launchEnvironment`, and use `waitForExistence(timeout:)` for anything asynchronous.",
    },
    {
      title: "Test tags are invisible to Maestro by default",
      body: "`Modifier.testTag` works with Compose tests, but Maestro, UI Automator, and Appium can't see it until you set `testTagsAsResourceId = true` in a root `semantics` block.",
    },
    {
      title: "Screenshot goldens are environment-specific",
      body: "A golden recorded on one simulator, OS version, or font setup won't match another. Record and verify on the same pinned CI environment, and review diffs as images in the PR.",
    },
  ],
  cheatsheet: [
    { rn: "Jest", android: "JUnit 4 (`./gradlew test`)", ios: "Swift Testing / XCTest (`Cmd+U`)" },
    { rn: "`describe('…')`", android: "Test class", ios: "`struct` (or `@Suite`)" },
    { rn: "`it('…', () => {})`", android: "`@Test fun …()`", ios: "`@Test func …()`" },
    { rn: "`expect(a).toBe(b)`", android: "`assertEquals(b, a)`", ios: "`#expect(a == b)`" },
    { rn: "`it.each([...])`", android: "JUnit 5 `@ParameterizedTest`", ios: "`@Test(arguments: [...])`" },
    { rn: "`beforeEach`", android: "`@Before` / a JUnit `@Rule`", ios: "`init()` on the suite struct" },
    { rn: "`jest.mock('./api')`", android: "Interface + fake (or MockK)", ios: "Protocol + fake" },
    { rn: "`await` / `waitFor`", android: "`runTest { }` + `advanceUntilIdle()`", ios: "`async` test + `await`" },
    { rn: "Fake timers", android: "`runTest` virtual time", ios: "Inject a `Clock`" },
    { rn: "`render(<X/>)`", android: "`composeRule.setContent { X() }`", ios: "ViewInspector `X().inspect()`" },
    { rn: "`getByText`", android: "`onNodeWithText`", ios: "`find(text:)` / `app.staticTexts[…]`" },
    { rn: "`fireEvent.press`", android: "`performClick()`", ios: "`.tap()`" },
    { rn: "`testID`", android: "`Modifier.testTag`", ios: "`.accessibilityIdentifier`" },
    { rn: "Detox", android: "`androidTest` + Compose rule / Espresso", ios: "XCUITest" },
    { rn: "`toMatchSnapshot()`", android: "Paparazzi / Roborazzi", ios: "swift-snapshot-testing" },
  ],
  quiz: [
    {
      question: "Your Android view model test fails with \"Module with the Main dispatcher is missing\". What's the fix?",
      options: [
        "Move the test to `src/androidTest/` so it runs on a device",
        "Replace `Dispatchers.Main` with a test dispatcher using a rule that calls `Dispatchers.setMain`",
        "Wrap the call in `runBlocking`",
        "Launch the work on `GlobalScope` instead of `viewModelScope`",
      ],
      answer: 1,
      explanation: "`viewModelScope` uses `Dispatchers.Main`, which only exists on Android. A `MainDispatcherRule` swaps in a test dispatcher so the JVM test runs fast and `runTest` can control it. Moving to a device works, but it's far slower.",
    },
    {
      question: "In RN you'd `jest.mock('./api')`. What's the idiomatic way to fake the network layer in a Swift test?",
      options: [
        "Swizzle `URLSession` at runtime",
        "Use a mocking library to patch the import",
        "Have the model depend on a protocol and pass in a hand-written fake that conforms to it",
        "Point the app at a staging server during tests",
      ],
      answer: 2,
      explanation: "Swift can't replace imports. You make code testable by depending on a protocol and injecting the implementation. The fake is a few lines and can double as preview data.",
    },
    {
      question: "Which Android test runs without an emulator?",
      options: [
        "A test in `src/androidTest/` using `createAndroidComposeRule<MainActivity>()`",
        "A JUnit test in `src/test/` for a pure Kotlin function",
        "An Espresso test",
        "A UI Automator test that grants a permission",
      ],
      answer: 1,
      explanation: "`src/test/` runs on your machine's JVM. Everything in `src/androidTest/`, including Espresso, Compose instrumentation tests, and UI Automator, needs a device or emulator.",
    },
    {
      question: "Your XCUITest needs a logged-in user. How does the test set that up?",
      options: [
        "Call `AuthStore.shared.login()` from the test method",
        "Use `@testable import Todos` in the UI test target",
        "Pass a launch argument (e.g. `-ui-testing`) that the app reads at startup to use a fake session",
        "Inject the fake through `@Environment` from the test",
      ],
      answer: 2,
      explanation: "XCUITest runs in a separate process and can't touch your app's code or memory. It can only launch the app with arguments or environment variables and interact through the accessibility tree.",
    },
    {
      question: "You've migrated a screen to Compose and set `Modifier.testTag(\"add-todo\")`, but your Maestro flow can't find `add-todo`. Why?",
      options: [
        "Maestro doesn't support native apps",
        "Test tags aren't exposed as resource IDs until you set `testTagsAsResourceId = true` in a root `semantics` block",
        "Tags must be in camelCase",
        "You need to use `contentDescription` instead",
      ],
      answer: 1,
      explanation: "By default test tags are only visible to Compose's own test APIs. Setting `testTagsAsResourceId` exposes them as resource IDs, which Maestro, UI Automator, and Appium can match.",
    },
    {
      question: "How does a native screenshot test differ from a Jest snapshot?",
      options: [
        "They're the same: both serialize the view tree to text",
        "Screenshot tests render real pixels and diff them against golden images",
        "Screenshot tests only run on physical devices",
        "Native snapshots can't be checked into git",
      ],
      answer: 1,
      explanation: "Jest snapshots store a text tree, which misses visual regressions. Paparazzi and swift-snapshot-testing render PNGs and fail on pixel differences, so goldens depend on a pinned device and OS setup.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "This test passes even when the error message never appears. Which line is the bug?",
      code: `class LoginTest {
    @get:Rule val rule = createComposeRule()

    @Test fun showsError() {
        rule.setContent { LoginScreen() }
        rule.onNodeWithText("Log in").performClick()
        rule.onNodeWithText("Email is required")
    }
}`,
      answer: 7,
      explanation: "`onNodeWithText` only builds a matcher and checks nothing until you assert or act on it. Add `.assertIsDisplayed()`. RNTL's `getByText` throws when nothing matches; Compose finders don't.",
    },
    {
      kind: "bug",
      platform: "ios",
      question: "This test always passes, even when `total` is wrong. Which line is the bug?",
      code: `final class CartTests: XCTestCase {
    func testTotal() {
        let cart = Cart(api: FakeAPI())
        Task {
            await cart.load()
            XCTAssertEqual(cart.total, 42)
        }
    }
}`,
      answer: 4,
      explanation: "The test returns before the unstructured `Task` runs, so the assertion never runs in time. Make the test itself async (`func testTotal() async`) and `await cart.load()` directly, the same as returning or awaiting the promise in Jest.",
    },
  ],
};
