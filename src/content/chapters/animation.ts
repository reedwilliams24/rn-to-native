import type { Chapter } from "../types";

export const animation: Chapter = {
  slug: "animation",
  title: "Animations & gestures",
  intro: [
    "In React Native, smooth animation is something you fight for. The JavaScript thread can't keep up with 60 or 120 frames per second, so Reanimated moves your animation code onto the UI thread as *worklets*, and Gesture Handler does the same for touches. Much of the API exists to keep work away from JavaScript.",
    "Native doesn't have that problem. Your Kotlin or Swift already runs on the UI thread, and the animation systems are built into Compose and SwiftUI. That changes the API's shape: instead of driving values frame by frame, you mostly **change state and say how the change should animate**.",
    "This chapter maps Animated and Reanimated onto state-driven animations, then covers enter/exit transitions, shared elements, gestures, and haptics.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "Reanimated thinks in **values**: a shared value changes over time, and an animated style reads it. Compose and SwiftUI think in **state changes**. You flip `liked` from `false` to `true`, and the framework animates every property that depends on it from the old value to the new one.",
      ],
      compare: [
        {
          label: "The core primitive",
          values: {
            rn: "`useSharedValue` + `withTiming` / `withSpring`",
            android: "`animate*AsState(targetValue)`, which follows a target",
            ios: "`withAnimation { state change }` or `.animation(_:value:)`",
          },
        },
        {
          label: "Where it runs",
          values: {
            rn: "UI thread, via worklets",
            android: "Main thread, on Compose's frame clock",
            ios: "Render server via Core Animation. Your code doesn't run per frame.",
          },
        },
        {
          label: "Interrupting mid-flight",
          values: {
            rn: "Assign a new animation. It starts from the current value.",
            android: "Change the target. It continues from the current value and velocity.",
            ios: "Change state again. Springs blend from the current velocity.",
          },
        },
        {
          label: "Imperative control",
          values: {
            rn: "Shared values, `cancelAnimation`",
            android: "`Animatable` with `animateTo` / `snapTo` in a coroutine",
            ios: "Mostly none. Use `withAnimation(completion:)` or `PhaseAnimator` / `KeyframeAnimator`.",
          },
        },
      ],
      callout:
        "There is no bridge to avoid. You don't need a special worklet syntax or animated component variants (`Animated.View`), and you don't have to choose between the JS and UI threads. Any composable or view can animate.",
    },
    {
      id: "animate-state",
      title: "Animating a value",
      prose: [
        "The most common animation is \"this property should ease to its new value when state changes\". In Reanimated you'd write a shared value, an effect to update it, and an animated style. In Compose, `animateFloatAsState` returns a `State<Float>` that animates toward whatever target you pass on each recomposition. In SwiftUI you change the state, and the `.animation(_:value:)` modifier animates every animatable property it affects.",
      ],
      snippet: "animate-state",
      notes: {
        rn: ["You need `useEffect` here because the shared value lives outside React state. Native has nothing to sync."],
        android: [
          "There are `animateDpAsState`, `animateColorAsState`, `animateOffsetAsState`, and more. Each one interpolates its own type correctly.",
          "`label` names the animation in Android Studio's Animation Preview inspector.",
          "Reading `scale` inside `graphicsLayer { }` defers the read to the draw phase, so each frame skips recomposition. This is Compose's version of `useAnimatedStyle`.",
        ],
        ios: [
          "`.animation(.bouncy, value: liked)` animates the view it's attached to, and its children, whenever `liked` changes. Always pass `value:`. The value-less version is deprecated.",
          "`withAnimation` is the other style: wrap the state change itself, and every view that depends on it animates.",
        ],
      },
    },
    {
      id: "specs",
      title: "Timing, springs, and easing",
      prose: [
        "The vocabulary carries over almost one-to-one. Both platforms lean toward springs as the default, because springs handle interruption gracefully. A spring that's redirected mid-flight keeps its velocity instead of jerking.",
      ],
      compare: [
        {
          label: "Timing",
          values: {
            rn: "`withTiming(v, { duration: 300, easing: Easing.inOut(Easing.ease) })`",
            android: "`tween(durationMillis = 300, easing = FastOutSlowInEasing)`",
            ios: "`.easeInOut(duration: 0.3)` (seconds, not milliseconds)",
          },
        },
        {
          label: "Spring",
          values: {
            rn: "`withSpring(v, { damping: 15, stiffness: 150 })`",
            android: "`spring(dampingRatio = …, stiffness = …)`",
            ios: "`.spring(duration: 0.4, bounce: 0.2)`, or `.snappy`, `.smooth`, `.bouncy`",
          },
        },
        {
          label: "Default when unspecified",
          values: {
            rn: "None. You pick every time.",
            android: "A spring (`spring()`) for most `animate*AsState`",
            ios: "`.default`, which is a spring since iOS 17",
          },
        },
        {
          label: "Repeat / sequence",
          values: {
            rn: "`withRepeat`, `withSequence`, `withDelay`",
            android: "`infiniteRepeatable`, `keyframes { }`, `rememberInfiniteTransition`",
            ios: "`.repeatForever()`, `.delay()`, `PhaseAnimator`, `KeyframeAnimator`",
          },
        },
      ],
    },
    {
      id: "visibility",
      title: "Enter and exit transitions",
      prose: [
        "Reanimated's `entering` and `exiting` props become `AnimatedVisibility` in Compose and `.transition()` in SwiftUI. The idea is the same: when a view is added to or removed from the tree, play an animation instead of popping.",
        "The part that trips people up is *exit*. In React, a component disappears as soon as you stop rendering it, so Reanimated keeps a snapshot alive to animate out. Compose's `AnimatedVisibility` keeps its content composed until the exit finishes. SwiftUI keeps the removed view around, but only if the removal happens inside an animation.",
      ],
      snippet: "visibility",
      notes: {
        android: [
          "Transitions combine with `+`: `fadeIn() + expandVertically()`.",
          "During the exit animation, `message` is already `null`. Remembering the last value avoids flashing an empty banner.",
          "Inside a `LazyColumn`, use `Modifier.animateItem()` for insert, remove, and reorder animations instead.",
        ],
        ios: [
          "Without an animation in effect, `.transition` does nothing. Pair it with `.animation(_:value:)` on a container, or `withAnimation` where the state changes.",
          "Combine transitions with `.combined(with:)`. Use `.asymmetric(insertion:removal:)` for different in and out effects.",
          "Put the `.animation` modifier on a container that stays in the tree (the `VStack`), not on the view that's being removed.",
        ],
      },
    },
    {
      id: "content",
      title: "Animating content changes",
      prose: [
        "Sometimes the view stays but its content changes: a counter ticks, or a status label swaps. In RN you'd change the `key` to force a remount and let `entering`/`exiting` animate it. Compose has `AnimatedContent`, which crossfades or slides between old and new content for any target state. SwiftUI's `.contentTransition` handles text and symbol changes, including a rolling-digits effect for numbers.",
      ],
      snippet: "content",
      notes: {
        android: [
          "`AnimatedContent` gives you `initialState` and `targetState` in `transitionSpec`, so you can pick a direction based on the change.",
          "`Crossfade(targetState)` is the simpler version when a fade is all you need.",
        ],
        ios: [
          "`.numericText(value:)` animates digit by digit and uses the value to pick a direction.",
          "For anything that isn't text, swap views with `.id(value)` plus a `.transition`. That's the closest equivalent of the RN `key` trick.",
        ],
      },
    },
    {
      id: "layout",
      title: "Layout animations",
      prose: [
        "RN's `LayoutAnimation.configureNext()` and Reanimated's `layout={LinearTransition}` animate size and position changes after a re-render. Each native platform handles this in its own way.",
        "SwiftUI does it automatically: any frame change that happens inside `withAnimation` animates, including siblings that move to make room. Compose is explicit: add `Modifier.animateContentSize()` to a container whose size changes, or `Modifier.animateItem()` to lazy list items.",
      ],
      compare: [
        {
          label: "Container grows or shrinks",
          values: {
            rn: "`LayoutAnimation.configureNext(...)`",
            android: "`Modifier.animateContentSize()`",
            ios: "Automatic inside `withAnimation`",
          },
        },
        {
          label: "List item inserted or moved",
          values: {
            rn: "`itemLayoutAnimation` on `Animated.FlatList`",
            android: "`Modifier.animateItem()` in `LazyColumn`",
            ios: "Automatic for `List` and `ForEach` with stable IDs",
          },
        },
        {
          label: "Siblings reflow",
          values: {
            rn: "`layout={LinearTransition}` on each sibling",
            android: "`animateContentSize()` on the parent, or `LookaheadScope`",
            ios: "Automatic inside `withAnimation`",
          },
        },
      ],
    },
    {
      id: "shared",
      title: "Shared element transitions",
      prose: [
        "A thumbnail that grows into a full-screen photo is a shared element transition. In RN it's an experimental Reanimated feature tied to React Navigation. Both native platforms support it in the UI toolkit itself.",
        "Compose wraps both states in `SharedTransitionLayout` and tags matching elements with `Modifier.sharedElement`. SwiftUI uses `matchedGeometryEffect` with a shared `@Namespace` within a screen, and `.navigationTransition(.zoom)` for `NavigationStack` pushes on iOS 18+.",
      ],
      snippet: "shared",
      notes: {
        android: [
          "Shared elements need an `AnimatedVisibilityScope` to know when they're entering or leaving. `AnimatedContent` provides one, and so does each `composable()` destination in Navigation Compose.",
          "The API is still marked `@ExperimentalSharedTransitionApi`, so opt in explicitly.",
          "Use `sharedBounds` instead of `sharedElement` when the two sides have different content, like a card that becomes a screen.",
        ],
        ios: [
          "Both views use the same `id` and `namespace`. At any moment, exactly one of them should be in the tree.",
          "Apply `matchedGeometryEffect` *before* `.frame`, so it matches the frame each side ends up with.",
        ],
      },
    },
    {
      id: "gestures",
      title: "Gestures",
      prose: [
        "Gesture Handler exists because RN's built-in responder system runs touches through JavaScript. Native gesture systems already run on the UI thread, so there's nothing to work around.",
        "Simple taps are modifiers you've already met: `Modifier.clickable` and `Button` (Chapter 1). For custom gestures, Compose gives you `Modifier.pointerInput` with *detectors* like `detectDragGestures`, which are suspend functions running in a coroutine. SwiftUI attaches gesture values like `DragGesture()` with `.gesture()`. The drag-and-spring-back pattern looks like this:",
      ],
      snippet: "drag",
      notes: {
        rn: ["`translationX` is relative to where the gesture started. SwiftUI's `value.translation` is too. Compose's `dragAmount` is the delta since the last event, so you accumulate it."],
        android: [
          "`Animatable` is the imperative animation handle. Use `snapTo` to follow the finger, then `animateTo` to spring back. Each call cancels the previous one.",
          "`Modifier.offset { }` (the lambda version) reads the offset during layout, so dragging doesn't recompose the composable.",
          "`pointerInput(Unit)` restarts its gesture detector when the key changes, just like `useEffect` deps.",
        ],
        ios: [
          "SwiftUI re-evaluates `body` on every `onChanged`. That's fine here. For heavy views, use `@GestureState`, which resets automatically when the gesture ends.",
          "Combine gestures with `.simultaneously(with:)`, `.sequenced(before:)`, and `.exclusively(before:)`. These are Gesture Handler's `Gesture.Simultaneous`, `Sequence`, and `Exclusive`.",
        ],
      },
      compare: [
        {
          label: "Tap / long press",
          values: {
            rn: "`Gesture.Tap()`, `Gesture.LongPress()`",
            android: "`Modifier.combinedClickable(onLongClick = …)` or `detectTapGestures`",
            ios: "`.onTapGesture`, `.onLongPressGesture`",
          },
        },
        {
          label: "Pan / drag",
          values: {
            rn: "`Gesture.Pan()`",
            android: "`detectDragGestures`, or `Modifier.draggable` for one axis",
            ios: "`DragGesture()`",
          },
        },
        {
          label: "Pinch / rotate",
          values: {
            rn: "`Gesture.Pinch()`, `Gesture.Rotation()`",
            android: "`detectTransformGestures` or `Modifier.transformable`",
            ios: "`MagnifyGesture()`, `RotateGesture()` (iOS 17+)",
          },
        },
        {
          label: "Swipe to dismiss",
          values: {
            rn: "`Swipeable` from Gesture Handler",
            android: "`SwipeToDismissBox` (Material 3)",
            ios: "`.swipeActions` on `List` rows",
          },
        },
      ],
    },
    {
      id: "haptics",
      title: "Haptics",
      prose: [
        "`expo-haptics` maps to `LocalHapticFeedback` in Compose and the `.sensoryFeedback` modifier in SwiftUI. The Compose API is imperative, like RN: call it in your event handler. SwiftUI's is declarative: you tie feedback to a state change, and it plays when that value changes. It's the same idea as `.animation(_:value:)`.",
      ],
      snippet: "haptics",
      notes: {
        android: [
          "`HapticFeedbackType` includes `Confirm`, `Reject`, `ToggleOn`, `ToggleOff`, `LongPress`, and more (Compose 1.8+). Prefer semantic types over raw vibration, because they respect the user's system settings.",
        ],
        ios: [
          "The `condition` closure (`{ _, isDone in isDone }`) limits feedback to the transitions you care about.",
          "`.sensoryFeedback` is iOS 17+. Older code uses `UINotificationFeedbackGenerator().notificationOccurred(.success)`.",
        ],
      },
    },
  ],
  gotchas: [
    {
      title: "SwiftUI transitions need an animation",
      body: "`.transition(.opacity)` alone does nothing. The insertion or removal must happen inside `withAnimation` or under an `.animation(_:value:)` modifier on a parent that stays in the tree. When an exit \"just pops\", this is almost always why.",
    },
    {
      title: "Reading animated state in composition recomposes every frame",
      body: "`Modifier.scale(scale)` with an animating `scale` recomposes on every frame. `Modifier.graphicsLayer { scaleX = scale }` and `Modifier.offset { … }` read the value later, during draw or layout. It's the same concern as keeping Reanimated work off the JS thread, just at a different level.",
    },
    {
      title: "Don't re-create animation state on every recomposition",
      body: "`val offset = Animatable(0f)` without `remember` creates a new animation on every recomposition, so it never moves. Wrap it in `remember { }`, the same way you'd use `useSharedValue` rather than a plain variable.",
    },
    {
      title: "SwiftUI durations are in seconds",
      body: "Reanimated and Compose use milliseconds (`duration: 300`, `tween(300)`). SwiftUI uses seconds: `.easeInOut(duration: 0.3)`. Writing `duration: 300` gives you a five-minute animation.",
    },
    {
      title: "`withAnimation` animates everything that changed",
      body: "Every view that depends on state changed inside `withAnimation` animates, including views you didn't mean to. To scope an animation, use `.animation(_:value:)` on the specific subtree. To opt a view out, use `.transaction { $0.animation = nil }`.",
    },
    {
      title: "Respect Reduce Motion",
      body: "Neither platform turns off your custom animations for you. Check the setting and swap big motion for a crossfade or nothing. Chapter 16 shows how on each platform.",
    },
  ],
  cheatsheet: [
    { rn: "`useSharedValue` + `withTiming`", android: "`animate*AsState(target)`", ios: "`.animation(_:value:)` / `withAnimation`" },
    { rn: "Imperative shared value", android: "`remember { Animatable(…) }`", ios: "`@State` + `withAnimation`" },
    { rn: "`useAnimatedStyle`", android: "`graphicsLayer { }` / `offset { }`", ios: "Plain modifiers" },
    { rn: "`withTiming(v, { duration })`", android: "`tween(durationMillis)`", ios: "`.easeInOut(duration:)` (seconds)" },
    { rn: "`withSpring`", android: "`spring(dampingRatio, stiffness)`", ios: "`.spring(duration:bounce:)` / `.bouncy`" },
    { rn: "`entering` / `exiting`", android: "`AnimatedVisibility(enter, exit)`", ios: "`.transition()`" },
    { rn: "`key` change + entering", android: "`AnimatedContent` / `Crossfade`", ios: "`.contentTransition` / `.id()` + `.transition`" },
    { rn: "`LayoutAnimation`", android: "`animateContentSize()` / `animateItem()`", ios: "Automatic in `withAnimation`" },
    { rn: "`sharedTransitionTag`", android: "`SharedTransitionLayout` + `sharedElement`", ios: "`matchedGeometryEffect` / `.navigationTransition(.zoom)`" },
    { rn: "`Gesture.Pan()`", android: "`pointerInput { detectDragGestures }`", ios: "`DragGesture()`" },
    { rn: "`Gesture.Pinch()`", android: "`detectTransformGestures`", ios: "`MagnifyGesture()`" },
    { rn: "`Gesture.Simultaneous`", android: "Multiple detectors in one `pointerInput`", ios: "`.simultaneously(with:)`" },
    { rn: "`expo-haptics`", android: "`LocalHapticFeedback.current`", ios: "`.sensoryFeedback(_:trigger:)`" },
  ],
  quiz: [
    {
      question: "In Compose, how do you animate a heart icon's scale between `1f` and `1.3f` when `liked` changes?",
      options: [
        "`val scale = remember { mutableStateOf(1f) }` and a `LaunchedEffect` loop updating it each frame",
        "`val scale by animateFloatAsState(if (liked) 1.3f else 1f)`",
        "Wrap the icon in `Animated.View`",
        "`Modifier.animation(liked)`",
      ],
      answer: 1,
      explanation: "`animate*AsState` takes a target and animates toward it whenever the target changes. You declare the end state, and Compose handles the frames. You don't need to sync anything in an effect.",
    },
    {
      question: "A SwiftUI banner has `.transition(.move(edge: .top))`, but it pops in and out with no animation. What's the most likely cause?",
      options: [
        "Transitions only work on iOS 18+",
        "The state change that inserts/removes it isn't inside an animation",
        "`.transition` must come before `.padding`",
        "Banners need `matchedGeometryEffect`",
      ],
      answer: 1,
      explanation: "Transitions describe *how* to animate an insertion or removal, but something must start an animation. Use `withAnimation` around the state change, or `.animation(_:value:)` on a parent that stays in the tree.",
    },
    {
      question: "You write `.easeInOut(duration: 300)` in SwiftUI. What happens?",
      options: [
        "A 300 ms animation",
        "A compile error",
        "A 5-minute animation",
        "SwiftUI clamps it to 1 second",
      ],
      answer: 2,
      explanation: "SwiftUI animation durations are `TimeInterval`, measured in seconds. Reanimated and Compose use milliseconds. Write `0.3`.",
    },
    {
      question: "Your draggable Compose card stutters. It uses `Modifier.offset(x = offsetX.dp)` with an animated `offsetX`. What's the better approach?",
      options: [
        "Move the drag logic to a background thread",
        "Use `Modifier.offset { IntOffset(...) }`, which reads the value during layout instead of composition",
        "Use Reanimated's worklets on Android",
        "Wrap the card in `key(offsetX)`",
      ],
      answer: 1,
      explanation: "Lambda modifiers like `offset { }` and `graphicsLayer { }` defer the read past composition, so each frame skips recomposition. That's the Compose equivalent of keeping per-frame work off the JS thread.",
    },
    {
      question: "Why doesn't native need a library like Gesture Handler?",
      options: [
        "Native apps don't support custom gestures",
        "Gesture recognition already runs on the UI thread with your code, so there's no bridge to bypass",
        "Gestures are handled by the GPU",
        "Gesture Handler is built into Android and iOS",
      ],
      answer: 1,
      explanation: "Gesture Handler moves touch handling off the JS thread. On native, `pointerInput` and SwiftUI gestures already run on the main thread, alongside your UI code.",
    },
    {
      question: "How does SwiftUI's `.sensoryFeedback(.success, trigger: done)` differ from `Haptics.notificationAsync()`?",
      options: [
        "It's imperative and must be called in the button action",
        "It plays whenever the `trigger` value changes, so it's tied to state, not to an event handler",
        "It only works on iPad",
        "It requires a permission",
      ],
      answer: 1,
      explanation: "SwiftUI's haptics are declarative, like `.animation(_:value:)`. Compose's `LocalHapticFeedback` is imperative, like `expo-haptics`.",
    },
  ],
};
