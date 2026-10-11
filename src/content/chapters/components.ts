import type { Chapter } from "../types";

export const components: Chapter = {
  slug: "components",
  title: "Components & declarative UI",
  intro: [
    "If you've shipped React Native, you already understand the core idea behind modern native UI: **the UI is a function of state**. Jetpack Compose (Android) and SwiftUI (iOS) are both declarative UI frameworks, and React influenced both. You describe what the screen should look like for the current state, and the framework works out what to change.",
    "What changes is the syntax, the vocabulary, and a few rules that the compiler now enforces for you. This chapter builds up a small `TodoRow` piece by piece, so you can see the same idea in all three platforms side by side.",
    "Don't worry about every Kotlin or Swift keyword yet. Chapter 2 covers the languages properly. Here, focus on the shape of the code.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "All three frameworks describe UI with functions or values that are cheap to re-run. When state changes, the framework re-runs the affected code and updates only what's different. The vocabulary changes, but the loop is the same.",
      ],
      compare: [
        {
          label: "A component is…",
          values: {
            rn: "A function that returns a React element tree (JSX).",
            android: "A `@Composable` function that *emits* UI into the composition. It returns `Unit`, not an element.",
            ios: "A `struct` conforming to `View`, whose `body` property describes its content.",
          },
        },
        {
          label: "An update is called…",
          values: {
            rn: "A re-render",
            android: "A recomposition",
            ios: "Re-evaluating `body`",
          },
        },
        {
          label: "It's triggered by…",
          values: {
            rn: "A change to state, props, or context",
            android: "A change to a `State<T>` that the function read, or to its parameters",
            ios: "A change to `@State`, `@Binding`, `@Observable`, or `@Environment` that `body` read",
          },
        },
        {
          label: "What gets diffed",
          values: {
            rn: "The element tree. The reconciler then updates native views.",
            android: "Composable calls. Calls whose inputs didn't change are skipped.",
            ios: "The view value tree, matched by structural identity",
          },
        },
        {
          label: "Markup language",
          values: {
            rn: "JSX",
            android: "None. It's plain Kotlin with trailing lambdas.",
            ios: "None. It's plain Swift with result builders (`@ViewBuilder`).",
          },
        },
      ],
      callout:
        "Purity carries over too. Like a React render, a composable or a SwiftUI `body` should be fast and side-effect free, because the framework can call it at any time and as often as it likes.",
    },
    {
      id: "first-component",
      title: "Your first component",
      prose: [
        "Here's the smallest useful component on each platform. `View` maps to a layout container (`Column` or `VStack`). `Text` is simply `Text` everywhere.",
      ],
      snippet: "hello",
      notes: {
        rn: ["Returns JSX. `View` is a flexbox container that defaults to `flexDirection: 'column'`."],
        android: [
          "`@Composable` is an annotation that lets the Compose compiler plugin turn this into a UI-emitting function.",
          "Composable names that emit UI use PascalCase by convention, just like React components.",
          "`Column { … }` is a normal function call whose last argument is a lambda (a *trailing lambda*).",
        ],
        ios: [
          "`some View` is an *opaque type*: \"some concrete View, and the compiler knows which one\".",
          "`body` is a computed property, re-evaluated whenever its dependencies change.",
          "`VStack { … }` uses a trailing closure built with `@ViewBuilder`.",
        ],
      },
    },
    {
      id: "props",
      title: "Props → parameters",
      prose: [
        "Props become ordinary function parameters in Compose, and stored properties on the struct in SwiftUI. Defaults work like JS default parameters. Named arguments at the call site make usage look a lot like JSX attributes.",
      ],
      snippet: "props",
      notes: {
        android: [
          "Use named arguments (`name = \"Reed\"`) at call sites. They read like props, and parameter order stops mattering.",
          "`\"$name\"` and `\"${expr}\"` are string templates, like JS template literals.",
        ],
        ios: [
          "Swift auto-generates a *memberwise initializer* from the stored properties, so you get `Greeting(name:excited:)` for free.",
          "A `var` with a default value becomes an optional argument. A `let` without one is required.",
          "`\"\\(name)\"` is string interpolation.",
        ],
      },
    },
    {
      id: "children",
      title: "children → content slots",
      prose: [
        "React's `children` prop becomes a function parameter that takes UI. In Compose it's a `@Composable () -> Unit` lambda, conventionally named `content`. In SwiftUI it's a generic `Content: View` built by `@ViewBuilder`. On both platforms, placing it last enables the trailing-lambda syntax, which reads just like nesting JSX.",
      ],
      snippet: "children",
      notes: {
        android: [
          "You can define multiple slots, e.g. `header: @Composable () -> Unit` and `footer: …`. That's the Compose take on render props.",
          "`16.dp` is an explicit density-independent unit. RN numbers are implicitly dp.",
        ],
        ios: [
          "Putting `@ViewBuilder` on a stored property makes the memberwise init accept a closure (Swift 5.4+).",
          "The `<Content: View>` generic lets SwiftUI know the exact child type. That keeps diffing fast and avoids `AnyView`.",
        ],
      },
    },
    {
      id: "conditional",
      title: "Conditional rendering",
      prose: [
        "No more ternaries and `&&` inside JSX. Both platforms let you use the language's own `if` directly inside a UI block. Optional values have first-class syntax: `!= null` smart-casts in Kotlin, and `if let` unwraps in Swift.",
      ],
      snippet: "conditional",
      notes: {
        rn: ["Watch out for `{count && <Text/>}`. When `count` is `0`, RN tries to render a bare `0`. Native has no equivalent footgun."],
        android: ["After `if (dueDate != null)`, Kotlin *smart-casts* `dueDate` from `String?` to `String` inside the block."],
        ios: ["`if let dueDate { … }` unwraps the optional into a non-optional constant of the same name (Swift 5.7+)."],
      },
    },
    {
      id: "enums",
      title: "Branching on unions & enums",
      prose: [
        "TypeScript string unions map well onto `enum class` in Kotlin and `enum` in Swift. Both languages check exhaustiveness at compile time, so adding a new case flags every `when` or `switch` that needs updating.",
      ],
      snippet: "enums",
      notes: {
        android: [
          "`when` is Kotlin's `switch`, and it's an expression, so it can return a value.",
          "Kotlin enum constants are usually PascalCase or SCREAMING_CASE. Pick one and be consistent.",
          "For unions that carry data (`{ type: 'error', message }`), use a `sealed interface`. Chapter 2 covers it.",
        ],
        ios: [
          "`switch` works directly inside `body` because `body` is implicitly a `@ViewBuilder`.",
          "Swift enums can carry associated values (`case error(String)`), which covers discriminated unions.",
        ],
      },
    },
    {
      id: "collections",
      title: "Rendering a collection",
      prose: [
        "`array.map` turns into a loop. For a handful of items in a row or column this is all you need. Long, scrolling lists use lazy containers instead (`LazyColumn` or `List`), which Chapter 7 covers.",
      ],
      snippet: "collections",
      notes: {
        android: [
          "A plain `forEach` is fine. Compose tracks children by position, so you don't need `key` for static lists.",
          "If items can reorder and hold their own state, wrap each item in `key(tag) { … }`, the same idea as React's `key`.",
        ],
        ios: [
          "`ForEach` *requires* identity: either `id: \\.self` for simple values, or make your model `Identifiable`.",
          "`ForEach` is a view, not a loop. Don't confuse it with Swift's `for … in` or `.forEach`.",
        ],
      },
    },
    {
      id: "styling",
      title: "Styling: style props → modifiers",
      prose: [
        "There's no `StyleSheet` on native. Styling happens through text parameters (`fontSize`, `color`) and a chain of **modifiers** (padding, background, size, click handling, and so on).",
        "Compose has a strong convention: every reusable composable accepts `modifier: Modifier = Modifier` and applies it to its root. That's the equivalent of forwarding a `style` prop. In SwiftUI, callers simply chain more modifiers onto your view.",
      ],
      snippet: "styling",
      callout:
        "**Modifier order matters, and it reads in opposite directions.** Compose applies modifiers outer → inner, so `background` then `padding` puts the padding *inside* the background. SwiftUI wraps inner → outer, so `padding` then `background` does the same thing. Swap the order on either platform and the padding acts like a margin.",
      notes: {
        rn: ["Style arrays (`[styles.chip, style]`) merge left to right, and order rarely matters."],
        android: [
          "Text styling (`fontSize`, `color`, `fontWeight`) is passed as `Text` parameters, not modifiers.",
          "`sp` is for text (it respects the user's font scale) and `dp` is for everything else.",
          "Hex colors are written `Color(0xAARRGGBB)`, so `0xFF…` means fully opaque.",
        ],
        ios: [
          "Each modifier returns a *new* view wrapping the previous one. That's why order matters.",
          "Prefer semantic fonts (`.body`, `.headline`) so Dynamic Type works automatically.",
        ],
      },
    },
    {
      id: "events",
      title: "Events & callbacks",
      prose: [
        "Callback props stay callback props. `onPress: () => void` becomes `onToggle: () -> Unit` in Kotlin and `() -> Void` in Swift. Data flows down and events flow up, exactly as in React. In Compose this is called **state hoisting**.",
      ],
      snippet: "events",
      notes: {
        android: [
          "`Modifier.clickable` makes anything pressable and adds a ripple effect. It's the closest match to `Pressable`.",
          "Put `clickable` *before* `padding` so the whole padded area is tappable.",
          "Name event params `onX`, the same convention as in React.",
        ],
        ios: [
          "`Button` is the idiomatic tappable. It gives you accessibility traits and press states for free.",
          "`.buttonStyle(.plain)` removes the default tint so the row looks like content, not a link.",
          "For non-button taps there's `.onTapGesture { }`, but prefer `Button` where you can.",
        ],
      },
    },
    {
      id: "previews",
      title: "Previews: your new Fast Refresh",
      prose: [
        "The closest thing to Storybook plus Fast Refresh is built into the IDEs. Android Studio renders `@Preview` functions and Xcode renders `#Preview` blocks right next to your code, so you can iterate on a component without launching the app.",
        "Get into the habit of writing a preview for each state of a component (empty, loading, error, long text, dark mode). This is the fastest feedback loop on native.",
      ],
      snippet: "previews",
      notes: {
        android: ["Previews are just composables with no parameters, annotated with `@Preview`. Mark them `private` so they don't leak into your API."],
        ios: ["`#Preview` is a Swift macro (Xcode 15+). Older code uses `struct X_Previews: PreviewProvider`."],
      },
    },
  ],
  gotchas: [
    {
      title: "You can't store a composable in a variable",
      body: "In React, `const icon = <Icon />` is a value you can pass around. A composable returns `Unit` and emits UI where it's called, so to pass UI around you pass a lambda: `icon: @Composable () -> Unit`. In SwiftUI, views *are* values, but helper functions that return different view types need `@ViewBuilder` or `some View`. Reach for `AnyView` only as a last resort.",
    },
    {
      title: "Composables can only be called from composables",
      body: "It's like the Rules of Hooks, except the compiler enforces it. You can't call `Text(\"hi\")` from a click handler or a coroutine. Change state there instead, and let the UI react.",
    },
    {
      title: "SwiftUI view structs are created constantly",
      body: "SwiftUI may create your `View` struct and evaluate `body` many times. Keep `init` and `body` cheap, and never start network calls or timers in them. Use `.task { }` instead (Chapter 6).",
    },
    {
      title: "Modifier order reads in opposite directions",
      body: "In Compose, the first modifier is the outermost. In SwiftUI, the first modifier is the innermost. When a layout looks wrong, check the modifier order first.",
    },
    {
      title: "Units are explicit on Android",
      body: "RN numbers are density-independent pixels. Compose makes the unit explicit with `16.dp` for layout and `14.sp` for text. SwiftUI uses points, which are already density-independent, so you write plain numbers.",
    },
    {
      title: "Defaults look native",
      body: "`Text` in Material 3 picks up `MaterialTheme` colors and typography. SwiftUI views adapt to dark mode, Dynamic Type, and platform conventions automatically. Unlike RN, you start from the platform's look, not from a blank slate.",
    },
  ],
  cheatsheet: [
    { rn: "Function component", android: "`@Composable fun Name()`", ios: "`struct Name: View`" },
    { rn: "`return (<JSX/>)`", android: "Call child composables", ios: "`var body: some View { … }`" },
    { rn: "Props", android: "Function parameters", ios: "Stored properties (memberwise init)" },
    { rn: "Default props", android: "Default arguments", ios: "Property default values" },
    { rn: "`children`", android: "`content: @Composable () -> Unit`", ios: "`@ViewBuilder let content: Content`" },
    { rn: "`style` prop", android: "`modifier: Modifier = Modifier`", ios: "Caller chains modifiers" },
    { rn: "`StyleSheet`", android: "Modifier chain + Text params", ios: "View modifiers" },
    { rn: "`cond ? <A/> : <B/>`", android: "`if (cond) A() else B()`", ios: "`if cond { A() } else { B() }`" },
    { rn: "`switch` on union", android: "`when` on `enum class`", ios: "`switch` on `enum`" },
    { rn: "`items.map(…)`", android: "`items.forEach { … }`", ios: "`ForEach(items) { … }`" },
    { rn: "`key`", android: "`key(id) { … }` (optional)", ios: "`id:` / `Identifiable` (required)" },
    { rn: "`<View>` (column)", android: "`Column` / `Row` / `Box`", ios: "`VStack` / `HStack` / `ZStack`" },
    { rn: "`<Pressable onPress>`", android: "`Modifier.clickable`", ios: "`Button(action:)`" },
    { rn: "Storybook / Fast Refresh", android: "`@Preview`", ios: "`#Preview`" },
  ],
  quiz: [
    {
      question: "You want a `Card` composable that accepts an optional icon, the way an RN component accepts `icon?: ReactNode`. What's the idiomatic parameter type?",
      options: [
        "`icon: View? = null`",
        "`icon: (@Composable () -> Unit)? = null`",
        "`icon: Modifier = Modifier`",
        "`icon: Any? = null`, rendered with `Box(icon)`",
      ],
      answer: 1,
      explanation: "Composables emit UI rather than return it, so you pass UI around as a composable lambda. Call it with `icon?.invoke()` where it should appear.",
    },
    {
      question: "In Compose, which chain paints the blue background behind the padding as well?",
      options: [
        "`Modifier.padding(16.dp).background(Blue)`",
        "`Modifier.background(Blue).padding(16.dp)`",
        "Both look the same",
        "Neither; padding is never painted",
      ],
      answer: 1,
      explanation: "Compose modifiers apply from outside in. `background` first paints the full area, then `padding` insets the content. In SwiftUI it's the opposite: `.padding(16).background(.blue)` paints behind the padding.",
    },
    {
      question: "Where should a SwiftUI view start loading data from the network?",
      options: [
        "In the struct's `init`",
        "At the top of `body`",
        "In a `.task { }` modifier",
        "In a `static let` on the view",
      ],
      answer: 2,
      explanation: "SwiftUI creates view structs and evaluates `body` often, so side effects there run repeatedly. `.task` runs when the view appears and is cancelled automatically when it disappears.",
    },
    {
      question: "You render `ForEach(todos) { todo in Row(todo) }` in SwiftUI. What must be true about `Todo`?",
      options: [
        "Nothing; SwiftUI uses array indexes like React's default",
        "It must conform to `Identifiable` (or you pass `id:`)",
        "It must be a `class`",
        "It must conform to `Codable`",
      ],
      answer: 1,
      explanation: "SwiftUI requires stable identity for collections. React only warns about a missing `key`, but SwiftUI won't compile without one.",
    },
    {
      question: "A tap handler needs to show an error message. What's the right move in Compose?",
      options: [
        "Call `Text(\"Error\")` inside the `onClick` lambda",
        "Set a state variable (e.g. `error = \"…\"`) and let the composable render `Text` when it's non-null",
        "Return a composable from `onClick`",
        "Use `LaunchedEffect` inside `onClick`",
      ],
      answer: 1,
      explanation: "Composables can only be called from other composables, just like hooks only run during render. Event handlers change state, and the UI reacts to it, the same as `setError` in React.",
    },
    {
      question: "In Compose, `16` in RN's `fontSize: 16` becomes…",
      options: ["`16.dp`", "`16.sp`", "`16.px`", "`16f`"],
      answer: 1,
      explanation: "Use `sp` for text so it scales with the user's font-size setting, and `dp` for layout. SwiftUI uses plain points and scales text with Dynamic Type through text styles like `.body`.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "Callers pass `Modifier.testTag(\"badge\")` and alignment modifiers, but none of them apply. Which line is the bug?",
      code: `@Composable
fun Badge(
    text: String,
    modifier: Modifier = Modifier,
) {
    Text(
        text,
        Modifier.padding(4.dp),
    )
}`,
      answer: 8,
      explanation: "The root ignores the `modifier` parameter and starts a fresh `Modifier` chain, so whatever the caller passed is dropped. It's like a component that takes a `style` prop and never forwards it. Use `modifier.padding(4.dp)`.",
    },
    {
      kind: "bug",
      platform: "ios",
      question: "The parent passes a new `user.name`, but `Greeting` keeps showing the first name it got. Which line is the bug?",
      code: `struct Greeting: View {
    @State var name: String

    var body: some View {
        Text("Hello, \\(name)")
    }
}

// Parent: Greeting(name: user.name)`,
      answer: 2,
      explanation: "`@State` is state the view owns. It takes the initial value once and ignores later ones, like `useState(props.name)`. A value that comes from the parent is a plain prop: `let name: String`.",
    },
  ],
};
