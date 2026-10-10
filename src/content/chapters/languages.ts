import type { Chapter } from "../types";

export const languages: Chapter = {
  slug: "languages",
  title: "TypeScript → Kotlin & Swift",
  intro: [
    "Kotlin and Swift will feel familiar faster than you expect. Both are modern, statically typed languages with type inference, lambdas, null safety, and generics. If you write strict TypeScript today, most of what you know transfers.",
    "The differences that matter are deeper than syntax. Both languages are **compiled**, so types exist at build time and the compiler refuses code it can't prove is safe. Both are **nominally typed**, so a shape isn't a type until you declare it. And Swift adds **value types**, which change what `let` and `=` mean.",
    "This chapter walks through the features you use every day in TypeScript, in the order you'd reach for them. The snippets stay small and use a `Todo` model, so you can compare the three languages line by line.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "TypeScript is a type layer on top of JavaScript. The types vanish at build time, and at runtime anything goes. Kotlin and Swift are the language itself, and the compiler is much stricter about what it lets through.",
      ],
      compare: [
        {
          label: "Runs as…",
          values: {
            rn: "JavaScript, executed by Hermes. Types are erased.",
            android: "JVM bytecode, compiled ahead of time on the device by ART.",
            ios: "Native machine code, compiled by `swiftc`.",
          },
        },
        {
          label: "Type system",
          values: {
            rn: "Structural: any value with the right shape fits.",
            android: "Nominal: a type must be declared, or explicitly implement an interface.",
            ios: "Nominal: a type must be declared, or conform to a protocol.",
          },
        },
        {
          label: "Missing values",
          values: {
            rn: "`null` *and* `undefined`",
            android: "`null` only, tracked in the type (`String?`)",
            ios: "`nil` only, via `Optional<T>` (`String?`)",
          },
        },
        {
          label: "Numbers",
          values: {
            rn: "One `number` type (a double), plus `bigint`.",
            android: "`Int`, `Long`, `Double`, `Float`, …, with no implicit conversion.",
            ios: "`Int`, `Double`, `Float`, …, with no implicit conversion.",
          },
        },
        {
          label: "Equality",
          values: {
            rn: "`===` compares objects by reference.",
            android: "`==` calls `equals()`. `===` compares references.",
            ios: "`==` uses `Equatable`. `===` compares class references.",
          },
        },
        {
          label: "Escape hatch",
          values: {
            rn: "`any`, `as`, `!`",
            android: "`Any`, `as`, `!!`. A bad cast or `!!` throws at runtime.",
            ios: "`Any`, `as!`, `!`. A bad cast or `!` crashes the app.",
          },
        },
      ],
      callout:
        "Semicolons are optional in all three, and idiomatic Kotlin and Swift leave them out. Both languages also use `name: Type`, so annotations read the same way they do in TypeScript.",
    },
    {
      id: "variables",
      title: "const/let → val/var and let/var",
      prose: [
        "Kotlin uses `val` for read-only bindings and `var` for mutable ones. Swift uses `let` and `var`. Watch the false friend: Swift's `let` means TypeScript's `const`, not TypeScript's `let`.",
        "In TypeScript and Kotlin, a read-only binding doesn't freeze the object behind it. In Swift, arrays, dictionaries, strings, and structs are *values*, so a `let` array really can't change. You'll see this again at the end of the chapter.",
      ],
      snippet: "variables",
      notes: {
        rn: ["`const` stops reassignment only. `todos.push()` still works."],
        android: [
          "Default to `val`. The IDE nudges you when a `var` is never reassigned.",
          "`const val` is for compile-time primitives and strings at the top level or in an `object`.",
          "`mutableListOf` vs `listOf` decides whether a list can change, not `val` vs `var`.",
        ],
        ios: [
          "Default to `let`. The compiler warns when a `var` is never mutated.",
          "`todos.append` needs `var todos`. With `let`, the whole array is immutable.",
          "Mixing `Int` and `Double` is a compile error. Convert explicitly with `Double(x)`.",
        ],
      },
    },
    {
      id: "functions",
      title: "Functions & named arguments",
      prose: [
        "Functions look familiar, with the return type after the parameters. The big upgrade is **named arguments**. In TypeScript you'd pass an options object to make call sites readable. In Kotlin and Swift you just name the parameters and give them defaults.",
        "Swift goes further with **argument labels**. Each parameter can have an external label used by callers and an internal name used in the body. `_` removes the label. Swift call sites read like sentences: `send(\"Lunch?\", to: \"Sam\")`.",
      ],
      snippet: "functions",
      notes: {
        android: [
          "Named arguments are optional at the call site, but use them whenever a bare `true` or `0` would be unclear.",
          "`= expr` is an *expression body*. It's the Kotlin version of an arrow function without braces.",
          "`fun main()` is the entry point for plain Kotlin programs. Android apps start from an Activity instead (Chapter 3).",
        ],
        ios: [
          "Labels are part of the function's name and are **required** at call sites. `greet(\"Reed\", \"Hi\")` doesn't compile.",
          "A function whose body is a single expression returns it implicitly.",
          "Swift docs write functions by their labels, e.g. `send(_:to:silent:)`.",
        ],
      },
    },
    {
      id: "null-safety",
      title: "Null safety",
      prose: [
        "You already know `?.` and `??` from TypeScript, and they carry over almost directly. Kotlin spells `??` as `?:`, the *Elvis operator*. Both languages make nullability part of the type, so `String` and `String?` are different types and the compiler won't let you mix them up.",
        "Narrowing works too. Kotlin *smart-casts* a value after a null check, as TypeScript does. Swift *unwraps* with `if let` and `guard let`. `guard` is an early return with the unwrapped value in scope for the rest of the function.",
      ],
      snippet: "null-safety",
      notes: {
        rn: ["`user!.name` is a compile-time lie. If `user` is undefined you get a `TypeError` later, somewhere else."],
        android: [
          "`?: return …` is a common idiom: unwrap or exit early, like Swift's `guard let`.",
          "`user?.let { … }` runs a block only when the value is non-null.",
          "Smart casts only work on values that can't change in between, such as local `val`s. For a `var` property, copy it into a local first.",
        ],
        ios: [
          "`guard let user else { … }` (Swift 5.7+) unwraps into a constant with the same name. The `else` block must exit.",
          "Optional chaining flattens: `user?.nickname` is `String?`, not `String??`.",
          "Swift has no `undefined`. A `var` optional property defaults to `nil` automatically.",
        ],
      },
      callout:
        "`!!` and `!` are not TypeScript's harmless `!`. If the value is null, Kotlin throws and Swift crashes the app on the spot. Treat every one as a crash you've chosen to accept.",
    },
    {
      id: "data-classes",
      title: "Object types → data class & struct",
      prose: [
        "A TypeScript object type becomes a `data class` in Kotlin and a `struct` in Swift. You don't write object literals any more. You call a constructor, and named arguments make it read almost the same.",
        "Both give you free equality, hashing, and a readable `toString`. The spread pattern `{ ...todo, done: true }` becomes `todo.copy(done = true)` in Kotlin. In Swift, assignment already copies a struct, so you copy into a `var` and change the field.",
      ],
      snippet: "data-classes",
      notes: {
        rn: ["`{ ...a } === a` is `false`. Value equality needs a helper or a library."],
        android: [
          "Use `val` properties so instances are immutable, and use `copy()` for changes. Compose and `StateFlow` rely on this (Chapter 5).",
          "`==` compares contents, `===` compares identity. That's the reverse of the habit `===` gives you in JS.",
          "For JSON, add `@Serializable` from kotlinx.serialization (Chapter 12).",
        ],
        ios: [
          "Conformances like `Equatable`, `Hashable`, and `Codable` are synthesized when you declare them.",
          "`Identifiable` just needs an `id` property, and it's what `ForEach` and `List` want (Chapter 1).",
          "The memberwise initializer skips parameters for properties that have defaults, like `done` here.",
        ],
      },
    },
    {
      id: "unions",
      title: "Discriminated unions → sealed interface & enum",
      prose: [
        "Discriminated unions are one of the most useful TypeScript patterns, and both native languages have a first-class version. Kotlin uses a `sealed interface` with a subtype per case. Swift uses an `enum` whose cases carry **associated values**.",
        "Instead of switching on a `status` string, you switch on the type or case itself. The compiler checks exhaustiveness, and each branch sees only that case's data. This is the standard way to model screen state (Chapter 10).",
      ],
      snippet: "unions",
      notes: {
        android: [
          "`is LoadState.Success ->` smart-casts `state`, so `state.todos` is available in that branch.",
          "Use `data object` for cases with no data. It gets a readable `toString` and correct equality.",
          "Don't add an `else` branch to a `when` over a sealed type. Without it, adding a case makes every `when` fail to compile until you handle it.",
        ],
        ios: [
          "`case .success(let todos)` binds the associated value, much like destructuring.",
          "`switch` must be exhaustive. Avoid `default:` for the same reason as Kotlin's `else`.",
          "Here `switch` is an expression (Swift 5.9+), so each case's value is returned.",
        ],
      },
    },
    {
      id: "lambdas",
      title: "Lambdas, trailing lambdas & closures",
      prose: [
        "Arrow functions become lambdas in Kotlin and closures in Swift. Function types are written `(Todo) -> Boolean` and `(Todo) -> Bool`, almost the same as TypeScript's `(todo: Todo) => boolean`.",
        "The syntax that makes Compose and SwiftUI possible is the **trailing lambda**. When a function's last parameter is a function, you can move it outside the parentheses. That's why `Column { … }` and `VStack { … }` look like blocks rather than calls.",
      ],
      snippet: "lambdas",
      notes: {
        android: [
          "In a lambda with one parameter, you can drop the name and use `it`.",
          "If the lambda is the only argument, drop the parentheses too: `todos.filter { !it.done }`.",
          "A bare `return` inside a lambda passed to an `inline` function (like `forEach`) returns from the *enclosing* function. Use `return@forEach` to skip one item.",
        ],
        ios: [
          "`$0`, `$1` are shorthand parameter names. Name them (`{ todo in … }`) when the closure is longer than a line.",
          "`\\.title` is a *key path*. You can pass it anywhere a `(Todo) -> String` is expected.",
          "A closure parameter that's stored and called later must be marked `@escaping`. In classes, capture `[weak self]` to avoid retain cycles.",
        ],
      },
    },
    {
      id: "extensions",
      title: "Extension functions",
      prose: [
        "In TypeScript, adding a method to a type you don't own means patching a prototype, which nobody should do. So you write free functions like `capitalized(s)`. Kotlin and Swift let you add methods and computed properties to *any* type, including `String`, and call them with dot syntax.",
        "Extensions are resolved at compile time and can't add stored fields. They're a way to organize helpers, not inheritance. Swift goes further: an extension can make an existing type conform to a protocol.",
      ],
      snippet: "extensions",
      notes: {
        android: [
          "Inside an extension, `this` is the receiver, so `replaceFirstChar` is called on the string.",
          "Extensions are only visible where they're imported, so they can't leak globally the way prototype patches do.",
          "Compose's `Modifier.padding()` and friends are all extension functions on `Modifier`.",
        ],
        ios: [
          "`extension Todo: CustomStringConvertible { … }` adds a conformance after the fact.",
          "Swift already has `String.capitalized`, which capitalizes *every* word. That's why this helper has a different name.",
          "It's common to split a type into several extensions, one per protocol or concern.",
        ],
      },
    },
    {
      id: "collections",
      title: "Collections: map, filter, reduce",
      prose: [
        "The collection pipeline you know from JS is all here, with a much bigger standard library. Many things you'd write with `reduce` have a dedicated function: `count`, `sumOf`, `associateBy`, `groupBy`, `first`, `partition`.",
        "Mutability is part of the type. Kotlin separates `List` (read-only) from `MutableList`. Swift has one `Array`, and `let` or `var` decides whether it can change. Sorting returns a new collection by default, so the in-place `sort()` mutation that bites you in JS is opt-in.",
      ],
      snippet: "collections",
      notes: {
        rn: ["`todos.sort()` mutates in place, which is why the copy `[...todos]` is needed."],
        android: [
          "`firstOrNull` returns `Todo?`. `first` throws if nothing matches.",
          "`fold` is `reduce` with an initial value. Kotlin's `reduce` uses the first element as the start and throws on an empty list.",
          "For large chains, `asSequence()` makes the steps lazy, like an iterator pipeline.",
        ],
        ios: [
          "`first(where:)` is the `find` equivalent. With a trailing closure it reads `todos.first { … }`.",
          "`Dictionary(uniqueKeysWithValues:)` crashes on duplicate keys. Use `Dictionary(grouping:by:)` if keys can repeat.",
          "`sort()` mutates a `var` array in place. `sorted()` returns a new one.",
        ],
      },
    },
    {
      id: "value-reference",
      title: "Value vs reference semantics",
      prose: [
        "In JavaScript every object is shared by reference. Kotlin works the same way: every class instance is a reference, and `data class` is no exception. You stay safe by making data immutable and copying it with `copy()`.",
        "Swift has two kinds of types. A `class` is a reference, like JS objects. A `struct` or `enum` is a **value**, and assigning it or passing it to a function makes an independent copy. Swift's standard types, including `Array`, `Dictionary`, and `String`, are all structs.",
        "This is why Swift models and SwiftUI views are structs. Nobody can mutate your copy behind your back. Swift uses copy-on-write internally, so copying a large array is cheap until someone actually changes it.",
      ],
      snippet: "value-reference",
      compare: [
        {
          label: "Model data with…",
          values: {
            rn: "Plain objects, treated as immutable by convention.",
            android: "`data class` with `val` properties.",
            ios: "`struct` with `let`/`var` properties.",
          },
        },
        {
          label: "Shared, mutable things",
          values: {
            rn: "Objects, stores, refs",
            android: "Regular `class` (e.g. a `ViewModel`)",
            ios: "`class` (e.g. an `@Observable` model)",
          },
        },
        {
          label: "`let`/`val` on a model",
          values: {
            rn: "Reference is fixed, fields can still change.",
            android: "Reference is fixed. Fields change only if declared `var`.",
            ios: "On a struct, *everything* is frozen. On a class, only the reference is.",
          },
        },
      ],
      notes: {
        android: ["Kotlin has no user-defined value types for general use. `@JvmInline value class` wraps a single value for type safety, not copy semantics."],
        ios: [
          "Mark classes `final` unless you plan to subclass. It's idiomatic and lets the compiler optimize.",
          "A method that changes a struct's own properties must be marked `mutating`.",
        ],
      },
    },
  ],
  gotchas: [
    {
      title: "Swift's let is const, not let",
      body: "TypeScript's `let` is mutable. Swift's `let` is a constant, and because arrays and structs are values, a `let` array can't even be appended to. If you see \"cannot use mutating member on immutable value\", you want `var`.",
    },
    {
      title: "No structural typing",
      body: "In TypeScript, any object with the right fields is a `Todo`. In Kotlin and Swift you have to construct a `Todo`, and a class only satisfies an interface or protocol if it says so. Two data classes with identical fields are unrelated types.",
    },
    {
      title: "Integer math is real",
      body: "`5 / 2` is `2` in both languages because both operands are `Int`. Neither language converts between `Int` and `Double` implicitly, so `count * 1.5` won't compile until you convert. Integer overflow wraps silently in Kotlin and crashes in Swift.",
    },
    {
      title: "!! and ! crash for real",
      body: "TypeScript's non-null assertion is erased at build time. Kotlin's `!!` throws a `NullPointerException`, and Swift's `!` terminates the app. Prefer `?:`/`??`, smart casts, `guard let`, or `requireNotNull` with a message.",
    },
    {
      title: "== means value equality",
      body: "JS trained you to use `===` and to expect objects to compare by reference. In Kotlin and Swift, `==` compares contents (via `equals()` or `Equatable`) and `===` checks identity. Two `Todo`s with the same fields are `==`.",
    },
    {
      title: "Passing a struct passes a copy",
      body: "If you pass a Swift struct to a function and change it there, the caller's copy doesn't change. That's usually what you want. When you really need shared mutable state, use a `class` (Chapter 10) or an `inout` parameter.",
    },
  ],
  cheatsheet: [
    { rn: "`const x = 1`", android: "`val x = 1`", ios: "`let x = 1`" },
    { rn: "`let x = 1`", android: "`var x = 1`", ios: "`var x = 1`" },
    { rn: "`x: string | null`", android: "`x: String?`", ios: "`x: String?`" },
    { rn: "`a ?? b`", android: "`a ?: b`", ios: "`a ?? b`" },
    { rn: "`if (x) { /* narrowed */ }`", android: "`if (x != null)` smart cast", ios: "`if let x { … }` / `guard let x else { … }`" },
    { rn: "`x!`", android: "`x!!` (throws)", ios: "`x!` (crashes)" },
    { rn: "`type Todo = { … }`", android: "`data class Todo(…)`", ios: "`struct Todo { … }`" },
    { rn: "`{ ...todo, done: true }`", android: "`todo.copy(done = true)`", ios: "`var t = todo; t.done = true`" },
    { rn: "Discriminated union", android: "`sealed interface` + `when`", ios: "`enum` with associated values + `switch`" },
    { rn: "`(t: Todo) => t.done`", android: "`{ t: Todo -> t.done }` / `{ it.done }`", ios: "`{ t in t.done }` / `{ $0.done }`" },
    { rn: "Options object", android: "Named + default arguments", ios: "Argument labels + defaults" },
    { rn: "Helper `fn(s)`", android: "Extension `fun String.fn()`", ios: "`extension String { … }`" },
    { rn: "`arr.find(…)`", android: "`list.firstOrNull { … }`", ios: "`array.first { … }`" },
    { rn: "`arr.reduce(f, 0)`", android: "`list.fold(0) { … }`", ios: "`array.reduce(0) { … }`" },
    { rn: "Template literal", android: "`\"Hi $name\"`", ios: "`\"Hi \\(name)\"`" },
  ],
  quiz: [
    {
      question: "In Swift, you write `let todos = [\"A\"]` and then `todos.append(\"B\")`. What happens?",
      options: [
        "It works, like `const` in TypeScript",
        "It compiles but throws at runtime",
        "It doesn't compile, because a `let` array is immutable",
        "It creates a new array and rebinds `todos`",
      ],
      answer: 2,
      explanation: "Swift arrays are value types, so `let` freezes the whole value, not just the binding. Use `var todos` to append. In Kotlin the equivalent question depends on `listOf` vs `mutableListOf`, not `val`.",
    },
    {
      question: "What does `val half = 5 / 2` give you in Kotlin?",
      options: ["`2.5`", "`2`", "`3`", "A compile error"],
      answer: 1,
      explanation: "Both operands are `Int`, so it's integer division. Write `5 / 2.0` or `5.toDouble() / 2` to get `2.5`. Swift behaves the same way.",
    },
    {
      question: "You model screen state as a Kotlin `sealed interface` with `Loading`, `Success`, and `Error`. Why should your `when` over it avoid an `else` branch?",
      options: [
        "`else` is not allowed on sealed types",
        "Without `else`, adding a new case makes every non-exhaustive `when` fail to compile",
        "`else` makes the `when` slower",
        "`else` disables smart casts in the other branches",
      ],
      answer: 1,
      explanation: "Exhaustiveness checking is the main benefit of sealed types, like TypeScript's `never` check. An `else` silently swallows new cases. The same applies to `default:` in a Swift `switch` over an enum.",
    },
    {
      question: "In Swift, `var b = a; b.done = true`, where `a` is a `struct Todo`. What is `a.done`?",
      options: [
        "`true`, because `b` points to the same object",
        "`false`, because assignment copied the struct",
        "It doesn't compile, because `a` is a `let`",
        "It depends on whether `Todo` is `Equatable`",
      ],
      answer: 1,
      explanation: "Structs are value types, so `b` is an independent copy. With a `class`, or with a Kotlin `data class` and a `var` property, both names would refer to the same object and `a.done` would be `true`.",
    },
    {
      question: "What's the Kotlin equivalent of TypeScript's `user?.nickname ?? 'Guest'`?",
      options: [
        "`user?.nickname ?? \"Guest\"`",
        "`user!!.nickname ?: \"Guest\"`",
        "`user?.nickname ?: \"Guest\"`",
        "`user.nickname || \"Guest\"`",
      ],
      answer: 2,
      explanation: "Kotlin keeps `?.` but spells the null-coalescing operator `?:` (the Elvis operator). `!!` would throw if `user` is null. Swift uses exactly the TypeScript syntax: `user?.nickname ?? \"Guest\"`.",
    },
    {
      question: "You have a function `processTodo(todo: TodoLike)` where `TodoLike` is an interface/protocol with `title`. You pass in a `Task` type that has a `title` property but doesn't declare the interface. What happens in Kotlin and Swift?",
      options: [
        "It works, because the shapes match",
        "It works in Swift but not in Kotlin",
        "It fails to compile in both until `Task` declares the interface or protocol",
        "It compiles but crashes at runtime",
      ],
      answer: 2,
      explanation: "Both languages are nominally typed. A matching shape isn't enough. In Swift you can add the conformance after the fact with `extension Task: TodoLike {}`. In Kotlin you need to declare it on the class or write an adapter.",
    },
  ],
};
