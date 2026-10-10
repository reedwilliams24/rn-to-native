import type { Chapter } from "../types";

export const nativeApis: Chapter = {
  slug: "native-apis",
  title: "Native APIs & permissions",
  intro: [
    "In React Native, most device features arrive as a package: `expo-camera`, `expo-location`, `expo-notifications`. Each one wraps an Android API and an iOS API behind a single JavaScript function, and a config plugin edits the native project files for you.",
    "On native you call those APIs directly. That's less magic and more code, but also less indirection: when something breaks, the stack trace points at your code and the platform docs describe exactly what you called.",
    "This chapter walks through the permissions model on each platform, then the features RN apps reach for most: photos and camera, location, local notifications, background work, and push. Expect the two platforms to differ more here than anywhere else in the guide. Expo's job was to hide those differences.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "Every Expo module you used had two halves: a JavaScript API, and a config plugin that patched `AndroidManifest.xml` and `Info.plist` at prebuild time. On native you own both halves. You declare capabilities in the project's config files, and you call the platform API from Kotlin or Swift.",
      ],
      compare: [
        {
          label: "Declare a capability in…",
          values: {
            rn: "`app.json` plugins, or `react-native-permissions` setup",
            android: "`<uses-permission>` in `AndroidManifest.xml`",
            ios: "A usage-description key in `Info.plist`, plus *Signing & Capabilities* for some features",
          },
        },
        {
          label: "Ask the user with…",
          values: {
            rn: "`requestPermissionsAsync()` or a `use…Permissions()` hook",
            android: "An `ActivityResultLauncher` with `RequestPermission()`",
            ios: "A framework-specific call, e.g. `AVCaptureDevice.requestAccess(for:)`",
          },
        },
        {
          label: "One API for all permissions?",
          values: {
            rn: "Yes, roughly. Every module returns `{ granted, canAskAgain }`.",
            android: "Yes. Every runtime permission is a `Manifest.permission` string.",
            ios: "No. Each framework (AVFoundation, CoreLocation, UserNotifications, Photos) has its own status enum and request method.",
          },
        },
        {
          label: "If you forget to declare it…",
          values: {
            rn: "Prebuild leaves it out, and the native layer fails",
            android: "The request is silently denied. No dialog appears.",
            ios: "The app crashes the moment you touch the API",
          },
        },
      ],
      callout:
        "You'll still find wrapper libraries on native (Accompanist Permissions on Android, for example), but the platform APIs are small enough that most teams use them directly. Learn the raw API first.",
    },
    {
      id: "request",
      title: "Requesting a permission",
      prose: [
        "The shape is the same on every platform: check the current status, request if needed, then act on the result. What differs is how the result comes back.",
        "Android permission requests go through the *Activity Result API*. You register a launcher during composition, and the result arrives later in a callback, because the system dialog is technically another activity. iOS frameworks expose an `async` method you can simply `await`.",
      ],
      snippet: "permission",
      notes: {
        rn: ["`useCameraPermissions` re-checks status for you. On native you check it yourself before every use, because the user can revoke it in Settings at any time."],
        android: [
          "`rememberLauncherForActivityResult` must be called unconditionally during composition, like a hook. You can't create a launcher inside `onClick`.",
          "`ContextCompat.checkSelfPermission` is the synchronous status check. It's cheap, so call it right before you need the feature.",
          "`LocalContext.current` gives you the `Context` that most Android APIs need. More on that below.",
        ],
        ios: [
          "The string in `NSCameraUsageDescription` is shown in the system prompt. App Review rejects vague text like \"We need the camera\".",
          "`requestAccess(for:)` returns immediately with `false` if the user already decided. It never shows the prompt twice.",
        ],
      },
    },
    {
      id: "denied",
      title: "Denied, and denied for good",
      prose: [
        "RN hands you `canAskAgain`. Native makes you work it out, and the rules differ.",
        "iOS asks exactly once. After that, the only way to change the answer is the Settings app, so a denied status means \"show a button that opens Settings\". Android lets you ask twice. If the user denies the second time (or ticks *Don't ask again* on older versions), further requests return `false` instantly with no dialog. Android has no direct \"permanently denied\" flag, so apps infer it: after a request, if permission is still denied and `shouldShowRequestPermissionRationale` returns `false`, the dialog won't come back.",
      ],
      snippet: "denied",
      notes: {
        rn: ["`Linking.openSettings()` wraps exactly the two native calls on the right."],
        android: [
          "`shouldShowRequestPermissionRationale` returns `true` after one denial. That's your cue to explain *why* before asking again.",
          "It also returns `false` before you've ever asked, which is why the snippet tracks `askedOnce`.",
          "`LifecycleResumeEffect` re-runs when the screen resumes, so returning from Settings refreshes the state. Chapter 6 covers lifecycle effects.",
        ],
        ios: [
          "`UIApplication.openSettingsURLString` opens your app's page in Settings.",
          "Revoking a privacy permission in Settings usually terminates your app, so it relaunches fresh. Re-checking on `scenePhase` covers the cases where it doesn't.",
        ],
      },
    },
    {
      id: "context",
      title: "Context, activities, and singletons",
      prose: [
        "JavaScript modules are global, so RN code calls `Location.getCurrentPositionAsync()` from anywhere. Native APIs aren't shaped like that, and the two platforms disagree in an important way.",
        "Most Android APIs need a `Context`: a handle to your app's resources and system services. Some (permission dialogs, starting another screen) need an `Activity` specifically. In Compose you get them from `LocalContext.current` and `LocalActivity.current`. In a ViewModel or repository you inject the *application* context. iOS APIs are mostly shared singletons (`UNUserNotificationCenter.current()`, `BGTaskScheduler.shared`) or objects you create yourself (`CLLocationManager()`).",
      ],
      compare: [
        {
          label: "Get a system service",
          values: {
            rn: "Import the module",
            android: "`context.getSystemService(NotificationManager::class.java)`",
            ios: "`UNUserNotificationCenter.current()`",
          },
        },
        {
          label: "In UI code",
          values: {
            rn: "Call it anywhere",
            android: "`LocalContext.current`, `LocalActivity.current`",
            ios: "Call it anywhere, or `@Environment(\\.openURL)` for URLs",
          },
        },
        {
          label: "In app-wide code",
          values: {
            rn: "Call it anywhere",
            android: "Inject `applicationContext` (e.g. with Hilt)",
            ios: "Call it anywhere",
          },
        },
        {
          label: "App-level callbacks",
          values: {
            rn: "Handled inside native modules",
            android: "`Application` subclass, `Service`s, manifest entries",
            ios: "`UIApplicationDelegate` via `@UIApplicationDelegateAdaptor`",
          },
        },
      ],
      callout:
        "Never store an `Activity` or a composable's `Context` in a long-lived object such as a singleton or ViewModel. The activity is destroyed on rotation (Chapter 6), and you'll leak it. If something outlives the screen, give it `applicationContext`.",
    },
    {
      id: "photos",
      title: "Photos: use the system picker",
      prose: [
        "Here's where RN intuition misleads you. Many RN apps request photo library access before opening a picker, because older libraries required it. Both platforms now ship a system picker that runs in a separate process. Your app only receives the items the user picks, so **no permission is needed**.",
        "Ask for full library or camera access only when you're building your own gallery or camera UI.",
      ],
      snippet: "picker",
      notes: {
        android: [
          "`PickVisualMedia` uses the Android photo picker. On older devices without it, the library falls back to the document picker automatically.",
          "You get a content `Uri`, not a file path. Read it with `context.contentResolver.openInputStream(uri)`.",
        ],
        ios: [
          "`PhotosPicker` lives in the `PhotosUI` framework. `loadTransferable` is `async` because the image might need downloading from iCloud.",
          "To take a new photo, wrap `UIImagePickerController` with `UIViewControllerRepresentable` or build a custom camera with AVFoundation. Both need `NSCameraUsageDescription`.",
        ],
      },
      callout:
        "Taking a photo is different. Android's `TakePicture()` contract launches the camera app and doesn't need the permission. But if your manifest declares `CAMERA` and it isn't granted, the launch throws a `SecurityException`. If you only use the system camera, don't declare `CAMERA` at all.",
    },
    {
      id: "location",
      title: "Location",
      prose: [
        "Location shows how much each platform's model differs. Android splits location into two permissions, *coarse* (approximate) and *fine* (precise). You request both together, and the user can choose to grant only approximate. iOS has a single authorization with a separate *precise* toggle. It also separates *when in use* from *always*, which Android handles with a third permission for background location.",
        "For reading the position, Android uses Google Play services' `FusedLocationProviderClient`, which blends GPS, Wi-Fi, and cell signals. iOS 17 added `CLLocationUpdate.liveUpdates()`, an `AsyncSequence` you iterate with `for await`.",
      ],
      snippet: "location",
      notes: {
        rn: ["`expo-location` hides the coarse/fine split. On Android it requests both and reports the result as one `granted` flag."],
        android: [
          "`await()` on a Play services `Task` comes from `kotlinx-coroutines-play-services`. It turns callback APIs into `suspend` functions (Chapter 11).",
          "`@RequiresPermission` makes Android Lint flag call sites that haven't checked the permission. `@SuppressLint` says \"I've checked\".",
          "Background location (`ACCESS_BACKGROUND_LOCATION`) must be requested separately, *after* foreground access, and sends the user to Settings.",
        ],
        ios: [
          "Keep the `CLLocationManager` alive in a property. If it's deallocated, the authorization prompt disappears.",
          "`break` ends the `for await` loop, which stops location updates. That's structured concurrency doing cleanup for you.",
          "`@ObservationIgnored` keeps the manager out of `@Observable` tracking, since views never read it.",
        ],
      },
    },
    {
      id: "notifications",
      title: "Local notifications",
      prose: [
        "`expo-notifications` gives you one `scheduleNotificationAsync` call. Natively, iOS has a direct equivalent: build content, attach a trigger, and add the request to `UNUserNotificationCenter`. The system delivers it later even if your app isn't running.",
        "Android works differently. It can *post* a notification right away, but there's no API to schedule one for later. You schedule work instead (with WorkManager or `AlarmManager`), and that work posts the notification. Android also requires every notification to belong to a **channel**. Users can mute or customize each channel separately in Settings.",
      ],
      snippet: "notify",
      notes: {
        android: [
          "Creating a channel that already exists is a no-op, so call `createReminderChannel` at app start.",
          "On Android 13+, `POST_NOTIFICATIONS` is a runtime permission. Request it with the same launcher pattern as the camera.",
          "`setSmallIcon` is required. Without it, the notification throws at runtime. Real apps use a monochrome drawable from `res/`.",
        ],
        ios: [
          "`requestAuthorization` returns `Bool` and throws. Like the camera prompt, it's shown only once.",
          "Foreground notifications are hidden by default. To show them, implement `userNotificationCenter(_:willPresent:)` on a delegate.",
        ],
      },
    },
    {
      id: "background",
      title: "Background work",
      prose: [
        "RN background tasks (`expo-background-task`, `react-native-background-fetch`) have to boot a JavaScript runtime just to run your function. Native background work skips that step, but the OS rules are the same, because the libraries were always wrapping these APIs.",
        "**WorkManager** is Android's answer for deferrable, guaranteed work. You describe the job and its constraints, such as \"needs network\" and \"every 15 minutes\", and the system runs it when conditions allow, even after a reboot. **BGTaskScheduler** is iOS's version, and it's far more conservative. You *request* a refresh no earlier than a given time, and iOS decides whether and when to run it, based on battery and how often the user opens your app.",
      ],
      snippet: "background",
      notes: {
        android: [
          "`CoroutineWorker.doWork()` is a `suspend` function that already runs off the main thread.",
          "`enqueueUniquePeriodicWork` with `KEEP` makes registration idempotent, so calling it on every launch is safe.",
          "15 minutes is the minimum period. For exact times (an alarm clock) use `AlarmManager`, which needs its own permission.",
        ],
        ios: [
          "The SwiftUI `.backgroundTask(.appRefresh(…))` scene modifier replaces the old `BGTaskScheduler.register` boilerplate.",
          "Requests are one-shot. Re-submit each time, or the task runs once and never again.",
          "Expect iOS to run refreshes rarely, and not at all if the user force-quits your app. Never rely on them for correctness.",
        ],
      },
    },
    {
      id: "push",
      title: "Push notifications",
      prose: [
        "Push has three parts on every platform: get permission, get a device token and send it to your server, and handle incoming messages. Android uses **Firebase Cloud Messaging** (FCM). iOS uses **Apple Push Notification service** (APNs). If you used `@react-native-firebase/messaging`, you were already using FCM on both, since FCM can relay to APNs. Many teams keep that setup after migrating, using the Firebase iOS SDK.",
        "The snippet shows the platform-native path: a `FirebaseMessagingService` on Android, and the raw APNs token from a `UIApplicationDelegate` on iOS.",
      ],
      snippet: "push",
      notes: {
        rn: ["Expo Push is a relay in front of FCM and APNs. After migrating, your server talks to them directly, or to a provider that does."],
        android: [
          "The service is declared in the manifest, and the system starts it when a message arrives, even if your app isn't running.",
          "*Notification* messages are shown by the system automatically while your app is in the background. `onMessageReceived` only sees them in the foreground. *Data* messages always reach your code.",
          "`onNewToken` fires on first launch and whenever the token rotates. Treat the token as something that changes.",
        ],
        ios: [
          "`@UIApplicationDelegateAdaptor` is how a SwiftUI app gets the delegate callbacks that push still requires.",
          "The token arrives as raw `Data`. Hex-encode it before sending it to your server.",
          "The Simulator can receive real pushes on Apple silicon Macs (Xcode 14+). For quick tests, drag an `.apns` JSON file onto it, or use `xcrun simctl push`.",
        ],
      },
    },
  ],
  gotchas: [
    {
      title: "A missing Info.plist key crashes the app",
      body: "On iOS, touching a protected API without its usage-description key terminates the app immediately, with only a console message to explain why. Android fails quietly instead: the request returns denied and no dialog appears. When a permission \"does nothing\", check the manifest or plist first.",
    },
    {
      title: "iOS asks once, Android asks twice",
      body: "An iOS prompt you waste on app launch is gone for good. Ask in context, right when the user taps the feature, and explain why first. On Android, the second denial is permanent. Both platforms reward asking late.",
    },
    {
      title: "Launchers are registered, not created on demand",
      body: "`rememberLauncherForActivityResult` follows the same rules as hooks: call it unconditionally during composition, then call `launch` from your event handler. Calling it inside `onClick` won't compile, because `onClick` isn't composable.",
    },
    {
      title: "You may not need a permission at all",
      body: "The system photo picker, the system camera app, and the share sheet all run outside your app and need no permission. Asking for library access you don't need is a common App Review and Play policy rejection.",
    },
    {
      title: "Background execution is a request, not a guarantee",
      body: "Neither OS runs your code on a timer. WorkManager is reliable but batches work. iOS may skip `BGAppRefreshTask` for days. Design so that syncing on launch is the source of truth and background refresh is a bonus.",
    },
    {
      title: "The Simulator and emulator lie about hardware",
      body: "Location, camera, push, and biometrics are faked or missing in simulators. The iOS Simulator has no camera at all. Test permission flows on real devices, and reset them between runs (`adb shell pm reset-permissions`, or delete and reinstall the app on iOS).",
    },
  ],
  cheatsheet: [
    { rn: "`app.json` permission plugins", android: "`<uses-permission>` in `AndroidManifest.xml`", ios: "`NS…UsageDescription` in `Info.plist`" },
    { rn: "`requestPermissionsAsync()`", android: "`rememberLauncherForActivityResult(RequestPermission())`", ios: "Framework `requestAccess` / `requestAuthorization`" },
    { rn: "`getPermissionsAsync()`", android: "`ContextCompat.checkSelfPermission`", ios: "`authorizationStatus(for:)` / `authorizationStatus`" },
    { rn: "`canAskAgain`", android: "`shouldShowRequestPermissionRationale` (inferred)", ios: "Status is `.notDetermined`" },
    { rn: "`Linking.openSettings()`", android: "`Intent(ACTION_APPLICATION_DETAILS_SETTINGS)`", ios: "`openURL(UIApplication.openSettingsURLString)`" },
    { rn: "`expo-image-picker`", android: "`PickVisualMedia()`", ios: "`PhotosPicker`" },
    { rn: "`expo-camera`", android: "CameraX", ios: "AVFoundation" },
    { rn: "`expo-location`", android: "`FusedLocationProviderClient`", ios: "`CLLocationManager` / `CLLocationUpdate`" },
    { rn: "`scheduleNotificationAsync`", android: "`NotificationCompat` + WorkManager", ios: "`UNUserNotificationCenter.add`" },
    { rn: "Android notification channels", android: "`NotificationChannel`", ios: "N/A (per-app settings)" },
    { rn: "`expo-background-task`", android: "WorkManager `CoroutineWorker`", ios: "`BGTaskScheduler` / `.backgroundTask`" },
    { rn: "`@react-native-firebase/messaging`", android: "`FirebaseMessagingService`", ios: "APNs via `UIApplicationDelegate`" },
    { rn: "Native module access", android: "`LocalContext.current`", ios: "Shared singletons" },
  ],
  quiz: [
    {
      question: "You add camera scanning on iOS but forget `NSCameraUsageDescription`. What happens when you call `AVCaptureDevice.requestAccess(for: .video)`?",
      options: [
        "The prompt shows a generic default message",
        "The request silently returns `false`",
        "The app crashes",
        "It works in debug builds only",
      ],
      answer: 2,
      explanation: "iOS terminates the app when a protected API is used without its usage-description key. Android behaves differently: a permission missing from the manifest is silently denied.",
    },
    {
      question: "A user denied location on iOS last week. Your app calls `requestWhenInUseAuthorization()` again. What does the user see?",
      options: [
        "The same system prompt",
        "A prompt with a \"Don't ask again\" option",
        "Nothing; the status stays denied",
        "A redirect to the Settings app",
      ],
      answer: 2,
      explanation: "iOS shows each permission prompt once. After that, only the user can change it in Settings, so your UI should offer a button that opens Settings.",
    },
    {
      question: "Where do you call `rememberLauncherForActivityResult` in Compose?",
      options: [
        "Inside the button's `onClick`",
        "Unconditionally in the composable body; then call `launch()` from `onClick`",
        "In `Activity.onCreate` only",
        "In a `LaunchedEffect`",
      ],
      answer: 1,
      explanation: "It's a composable, so it follows the same rules as hooks: register it during composition, then trigger it from events. Event handlers aren't composable.",
    },
    {
      question: "You need users to attach one existing photo to a todo. Which permission do you request?",
      options: [
        "`READ_MEDIA_IMAGES` / full Photos library access",
        "`CAMERA` / camera access",
        "None; use the system photo picker",
        "Storage permission on Android, nothing on iOS",
      ],
      answer: 2,
      explanation: "`PickVisualMedia` and `PhotosPicker` run outside your app and return only what the user selects. Requesting broad media access you don't need can get your app rejected.",
    },
    {
      question: "How do you show a reminder notification on Android one hour from now?",
      options: [
        "`NotificationManagerCompat.notify(id, n, delay = 3600)`",
        "Build it with `setWhen(now + 1h)`",
        "Schedule work (WorkManager or AlarmManager) that posts the notification when it runs",
        "Post it now on a hidden channel and unhide it later",
      ],
      answer: 2,
      explanation: "Android can only post notifications immediately. Scheduling is a separate concern. iOS is the platform with a built-in trigger (`UNTimeIntervalNotificationTrigger`).",
    },
    {
      question: "You submit a `BGAppRefreshTaskRequest` with `earliestBeginDate` 15 minutes from now. What does iOS guarantee?",
      options: [
        "It runs in exactly 15 minutes",
        "It runs within 15 minutes",
        "It won't run *before* 15 minutes; it may run much later or not at all",
        "It runs every 15 minutes until cancelled",
      ],
      answer: 2,
      explanation: "iOS treats background refresh as a hint and schedules it based on battery and usage. It's also one-shot, so you re-submit each time. Never depend on it for correctness.",
    },
    {
      question: "Why shouldn't a singleton repository keep the `Context` from `LocalContext.current`?",
      options: [
        "It's a different type from `ApplicationContext` and won't compile",
        "It's usually the Activity, which is destroyed on rotation, so the singleton would leak it",
        "Context isn't thread-safe",
        "It's only valid during recomposition",
      ],
      answer: 1,
      explanation: "In a composable, the local context is usually your `Activity`. Long-lived objects should hold `applicationContext`, which lives as long as the process.",
    },
  ],
};
