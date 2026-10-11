import type { Chapter } from "../types";

export const lists: Chapter = {
  slug: "lists",
  title: "Lists & performance",
  intro: [
    "`FlatList` is probably the RN component you've tuned the most: `keyExtractor`, `getItemLayout`, `windowSize`, `React.memo` on every row. Native lists need much less of that. `LazyColumn` and SwiftUI's `List` only build the rows on screen, and both frameworks skip work for rows whose data didn't change, without being asked.",
    "The API shape also changes. There's no `renderItem` prop. You write the rows inside a builder block, using the same code you'd write for a non-lazy column. Headers, footers, empty states, and sections are just more items in that block.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "All three are *virtualized*: they create UI only for what's visible, plus a small buffer. The differences are in how much they recycle, and how much you have to help them.",
      ],
      compare: [
        {
          label: "The list",
          values: {
            rn: "`FlatList` (`VirtualizedList` underneath)",
            android: "`LazyColumn` / `LazyRow`",
            ios: "`List` (backed by `UICollectionView`), or `LazyVStack` in a `ScrollView`",
          },
        },
        {
          label: "Rows are declared…",
          values: {
            rn: "With `data` plus a `renderItem` function",
            android: "With `items(list) { … }` calls inside a DSL block",
            ios: "With `ForEach` (or `List(data)`) inside a view builder",
          },
        },
        {
          label: "Off-screen rows",
          values: {
            rn: "Unmounted outside `windowSize`",
            android: "Leave the composition. Their slots are reused for new rows.",
            ios: "`List` reuses cells. `LazyVStack` creates views lazily but keeps them.",
          },
        },
        {
          label: "Skipping unchanged rows",
          values: {
            rn: "Opt in with `React.memo`",
            android: "Automatic when parameters are equal",
            ios: "Automatic when the view's stored properties are equal",
          },
        },
        {
          label: "Item heights",
          values: {
            rn: "Measured async. `getItemLayout` helps scrolling.",
            android: "Measured as each row appears. No layout hint needed.",
            ios: "Measured as each row appears. No layout hint needed.",
          },
        },
      ],
    },
    {
      id: "flatlist",
      title: "FlatList → LazyColumn & List",
      prose: [
        "Here's a basic list with separators and an empty state. Notice how much of `FlatList`'s API turns into plain code: the empty state is an `if`, and separators are either drawn for you (iOS) or added to each row (Android).",
      ],
      snippet: "basic-list",
      notes: {
        android: [
          "`LazyColumn { … }` isn't a composable block. It's a DSL where you call `item { }` and `items(…) { }`. You can't put an `if` *around* composables there, but you can put an `if` around `item` calls.",
          "Use `itemsIndexed` when you need the index, like `renderItem`'s `index`.",
          "`HorizontalDivider` is the Material 3 name. Older code uses `Divider`.",
        ],
        ios: [
          "`List` brings platform styling: insets, separators, swipe actions, selection, and edit mode. Use `.listStyle(.plain)` for a flatter look.",
          "For a fully custom look, use `ScrollView { LazyVStack { ForEach(…) } }` instead.",
          "`ContentUnavailableView` (iOS 17+) is the system empty-state view.",
        ],
      },
    },
    {
      id: "keys",
      title: "keyExtractor → key & Identifiable",
      prose: [
        "Keys matter for the same reasons as in React: they keep each row's state attached to the right item when the list changes, and they let the framework animate inserts and moves. Compose falls back to position when you don't pass a key. SwiftUI won't compile without one.",
      ],
      compare: [
        {
          label: "Provide a key",
          values: {
            rn: "`keyExtractor={(t) => t.id}`",
            android: "`items(todos, key = { it.id })`",
            ios: "`Todo: Identifiable`, or `ForEach(todos, id: \\.id)`",
          },
        },
        {
          label: "No key given",
          values: {
            rn: "Falls back to index, with a warning",
            android: "Falls back to position, silently",
            ios: "Compile error",
          },
        },
        {
          label: "Key requirements",
          values: {
            rn: "A unique string",
            android: "Unique, and saveable in a `Bundle` (String, Int, Long, …)",
            ios: "Unique and `Hashable`",
          },
        },
        {
          label: "Mixed row types",
          values: {
            rn: "`getItemType` (FlashList)",
            android: "`contentType = { it.kind }` to reuse slots between rows of the same type",
            ios: "Handled by the cell reuse in `List`",
          },
        },
        {
          label: "Animate changes",
          values: {
            rn: "`LayoutAnimation` or Reanimated layout animations",
            android: "`Modifier.animateItem()` on each row (needs keys)",
            ios: "Wrap the change in `withAnimation { }`",
          },
        },
      ],
      callout:
        "Duplicate keys crash on both platforms. Compose throws \"Key was already used\" and SwiftUI logs an error and misbehaves. RN only warns. If your API can return duplicates, de-dupe before rendering.",
    },
    {
      id: "sections",
      title: "SectionList → stickyHeader & Section",
      prose: [
        "There's no separate section list component. In Compose, loop over the groups and emit a `stickyHeader` followed by that group's `items`. In SwiftUI, wrap each group's rows in a `Section`.",
      ],
      snippet: "sections",
      notes: {
        android: [
          "`stickyHeader` is experimental in the Compose version used here, hence the `@OptIn`. If your compiler says the opt-in is unnecessary, drop it.",
          "Give the header an opaque background, or rows will show through it when it's pinned.",
          "Use non-sticky `item { }` headers for a list that scrolls its headers away.",
        ],
        ios: [
          "Header pinning depends on the list style. `.plain` pins headers, while the default inset-grouped style scrolls them.",
          "`Section` also takes a `footer:`, which replaces `renderSectionFooter`.",
        ],
      },
    },
    {
      id: "grids",
      title: "Horizontal lists & grids",
      prose: [
        "Every lazy container has a horizontal and a grid variant, with the same item DSL.",
      ],
      compare: [
        {
          label: "Horizontal list",
          values: {
            rn: "`<FlatList horizontal />`",
            android: "`LazyRow`",
            ios: "`ScrollView(.horizontal) { LazyHStack { … } }`",
          },
        },
        {
          label: "Fixed columns",
          values: {
            rn: "`numColumns={2}`",
            android: "`LazyVerticalGrid(columns = GridCells.Fixed(2))`",
            ios: "`LazyVGrid(columns: Array(repeating: GridItem(), count: 2))`",
          },
        },
        {
          label: "As many columns as fit",
          values: {
            rn: "Compute `numColumns` from the width",
            android: "`GridCells.Adaptive(minSize = 120.dp)`",
            ios: "`[GridItem(.adaptive(minimum: 120))]`",
          },
        },
        {
          label: "Masonry",
          values: {
            rn: "A third-party library",
            android: "`LazyVerticalStaggeredGrid`",
            ios: "No built-in. Use a custom `Layout`.",
          },
        },
        {
          label: "Snapping carousel",
          values: {
            rn: "`pagingEnabled` / `snapToInterval`",
            android: "`HorizontalPager`",
            ios: "`.scrollTargetBehavior(.paging)` (iOS 17+), or `TabView` with `.page` style",
          },
        },
      ],
    },
    {
      id: "refresh",
      title: "Pull to refresh",
      prose: [
        "SwiftUI's version is the shortest code in this guide: `.refreshable` takes an `async` closure and shows the spinner until it returns. Material 3 has `PullToRefreshBox`, which follows the RN shape: you pass the `refreshing` flag and an `onRefresh` callback.",
      ],
      snippet: "refresh",
      notes: {
        android: [
          "`PullToRefreshBox` is in Material 3 1.3+, and still marked experimental. Older code uses the deprecated `pullRefresh` modifier from Material 2.",
          "In real code, `refreshing` usually comes from a `ViewModel`'s state rather than local state.",
        ],
        ios: [
          "`.refreshable` works on `List` and `ScrollView`.",
          "The closure runs on the main actor, and pulling again while it runs doesn't start a second refresh.",
        ],
      },
    },
    {
      id: "pagination",
      title: "Infinite scroll",
      prose: [
        "There's no `onEndReached` on either platform. On Android you watch the `LazyListState`: read how far the user has scrolled with `derivedStateOf`, and react in a `LaunchedEffect`. On iOS, the usual trick is a sentinel row at the end of the list that calls `loadMore` when it appears.",
      ],
      snippet: "pagination",
      notes: {
        android: [
          "`derivedStateOf` matters here. Without it, the composable would recompose on every scroll frame. With it, it recomposes only when `nearEnd` flips.",
          "The Paging 3 library (`collectAsLazyPagingItems()`) handles paging, retries, and placeholders, if you'd rather not do this by hand.",
        ],
        ios: [
          "`onAppear` fires once each time the sentinel comes into view. When `loading` flips back to `false`, the sentinel is re-inserted, so it fires again if the user is still at the bottom.",
          "Another common pattern is to check `if todo.id == todos.last?.id` in each row's `onAppear`.",
        ],
      },
    },
    {
      id: "scroll-to",
      title: "Scrolling programmatically",
      prose: [
        "In RN you hold a `ref` to the list and call `scrollToIndex`. Compose gives you a state object instead. `rememberLazyListState()` both reports the scroll position and controls it, and its scroll functions are `suspend`, so you call them from a coroutine. SwiftUI uses a `ScrollViewReader`, whose proxy scrolls to an item by its *id*, not its index.",
      ],
      snippet: "scroll-to",
      notes: {
        android: [
          "`listState.firstVisibleItemIndex` and `firstVisibleItemScrollOffset` replace `onScroll` for most uses.",
          "`scrollToItem` jumps and `animateScrollToItem` animates. Both take an index.",
        ],
        ios: [
          "On iOS 17+, `.scrollPosition(id:)` binds the scroll position to state in both directions, which is closer to Compose's model.",
          "`Button(_:systemImage:action:)` with `.labelStyle(.iconOnly)` keeps a text label for VoiceOver.",
        ],
      },
    },
    {
      id: "stability",
      title: "React.memo → stability & Equatable",
      prose: [
        "In RN, every row re-renders when the list re-renders, unless you wrap it in `React.memo` and stabilize callbacks with `useCallback`. Compose does this by default. A call to a composable is *skipped* when all its parameters are equal to last time. With **strong skipping** (the default since Kotlin 2.0.20), lambdas are remembered for you, so there's no `useCallback` to write.",
        "SwiftUI compares a view's stored properties before re-running its `body`. Closures can't be compared, though, so a row that takes a callback is always treated as changed. If that shows up in profiling, conform the view to `Equatable` and compare only the data.",
      ],
      snippet: "stability",
      notes: {
        android: [
          "A class is *stable* if all its public properties are `val`s of stable types. A `data class` of primitives and `String`s qualifies.",
          "`List<T>` is an interface, so the compiler can't prove it's immutable. Strong skipping compares such parameters by instance (`===`), which works if you replace lists instead of mutating them.",
          "Layout Inspector shows recomposition and skip counts per composable, which is the equivalent of the React DevTools profiler.",
        ],
        ios: [
          "Only reach for `Equatable` views after profiling. SwiftUI's default diffing is usually enough.",
          "Instruments has a SwiftUI template that shows how often each `body` runs.",
        ],
      },
    },
    {
      id: "performance",
      title: "Keeping scrolling fast",
      prose: [
        "Most RN list tuning knobs have no native equivalent, because native lists don't need them. What's left are a few universal rules: keep row code cheap, load images asynchronously with caching, and measure in a release build.",
      ],
      compare: [
        {
          label: "`getItemLayout`",
          values: { rn: "Avoids async measurement", android: "Not needed", ios: "Not needed" },
        },
        {
          label: "`windowSize`, `initialNumToRender`",
          values: { rn: "Tune the render window", android: "Not needed. Prefetching is built in.", ios: "Not needed" },
        },
        {
          label: "Images",
          values: { rn: "`expo-image` / FastImage", android: "Coil's `AsyncImage`", ios: "`AsyncImage` (no disk cache), or Kingfisher / Nuke" },
        },
        {
          label: "Heavy work per row",
          values: {
            rn: "Move out of `renderItem`",
            android: "Move out of composition. Format dates once, in the model.",
            ios: "Move out of `body`. Avoid `DateFormatter()` in `body`.",
          },
        },
        {
          label: "Measure in…",
          values: {
            rn: "A release build (Hermes, no dev mode)",
            android: "A release build with R8, ideally with Baseline Profiles",
            ios: "A release build, profiled with Instruments",
          },
        },
      ],
      callout:
        "Compose in a debug build is *much* slower than in release, because debug builds skip compiler optimizations and the ahead-of-time compiled code from Baseline Profiles. A janky `LazyColumn` in debug is normal. Profile a release build before you optimize anything.",
    },
  ],
  gotchas: [
    {
      title: "No keys means position-based identity",
      body: "Compose silently uses position when you leave out `key`. Insert an item at the top and every row's `remember`ed state shifts down by one. Always pass a key for dynamic data.",
    },
    {
      title: "LazyColumn inside verticalScroll crashes",
      body: "A lazy list needs a bounded height. Inside a `verticalScroll` column, it gets infinite height and throws. Put the other content into the `LazyColumn` as `item { }` blocks instead.",
    },
    {
      title: "VStack in a ScrollView isn't lazy",
      body: "`ScrollView { VStack { ForEach(…) } }` builds every row up front. Use `LazyVStack`, or `List`, for long content.",
    },
    {
      title: "Duplicate IDs crash",
      body: "Two items with the same key throw in Compose and corrupt SwiftUI's diffing. RN only warns. De-dupe data from the network before showing it.",
    },
    {
      title: "Closures defeat SwiftUI's diffing",
      body: "A row that stores a closure can't be compared, so it's re-evaluated every time the parent's `body` runs. That's usually fine. If profiling says otherwise, make the row `Equatable`.",
    },
    {
      title: "Judge performance in release builds",
      body: "Debug Compose builds are dramatically slower than release builds. Don't add `remember`s and `@Stable` annotations based on how a debug build feels.",
    },
  ],
  cheatsheet: [
    { rn: "`FlatList`", android: "`LazyColumn`", ios: "`List` / `LazyVStack`" },
    { rn: "`renderItem`", android: "`items(list) { item -> … }`", ios: "`ForEach(list) { item in … }`" },
    { rn: "`keyExtractor`", android: "`key = { it.id }`", ios: "`Identifiable` / `id: \\.id`" },
    { rn: "`ListHeaderComponent`", android: "`item { Header() }` first", ios: "A view before the `ForEach`" },
    { rn: "`ListEmptyComponent`", android: "`if (list.isEmpty())`", ios: "`.overlay { ContentUnavailableView(…) }`" },
    { rn: "`ItemSeparatorComponent`", android: "`HorizontalDivider()` in each row", ios: "Automatic in `List`" },
    { rn: "`SectionList`", android: "`stickyHeader { }` + `items`", ios: "`Section(header) { … }`" },
    { rn: "`horizontal`", android: "`LazyRow`", ios: "`ScrollView(.horizontal) { LazyHStack }`" },
    { rn: "`numColumns`", android: "`LazyVerticalGrid`", ios: "`LazyVGrid`" },
    { rn: "`refreshing` / `onRefresh`", android: "`PullToRefreshBox`", ios: "`.refreshable { await … }`" },
    { rn: "`onEndReached`", android: "`LazyListState` + `derivedStateOf`", ios: "Sentinel row `.onAppear`" },
    { rn: "`ref.scrollToIndex`", android: "`listState.animateScrollToItem(i)`", ios: "`proxy.scrollTo(id)`" },
    { rn: "`React.memo`", android: "Automatic skipping", ios: "Automatic / `Equatable` view" },
    { rn: "`useCallback` for row props", android: "Not needed (strong skipping)", ios: "Not needed" },
  ],
  exercises: [
    {
      id: "todo-list",
      title: "A keyed todo list",
      prompt: "Render a lazily loaded list with a stable key per row, like `FlatList` with `keyExtractor`.",
      blanks: {
        android: [
          { hint: "Compose's `FlatList`: a vertical list that only composes the rows on screen.", distractors: ["Column", "FlatList", "LazyRow"] },
          { hint: "The `LazyListScope` function that emits one row per element of a list.", distractors: ["forEach", "map", "item"] },
          { hint: "Same job as `keyExtractor`. In a one-parameter lambda the parameter is implicitly named `it`.", distractors: ["index", "it", "this.id"] },
        ],
        ios: [
          { hint: "The protocol that promises a stable `id` per element, so `List` doesn't need a key extractor.", distractors: ["Hashable", "Equatable", "Codable"] },
          { hint: "SwiftUI's scrolling, lazily loaded table of rows.", distractors: ["VStack", "FlatList", "ScrollView"] },
          { hint: "Name the closure parameter. Swift closures list their parameters before the `in` keyword.", distractors: ["todo ->", "(todo) =>", "in todo"] },
        ],
      },
    },
  ],
  quiz: [
    {
      question: "You render a `LazyColumn` with `items(todos) { TodoRow(it) }` and no key. Each row has a `remember`ed \"expanded\" flag. You insert a todo at the top. What happens?",
      options: [
        "Every row keeps its own expanded state",
        "The expanded states stay at their positions, so they now belong to different todos",
        "Compose throws a missing-key error",
        "All rows collapse",
      ],
      answer: 1,
      explanation: "Without a key, identity is the position. The state at position 0 now belongs to the new todo. Pass `key = { it.id }`, just as you'd pass `keyExtractor`.",
    },
    {
      question: "In Compose, what's the equivalent of wrapping every FlatList row in `React.memo` and every callback in `useCallback`?",
      options: [
        "Annotate each row with `@Memo`",
        "Wrap rows in `remember { }`",
        "Nothing. Compose skips calls whose parameters are unchanged, and strong skipping remembers lambdas.",
        "Use `key()` on every row",
      ],
      answer: 2,
      explanation: "Skipping is the default. Your job is to pass stable, equal parameters, such as immutable `data class`es and lists you replace rather than mutate.",
    },
    {
      question: "A Compose screen has a header, then a `LazyColumn` of comments, all inside `Column(Modifier.verticalScroll(…))`. It crashes. What's the fix?",
      options: [
        "Give the `LazyColumn` a fixed height of 10,000dp",
        "Remove `verticalScroll`, and put the header into the `LazyColumn` as an `item { }`",
        "Switch to `LazyRow`",
        "Wrap the `LazyColumn` in a `Box`",
      ],
      answer: 1,
      explanation: "A lazy list inside a vertical scroll gets infinite height constraints, which isn't allowed. Make the lazy list the only scroller and put everything else in it as items.",
    },
    {
      question: "How do you implement pull to refresh in SwiftUI?",
      options: [
        "Track a `refreshing` Bool and pass it to `List`",
        "`.refreshable { await reload() }`",
        "Wrap the `List` in a `RefreshControl`",
        "Add a `DragGesture` to the list",
      ],
      answer: 1,
      explanation: "`.refreshable` shows the system spinner and keeps it until the async closure returns. There's no flag to manage.",
    },
    {
      question: "Your `LazyColumn` stutters when you scroll on the emulator in a debug build. What should you do first?",
      options: [
        "Add `@Stable` to every class",
        "Wrap every row in `remember`",
        "Measure a release build (R8, Baseline Profile) before optimizing",
        "Switch to `RecyclerView`",
      ],
      answer: 2,
      explanation: "Debug Compose builds are far slower than release builds. Measure release performance first, the same way you'd never judge RN performance with dev mode on.",
    },
    {
      question: "In SwiftUI, what does `ScrollViewReader`'s `proxy.scrollTo(_:)` take?",
      options: [
        "An index into the data",
        "A pixel offset",
        "The id of the target view (e.g. the item's `id`)",
        "A `LazyListState`",
      ],
      answer: 2,
      explanation: "SwiftUI scrolls by identity, not position. Pass the same `id` the `ForEach` uses for that row.",
    },
    {
      kind: "bug",
      platform: "android",
      question: "Each row remembers whether it's expanded. After inserting a todo at the top, the expanded state shows on the wrong row. Which line is the bug?",
      code: `@Composable
fun Todos(todos: List<Todo>) {
    LazyColumn {
        itemsIndexed(
            todos,
            key = { index, _ -> index },
        ) { _, todo ->
            TodoRow(todo)
        }
    }
}`,
      answer: 6,
      explanation: "Using the index as the key is like `keyExtractor={(_, i) => String(i)}`: after an insert, every row's key now points at a different todo, so its `remember`ed state moves with the position. Key by a stable id: `key = { _, todo -> todo.id }`.",
    },
    {
      kind: "bug",
      platform: "ios",
      question: "After a swipe-to-delete, the rows' state jumps to the wrong todos, and it can crash. Which line is the bug?",
      code: `struct TodoList: View {
    @Binding var todos: [Todo]

    var body: some View {
        List {
            ForEach(todos.indices, id: \\.self) { i in
                TodoRow(todo: todos[i])
            }
            .onDelete { todos.remove(atOffsets: $0) }
        }
    }
}`,
      answer: 6,
      explanation: "The identity here is the index, so deleting a row shifts which todo each identity points at. Stale indices can also go out of range. Iterate the `Identifiable` elements instead: `ForEach(todos) { todo in … }`, or `ForEach($todos) { $todo in … }` if you need bindings.",
    },
  ],
};
