import type { Chapter } from "../types";

export const navigation: Chapter = {
  slug: "navigation",
  title: "Navigation",
  intro: [
    "React Navigation is a JavaScript library that sits on top of native screens. On native, navigation is part of the platform. Compose uses **Navigation Compose**, a Jetpack library built around a `NavController` and a back stack. SwiftUI has `NavigationStack`, and its back stack can be a plain array that you own.",
    "The biggest shift is *type-safe routes*. Instead of a string screen name plus a params object you type by hand, a route is a type. On Android it's a `@Serializable` class whose properties are the params. On iOS it's any `Hashable` value, often an enum case. The compiler checks every `navigate` call.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "All three keep a stack of screens. The difference is who owns it. React Navigation owns it and you send it actions. Compose's `NavController` works the same way. SwiftUI can go either way: let `NavigationLink` manage the stack, or bind the stack to an array in your state and push by appending.",
      ],
      compare: [
        {
          label: "The stack",
          values: {
            rn: "`createNativeStackNavigator()`",
            android: "`NavHost` + `rememberNavController()`",
            ios: "`NavigationStack`",
          },
        },
        {
          label: "Declaring screens",
          values: {
            rn: "`<Stack.Screen name component>`",
            android: "`composable<Route> { … }` inside `NavHost`",
            ios: "`.navigationDestination(for: Type.self) { … }`",
          },
        },
        {
          label: "A route is…",
          values: {
            rn: "A string name plus a params object",
            android: "A `@Serializable` object or data class",
            ios: "Any `Hashable` value",
          },
        },
        {
          label: "Who owns the back stack",
          values: {
            rn: "The navigator",
            android: "The `NavController`",
            ios: "SwiftUI, or you (`NavigationStack(path: $path)`)",
          },
        },
        {
          label: "Header / title",
          values: {
            rn: "`options={{ title }}`",
            android: "A `TopAppBar` you place in each screen's `Scaffold`",
            ios: "`.navigationTitle(\"…\")` on the screen",
          },
        },
      ],
    },
    {
      id: "stack",
      title: "Stack navigation",
      prose: [
        "Here's the smallest stack: a home screen that opens a detail screen with an id. The structure is the same everywhere. What differs is where params live. In Compose, the `Detail` route *is* the params. In SwiftUI, the value you push (here a `UUID`) is passed to the destination closure.",
      ],
      snippet: "stack",
      notes: {
        android: [
          "Type-safe routes need Navigation 2.8+ and the Kotlin serialization plugin. Older code uses string routes like `\"detail/{id}\"`.",
          "`entry.toRoute<Detail>()` turns the back stack entry back into your route class, like reading `route.params`.",
          "Pass callbacks like `onOpen` down to screens instead of the `NavController`. Screens stay previewable and testable, and only `App` knows about navigation.",
          "There's no built-in header. Each screen puts a `TopAppBar` in its own `Scaffold` (Chapter 4).",
        ],
        ios: [
          "`NavigationLink(value:)` pushes a value. The matching `.navigationDestination(for:)` decides which view to show for it.",
          "Put `.navigationDestination` *inside* the `NavigationStack`, on the root screen, not on the stack itself. Don't put it inside a lazy container like `List`, where it may not be loaded.",
          "`.navigationTitle` and `.toolbar` are set by the screen, on its own content. That's the reverse of RN, where the navigator holds the options.",
        ],
      },
    },
    {
      id: "programmatic",
      title: "Navigating from code",
      prose: [
        "`navigation.navigate()` and `goBack()` become commands on the `NavController` in Compose. In SwiftUI, the idiomatic version is a **path**: bind `NavigationStack(path:)` to an array, and navigation becomes array operations. Push is `append`, back is `removeLast`, and pop to root is `removeAll`.",
        "This makes the iOS back stack ordinary state. You can save it, restore it, test it, or replace it from a deep link in a single assignment.",
      ],
      snippet: "programmatic",
      notes: {
        rn: ["React Navigation's `reset` is the closest RN gets to replacing the whole stack at once."],
        android: [
          "`navigate` pushes by default, even if the screen is already on the stack. Use `launchSingleTop = true` in the options block to avoid duplicates from a double tap.",
          "`popUpTo` removes screens before pushing, which is how you do a login → home transition.",
          "Read the current back stack with `navController.currentBackStackEntryAsState()`.",
        ],
        ios: [
          "An enum route keeps all destinations in one `switch`, so the compiler tells you when one is missing.",
          "For mixed route types, use `NavigationPath`, a type-erased path. A typed array is simpler when one enum covers everything.",
          "`@Observable` routers are shared with `.environment(router)` (Chapter 5) and read with `@Environment(Router.self)`.",
        ],
      },
    },
    {
      id: "params",
      title: "Params & type-safe routes",
      prose: [
        "In React Navigation, you get type safety by writing a `ParamList` type that mirrors your screens, and it only checks what you declared. Native routes are the source of truth themselves. A missing or mistyped param is a compile error.",
        "Route params should be small and serializable on Android, since they're saved with the back stack and restored after process death. Pass an id, not the whole object, and load the data on the destination screen. That's also React Navigation's advice, but on Android it's enforced.",
      ],
      compare: [
        {
          label: "Define params",
          values: {
            rn: "`type RootStack = { Detail: { id: string } }`",
            android: "`@Serializable data class Detail(val id: String)`",
            ios: "`enum Route: Hashable { case detail(id: UUID) }`",
          },
        },
        {
          label: "Navigate with params",
          values: {
            rn: "`navigate('Detail', { id })`",
            android: "`navigate(Detail(id))`",
            ios: "`path.append(.detail(id: id))`",
          },
        },
        {
          label: "Read params",
          values: {
            rn: "`route.params.id`",
            android: "`entry.toRoute<Detail>().id`, or `SavedStateHandle.toRoute<Detail>()` in a ViewModel",
            ios: "Destination closure arguments",
          },
        },
        {
          label: "Optional params",
          values: {
            rn: "`{ filter?: string }`",
            android: "A nullable property with a default: `val filter: String? = null`",
            ios: "An optional associated value",
          },
        },
        {
          label: "Return a result",
          values: {
            rn: "Pass a callback param, or `navigate` back with params",
            android: "`previousBackStackEntry?.savedStateHandle?.set(…)`, or shared ViewModel state",
            ios: "A shared `@Observable` model, or a closure passed in the route's destination",
          },
        },
      ],
      callout:
        "Avoid passing whole objects as routes. Compose saves the back stack in the Activity's saved state, which has a size limit. Large routes can make the app crash in the background with `TransactionTooLargeException`.",
    },
    {
      id: "tabs",
      title: "Tabs",
      prose: [
        "Tabs aren't part of the navigation library on either platform. On iOS, `TabView` is a standard container. On Android, a tab bar is a Material `NavigationBar` in a `Scaffold`'s `bottomBar`, and switching tabs is just state.",
        "For tabs with their own stacks (the usual RN setup of a tab navigator with a stack in each tab), SwiftUI needs a `NavigationStack` per tab. In Compose you give each tab a nested graph and navigate between them with the `saveState`/`restoreState` options.",
      ],
      snippet: "tabs",
      notes: {
        android: [
          "`Tab.entries` lists the values of an enum, like `Object.values()` on a TS enum.",
          "In this simple version, the unselected tab leaves the composition, and its `remember` state is lost. Use `rememberSaveableStateHolder()`, or a `NavHost` with `saveState = true`, if tabs must keep scroll position and input.",
          "On large screens, swap `NavigationBar` for `NavigationRail`, or use `NavigationSuiteScaffold`, which picks one for you.",
        ],
        ios: [
          "`TabView` keeps every tab's state alive while you switch, including its navigation stack.",
          "On iOS 18+, you can write tabs as `Tab(\"Todos\", systemImage: \"house\") { … }` instead of `.tabItem`.",
          "Bind `TabView(selection: $tab)` to an enum to switch tabs from code.",
        ],
      },
    },
    {
      id: "modals",
      title: "Modals & sheets",
      prose: [
        "React Navigation presents modals as a kind of screen in the stack. Native platforms usually present them from the *current screen*, controlled by state: show the sheet while a Bool (or an optional item) is set.",
      ],
      snippet: "sheet",
      compare: [
        {
          label: "Bottom sheet / page sheet",
          values: {
            rn: "`presentation: 'modal'`, or `<Modal presentationStyle=\"pageSheet\">`",
            android: "`ModalBottomSheet`",
            ios: "`.sheet(isPresented:)`",
          },
        },
        {
          label: "Full screen",
          values: {
            rn: "`presentation: 'fullScreenModal'`",
            android: "A regular destination in the `NavHost`",
            ios: "`.fullScreenCover(isPresented:)`",
          },
        },
        {
          label: "Sheet for an item",
          values: {
            rn: "Params on the modal screen",
            android: "`selected?.let { ModalBottomSheet(…) }`",
            ios: "`.sheet(item: $selected) { item in … }`",
          },
        },
        {
          label: "Alert",
          values: {
            rn: "`Alert.alert(…)`",
            android: "`AlertDialog(…)` shown while state is true",
            ios: "`.alert(\"Title\", isPresented: $show) { … }`",
          },
        },
        {
          label: "Action sheet",
          values: {
            rn: "`ActionSheetIOS` or a library",
            android: "`ModalBottomSheet` with a list, or a `DropdownMenu`",
            ios: "`.confirmationDialog(…)`",
          },
        },
        {
          label: "Block swipe to dismiss",
          values: {
            rn: "`gestureEnabled: false`",
            android: "`sheetState.confirmValueChange` / `DialogProperties`",
            ios: "`.interactiveDismissDisabled()`",
          },
        },
      ],
      notes: {
        android: [
          "Setting `adding = false` removes the sheet instantly, without the slide-down animation. Call `sheetState.hide()` in a coroutine first if you want it to animate out.",
          "`ModalBottomSheet` is still experimental in Material 3, hence the `@OptIn`.",
          "Alerts don't have an imperative API like `Alert.alert`. Every dialog is a composable you show based on state.",
        ],
        ios: [
          "`.presentationDetents([.medium, .large])` makes a half-height sheet, the most common bottom sheet design.",
          "Sheets don't inherit the presenter's `NavigationStack`. Wrap the sheet's content in its own stack if it needs a title bar or pushes.",
        ],
      },
    },
    {
      id: "deep-links",
      title: "Deep links",
      prose: [
        "React Navigation's `linking` config maps URL patterns to screens. Compose attaches deep link patterns to each destination, and the `NavHost` handles the incoming intent. SwiftUI hands you the URL in `.onOpenURL`. You parse it and set the path, which is where owning the stack as an array pays off.",
        "Both platforms also need the URL registered outside your code: an `<intent-filter>` in `AndroidManifest.xml` for Android, and a URL type in the target's settings for iOS. Universal links (https) need a verified domain file on your server, just like with RN.",
      ],
      snippet: "deep-link",
      notes: {
        android: [
          "When a deep link opens the app in a new task, Navigation puts the graph's start destination under `Detail`, so Back goes to Home instead of exiting the app.",
          "Test from the command line with `adb shell am start -a android.intent.action.VIEW -d \"myapp://todo/42\"`.",
        ],
        ios: [
          "Test in the simulator with `xcrun simctl openurl booted myapp://todo/<id>`.",
          "`path = [id]` replaces the stack in one step. Put more values in the array if the link needs screens underneath.",
        ],
      },
    },
    {
      id: "back",
      title: "Back handling",
      prose: [
        "Android has a system back button and gesture. Compose's `BackHandler` intercepts it while `enabled` is true, which replaces both `BackHandler` from RN and the `beforeRemove` listener. Android 13+ also has **predictive back**, which previews the previous screen during the gesture. Navigation Compose supports it out of the box.",
        "iOS has no system back button, only the navigation bar's back button and the edge-swipe gesture. SwiftUI doesn't let you intercept either. To confirm before leaving, you hide the default back button and provide your own.",
      ],
      snippet: "back",
      notes: {
        android: [
          "`BackHandler` only covers the system back. A `TopAppBar` up arrow calls your own `onBack`, so check `dirty` there too.",
          "The innermost enabled `BackHandler` wins, so a handler in a sheet or dialog takes priority over the screen's.",
        ],
        ios: [
          "Hiding the back button also disables swipe-to-go-back. Only do it while there are unsaved changes if you can, by passing `dirty` to `.navigationBarBackButtonHidden(dirty)`.",
          "For sheets, `.interactiveDismissDisabled(dirty)` blocks the swipe-down, which is the more common case.",
        ],
      },
    },
  ],
  gotchas: [
    {
      title: "navigate always pushes",
      body: "`navController.navigate(Detail(id))` pushes a new entry even if that screen is already on top. A fast double tap opens two copies. Use `launchSingleTop = true`, or ignore clicks while navigating.",
    },
    {
      title: "Don't pass the NavController down",
      body: "Passing `navController` into every screen ties each one to navigation and breaks previews. Pass lambdas like `onOpen: (String) -> Unit` and keep the `NavController` in the `NavHost` owner.",
    },
    {
      title: "Big routes crash in the background",
      body: "Android saves route params with the back stack. Passing large objects can exceed the saved-state size limit and crash when the app goes to the background. Pass ids.",
    },
    {
      title: "navigationDestination in the wrong place",
      body: "SwiftUI only finds a `.navigationDestination` that's inside the `NavigationStack` and not inside a lazy container. A misplaced one gives a runtime warning and a link that does nothing.",
    },
    {
      title: "You can't intercept iOS back",
      body: "There's no `beforeRemove` on iOS. Hide the back button and use your own, accepting that this disables the swipe gesture while it's hidden.",
    },
    {
      title: "Sheets start a new hierarchy",
      body: "A SwiftUI sheet doesn't share the presenter's `NavigationStack`. Its content needs its own stack for a title or pushes. Environment objects are passed through, but navigation isn't.",
    },
  ],
  cheatsheet: [
    { rn: "`NavigationContainer` + stack", android: "`NavHost(navController, startDestination)`", ios: "`NavigationStack`" },
    { rn: "`<Stack.Screen name=\"Detail\">`", android: "`composable<Detail> { }`", ios: "`.navigationDestination(for:)`" },
    { rn: "`ParamList` type", android: "`@Serializable data class Detail(val id: String)`", ios: "`enum Route: Hashable`" },
    { rn: "`navigate('Detail', { id })`", android: "`navController.navigate(Detail(id))`", ios: "`path.append(.detail(id: id))` / `NavigationLink(value:)`" },
    { rn: "`route.params`", android: "`entry.toRoute<Detail>()`", ios: "Closure argument" },
    { rn: "`goBack()`", android: "`popBackStack()`", ios: "`dismiss()` / `path.removeLast()`" },
    { rn: "`popToTop()`", android: "`popBackStack(Home, inclusive = false)`", ios: "`path.removeAll()`" },
    { rn: "`reset(…)`", android: "`navigate(Home) { popUpTo(…) { inclusive = true } }`", ios: "`path = […]`" },
    { rn: "`options={{ title }}`", android: "`TopAppBar(title = { … })`", ios: "`.navigationTitle(…)`" },
    { rn: "Bottom tabs", android: "`NavigationBar` in `Scaffold`", ios: "`TabView`" },
    { rn: "`presentation: 'modal'`", android: "`ModalBottomSheet`", ios: "`.sheet(isPresented:)`" },
    { rn: "`Alert.alert`", android: "`AlertDialog` while state is set", ios: "`.alert(isPresented:)`" },
    { rn: "`linking` config", android: "`deepLinks = listOf(navDeepLink<…>(…))`", ios: "`.onOpenURL { }`" },
    { rn: "`BackHandler` / `beforeRemove`", android: "`BackHandler(enabled) { }`", ios: "Custom back button" },
  ],
  exercises: [
    {
      id: "open-message",
      title: "Push a message screen, then go back",
      prompt: "Navigate to a detail route with a param, read the param on the new screen, then pop back.",
      blanks: {
        android: [
          { hint: "Creates the back stack holder and keeps it across recompositions." },
          {
            hint: "Push a route. With type-safe routes you pass an instance of the route class, params included.",
            accept: ['navigate(route = Message("a"))', 'navigate(Message(id = "a"))'],
          },
          { hint: "The destination's route type, passed as a generic type argument (like `Stack.Screen name=…`)." },
          { hint: "Decodes the back stack entry's arguments into the route object: your `route.params`.", accept: ["toRoute<Message>()"] },
          { hint: "Removes the top destination from the stack, like `navigation.goBack()`.", accept: ["navigateUp()"] },
        ],
        ios: [
          { hint: "The container that owns the push/pop stack, like `Stack.Navigator`." },
          { hint: "A button that pushes a value onto the stack when tapped." },
          { hint: "Maps a pushed value's type to the screen it shows, like registering a `Stack.Screen`." },
          { hint: "Read the dismiss action from the environment with a property wrapper and the `\\.dismiss` key path." },
          { hint: "The dismiss action is callable. Call it like a function to pop this screen.", accept: ["self.dismiss()"] },
        ],
      },
    },
  ],
  quiz: [
    {
      question: "In Navigation Compose, what is a type-safe route?",
      options: [
        "A string constant like `\"detail/{id}\"`",
        "A `@Serializable` class or object whose properties are the screen's params",
        "An `enum` of screen names",
        "A `ParamList` type, as in React Navigation",
      ],
      answer: 1,
      explanation: "`navigate(Detail(id))` creates the route from a class, so a missing param is a compile error. Read it back with `toRoute<Detail>()`.",
    },
    {
      question: "In SwiftUI, with `NavigationStack(path: $path)` bound to `[Route]`, how do you pop to the root screen?",
      options: [
        "Call `dismiss()` repeatedly",
        "`path.removeAll()`",
        "`NavigationStack.popToRoot()`",
        "Recreate the `NavigationStack`",
      ],
      answer: 1,
      explanation: "When you own the path, the back stack is just an array. Every navigation operation is an array operation, which also makes deep links a single assignment.",
    },
    {
      question: "A Compose screen passes a full `Todo` object (with a large `notes` field and attachments) as a route param. What's the risk?",
      options: [
        "None. Routes can be any size.",
        "Routes are saved with the back stack, so large ones can exceed the saved-state limit and crash in the background",
        "The object is copied on every recomposition",
        "Serialization is too slow for the UI thread",
      ],
      answer: 1,
      explanation: "The back stack survives process death by being saved in the Activity's state, which has a size limit. Pass the id and load the todo on the destination.",
    },
    {
      question: "A form screen in SwiftUI should confirm before the user leaves with unsaved changes. How?",
      options: [
        "Listen for a `beforeRemove` event",
        "Use `BackHandler`",
        "Hide the default back button and add your own toolbar button that asks first",
        "Override `onBackPressed`",
      ],
      answer: 2,
      explanation: "SwiftUI can't intercept the built-in back button or swipe gesture. Replace the button, and accept that hiding it also disables the swipe while it's hidden.",
    },
    {
      question: "How does a Compose screen usually show a modal bottom sheet?",
      options: [
        "`navController.navigate(Sheet)` with `presentation = modal`",
        "Call `ModalBottomSheet.show()`",
        "Compose `ModalBottomSheet` inside `if (showSheet) { … }`, and set the state to false in `onDismissRequest`",
        "Start a new Activity",
      ],
      answer: 2,
      explanation: "Modals are state-driven, like `<Modal visible>`. There's no imperative show/hide call. The same goes for `AlertDialog`, which replaces `Alert.alert`.",
    },
    {
      question: "Users report that double-tapping a row in your Compose list opens the detail screen twice. Why?",
      options: [
        "Compose recomposes twice",
        "`navigate` pushes a new entry every time, even when that destination is already on top",
        "The deep link fired as well",
        "`LazyColumn` duplicates clicks",
      ],
      answer: 1,
      explanation: "Use `navigate(route) { launchSingleTop = true }` to reuse the top entry when it's already that destination, or debounce the tap.",
    },
  ],
};
