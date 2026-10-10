import type { Chapter } from "../types";

export const networking: Chapter = {
  slug: "networking",
  title: "Networking",
  intro: [
    "Networking on native is less exotic than it looks. You still make HTTP requests, decode JSON, attach a bearer token, and retry on failure. What changes is that the type system now extends to the wire. Your JSON model is a real type the compiler checks, and the decoder fails loudly when the server doesn't match it.",
    "On Android, the standard stack is **OkHttp** for HTTP, **Retrofit** to turn an interface into an API client, and **kotlinx.serialization** for JSON. Ktor Client is the main alternative, and it's what you'd pick for Kotlin Multiplatform (Chapter 19). On iOS, **URLSession** and **Codable** are built in, and most apps use them without a library.",
    "Everything here builds on suspend functions and `async` from Chapter 11.",
  ],
  sections: [
    {
      id: "stack",
      title: "The stack, compared",
      prose: [
        "Here's what replaces each part of a typical RN networking setup. There's no first-party React Query on either platform. You build the same behavior from a `ViewModel` or model object and a cache, as shown later in this chapter.",
      ],
      compare: [
        {
          label: "HTTP client",
          values: {
            rn: "`fetch` or axios",
            android: "OkHttp (under Retrofit), or Ktor Client",
            ios: "`URLSession`",
          },
        },
        {
          label: "Typed API layer",
          values: {
            rn: "Hand-written functions, or generated from OpenAPI",
            android: "A Retrofit `interface` with annotations",
            ios: "A hand-written `struct` or `actor` around `URLSession`",
          },
        },
        {
          label: "JSON",
          values: {
            rn: "`res.json()` plus zod, or a type assertion",
            android: "`@Serializable` data classes",
            ios: "`Codable` structs",
          },
        },
        {
          label: "Interceptors",
          values: {
            rn: "axios interceptors",
            android: "OkHttp `Interceptor` and `Authenticator`",
            ios: "Your own wrapper methods",
          },
        },
        {
          label: "Server-state cache",
          values: {
            rn: "React Query, SWR, RTK Query",
            android: "`ViewModel` + repository, often backed by Room",
            ios: "`@Observable` model + repository, often backed by SwiftData",
          },
        },
      ],
    },
    {
      id: "json",
      title: "JSON: kotlinx.serialization / Codable",
      prose: [
        "In TypeScript, `await res.json()` gives you `any`, and the type is a promise you make to yourself. On native, decoding *is* validation. You declare the shape once as a data class or struct, and the decoder either produces that type or throws.",
        "That strictness is the biggest change. A field the server renamed, a `null` where you expected a string, or a number sent as a string is now a decode error, not a silent `undefined`. Decide up front how forgiving each model should be.",
      ],
      snippet: "json",
      notes: {
        rn: ["Without runtime validation, a bad payload shows up later as `undefined is not an object`, far from the request."],
        android: [
          "The serialization compiler plugin generates the encoder and decoder at build time. There's no reflection, so it's fast and R8-safe.",
          "By default, an unknown key is an error. `ignoreUnknownKeys = true` is almost always what you want for API clients.",
          "A property with a default value is optional in the JSON. A nullable property *without* a default is still required, but may be `null`.",
          "Create one `Json { }` instance and reuse it. Building one per call is wasteful.",
        ],
        ios: [
          "`Codable` is `Decodable & Encodable`. The compiler writes the conformance from the stored properties.",
          "Unknown keys are ignored by default. A missing key is an error unless the property is Optional.",
          "Default values on properties are *not* used when a key is missing. Make it Optional, or write a custom `init(from:)`.",
          "`.convertFromSnakeCase` handles `due_date` → `dueDate`. For one-off names, add a `CodingKeys` enum.",
        ],
      },
    },
    {
      id: "fetch",
      title: "fetch → Retrofit / URLSession",
      prose: [
        "With Retrofit, you describe endpoints as an annotated Kotlin `interface`, and Retrofit generates the implementation. Path parameters, query strings, and bodies are just annotated parameters. A suspend function that returns `List<Todo>` sends the request, checks the status, and decodes the body.",
        "On iOS, `URLSession` is closer to `fetch`. You build a `URLRequest`, `await` the data and response, check the status yourself, then decode. Most teams wrap this in a small API struct like the one below.",
      ],
      snippet: "fetch",
      notes: {
        android: [
          "Retrofit suspend functions are main-safe. OkHttp runs the request on its own threads, so no `withContext` is needed.",
          "A non-2xx response throws `HttpException`. To inspect status and headers yourself, return `Response<List<Todo>>` instead.",
          "`.create()` is the reified Kotlin extension, short for `.create(TodoApi::class.java)`.",
          "Your app needs `<uses-permission android:name=\"android.permission.INTERNET\" />` in the manifest. RN templates add it for you.",
        ],
        ios: [
          "`data(from:)` and `data(for:)` are the async versions of `fetch`. They throw for network failures only, never for HTTP status codes.",
          "`appending(path:)` (iOS 16+) builds URLs safely. Avoid string concatenation.",
          "`APIError` is defined in the error-handling section below.",
        ],
      },
    },
    {
      id: "client",
      title: "A configured client & auth headers",
      prose: [
        "An `axios.create()` instance with interceptors maps directly to an `OkHttpClient` with interceptors on Android. An interceptor sees every request and response, so it's the place for auth headers, logging, and common headers like `User-Agent`.",
        "`URLSession` has no interceptor API. The idiomatic replacement is your own client type that every request goes through. It's a few more lines, but it's ordinary code you can read and test.",
      ],
      snippet: "client",
      notes: {
        android: [
          "Interceptors are synchronous and run on a background thread. Read the token from memory, not with a suspend call. If you must, `runBlocking` is acceptable here, but never on Main.",
          "Create one `OkHttpClient` for the whole app (a Hilt `@Singleton`, Chapter 10). Each client has its own connection pool and thread pool.",
          "For request logs, add `HttpLoggingInterceptor` from `okhttp3:logging-interceptor`, in debug builds only.",
        ],
        ios: [
          "`TokenStore` is an `actor` (see the token refresh section), so reading from it needs `await`.",
          "A custom `URLSessionConfiguration` sets timeouts, default headers, and cache policy for every request on that session.",
          "To log traffic during development, use Xcode's network instrument or a proxy like Proxyman or Charles.",
        ],
      },
    },
    {
      id: "errors",
      title: "Error handling & retries",
      prose: [
        "Network calls fail in three different ways: the request never completed (offline, timeout), the server answered with an error status, or the body didn't decode. Treat them differently. Retrying a timeout makes sense. Retrying a 404 or a decode error never will.",
        "A small `withRetry` helper with exponential backoff covers most needs. Both versions below are cancellation-safe: if the screen goes away mid-retry, the delay throws and the loop stops.",
      ],
      snippet: "errors",
      notes: {
        android: [
          "`IOException` covers timeouts and connection failures. `HttpException` is a non-2xx status. `SerializationException` is a bad body.",
          "`repeat` is an inline function, so `return block()` inside it returns from `withRetry` itself.",
          "Catching specific types keeps `CancellationException` out of the retry loop (Chapter 11).",
        ],
        ios: [
          "`URLError` covers network failures (`.notConnectedToInternet`, `.timedOut`). `DecodingError` is a bad body. The HTTP status is up to you.",
          "`catch APIError.http(let status) where status < 500` matches one enum case with a condition, like a guarded `case` in `switch`.",
          "Swift 6 also supports typed throws (`throws(APIError)`), but most networking code still uses untyped `throws`.",
        ],
      },
      callout:
        "Show errors in the UI as state, not exceptions. A screen should render \"offline, showing saved data\" from a field in its UI state. It should never find out about errors from a crash.",
    },
    {
      id: "refresh",
      title: "Token refresh",
      prose: [
        "When the access token expires, several requests can get a 401 at the same moment. You want exactly one refresh, with every failed request retried with the new token. In RN, that's a shared promise in an axios response interceptor.",
        "OkHttp has a dedicated hook for this, the `Authenticator`, which runs when a response is 401. On iOS, an `actor` is the natural fit: it serializes access, so storing the in-flight refresh `Task` lets every caller join the same refresh.",
      ],
      snippet: "refresh",
      notes: {
        android: [
          "`synchronized` makes concurrent 401s wait for one refresh. The check against the token that was *sent* lets late arrivals skip a second refresh.",
          "`authApi` must use a separate client without this authenticator, or a failed refresh would try to refresh itself.",
          "Returning `null` gives up, and the original 401 goes back to the caller. That's your cue to log the user out.",
        ],
        ios: [
          "An `actor` is a class whose state only one task can touch at a time, so no locks are needed.",
          "Actor methods can interleave at each `await`. Storing `refreshTask` *before* awaiting it is what stops a second refresh from starting.",
          "The `Task` inherits the actor's isolation, so it can safely write `access` and `refresh`.",
        ],
      },
    },
    {
      id: "query",
      title: "Caching & React Query-style patterns",
      prose: [
        "React Query gives you loading and error state, caching, stale times, refetch on focus, and pull to refresh. Native has no drop-in equivalent, but the pieces are simple enough to write yourself.",
        "The recommended Android pattern is *offline-first*. The repository exposes cached data as a Flow, usually a Room query (Chapter 13), and `refresh()` fetches from the network and writes to the cache. The UI only ever shows the cache, so it updates automatically and still works offline. On iOS, an `@Observable` model with `.task` and `.refreshable` covers the common cases. You can back it with SwiftData for the same offline-first behavior.",
      ],
      snippet: "query",
      notes: {
        rn: ["React Query keys the cache by `queryKey`. On native, the repository and its database tables play that role."],
        android: [
          "`combine` merges the cached list with the refresh and error flags into one UI state. `::TodosUiState` passes the constructor as the combining function.",
          "`stateIn(…WhileSubscribed(5_000)…)` keeps the query alive briefly through rotation (Chapter 11).",
          "For pull to refresh, wrap the list in Material 3's `PullToRefreshBox(isRefreshing, onRefresh)`.",
          "For GraphQL, Apollo Kotlin includes a normalized cache. For REST, Store5 is a community library for this exact pattern.",
        ],
        ios: [
          "`.task` loads when the view appears. `.refreshable` adds native pull to refresh and shows the spinner until the `await` finishes.",
          "The `fetchedAt` check is a hand-rolled `staleTime`. Coming back to the screen within 30 seconds won't refetch.",
          "`URLCache` can cache raw HTTP responses that use cache headers, but it doesn't replace a model-level cache.",
        ],
      },
    },
    {
      id: "platform",
      title: "Platform rules RN set up for you",
      prose: [
        "A few network settings that RN templates and Expo configure for you become your job on native. Most of them show up as a confusing failure on the first request.",
      ],
      compare: [
        {
          label: "Internet permission",
          values: {
            rn: "Added by the template",
            android: "`INTERNET` permission in `AndroidManifest.xml`, or every request fails",
            ios: "Not needed",
          },
        },
        {
          label: "Plain http://",
          values: {
            rn: "Template allows it in debug",
            android: "Blocked by default since Android 9. Allow per domain in a network security config.",
            ios: "Blocked by App Transport Security. Add exceptions in `Info.plist`.",
          },
        },
        {
          label: "localhost from emulator",
          values: {
            rn: "Metro handles the bundle; APIs need the same fix",
            android: "`10.0.2.2` is your machine; `localhost` is the emulator itself",
            ios: "`localhost` works in the Simulator",
          },
        },
        {
          label: "Background transfers",
          values: {
            rn: "Libraries like react-native-background-upload",
            android: "WorkManager (Chapter 14)",
            ios: "Background `URLSessionConfiguration` (Chapter 14)",
          },
        },
      ],
    },
  ],
  gotchas: [
    {
      title: "Neither fetch nor URLSession throws on 4xx/5xx",
      body: "`URLSession` behaves like `fetch`: a 500 is a successful round trip. Check `HTTPURLResponse.statusCode` yourself. Retrofit is the odd one out. A suspend function that returns a body type throws `HttpException` for any non-2xx status.",
    },
    {
      title: "Unknown keys crash kotlinx.serialization",
      body: "The default `Json` throws when the server adds a new field. That makes a harmless backend change crash old app versions. Configure `ignoreUnknownKeys = true` on the shared `Json` instance.",
    },
    {
      title: "Codable ignores property defaults",
      body: "`var done = false` doesn't make `done` optional in the JSON. If the key is missing, decoding fails. Use `Bool?`, or write `init(from:)` with `decodeIfPresent`.",
    },
    {
      title: "Retrofit base URLs need a trailing slash",
      body: "`baseUrl(\"https://api.example.com/v1\")` throws at startup. And a path that starts with `/`, like `@GET(\"/todos\")`, drops the `/v1` part entirely. Use `.../v1/` with relative paths like `todos`.",
    },
    {
      title: "Don't refresh with the client that's refreshing",
      body: "If the refresh request goes through the same `Authenticator` or retry wrapper, an expired refresh token causes an infinite loop of 401s. Give auth calls their own client.",
    },
    {
      title: "localhost isn't your machine on Android",
      body: "In the Android emulator, `localhost` is the emulator itself. Use `10.0.2.2` for your dev server, and allow cleartext for that host in a debug-only network security config.",
    },
  ],
  cheatsheet: [
    { rn: "`fetch(url)`", android: "Retrofit `@GET` suspend fun", ios: "`URLSession.shared.data(from:)`" },
    { rn: "`fetch(url, { method: 'POST', body })`", android: "`@POST` + `@Body`", ios: "`URLRequest` + `httpMethod` + `data(for:)`" },
    { rn: "`res.ok` check", android: "Automatic (`HttpException`)", ios: "Check `HTTPURLResponse.statusCode`" },
    { rn: "`res.json()` + zod", android: "`@Serializable` + `Json.decodeFromString`", ios: "`Codable` + `JSONDecoder`" },
    { rn: "snake_case → camelCase", android: "`@SerialName(\"due_date\")`", ios: "`.convertFromSnakeCase` / `CodingKeys`" },
    { rn: "`JSON.stringify`", android: "`Json.encodeToString`", ios: "`JSONEncoder().encode`" },
    { rn: "`axios.create({ baseURL })`", android: "`Retrofit.Builder().baseUrl()`", ios: "Your own client `struct`" },
    { rn: "Request interceptor", android: "OkHttp `Interceptor`", ios: "Wrapper method" },
    { rn: "401 refresh interceptor", android: "OkHttp `Authenticator`", ios: "`actor` with a shared refresh `Task`" },
    { rn: "`timeout: 10_000`", android: "`callTimeout(10, SECONDS)`", ios: "`timeoutIntervalForRequest = 10`" },
    { rn: "`useQuery`", android: "`ViewModel` + repository `Flow`", ios: "`@Observable` model + `.task`" },
    { rn: "`refetch` / pull to refresh", android: "`PullToRefreshBox`", ios: "`.refreshable`" },
    { rn: "`staleTime`", android: "Repository decides when to refresh", ios: "Timestamp check in the model" },
  ],
  quiz: [
    {
      question: "Your server starts returning an extra `priority` field. The Android app uses the default `Json` instance. What happens?",
      options: [
        "The field is ignored",
        "Decoding throws, so the request fails",
        "`priority` is added to the data class at runtime",
        "Only release builds fail",
      ],
      answer: 1,
      explanation: "kotlinx.serialization rejects unknown keys by default. Set `ignoreUnknownKeys = true` on a shared `Json` instance so backend additions don't break older app versions. Swift's `Codable` ignores unknown keys by default.",
    },
    {
      question: "A Swift `Codable` struct has `var done: Bool = false`. The JSON has no `done` key. What happens?",
      options: [
        "`done` is `false`",
        "`done` is `nil`",
        "Decoding throws a `keyNotFound` error",
        "It doesn't compile",
      ],
      answer: 2,
      explanation: "Synthesized decoding ignores default values and requires every non-Optional key. Declare `done: Bool?`, or write a custom `init(from:)` using `decodeIfPresent`. kotlinx.serialization does use defaults for missing keys.",
    },
    {
      question: "`try await URLSession.shared.data(for: request)` returns. The server responded 500. What do you have?",
      options: [
        "A thrown `URLError`",
        "Data and an `HTTPURLResponse` with `statusCode == 500`; it's up to you to treat it as an error",
        "`nil` data",
        "A `DecodingError`",
      ],
      answer: 1,
      explanation: "Like `fetch`, `URLSession` only throws when the request didn't complete. Check the status code before decoding, typically in a shared helper.",
    },
    {
      question: "Three Android requests get a 401 at once. What's the idiomatic OkHttp hook for refreshing the token exactly once and retrying?",
      options: [
        "A request `Interceptor` that refreshes before every call",
        "An `Authenticator` that synchronizes the refresh and returns the retried request",
        "Catching `HttpException` in every `ViewModel`",
        "A `LaunchedEffect` on the login screen",
      ],
      answer: 1,
      explanation: "OkHttp calls the `Authenticator` on 401 responses. Synchronizing inside it, and checking whether the token already changed, gives you one refresh. Returning the rebuilt request retries it.",
    },
    {
      question: "Which errors should a generic `withRetry` helper retry?",
      options: [
        "All of them, including decode errors",
        "Timeouts, connection failures, and 5xx; not 4xx, decode errors, or cancellation",
        "Only 401",
        "Only 4xx",
      ],
      answer: 1,
      explanation: "Transient failures can succeed on retry. A 4xx or a body that doesn't match the model will fail the same way every time. Cancellation means the caller no longer wants the result.",
    },
    {
      question: "What's the closest native equivalent of React Query's cached `useQuery` with pull to refresh?",
      options: [
        "A built-in `useQuery` in Jetpack and SwiftUI",
        "A `ViewModel` or `@Observable` model over a repository that serves cached data and refreshes it",
        "Calling the API directly in the composable or `body` on every render",
        "Saving every response to `UserDefaults` / SharedPreferences",
      ],
      answer: 1,
      explanation: "Neither platform ships a server-state cache library. The standard pattern is a repository that owns a cache (often Room or SwiftData) and a screen model that exposes loading, error, and data to the UI.",
    },
  ],
};
