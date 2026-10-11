import type { Chapter } from "../types";

export const accessibility: Chapter = {
  slug: "accessibility",
  title: "Accessibility & localization",
  intro: [
    "React Native's accessibility props (`accessibilityLabel`, `accessibilityRole`, `accessibilityState`) are thin wrappers. On Android they become Compose *semantics*, or the View system's accessibility node info. On iOS they become `UIAccessibility` traits. Going native means writing to those systems directly, and that's mostly good news: the built-in components already set them correctly, so you write less than you did in RN.",
    "The same goes for localization. `i18next` and `react-intl` are libraries you add. Android and iOS both have localization built into the build system, from string tables and plural rules to per-app language settings and right-to-left layout.",
    "This chapter covers labels and roles, grouping, custom actions, the differences between TalkBack and VoiceOver, font scaling, reduced motion, and string resources and formatting.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "Every platform builds a second tree next to your UI: an **accessibility tree** that screen readers walk. In RN you annotate views with props, and RN copies them onto native views. In Compose the tree is the **semantics tree**, built from modifiers. In SwiftUI it's built from **accessibility modifiers** and the view's built-in traits.",
      ],
      compare: [
        {
          label: "Annotate with…",
          values: {
            rn: "`accessibility*` props (or `aria-*` / `role` since RN 0.71)",
            android: "Component params (`contentDescription`) and `Modifier.semantics { }`",
            ios: "`.accessibilityLabel`, `.accessibilityHint`, `.accessibilityAddTraits`, …",
          },
        },
        {
          label: "Role comes from…",
          values: {
            rn: "`accessibilityRole=\"button\"`, which you usually set yourself",
            android: "The component (`Button`, `Checkbox`), or `role = Role.Checkbox` on `clickable` / `toggleable`",
            ios: "The view type (`Button`, `Toggle`), or `.accessibilityAddTraits(.isButton)`",
          },
        },
        {
          label: "Screen reader",
          values: {
            rn: "Both, via the native layer",
            android: "TalkBack",
            ios: "VoiceOver",
          },
        },
        {
          label: "Inspect the tree with…",
          values: {
            rn: "The native tools below",
            android: "Layout Inspector (semantics panel), Accessibility Scanner",
            ios: "Xcode Accessibility Inspector",
          },
        },
      ],
      callout:
        "The biggest RN habit to unlearn: you don't need to add a role to everything. A `Pressable` in RN has no role until you give it one. A Compose `Button` or a SwiftUI `Button` is announced as a button automatically. Reach for semantics modifiers only when you build custom controls.",
    },
    {
      id: "labels",
      title: "Labels, hints, and roles",
      prose: [
        "An icon-only button needs a label, or the screen reader announces nothing useful. In Compose, `Icon` and `Image` take a required `contentDescription` parameter, so the compiler makes you decide. In SwiftUI, the idiomatic fix is to give the `Button` a real title and hide it visually with `.labelStyle(.iconOnly)`. VoiceOver still reads the title.",
        "Hints (\"what happens if I activate this\") map to `accessibilityHint` on iOS. Android has no separate hint. TalkBack reads a custom *click label* instead: \"Double-tap to *label*\".",
      ],
      snippet: "labels",
      notes: {
        rn: ["`hitSlop` grows the touch target. Native components already meet the 48dp (Android) and 44pt (iOS) minimums."],
        android: [
          "`contentDescription = null` is an explicit \"decorative, skip me\". It's required, so you can't forget to decide.",
          "`semantics { onClick(label = …, action = null) }` changes only the spoken label and keeps the existing click handler.",
          "`Modifier.clickable(onClickLabel = …)` does the same for custom clickables.",
        ],
        ios: [
          "`Button(_:systemImage:role:action:)` gives you an SF Symbol plus a text label in one call. `role: .destructive` also tints it red in menus and swipe actions.",
          "Keep hints short and start with a verb. VoiceOver users can turn hints off.",
          "`Image(decorative:)` keeps an image out of the accessibility tree.",
        ],
      },
    },
    {
      id: "grouping",
      title: "Grouping and state",
      prose: [
        "A row with a checkbox, a title, and a due date should be read as one element: \"Buy milk, due Friday, not checked\". It shouldn't be three separate swipe stops. RN groups with `accessible={true}` on the parent (and `Pressable` does this by default), and exposes state with `accessibilityState`.",
        "Native does the grouping for you when the parent is interactive. Compose's `clickable`, `toggleable`, and `selectable` merge their children's semantics into one node. A SwiftUI `Button` combines its label's children. For non-interactive containers, opt in with `Modifier.semantics(mergeDescendants = true) { }` or `.accessibilityElement(children: .combine)`.",
      ],
      snippet: "grouping",
      notes: {
        android: [
          "`toggleable(role = Role.Checkbox)` gives TalkBack both the role and the checked state. It's the native version of `accessibilityRole` plus `accessibilityState`.",
          "Passing `onCheckedChange = null` makes the `Checkbox` display-only, so the row is the single tap target.",
          "Use `Modifier.clearAndSetSemantics { contentDescription = … }` to replace children's semantics entirely with your own text.",
        ],
        ios: [
          "`.accessibilityHidden(true)` stops VoiceOver from reading the SF Symbol's name (\"checkmark, circle, fill\").",
          "`.accessibilityValue` is for state that changes, like on/off or 3 of 5. The label says *what* the element is, and the value says what state it's in.",
          "For a real toggle, `Toggle` gives you the switch trait and value for free.",
        ],
      },
    },
    {
      id: "actions",
      title: "Custom actions",
      prose: [
        "Swipe-to-delete and long-press menus are invisible to screen reader users, because their gestures are taken over by the screen reader. Every platform solves this with **custom actions**: named actions attached to an element, which the user picks from a menu (TalkBack's actions menu, VoiceOver's rotor).",
      ],
      snippet: "actions",
      notes: {
        rn: ["`accessibilityActions` with standard names like `activate` and `longpress` map to native actions. Custom names become custom actions."],
        android: [
          "Each `CustomAccessibilityAction` lambda returns `true` if it handled the action.",
          "`SwipeToDismissBox` doesn't add actions for you. Add them whenever you build swipe UI.",
        ],
        ios: [
          "`.swipeActions` on `List` rows and `.contextMenu` are exposed to VoiceOver automatically.",
          "`.accessibilityAction(named:)` is for everything else: custom drag gestures, double-tap shortcuts, and so on.",
        ],
      },
    },
    {
      id: "screen-readers",
      title: "TalkBack vs VoiceOver",
      prose: [
        "The two screen readers are similar to use: swipe to move between elements, double-tap to activate. Their vocabularies differ, though, and some RN APIs map to different mechanisms on each side. Learn to turn both on quickly. On Android, set the accessibility shortcut to TalkBack. On iOS, set Settings → Accessibility → Accessibility Shortcut to VoiceOver, then triple-click the side button.",
      ],
      compare: [
        {
          label: "Mark a heading",
          values: {
            rn: "`accessibilityRole=\"header\"`",
            android: "`Modifier.semantics { heading() }`",
            ios: "`.accessibilityAddTraits(.isHeader)`",
          },
        },
        {
          label: "Announce a change",
          values: {
            rn: "`AccessibilityInfo.announceForAccessibility(msg)`",
            android: "`Modifier.semantics { liveRegion = LiveRegionMode.Polite }` on the changing text",
            ios: "`AccessibilityNotification.Announcement(msg).post()`",
          },
        },
        {
          label: "Is a screen reader on?",
          values: {
            rn: "`AccessibilityInfo.isScreenReaderEnabled()`",
            android: "`AccessibilityManager.isTouchExplorationEnabled`",
            ios: "`@Environment(\\.accessibilityVoiceOverEnabled)`",
          },
        },
        {
          label: "Move focus",
          values: {
            rn: "`AccessibilityInfo.setAccessibilityFocus(tag)`",
            android: "`FocusRequester` + `Modifier.focusRequester` (Chapter 8)",
            ios: "`@AccessibilityFocusState` + `.accessibilityFocused`",
          },
        },
        {
          label: "Reading order",
          values: {
            rn: "Follows view order",
            android: "`semantics { traversalIndex = … }` with `isTraversalGroup`",
            ios: "`.accessibilitySortPriority(_:)`",
          },
        },
        {
          label: "Automated audit",
          values: {
            rn: "None built in",
            android: "Accessibility Scanner app; Compose UI test `assert` on semantics (Chapter 17)",
            ios: "Accessibility Inspector audit; `XCUIApplication().performAccessibilityAudit()`",
          },
        },
      ],
      callout:
        "Your Compose semantics tree is also what UI tests query. `onNodeWithContentDescription(\"Delete todo\")` finds the button from the labels section. Good accessibility and testable UI come from the same work, the same way RN Testing Library's `getByRole` does.",
    },
    {
      id: "font-scaling",
      title: "Dynamic type and font scaling",
      prose: [
        "RN scales text automatically, and most RN apps then fight it with `allowFontScaling={false}` or `maxFontSizeMultiplier`. Native apps are expected to scale. Android scales every `sp` value by the user's font size, up to 200% since Android 14, which uses nonlinear scaling so large text grows less. iOS scales text styles (`.body`, `.headline`) through Dynamic Type, including five extra-large *accessibility sizes*.",
        "Scaling text isn't enough. At the largest sizes, rows that sat side by side need to stack, and icons should grow with the text. This snippet does both.",
      ],
      snippet: "font-scaling",
      notes: {
        rn: ["`fontScale` from `useWindowDimensions` is the same number Android reports as `fontScale`. On iOS, RN derives it from the Dynamic Type size."],
        android: [
          "`20.sp.toDp()` converts a text-relative size to layout units at the current scale. It's the Compose take on `@ScaledMetric`.",
          "Use `sp` for text sizes, never `dp`. A `dp` font ignores the user's setting entirely.",
          "To cap scaling for one piece of text, wrap it with a `CompositionLocalProvider` that overrides `LocalDensity`. Do this sparingly.",
        ],
        ios: [
          "`isAccessibilitySize` is `true` for the five largest sizes, which is where layouts usually need to change.",
          "`AnyLayout` switches between `HStackLayout` and `VStackLayout` without losing the children's state, unlike an `if`/`else`.",
          "`.dynamicTypeSize(...DynamicTypeSize.accessibility2)` caps scaling for one view. It's `maxFontSizeMultiplier` for SwiftUI.",
          "Fixed sizes like `.font(.system(size: 14))` don't scale. Use text styles, or `.font(.custom(\"Inter\", size: 14, relativeTo: .body))` for custom fonts.",
        ],
      },
    },
    {
      id: "reduce-motion",
      title: "Reduced motion and other settings",
      prose: [
        "Chapter 15's animations should respect the user's motion preference. iOS exposes **Reduce Motion** directly as an environment value. Android has no exact equivalent. The closest is **Remove animations**, which sets the system animator duration scale to `0`.",
      ],
      snippet: "reduce-motion",
      notes: {
        rn: ["Reanimated's `useReducedMotion` reads exactly these two settings: Reduce Motion on iOS, and the animator scale on Android."],
        android: [
          "`Settings.Global` values aren't observable state. This reads once per composition entry, which is enough for most screens.",
          "When reduce motion is on, replace big movement with a fade rather than cutting all feedback.",
        ],
        ios: [
          "Other environment values work the same way: `\\.accessibilityDifferentiateWithoutColor`, `\\.legibilityWeight` (Bold Text), `\\.colorSchemeContrast` (Increase Contrast).",
          "Reading them from `@Environment` means the view updates as soon as the user changes the setting.",
        ],
      },
    },
    {
      id: "strings",
      title: "Strings and plurals",
      prose: [
        "RN apps bundle JSON translation files and look keys up at runtime. Both native platforms compile strings into the app, pick the language automatically, and handle plural rules for every locale.",
        "Android uses **string resources**: `res/values/strings.xml` for the default language, and `res/values-es/`, `res/values-ar/`, and so on for translations. Each string gets a generated `R.string.*` constant, so a typo in a key is a compile error. iOS uses **String Catalogs** (`.xcstrings`, Xcode 15+). You write natural strings in code, and Xcode extracts them into the catalog on each build, where translators fill them in.",
      ],
      snippet: "strings",
      notes: {
        rn: ["i18next's `_one`/`_other` suffixes mirror CLDR plural categories. Android `<plurals>` and String Catalogs use the same categories (`zero`, `one`, `two`, `few`, `many`, `other`)."],
        android: [
          "`%1$s` and `%d` are Java format specifiers. Use positional ones (`%1$s`, `%2$d`) so translators can reorder arguments.",
          "Android Studio's *Translations Editor* shows every locale's strings side by side and flags missing ones.",
          "Per-app language (Android 13+): declare `android:localeConfig` in the manifest, and users can pick your app's language in system Settings. Use `AppCompatDelegate.setApplicationLocales` for an in-app picker.",
        ],
        ios: [
          "The key is the English string itself, with interpolations turned into format specifiers (`%@`, `%lld`).",
          "`Text(\"literal\")` is localized, but `Text(someStringVariable)` is *not*. Pass `LocalizedStringKey(variable)` or use `String(localized:)` upstream.",
          "iOS has per-app language built in. Once your app ships more than one localization, Settings shows a language picker for it.",
        ],
      },
    },
    {
      id: "formatting",
      title: "Dates, numbers, and right-to-left",
      prose: [
        "`Intl.DateTimeFormat` and `Intl.NumberFormat` become `java.time` and `java.text` on Android, and `FormatStyle` on iOS. All of them use the user's locale by default, so \"Mar 5, 2026\" becomes \"5 mars 2026\" in French without any extra work.",
        "Right-to-left languages are where native really helps. RN needs `I18nManager.forceRTL` and an app restart. Compose and SwiftUI flip layouts automatically based on the locale, as long as you use *start/end* (Compose) and *leading/trailing* (SwiftUI) instead of left/right.",
      ],
      snippet: "formatting",
      notes: {
        rn: ["Older Hermes versions had incomplete `Intl` support, so many RN apps ship `date-fns` or polyfills. Native needs neither."],
        android: [
          "`LocalConfiguration.current.locales[0]` makes the composable recompose when the user changes language.",
          "`java.time` requires API 26, or core library desugaring for older devices.",
          "`Modifier.padding(start = …)` flips in RTL. Icons that imply direction, like arrows, need `autoMirrored` versions (`Icons.AutoMirrored.Filled.ArrowBack`).",
        ],
        ios: [
          "`Text(_:format:)` formats and localizes in one step, and updates when the locale changes.",
          "Use `.padding(.leading)`, never left. To preview RTL, add `.environment(\\.layoutDirection, .rightToLeft)` to a `#Preview`.",
          "SF Symbols with directional meaning flip automatically in RTL.",
        ],
      },
      compare: [
        {
          label: "Date",
          values: {
            rn: "`Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })`",
            android: "`DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM)`",
            ios: "`date.formatted(date: .abbreviated, time: .omitted)`",
          },
        },
        {
          label: "Relative time",
          values: {
            rn: "`Intl.RelativeTimeFormat`",
            android: "`DateUtils.getRelativeTimeSpanString`",
            ios: "`Text(date, style: .relative)` / `.formatted(.relative(presentation: .named))`",
          },
        },
        {
          label: "Force RTL to test",
          values: {
            rn: "`I18nManager.forceRTL(true)` + restart",
            android: "Developer options → *Force RTL layout direction*, or `@Preview(locale = \"ar\")`",
            ios: "Scheme → App Language → *Right-to-Left Pseudolanguage*",
          },
        },
      ],
    },
  ],
  gotchas: [
    {
      title: "Don't label what's already labeled",
      body: "Adding `contentDescription` to a `Button` that already contains `Text`, or `.accessibilityLabel` to a `Button(\"Save\")`, replaces the visible text and can make the two drift apart. Label icons and custom controls. Let text speak for itself.",
    },
    {
      title: "Interactive parents merge; plain containers don't",
      body: "A `clickable` Row or a SwiftUI `Button` is read as one element. A plain `Row` or `HStack` of `Text`s is read as several. RN's `accessible` prop was explicit, but on native, check the result with TalkBack or VoiceOver rather than assuming.",
    },
    {
      title: "`Text(variable)` isn't localized on iOS",
      body: "SwiftUI treats string *literals* as `LocalizedStringKey`, but a `String` variable is displayed verbatim. If you pass labels around as `String`, convert them with `String(localized:)` where they're created, or type them as `LocalizedStringResource`.",
    },
    {
      title: "Use `sp` for text and text styles for fonts",
      body: "`fontSize = 14.dp` won't compile in Compose, but `.font(.system(size: 14))` compiles in SwiftUI and ignores Dynamic Type. Both mistakes give you text that doesn't scale. In Compose, use `MaterialTheme.typography`. In SwiftUI, use text styles or `relativeTo:`.",
    },
    {
      title: "Hard-coded strings slip through in Compose",
      body: "Android Lint flags `Text(\"Hello\")` with a literal as `HardcodedText` in XML layouts, but not in Compose. Neither IDE stops you from shipping English-only strings in code. Make string resources a code-review rule from day one, because extracting them later is tedious.",
    },
    {
      title: "Left and right are bugs",
      body: "`Arrangement.Absolute.Left`, `.padding(.left)` (which doesn't exist in SwiftUI for this reason), and manual `x` offsets don't flip in RTL. Use start/end and leading/trailing everywhere, and preview in an RTL locale.",
    },
  ],
  cheatsheet: [
    { rn: "`accessibilityLabel`", android: "`contentDescription` / `semantics { contentDescription }`", ios: "`.accessibilityLabel()`" },
    { rn: "`accessibilityHint`", android: "`onClickLabel` (\"Double-tap to …\")", ios: "`.accessibilityHint()`" },
    { rn: "`accessibilityRole`", android: "Built-in component, or `role = Role.X`", ios: "Built-in view, or `.accessibilityAddTraits()`" },
    { rn: "`accessibilityState={{ checked }}`", android: "`Modifier.toggleable(value, role)`", ios: "`Toggle`, or `.accessibilityValue()`" },
    { rn: "`accessible` (group)", android: "`semantics(mergeDescendants = true)`", ios: "`.accessibilityElement(children: .combine)`" },
    { rn: "`importantForAccessibility=\"no\"`", android: "`contentDescription = null` / `clearAndSetSemantics {}`", ios: "`.accessibilityHidden(true)`" },
    { rn: "`accessibilityActions`", android: "`semantics { customActions }`", ios: "`.accessibilityAction(named:)`" },
    { rn: "`accessibilityRole=\"header\"`", android: "`semantics { heading() }`", ios: "`.accessibilityAddTraits(.isHeader)`" },
    { rn: "`announceForAccessibility`", android: "`liveRegion = LiveRegionMode.Polite`", ios: "`AccessibilityNotification.Announcement`" },
    { rn: "`useWindowDimensions().fontScale`", android: "`LocalDensity.current.fontScale`", ios: "`@Environment(\\.dynamicTypeSize)`" },
    { rn: "`maxFontSizeMultiplier`", android: "Override `LocalDensity` (sparingly)", ios: "`.dynamicTypeSize(...max)`" },
    { rn: "`useReducedMotion()`", android: "`ANIMATOR_DURATION_SCALE == 0f`", ios: "`@Environment(\\.accessibilityReduceMotion)`" },
    { rn: "`t('key', { name })`", android: "`stringResource(R.string.key, name)`", ios: "`Text(\"Hello, \\(name)\")`" },
    { rn: "`t('key', { count })` plurals", android: "`pluralStringResource(R.plurals.key, count, count)`", ios: "String Catalog *Vary by Plural*" },
    { rn: "`Intl.*Format`", android: "`java.time` / `NumberFormat`", ios: "`.formatted()` / `Text(_:format:)`" },
    { rn: "`I18nManager.isRTL`", android: "`LocalLayoutDirection.current`", ios: "`@Environment(\\.layoutDirection)`" },
  ],
  quiz: [
    {
      question: "You have an icon-only delete button in Compose. Where does its accessible name go?",
      options: [
        "`Modifier.accessibilityLabel(\"Delete todo\")`",
        "`Icon(Icons.Filled.Delete, contentDescription = \"Delete todo\")`",
        "`IconButton(role = \"button\", label = \"Delete todo\")`",
        "It's automatic from the icon's name",
      ],
      answer: 1,
      explanation: "`Icon` and `Image` require a `contentDescription` parameter, so the compiler makes you decide between a label and `null` (decorative). `IconButton` already provides the button role.",
    },
    {
      question: "A Compose `Row` has `Modifier.toggleable(…)` and contains a `Checkbox` and two `Text`s. How does TalkBack read it?",
      options: [
        "Three separate elements",
        "One merged element with the checkbox role and checked state",
        "Only the checkbox; the texts are skipped",
        "Nothing until you add `mergeDescendants = true`",
      ],
      answer: 1,
      explanation: "`clickable`, `toggleable`, and `selectable` merge their children's semantics automatically. Passing `onCheckedChange = null` to the `Checkbox` keeps it from becoming a second focus stop.",
    },
    {
      question: "Your todo rows support swipe-to-pin with a custom gesture. How do VoiceOver users pin a todo?",
      options: [
        "They can't; swipe gestures are visual only",
        "VoiceOver passes custom swipes through automatically",
        "Add `.accessibilityAction(named: \"Pin\") { … }` to the row",
        "Add `.accessibilityHint(\"Swipe right to pin\")`",
      ],
      answer: 2,
      explanation: "Screen readers take over swipe gestures for navigation. Custom actions show up in VoiceOver's rotor (and TalkBack's actions menu), so the feature stays reachable. `List.swipeActions` gets this for free, but custom gestures don't.",
    },
    {
      question: "In SwiftUI, `let title: String = \"Delete\"` then `Text(title)`. Is it localized?",
      options: [
        "Yes, all `Text` is localized",
        "No; only string literals become `LocalizedStringKey`. A `String` variable is shown verbatim.",
        "Only if the app has a String Catalog",
        "Only in release builds",
      ],
      answer: 1,
      explanation: "`Text(\"Delete\")` uses the `LocalizedStringKey` initializer, while `Text(someString)` uses the verbatim `StringProtocol` one. Localize where the string is created with `String(localized:)`.",
    },
    {
      question: "Why does Android's `pluralStringResource(R.plurals.todo_count, count, count)` pass `count` twice?",
      options: [
        "It's a typo; once is enough",
        "The first picks the plural form (one/other/few…), the second is the format argument for `%d`",
        "The second is the default value",
        "One is for TalkBack, one is for display",
      ],
      answer: 1,
      explanation: "Selecting the plural category and formatting the string are separate steps. A string like \"%1$d of %2$d todos\" might pick its form from one number and display several.",
    },
    {
      question: "At the largest Dynamic Type sizes, your SwiftUI `HStack` of label + value overflows. What's the idiomatic fix?",
      options: [
        "`.minimumScaleFactor(0.5)` on everything",
        "Disable Dynamic Type for the screen",
        "Switch to a vertical layout when `dynamicTypeSize.isAccessibilitySize`, e.g. with `AnyLayout`",
        "Use fixed `.system(size:)` fonts",
      ],
      answer: 2,
      explanation: "Large-text users expect content to reflow, not shrink. `AnyLayout` swaps `HStackLayout` and `VStackLayout` while keeping the children's identity. On Android, the equivalent check is `LocalDensity.current.fontScale`.",
    },
    {
      question: "Which Compose modifier lays out correctly in both English and Arabic?",
      options: [
        "`Modifier.padding(left = 16.dp)`",
        "`Modifier.padding(start = 16.dp)`",
        "`Modifier.absolutePadding(left = 16.dp)`",
        "`Modifier.offset(x = 16.dp)`",
      ],
      answer: 1,
      explanation: "`start` and `end` follow the layout direction, so they flip in RTL locales. `absolutePadding` and raw offsets don't. SwiftUI's version is leading/trailing, and RN needs `I18nManager` plus a restart.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "TalkBack announces this as just \"Button\". Which line is the bug?",
      code: `@Composable
fun DeleteButton(onDelete: () -> Unit) {
    IconButton(onClick = onDelete) {
        Icon(
            Icons.Default.Delete,
            contentDescription = null,
        )
    }
}`,
      answer: 6,
      explanation: "`null` marks the icon as decorative, so an icon-only button has nothing to announce. Pass `contentDescription = \"Delete\"`, the equivalent of `accessibilityLabel`. Use `null` only when visible text already labels the button.",
    },
    {
      kind: "bug",
      platform: "ios",
      question: "Users with large text settings say the captions never get bigger. Which line is the bug?",
      code: `struct Caption: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.system(size: 13))
            .foregroundStyle(.secondary)
    }
}`,
      answer: 6,
      explanation: "A fixed point size opts out of Dynamic Type. Use a text style like `.font(.caption)`. If you need a custom size, use `.font(.system(.caption, design: .rounded))`, or scale it with `@ScaledMetric`.",
    },
  ],
};
