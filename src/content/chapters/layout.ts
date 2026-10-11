import type { Chapter } from "../types";

export const layout: Chapter = {
  slug: "layout",
  title: "Layout & styling",
  intro: [
    "In React Native, almost every layout is flexbox on a `View`. Compose and SwiftUI don't use flexbox. They use small, single-purpose containers: **rows, columns, and stacks** (`Row`, `Column`, `Box` and `HStack`, `VStack`, `ZStack`). Most RN layouts map onto these in a straight line, and this chapter shows how.",
    "The bigger shift is *who decides sizes*. In RN, Yoga solves the whole tree at once. On native, a parent tells each child how much room it has, the child picks its own size, and the parent places it. Once that clicks, most \"why is this not filling the screen?\" moments go away.",
    "The chapter ends with theming, dark mode, and font scaling. These are where native gives you the most for free, as long as you don't fight the defaults.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "How layout works",
      prose: [
        "Flexbox is one algorithm with many knobs. Native layout is many simple containers, each with a couple of knobs. You nest them instead of configuring them.",
        "The defaults differ in ways that bite RN developers. A flexbox column stretches its children across. A Compose `Column` and a SwiftUI `VStack` don't: children are only as wide as their content. And a `VStack` centers them.",
      ],
      compare: [
        {
          label: "Algorithm",
          values: {
            rn: "Yoga (flexbox) solves the tree, then native views are positioned",
            android: "Parent passes *constraints* (min/max size) down. Each child measures once, then the parent places it.",
            ios: "Parent *proposes* a size, the child chooses its own size, then the parent places it",
          },
        },
        {
          label: "Vertical container",
          values: {
            rn: "`<View>` (default `flexDirection: 'column'`)",
            android: "`Column`",
            ios: "`VStack`",
          },
        },
        {
          label: "Horizontal container",
          values: {
            rn: "`<View style={{ flexDirection: 'row' }}>`",
            android: "`Row`",
            ios: "`HStack`",
          },
        },
        {
          label: "Layered container",
          values: {
            rn: "`<View>` with `position: 'absolute'` children",
            android: "`Box`",
            ios: "`ZStack`, or `.overlay` / `.background`",
          },
        },
        {
          label: "Default cross-axis alignment",
          values: {
            rn: "`alignItems: 'stretch'`",
            android: "Start (top of a `Row`, left of a `Column`). No stretching.",
            ios: "`.center`. No stretching.",
          },
        },
        {
          label: "Default size",
          values: {
            rn: "Stretches across the cross axis, hugs content on the main axis",
            android: "Hugs content",
            ios: "Hugs content",
          },
        },
      ],
      callout:
        "If something looks too narrow, it's usually the defaults, not a bug. Add `Modifier.fillMaxWidth()` in Compose or `.frame(maxWidth: .infinity)` in SwiftUI, which is what `alignItems: 'stretch'` was quietly doing for you.",
    },
    {
      id: "stacks",
      title: "flexDirection & alignment → rows, columns, stacks",
      prose: [
        "Choose the container instead of setting `flexDirection`. Then map the two flexbox axes: Compose calls main-axis distribution **Arrangement** and cross-axis positioning **Alignment**. SwiftUI stacks only take an `alignment` (cross axis) and a `spacing`.",
        "`gap` maps neatly: `Arrangement.spacedBy(12.dp)` in Compose and `spacing: 12` in SwiftUI.",
      ],
      snippet: "stacks",
      notes: {
        android: [
          "A `Row` takes `horizontalArrangement` (justifyContent) and `verticalAlignment` (alignItems). A `Column` takes the opposite pair: `verticalArrangement` and `horizontalAlignment`.",
          "`Arrangement.SpaceBetween`, `SpaceAround`, and `SpaceEvenly` match their flexbox names.",
          "To override alignment for one child (`alignSelf`), use `Modifier.align(…)` inside the `Row` or `Column`.",
        ],
        ios: [
          "Stacks center children on the cross axis by default. Pass `alignment: .leading` to a `VStack` to get RN's left-aligned look.",
          "There's no `justifyContent`. Use `Spacer()` to push things apart: one `Spacer` between two views is `space-between`.",
          "If you leave out `spacing`, SwiftUI picks a platform default (usually about 8pt), not `0`.",
        ],
      },
    },
    {
      id: "fill",
      title: "flex: 1 → weight() and maxWidth: .infinity",
      prose: [
        "`flex: 1` means \"take the leftover space\". In a Compose `Row` or `Column`, that's `Modifier.weight(1f)`. Weights are proportional, so `weight(2f)` next to `weight(1f)` splits the space 2:1, exactly like `flex: 2` and `flex: 1`.",
        "SwiftUI has no weights. A view grows when you let it: `.frame(maxWidth: .infinity)` says \"I'll take as much width as you offer\". `Spacer()` is a flexible gap that does the same thing between views.",
      ],
      snippet: "fill",
      compare: [
        {
          label: "Fill the parent",
          values: {
            rn: "`flex: 1` or `width: '100%'`",
            android: "`Modifier.fillMaxSize()` / `fillMaxWidth()`",
            ios: "`.frame(maxWidth: .infinity, maxHeight: .infinity)`",
          },
        },
        {
          label: "Take the leftover space",
          values: {
            rn: "`flex: 1` on one child",
            android: "`Modifier.weight(1f)` on one child",
            ios: "`.frame(maxWidth: .infinity)` on one child, or a `Spacer()`",
          },
        },
        {
          label: "Proportional split",
          values: {
            rn: "`flex: 2` and `flex: 1`",
            android: "`weight(2f)` and `weight(1f)`",
            ios: "No direct equivalent. Use `GeometryReader` or a custom `Layout`.",
          },
        },
        {
          label: "Push to the end",
          values: {
            rn: "`marginLeft: 'auto'` or a `flex: 1` spacer",
            android: "`Spacer(Modifier.weight(1f))`",
            ios: "`Spacer()`",
          },
        },
      ],
      notes: {
        android: [
          "`weight` only exists inside `RowScope` and `ColumnScope`, so you can only use it on a direct child of a `Row` or `Column`.",
          "`fillMaxWidth()` fills the space the parent offers. Inside a `Row`, that would squeeze its siblings, so use `weight` there instead.",
        ],
        ios: [
          "The `alignment:` in `.frame(maxWidth: .infinity, alignment: .leading)` positions the content inside the bigger frame. Without it, the text sits in the middle.",
        ],
      },
    },
    {
      id: "spacing",
      title: "Padding, margins & gaps",
      prose: [
        "Neither platform has `margin`. There's only padding, and the order of modifiers decides whether it acts like padding or like margin. Padding added *outside* a background is a margin. Padding added *inside* it is padding.",
        "For space between siblings, prefer the container's spacing (`spacedBy` or `spacing:`) over padding on each child. For a one-off gap, use padding on that child or a fixed `Spacer`.",
      ],
      snippet: "spacing",
      notes: {
        rn: ["`margin` is outside the background and `padding` is inside it. Native expresses both with padding plus order."],
        android: [
          "Read the chain top to bottom as outside → inside: margin, then background, then padding.",
          "A fixed gap is `Spacer(Modifier.height(12.dp))` in a `Column` or `Spacer(Modifier.width(12.dp))` in a `Row`.",
          "`Modifier.padding(horizontal = 12.dp, vertical = 6.dp)` is `paddingHorizontal` plus `paddingVertical`.",
        ],
        ios: [
          "Read the chain bottom to top as outside → inside, the reverse of Compose.",
          "`.padding()` with no value uses a platform default (about 16pt). Pass a number if you want a specific size.",
          "Pass edges to pad one side: `.padding(.top, 12)`, `.padding(.horizontal, 16)`.",
        ],
      },
    },
    {
      id: "overlay",
      title: "Absolute positioning → Box, ZStack & offset",
      prose: [
        "`position: 'absolute'` is how RN layers things: badges, floating buttons, gradients over images. Native gives you layering containers instead. A Compose `Box` stacks children on top of each other, and each child can `align` itself to a corner. SwiftUI has `ZStack`, plus `.overlay` and `.background`, which layer a view on top of or behind another *without changing its size*.",
        "For a small nudge, use `offset`. It moves a view after layout, so siblings don't move to make room. It behaves like `transform: [{ translateX }]` in RN, not like `top` and `left`.",
      ],
      snippet: "overlay",
      notes: {
        android: [
          "`Modifier.align(Alignment.TopEnd)` is only available inside a `Box`. \"End\" means right in left-to-right languages and left in right-to-left ones.",
          "Material 3 ships `BadgedBox` and `Badge` for this exact case. Use those in real code.",
          "Negative dp needs parentheses: `(-4).dp`.",
        ],
        ios: [
          "`.overlay(alignment:)` sizes itself to the view it decorates. A `ZStack` sizes itself to its largest child. Pick `.overlay` when one view is the anchor.",
          "`.topTrailing` is the right edge in left-to-right languages, like Compose's `End`.",
        ],
      },
    },
    {
      id: "sizing",
      title: "Sizing & responsive layout",
      prose: [
        "Fixed sizes and aspect ratios translate directly. Responsive layout is where the APIs differ. Instead of reading the window size with `useWindowDimensions`, you usually ask how much room *this container* has.",
      ],
      compare: [
        {
          label: "Fixed size",
          values: {
            rn: "`width: 48, height: 48`",
            android: "`Modifier.size(48.dp)`",
            ios: "`.frame(width: 48, height: 48)`",
          },
        },
        {
          label: "Min / max size",
          values: {
            rn: "`minWidth`, `maxWidth`",
            android: "`Modifier.sizeIn(minWidth = …, maxWidth = …)` / `widthIn(…)`",
            ios: "`.frame(minWidth: …, maxWidth: …)`",
          },
        },
        {
          label: "Aspect ratio",
          values: {
            rn: "`aspectRatio: 16 / 9`",
            android: "`Modifier.aspectRatio(16f / 9f)`",
            ios: "`.aspectRatio(16 / 9, contentMode: .fit)`",
          },
        },
        {
          label: "Wrapping rows",
          values: {
            rn: "`flexWrap: 'wrap'`",
            android: "`FlowRow`",
            ios: "No built-in. Write a custom `Layout` (iOS 16+) or use `LazyVGrid`.",
          },
        },
        {
          label: "Container size",
          values: {
            rn: "`onLayout` event",
            android: "`BoxWithConstraints { maxWidth … }`",
            ios: "`GeometryReader`, or `.containerRelativeFrame` (iOS 17+)",
          },
        },
        {
          label: "Window size class",
          values: {
            rn: "`useWindowDimensions()` plus your own breakpoints",
            android: "`currentWindowAdaptiveInfo().windowSizeClass`",
            ios: "`@Environment(\\.horizontalSizeClass)`",
          },
        },
      ],
      notes: {
        android: ["Breakpoints on Android are *window size classes* (compact, medium, expanded). Foldables and tablets make these matter more than they do on iOS."],
        ios: ["`GeometryReader` takes all the space it's offered, which often breaks layouts. Reach for it last."],
      },
    },
    {
      id: "scrolling",
      title: "ScrollView & safe areas",
      prose: [
        "Containers don't scroll on their own. You opt in. In Compose, a scrolling column is a `Column` with `Modifier.verticalScroll(rememberScrollState())`. SwiftUI has a `ScrollView` that behaves like RN's.",
        "Safe areas are where the platforms differ most. iOS keeps content out of the notch and home indicator automatically. Android apps targeting SDK 35 (Android 15) are **edge-to-edge** by default: your content draws under the status and navigation bars until you add insets. `Scaffold` handles this for you through its `innerPadding`.",
      ],
      compare: [
        {
          label: "Vertical scroll",
          values: {
            rn: "`<ScrollView>`",
            android: "`Column(Modifier.verticalScroll(rememberScrollState()))`",
            ios: "`ScrollView { VStack { … } }`",
          },
        },
        {
          label: "Horizontal scroll",
          values: {
            rn: "`<ScrollView horizontal>`",
            android: "`Row(Modifier.horizontalScroll(rememberScrollState()))`",
            ios: "`ScrollView(.horizontal) { HStack { … } }`",
          },
        },
        {
          label: "Long or dynamic content",
          values: {
            rn: "`FlatList`",
            android: "`LazyColumn` (Chapter 7)",
            ios: "`List` / `LazyVStack` (Chapter 7)",
          },
        },
        {
          label: "Safe area",
          values: {
            rn: "`<SafeAreaView>` / `useSafeAreaInsets()`",
            android: "`Scaffold`'s `innerPadding`, or `Modifier.windowInsetsPadding(WindowInsets.safeDrawing)`",
            ios: "Automatic. Opt out with `.ignoresSafeArea()`.",
          },
        },
        {
          label: "Draw behind system bars",
          values: {
            rn: "`translucent` status bar + manual insets",
            android: "The default when edge-to-edge (call `enableEdgeToEdge()` in your Activity on older targets)",
            ios: "`.ignoresSafeArea()` on a background",
          },
        },
      ],
      callout:
        "On Android, don't nest a `LazyColumn` inside a `verticalScroll` column. It crashes at runtime with an \"infinite height\" error. It's the same idea as RN's warning about nesting a `FlatList` in a `ScrollView`, but here it's fatal.",
    },
    {
      id: "theme",
      title: "Theming & design tokens",
      prose: [
        "RN apps usually build a theme object and share it through Context. On Android, **`MaterialTheme`** is that object, already wired up: it provides `colorScheme`, `typography`, and `shapes`, and every Material component reads from it. For your own tokens (spacing, brand extras), add a `CompositionLocal`, which is Compose's Context.",
        "SwiftUI's version of Context is the **environment**. Built-in values like `tint`, `font`, and `colorScheme` flow down the tree, and you can add your own keys. Colors usually live in the asset catalog with light and dark variants, so they adapt automatically.",
      ],
      snippet: "theme",
      notes: {
        android: [
          "Wrap your whole app in `AppTheme { … }` once, in `setContent`.",
          "`staticCompositionLocalOf` suits values that rarely change. Use `compositionLocalOf` if they change often. Chapter 10 covers `CompositionLocal` in depth.",
          "On Android 12+, `dynamicLightColorScheme(context)` builds the palette from the user's wallpaper (Material You). Many apps offer it as an option.",
          "Read colors by role (`primary`, `onPrimary`, `surfaceContainer`) instead of hard-coding hex values. That's what makes dark mode work.",
        ],
        ios: [
          "`@Entry` (Xcode 16+) generates the `EnvironmentKey` boilerplate. Older code declares a `struct SpacingKey: EnvironmentKey` by hand.",
          "Xcode 15+ generates symbols for asset colors, so you can also write `Color(.brand)` or `.brand` without the extension.",
          "`.tint(…)` at the root recolors buttons, links, and toggles throughout the app. It's the closest thing to Material's `primary`.",
        ],
      },
    },
    {
      id: "dark-mode",
      title: "Dark mode",
      prose: [
        "In RN, dark mode is opt-in. You read `useColorScheme()` and pick colors yourself. Native flips it around: system components and semantic colors are dark-mode aware by default, and hard-coded colors are what break it.",
        "On Android, you switch between two `ColorScheme`s at the top of the tree (see the `AppTheme` above). On iOS, every color can carry a dark variant, so you rarely branch in code at all.",
      ],
      compare: [
        {
          label: "Read the current scheme",
          values: {
            rn: "`useColorScheme()`",
            android: "`isSystemInDarkTheme()`",
            ios: "`@Environment(\\.colorScheme) var colorScheme`",
          },
        },
        {
          label: "Adaptive colors",
          values: {
            rn: "Pick from two palettes by hand",
            android: "`MaterialTheme.colorScheme.*` roles",
            ios: "Semantic colors (`.primary`, `Color(.systemBackground)`) and asset catalog colors with a Dark variant",
          },
        },
        {
          label: "Force a scheme",
          values: {
            rn: "`Appearance.setColorScheme('dark')`",
            android: "Pass `darkColorScheme()` to `MaterialTheme`",
            ios: "`.preferredColorScheme(.dark)`",
          },
        },
        {
          label: "Preview both",
          values: {
            rn: "Toggle the simulator appearance",
            android: "`@Preview(uiMode = UI_MODE_NIGHT_YES)`",
            ios: "Previews canvas → Variants, or `.preferredColorScheme(.dark)` in `#Preview`",
          },
        },
      ],
    },
    {
      id: "dynamic-type",
      title: "Font scaling & Dynamic Type",
      prose: [
        "RN scales text with the system font size unless you set `allowFontScaling={false}`. Native does too, and users rely on it far more than most RN apps assume. Your job is to make layouts *survive* large text: let rows wrap, avoid fixed heights on text containers, and scale icons with the text.",
        "Android scales anything measured in `sp`. iOS scales *text styles* (`.body`, `.headline`), not fixed point sizes, so prefer `.font(.body)` over `.font(.system(size: 17))`.",
      ],
      snippet: "dynamic-type",
      notes: {
        android: [
          "Converting `20.sp` to dp gives you a size that follows the font scale. Android 14+ scales large text non-linearly, so this is more accurate than multiplying by `fontScale` yourself.",
          "Test with Settings → Display → Font size at maximum, or `@Preview(fontScale = 2f)`.",
        ],
        ios: [
          "`@ScaledMetric` scales any number (padding, icon size) along with a text style.",
          "SF Symbols used as text (`Image(systemName:)` with a `.font`) scale automatically. `.resizable()` turns that off, which is why the snippet needs `@ScaledMetric`.",
          "Chapter 16 covers accessibility sizes in depth.",
        ],
      },
    },
  ],
  gotchas: [
    {
      title: "Nothing stretches by default",
      body: "RN columns stretch their children across (`alignItems: 'stretch'`). Compose and SwiftUI children hug their content. Add `fillMaxWidth()` or `.frame(maxWidth: .infinity)` where you relied on stretching.",
    },
    {
      title: "VStack centers its children",
      body: "A SwiftUI `VStack` defaults to `alignment: .center`, so mixed-width text lines up down the middle. You almost always want `VStack(alignment: .leading)`.",
    },
    {
      title: "There is no margin",
      body: "Margin is just padding applied outside the background or border. Get the modifier order right (outside first in Compose, outside last in SwiftUI), or use the container's spacing.",
    },
    {
      title: "offset doesn't move siblings",
      body: "`offset` shifts a view after layout, like a translate transform. Siblings stay where they were and the view can overlap them. Use padding or alignment if you want layout to account for the move.",
    },
    {
      title: "Android 15 is edge-to-edge",
      body: "Targeting SDK 35 makes your content draw behind the status and navigation bars. Use `Scaffold`'s `innerPadding` or `WindowInsets` padding. iOS handles the safe area for you.",
    },
    {
      title: "Hex colors break dark mode",
      body: "In RN you might ship a single light palette. On native, system UI goes dark automatically, so a hard-coded `Color(0xFFFFFFFF)` background stands out. Use theme roles on Android and semantic or asset catalog colors on iOS.",
    },
  ],
  cheatsheet: [
    { rn: "`<View>` (column)", android: "`Column`", ios: "`VStack`" },
    { rn: "`flexDirection: 'row'`", android: "`Row`", ios: "`HStack`" },
    { rn: "`position: 'absolute'` layers", android: "`Box` + `Modifier.align`", ios: "`ZStack` / `.overlay(alignment:)`" },
    { rn: "`justifyContent`", android: "`horizontalArrangement` / `verticalArrangement`", ios: "`Spacer()`" },
    { rn: "`alignItems`", android: "`verticalAlignment` / `horizontalAlignment`", ios: "`alignment:` on the stack" },
    { rn: "`alignSelf`", android: "`Modifier.align(…)`", ios: "`.frame(maxWidth: .infinity, alignment: …)`" },
    { rn: "`gap: 12`", android: "`Arrangement.spacedBy(12.dp)`", ios: "`spacing: 12`" },
    { rn: "`flex: 1`", android: "`Modifier.weight(1f)`", ios: "`.frame(maxWidth: .infinity)` / `Spacer()`" },
    { rn: "`width: '100%'`", android: "`Modifier.fillMaxWidth()`", ios: "`.frame(maxWidth: .infinity)`" },
    { rn: "`margin`", android: "`padding` before `background`", ios: "`.padding` after `.background`" },
    { rn: "`transform: translate`", android: "`Modifier.offset(x, y)`", ios: "`.offset(x:y:)`" },
    { rn: "`flexWrap: 'wrap'`", android: "`FlowRow`", ios: "Custom `Layout`" },
    { rn: "`<ScrollView>`", android: "`Modifier.verticalScroll(rememberScrollState())`", ios: "`ScrollView`" },
    { rn: "`<SafeAreaView>`", android: "`Scaffold` `innerPadding` / `WindowInsets`", ios: "Automatic" },
    { rn: "Theme Context", android: "`MaterialTheme` + `CompositionLocal`", ios: "`@Environment` + asset colors" },
    { rn: "`useColorScheme()`", android: "`isSystemInDarkTheme()`", ios: "`@Environment(\\.colorScheme)`" },
  ],
  quiz: [
    {
      question: "You port `<View style={{ flexDirection: 'row' }}><Text style={{ flex: 1 }}/><Button/></View>` to Compose. What goes on the `Text`?",
      options: ["`Modifier.fillMaxWidth()`", "`Modifier.weight(1f)`", "`Modifier.flex(1f)`", "`Modifier.wrapContentWidth()`"],
      answer: 1,
      explanation: "`weight` claims the leftover space in a `Row` or `Column` after unweighted siblings are measured. `fillMaxWidth()` would ask for the full row width and squeeze the button out.",
    },
    {
      question: "A SwiftUI `VStack` holds a title and a shorter subtitle, and they line up down the middle. Why?",
      options: [
        "`Text` is centered by default",
        "`VStack` defaults to `alignment: .center`",
        "The parent applied `.multilineTextAlignment(.center)`",
        "SwiftUI mirrors RN's `alignItems: 'center'` default",
      ],
      answer: 1,
      explanation: "Stacks center their children on the cross axis unless you pass `alignment:`. Use `VStack(alignment: .leading)`. RN's default is actually `stretch`, which is why this surprises people.",
    },
    {
      question: "In SwiftUI, which chain gives a gray card 16pt of inner padding *and* 16pt of space around it?",
      options: [
        "`.padding(16).background(.gray).padding(16)`",
        "`.background(.gray).padding(16).padding(16)`",
        "`.padding(32).background(.gray)`",
        "`.margin(16).padding(16).background(.gray)`",
      ],
      answer: 0,
      explanation: "SwiftUI wraps from the inside out. The first padding sits inside the background, and the last padding acts as a margin. There's no `.margin` modifier.",
    },
    {
      question: "You add `.offset(y: 20)` to the first item in a `VStack`. What happens to the second item?",
      options: [
        "It moves down 20pt as well",
        "It stays put. The first item may overlap it.",
        "The stack grows by 20pt",
        "It moves up 20pt to fill the gap",
      ],
      answer: 1,
      explanation: "`offset` is applied after layout, like an RN translate transform. The stack still reserves the item's original slot. Use `.padding(.top, 20)` if you want the layout to change.",
    },
    {
      question: "After bumping `targetSdk` to 35, your Compose screen's title sits under the status bar. What's the fix?",
      options: [
        "Wrap the screen in `SafeAreaView`",
        "Apply `Scaffold`'s `innerPadding` (or `WindowInsets.safeDrawing` padding) to the content",
        "Add `android:fitsSystemWindows=\"false\"` to every composable",
        "Lower `targetSdk` permanently",
      ],
      answer: 1,
      explanation: "Android 15 enforces edge-to-edge for apps targeting SDK 35. Insets are your job, and `Scaffold` passes them to your content as `innerPadding`.",
    },
    {
      question: "Where should a Compose button get its background color so dark mode works?",
      options: [
        "`Color(0xFF1A56DB)` inline",
        "A `colors.ts`-style Kotlin object of hex values",
        "`MaterialTheme.colorScheme.primary` (which `Button` uses by default)",
        "`isSystemInDarkTheme()` checked inside every component",
      ],
      answer: 2,
      explanation: "Pick the light or dark `ColorScheme` once, at the top of the tree. Components read roles like `primary`, so they switch automatically.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "The close icon never shows up because the title pushes it off the screen. Which line is the bug?",
      code: `@Composable
fun Header(title: String) {
    Row(Modifier.fillMaxWidth()) {
        Text(title, Modifier.fillMaxWidth())
        Icon(Icons.Default.Close, "Close")
    }
}`,
      answer: 4,
      explanation: "`fillMaxWidth()` inside a `Row` claims the whole width before the icon is measured. To take only the space left over, like `flex: 1`, use `Modifier.weight(1f)`.",
    },
  ],
};
