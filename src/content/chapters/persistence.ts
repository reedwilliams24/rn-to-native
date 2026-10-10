import type { Chapter } from "../types";

export const persistence: Chapter = {
  slug: "persistence",
  title: "Persistence",
  intro: [
    "RN apps usually reach for AsyncStorage or MMKV for small values, SQLite or WatermelonDB for structured data, and a secure-store module for tokens. Native platforms have first-party versions of all three, and they're more capable than the RN wrappers built on top of them.",
    "The big shift is that native storage is *observable*. A Room query returns a Flow that re-emits when the table changes. A SwiftData `@Query` updates the view when rows change. `@AppStorage` re-renders when a setting changes. In RN you re-read after every write. On native, the UI subscribes and the storage layer tells it.",
    "This chapter uses the coroutines and Flow from Chapter 11, and connects to the offline-first pattern from Chapter 12.",
  ],
  sections: [
    {
      id: "choosing",
      title: "Which store for what",
      prose: [
        "The decision is the same as in RN: small settings go in a key-value store, structured data goes in a database, and secrets go in the platform's secure storage. Only the names change.",
      ],
      compare: [
        {
          label: "Settings & flags",
          values: {
            rn: "AsyncStorage, MMKV",
            android: "DataStore (Preferences)",
            ios: "`UserDefaults` / `@AppStorage`",
          },
        },
        {
          label: "Structured data",
          values: {
            rn: "expo-sqlite, WatermelonDB, op-sqlite",
            android: "Room (on top of SQLite)",
            ios: "SwiftData, or Core Data in older apps",
          },
        },
        {
          label: "Secrets",
          values: {
            rn: "expo-secure-store, react-native-keychain",
            android: "Android Keystore",
            ios: "Keychain",
          },
        },
        {
          label: "Files",
          values: {
            rn: "expo-file-system, react-native-fs",
            android: "`context.filesDir` / `cacheDir`",
            ios: "`URL.documentsDirectory` / `cachesDirectory`",
          },
        },
        {
          label: "Survives uninstall",
          values: {
            rn: "Depends on the native store underneath",
            android: "No (unless restored by Auto Backup)",
            ios: "No, *except* Keychain items, which can persist",
          },
        },
      ],
    },
    {
      id: "kv",
      title: "AsyncStorage → DataStore / UserDefaults",
      prose: [
        "**DataStore** is Android's modern key-value store. It replaced `SharedPreferences`, which did disk I/O on the main thread. Reads are a `Flow`, so you get the current value and every later change. Writes are suspend functions that run in a transaction.",
        "**UserDefaults** is iOS's key-value store, and it's the opposite in style: synchronous reads and writes, backed by an in-memory copy. It feels like MMKV more than AsyncStorage. Both are for small values. Neither is meant for lists of records or large blobs.",
      ],
      snippet: "kv",
      notes: {
        rn: ["AsyncStorage stores strings only, so anything else round-trips through `JSON.stringify`."],
        android: [
          "Keys are typed: `stringPreferencesKey`, `booleanPreferencesKey`, `intPreferencesKey`, and so on.",
          "`preferencesDataStore` is a property delegate. Declare it once at the top level. Two DataStores for the same file throw at runtime.",
          "Parsing with `entries.find` instead of `valueOf` means a renamed enum case falls back to a default instead of crashing.",
          "For typed objects, Proto DataStore stores a protobuf or serializable class instead of loose keys.",
        ],
        ios: [
          "UserDefaults stores property-list types: `String`, `Int`, `Bool`, `Double`, `Date`, `Data`, arrays, and dictionaries.",
          "`nonmutating set` lets you assign through a `let` instance, because the struct itself doesn't change.",
          "For values shared with widgets or extensions, use `UserDefaults(suiteName:)` with an App Group.",
        ],
      },
    },
    {
      id: "settings-ui",
      title: "Binding settings to the UI",
      prose: [
        "In RN, a persisted setting is a `useState` that you load in an effect and save in the change handler. SwiftUI collapses this into one property wrapper. `@AppStorage` reads `UserDefaults`, gives you a binding, and updates the view when the value changes anywhere in the app.",
        "Compose has no built-in equivalent. You collect the DataStore Flow as state and write in a coroutine. In a real app this logic lives in a `ViewModel` or repository (Chapter 10), and the composable just receives the value and an `onChange` callback.",
      ],
      snippet: "settings",
      notes: {
        android: [
          "Because the toggle reads from the Flow, the UI always shows what's on disk. There's no local copy to keep in sync.",
          "`initialValue = false` is shown for the first frame, before DataStore has loaded. Pick a sensible default, or show nothing until it loads.",
        ],
        ios: [
          "`$hideCompleted` is a `Binding<Bool>` (Chapter 5), so it plugs straight into `Toggle`.",
          "Every view using `@AppStorage(\"hideCompleted\")` stays in sync automatically.",
          "Keep key strings in one place, such as a `static let` on an enum, to avoid typos.",
        ],
      },
    },
    {
      id: "schema",
      title: "SQLite → Room / SwiftData",
      prose: [
        "**Room** is a typed layer over SQLite. You still write SQL, but Room checks every query against your schema *at compile time*, and generates the mapping code. An `@Entity` is a table, a `@Dao` is a set of queries, and a `@Database` ties them together.",
        "**SwiftData** (iOS 17+) goes further and hides SQL entirely. A class marked `@Model` is the schema. You insert, fetch, and mutate objects, and SwiftData persists them. It's built on Core Data, which you'll still find in older codebases and for features SwiftData doesn't cover yet.",
      ],
      snippet: "schema",
      notes: {
        rn: ["SQL strings are unchecked, so a typo in a column name fails only when that query runs."],
        android: [
          "A typo in `@Query` SQL fails the *build*, with the error pointing at the column.",
          "A DAO method returning `Flow` is observable. A `suspend` method runs once. Both are main-safe.",
          "Room needs the KSP compiler plugin (`ksp(\"androidx.room:room-compiler\")`) in your Gradle file.",
          "Build the database once and share it. Each instance holds its own connection pool.",
        ],
        ios: [
          "`@Model` must be a `class`. SwiftData tracks changes to each object's properties, like `@Observable`.",
          "Every stored property is a column. Use `@Attribute(.unique)` for unique keys and `@Relationship` for links between models.",
          "`.modelContainer(for:)` creates the store on disk and injects a main-actor `ModelContext` into the environment.",
        ],
      },
    },
    {
      id: "observing",
      title: "Live queries in the UI",
      prose: [
        "This is where native storage beats the RN setup. A Room `Flow` query re-emits after every write to its tables, so the UI never has to reload by hand. Any write, from any screen or a background sync, updates every list that shows that data.",
        "SwiftData's `@Query` does the same inside a view. It fetches on appear and updates the view whenever matching objects are inserted, deleted, or changed.",
      ],
      snippet: "query",
      notes: {
        android: [
          "This is the cache half of Chapter 12's offline-first pattern: the network writes to Room, and the UI only reads from Room.",
          "`TodoEntity` is a data class, so updating means `copy` + `update`. Room rows aren't live objects.",
        ],
        ios: [
          "`@Query` only works inside SwiftUI views. In a model object or a background task, use `context.fetch(FetchDescriptor<Todo>(…))`.",
          "Filtering uses the `#Predicate` macro, for example `@Query(filter: #Predicate<Todo> { !$0.done })`.",
          "`@Model` objects are bound to their `ModelContext`. Don't pass them between actors. Pass `persistentModelID` instead.",
        ],
      },
    },
    {
      id: "migrations",
      title: "Schema changes & migrations",
      prose: [
        "Changing a schema in a shipped app needs a migration on every platform. The difference is how much the framework does for you, and what happens when you forget.",
      ],
      compare: [
        {
          label: "Add a column",
          values: {
            rn: "Hand-written `ALTER TABLE` keyed on `PRAGMA user_version`",
            android: "Bump `version` and add `autoMigrations = [AutoMigration(from = 1, to = 2)]`",
            ios: "Usually automatic (lightweight migration)",
          },
        },
        {
          label: "Rename or split",
          values: {
            rn: "Hand-written SQL",
            android: "An `AutoMigrationSpec` with `@RenameColumn`, or a manual `Migration`",
            ios: "`VersionedSchema` + `SchemaMigrationPlan` with a custom stage",
          },
        },
        {
          label: "If you forget",
          values: {
            rn: "Queries fail at runtime",
            android: "Crash on open: \"Room cannot verify the data integrity\"",
            ios: "The container fails to load, often at launch",
          },
        },
        {
          label: "Dev escape hatch",
          values: {
            rn: "Delete the app",
            android: "`fallbackToDestructiveMigration()` (wipes data; never in production)",
            ios: "Delete the app from the Simulator",
          },
        },
      ],
      callout:
        "Room can export each schema version as JSON (`room.schemaLocation`). Commit those files. AutoMigrations need them, and they make schema changes visible in code review.",
    },
    {
      id: "secure",
      title: "Secure storage: Keystore / Keychain",
      prose: [
        "Tokens and other secrets never go in DataStore or UserDefaults as plain text. Those are ordinary files that backups and rooted devices can read.",
        "The two platforms work differently. The iOS **Keychain** is an encrypted database for small secrets. You store the token itself in it. The **Android Keystore** stores *keys*, not data. You generate a key that never leaves secure hardware, use it to encrypt the token, and store the ciphertext anywhere, such as DataStore.",
      ],
      snippet: "secure",
      notes: {
        rn: ["expo-secure-store does exactly what the two native snippets do, behind one API."],
        android: [
          "Jetpack Security's `EncryptedSharedPreferences` used to wrap this pattern, but it's now deprecated. The Keystore approach above is what it did under the hood.",
          "AES-GCM needs a fresh random IV for each encryption. The cipher generates one, and we store it in front of the ciphertext.",
          "Store the result as Base64 in DataStore. Exclude it from Auto Backup, because a restored ciphertext can't be decrypted without the original device's key.",
        ],
        ios: [
          "The Keychain API is a C-style API of dictionaries and status codes. Every app wraps it in a small helper like this, or uses a library like KeychainAccess.",
          "`…AfterFirstUnlockThisDeviceOnly` lets background tasks read the item, and keeps it out of backups restored to other devices.",
          "Keychain items can survive an uninstall. Clear them on the first launch after install if a stale login would be a problem.",
        ],
      },
    },
    {
      id: "files",
      title: "Files & caches",
      prose: [
        "Each app gets a private sandbox on both platforms, split into storage the system keeps and storage it may clear. The rule is simple: if you can re-download it, it's a cache. If the user would lose work, it belongs in the persistent directory.",
      ],
      snippet: "files",
      notes: {
        android: [
          "`filesDir` and `cacheDir` are private to your app and need no permissions.",
          "`java.io.File` calls block, so wrap them in `withContext(Dispatchers.IO)` (Chapter 11).",
          "To let the user pick or save files elsewhere, use the Storage Access Framework (`rememberLauncherForActivityResult` with `CreateDocument`), not raw paths.",
        ],
        ios: [
          "Documents is backed up to iCloud and can be shown in the Files app. Don't put large re-downloadable data there.",
          "`.atomic` writes to a temp file and renames it, so a crash mid-write can't leave a half-written file.",
          "To share a file with other apps, use `ShareLink` or `fileExporter`.",
        ],
      },
    },
  ],
  gotchas: [
    {
      title: "SharedPreferences and UserDefaults aren't databases",
      body: "Both load the whole file into memory. Storing a list of 5,000 todos as a JSON string there makes every read and write slow. Records belong in Room or SwiftData.",
    },
    {
      title: "Only one DataStore per file",
      body: "Creating two `DataStore` instances for the same file throws at runtime. Declare the `preferencesDataStore` delegate once at the top level, or provide a single instance through DI.",
    },
    {
      title: "Room checks SQL at compile time",
      body: "A typo in a `@Query` or a column that doesn't exist fails the build, not the app. It's annoying at first, but it's one of Room's best features. Read the KSP error carefully: it names the bad column.",
    },
    {
      title: "Forgetting a migration crashes on launch",
      body: "Change a Room entity without bumping `version` and adding a migration, and the app crashes for every existing user. SwiftData handles simple changes automatically, but renames and type changes need a migration plan. Test upgrades from the previous release, not just fresh installs.",
    },
    {
      title: "Keychain items can outlive the app",
      body: "Deleting an iOS app doesn't always delete its Keychain items. A reinstalled app can find an old refresh token and appear signed in. Store a first-launch flag in UserDefaults (which *is* deleted) and clear the Keychain when it's missing.",
    },
    {
      title: "SwiftData objects aren't thread-safe",
      body: "A `@Model` instance belongs to the `ModelContext` that fetched it, which for the environment context is the main actor. To work in the background, create a separate context (or a `@ModelActor`) and pass `persistentModelID`s, not objects.",
    },
  ],
  cheatsheet: [
    { rn: "`AsyncStorage.getItem(k)`", android: "`dataStore.data.map { it[key] }`", ios: "`UserDefaults.standard.string(forKey:)`" },
    { rn: "`AsyncStorage.setItem(k, v)`", android: "`dataStore.edit { it[key] = v }`", ios: "`UserDefaults.standard.set(v, forKey:)`" },
    { rn: "Persisted `useState`", android: "Collect DataStore `Flow` as state", ios: "`@AppStorage(\"key\")`" },
    { rn: "`CREATE TABLE`", android: "`@Entity` data class", ios: "`@Model` class" },
    { rn: "SQL query function", android: "`@Dao` method with `@Query`", ios: "`FetchDescriptor` / `@Query`" },
    { rn: "Re-read after writing", android: "DAO returns `Flow<List<T>>`", ios: "`@Query` updates the view" },
    { rn: "`openDatabaseSync('app.db')`", android: "`Room.databaseBuilder(…).build()`", ios: "`.modelContainer(for:)`" },
    { rn: "`INSERT`", android: "`@Insert suspend fun`", ios: "`context.insert(obj)`" },
    { rn: "`UPDATE`", android: "`@Update` with `copy(…)`", ios: "Mutate the object" },
    { rn: "Migrations by hand", android: "`version` + `AutoMigration`", ios: "Lightweight / `SchemaMigrationPlan`" },
    { rn: "`SecureStore.setItemAsync`", android: "Keystore key + encrypt, store ciphertext", ios: "`SecItemAdd` (Keychain)" },
    { rn: "`Paths.document`", android: "`context.filesDir`", ios: "`URL.documentsDirectory`" },
    { rn: "`Paths.cache`", android: "`context.cacheDir`", ios: "`URL.cachesDirectory`" },
  ],
  quiz: [
    {
      question: "How do you read a value from Preferences DataStore?",
      options: [
        "`dataStore.get(key)`, which returns the value synchronously",
        "Collect `dataStore.data`, a `Flow<Preferences>`, and read `prefs[key]`",
        "`dataStore.getString(\"key\", \"\")`",
        "Read the XML file directly",
      ],
      answer: 1,
      explanation: "DataStore exposes data as a Flow, so you get the current value and every future change, off the main thread. Synchronous `getString` is the older `SharedPreferences` API it replaced.",
    },
    {
      question: "A Room `@Query` refers to a column `due_at` that doesn't exist. When do you find out?",
      options: [
        "When the query runs",
        "At compile time, as a KSP error",
        "Only in release builds",
        "Never; Room returns an empty list",
      ],
      answer: 1,
      explanation: "Room's annotation processor checks every query against the entity schema during the build. That's a major upgrade over SQL strings in RN, which fail only at runtime.",
    },
    {
      question: "The Android UI shows a Room list via `dao.observeAll()`. A background sync inserts new rows. What do you need to do so the list updates?",
      options: [
        "Call a reload function after the sync",
        "Nothing; the `Flow` re-emits after writes to the table",
        "Post an event on an event bus",
        "Restart the Activity",
      ],
      answer: 1,
      explanation: "DAO methods that return `Flow` are observable queries. Room re-runs them after any write to the tables they read, and every collector gets the new list. SwiftData's `@Query` works the same way for views.",
    },
    {
      question: "What does the Android Keystore actually store?",
      options: [
        "Your token, encrypted",
        "Cryptographic keys, which you use to encrypt the token you store elsewhere",
        "SharedPreferences files",
        "Nothing; it's deprecated",
      ],
      answer: 1,
      explanation: "The Keystore keeps keys in secure hardware where possible, and they can't be exported. You encrypt the secret with one and store the ciphertext in DataStore or a file. The iOS Keychain is different: it stores the secret itself.",
    },
    {
      question: "You add a field to a Room entity and ship without bumping the database version. What happens to existing users?",
      options: [
        "Room adds the column automatically",
        "The new field is always `null`",
        "The app crashes when it opens the database",
        "Their data is silently wiped",
      ],
      answer: 2,
      explanation: "Room detects that the schema doesn't match the stored identity hash and throws. Bump `version` and add an `AutoMigration` or `Migration`. Only `fallbackToDestructiveMigration()` wipes data, and you should never use it in production.",
    },
    {
      question: "Where should a downloaded thumbnail you can fetch again go?",
      options: [
        "UserDefaults / DataStore as Base64",
        "The Keychain / Keystore",
        "`cacheDir` / `URL.cachesDirectory`",
        "The Documents / `filesDir` directory, so it's backed up",
      ],
      answer: 2,
      explanation: "Caches directories aren't backed up and can be cleared by the system when space runs low, which is fine for data you can re-download. Documents and `filesDir` are for user data you can't recreate.",
    },
  ],
};
