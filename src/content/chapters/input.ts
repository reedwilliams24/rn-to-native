import type { Chapter } from "../types";

export const input: Chapter = {
  slug: "input",
  title: "Input & forms",
  intro: [
    "`TextInput` is one of the few RN components where you already think in *controlled* terms: `value` plus `onChangeText`. Compose's `TextField` uses exactly the same contract. SwiftUI folds both halves into a single **binding** (`$text`), which you met in Chapter 5.",
    "What changes is everything around the field. Keyboard options are grouped into one object on Android and spread across modifiers on iOS. Focus is managed with state instead of refs. And the keyboard is just another inset, which mostly replaces `KeyboardAvoidingView`.",
  ],
  sections: [
    {
      id: "mental-model",
      title: "The mental model",
      prose: [
        "All three treat the text as state you own. The field displays whatever you store, and reports edits through a callback or binding. There's no uncontrolled `defaultValue` mode to fall back on in Compose.",
      ],
      compare: [
        {
          label: "Text field",
          values: {
            rn: "`<TextInput>`",
            android: "`TextField` / `OutlinedTextField` (Material 3), or unstyled `BasicTextField`",
            ios: "`TextField`, `SecureField`, `TextEditor` (multi-line)",
          },
        },
        {
          label: "Value + change",
          values: { rn: "`value` + `onChangeText`", android: "`value` + `onValueChange`", ios: "`text: $binding`" },
        },
        {
          label: "Placeholder / label",
          values: {
            rn: "`placeholder`",
            android: "`label` (floats above when focused) or `placeholder`",
            ios: "The first argument, `TextField(\"Name\", …)`",
          },
        },
        {
          label: "Keyboard settings",
          values: {
            rn: "Props on `TextInput`",
            android: "One `KeyboardOptions(…)` object",
            ios: "Modifiers: `.keyboardType`, `.submitLabel`, …",
          },
        },
        {
          label: "Focus",
          values: { rn: "A `ref` with `.focus()` / `.blur()`", android: "`FocusRequester` + `LocalFocusManager`", ios: "`@FocusState`" },
        },
      ],
    },
    {
      id: "text-field",
      title: "TextInput → TextField",
      prose: [
        "The smallest working field. In Compose, `onValueChange` is not optional in practice: if you don't write the new value back to state, the field ignores the keystroke. That's precisely what a controlled RN input does when you forget `onChangeText`.",
      ],
      snippet: "text-field",
      notes: {
        android: [
          "`OutlinedTextField` and `TextField` (filled) are the two Material 3 styles. Pick one per app, the way you'd pick one input style in a design system.",
          "`rememberSaveable` keeps the typed text across rotation (Chapter 5). Use it for form input that isn't in a `ViewModel`.",
          "Newer Compose versions also offer a `TextFieldState`-based field, where the field owns the text and you read it. The value/callback version shown here is still the common one.",
        ],
        ios: [
          "Without a style, `TextField` has no border at all. `.roundedBorder` is the quick fix, and inside a `Form` the row styling is applied for you.",
          "Use `TextField(\"Notes\", text: $notes, axis: .vertical)` for a field that grows, like `multiline`.",
        ],
      },
    },
    {
      id: "controlled",
      title: "Filtering & formatting input",
      prose: [
        "Because the field shows whatever you store, filtering works the RN way on Android. Transform the new text in `onValueChange`, and the rejected characters never appear.",
        "SwiftUI is different. A binding writes the new text *before* you see it, so the unfiltered value is briefly in state. You correct it in `.onChange(of:)`. It works, but it's a write after a write, and it's the reason formatting logic often moves into a model on iOS.",
      ],
      snippet: "controlled",
      notes: {
        android: [
          "`filter(Char::isDigit)` passes a function reference, like `.filter(isDigit)` in JS.",
          "For display-only formatting (spaces in a card number, a phone mask), use a `VisualTransformation`. It changes what's drawn without changing the stored value.",
        ],
        ios: [
          "The `if cleaned != new` check stops an infinite loop of change, write, change.",
          "For numbers, `TextField(\"Age\", value: $age, format: .number)` parses and formats for you, and updates the value when editing ends.",
        ],
      },
    },
    {
      id: "keyboard",
      title: "Keyboard type, autofill & return key",
      prose: [
        "The RN props map almost one to one. Android groups them into `KeyboardOptions` and handles the return key with `KeyboardActions`. iOS uses separate modifiers. Getting these right is a big part of what makes a form feel native.",
      ],
      snippet: "keyboard",
      compare: [
        {
          label: "Email keyboard",
          values: { rn: "`keyboardType=\"email-address\"`", android: "`KeyboardType.Email`", ios: "`.keyboardType(.emailAddress)`" },
        },
        {
          label: "Numbers only",
          values: { rn: "`keyboardType=\"number-pad\"`", android: "`KeyboardType.Number` / `NumberPassword`", ios: "`.keyboardType(.numberPad)`" },
        },
        {
          label: "Return key label",
          values: { rn: "`returnKeyType=\"next\"`", android: "`imeAction = ImeAction.Next`", ios: "`.submitLabel(.next)`" },
        },
        {
          label: "Return key pressed",
          values: { rn: "`onSubmitEditing`", android: "`KeyboardActions(onNext = { … })`", ios: "`.onSubmit { … }`" },
        },
        {
          label: "Autofill",
          values: {
            rn: "`autoComplete=\"email\"` / `textContentType`",
            android: "`Modifier.semantics { contentType = ContentType.EmailAddress }` (Compose 1.8+)",
            ios: "`.textContentType(.emailAddress)`",
          },
        },
        {
          label: "Password",
          values: {
            rn: "`secureTextEntry`",
            android: "`PasswordVisualTransformation()` + `KeyboardType.Password`",
            ios: "`SecureField`",
          },
        },
      ],
      notes: {
        android: [
          "`singleLine = true` is what makes the return key run an action. Without it, the field is multi-line and the key inserts a newline.",
          "The keyboard (IME) is a separate app on Android, so `KeyboardOptions` are hints. Some third-party keyboards ignore them.",
        ],
        ios: [
          "`.onSubmit` also applies to every field inside the view it's attached to, so you can put one handler on a whole `Form`.",
        ],
      },
    },
    {
      id: "focus",
      title: "Refs & focus → FocusRequester & @FocusState",
      prose: [
        "In RN you move focus imperatively, by calling `.focus()` on a ref. Compose keeps that shape: a `FocusRequester` is a handle you attach to a field with a modifier and call `requestFocus()` on. SwiftUI makes focus *state*. A `@FocusState` variable holds which field is focused, and assigning to it moves focus. Set it to `nil` to dismiss the keyboard.",
      ],
      snippet: "focus",
      notes: {
        android: [
          "`requestFocus()` throws if the requester isn't attached to anything yet. That's why the autofocus runs in `LaunchedEffect`, after the first composition.",
          "`focusManager.clearFocus()` hides the keyboard by removing focus, like `Keyboard.dismiss()`.",
          "`focusManager.moveFocus(FocusDirection.Down)` moves to the next field without a requester for each one.",
        ],
        ios: [
          "The `Field` enum is local to the view. Using an enum, rather than a set of Bools, makes \"only one field is focused\" impossible to get wrong.",
          "Setting focus in `.onAppear` can be ignored if the view is still animating in, for example while a screen is being pushed. If that happens, set it from `.task` after a short `Task.sleep`.",
        ],
      },
    },
    {
      id: "keyboard-avoid",
      title: "KeyboardAvoidingView → insets",
      prose: [
        "On both platforms, the keyboard is part of the **safe area** or **window insets**, just like the status bar. You don't need a wrapper that measures the keyboard. You pad content by the keyboard inset, or you pin content to the safe area and let it move.",
        "SwiftUI does this by default: content stays out from under the keyboard without any code. On Android, once you've gone edge to edge (Chapter 4), you apply the IME inset yourself with `Modifier.imePadding()`.",
      ],
      snippet: "keyboard-avoid",
      notes: {
        android: [
          "The Activity should use `android:windowSoftInputMode=\"adjustResize\"` (the default with `enableEdgeToEdge()` on recent targets). Without it, the system pans the whole window instead of reporting the inset.",
          "Insets are *consumed*: `systemBarsPadding()` before `imePadding()` means the navigation bar height isn't added twice when the keyboard opens.",
          "`Scaffold` passes system bar padding to its content, but not IME padding. You still add `imePadding()` for a bottom composer.",
        ],
        ios: [
          "To stop SwiftUI from avoiding the keyboard (for example, for a full-screen background), use `.ignoresSafeArea(.keyboard)`.",
          "`.scrollDismissesKeyboard(.interactively)` replaces `keyboardDismissMode=\"interactive\"`.",
        ],
      },
    },
    {
      id: "forms",
      title: "Forms & validation",
      prose: [
        "Neither platform has Formik or React Hook Form built in, and you rarely miss them. Form state is just state, validation is a computed value, and the error is a parameter on the field.",
        "Material 3 fields have built-in error styling: `isError` turns the outline red, and `supportingText` shows the message underneath. SwiftUI's `Form` gives you grouped, platform-styled rows, with `Section` footers as a natural place for hints and errors.",
      ],
      snippet: "form",
      notes: {
        android: [
          "`supportingText` takes a composable lambda, or `null` to hide it. That's why the snippet uses an `if` expression rather than a string.",
          "For larger forms, hold the fields in a `ViewModel` (Chapter 10) and expose validation as derived state.",
        ],
        ios: [
          "`Form` looks like the Settings app on iOS. If you want custom styling, use a `VStack` instead.",
          "Disable a submit button with `.disabled(!valid)`, the same idea as RN's `disabled` prop.",
        ],
      },
    },
    {
      id: "controls",
      title: "Other inputs",
      prose: [
        "The rest of the form toolkit maps cleanly. Most RN apps get these from community packages. Both native platforms have them built in, and they look right without styling.",
      ],
      compare: [
        {
          label: "Toggle",
          values: { rn: "`<Switch value onValueChange>`", android: "`Switch(checked, onCheckedChange)`", ios: "`Toggle(\"Label\", isOn: $on)`" },
        },
        {
          label: "Checkbox",
          values: { rn: "Community package", android: "`Checkbox(checked, onCheckedChange)`", ios: "`Toggle` with `.toggleStyle(.checkbox)` on macOS only. Use a `Toggle` or a custom row on iOS." },
        },
        {
          label: "Slider",
          values: { rn: "`@react-native-community/slider`", android: "`Slider(value, onValueChange)`", ios: "`Slider(value: $v, in: 0...1)`" },
        },
        {
          label: "Picker / select",
          values: { rn: "`@react-native-picker/picker`", android: "`ExposedDropdownMenuBox`, or radio buttons", ios: "`Picker(\"Label\", selection: $choice) { … }`" },
        },
        {
          label: "Segmented control",
          values: { rn: "Community package", android: "`SingleChoiceSegmentedButtonRow`", ios: "`Picker` with `.pickerStyle(.segmented)`" },
        },
        {
          label: "Date picker",
          values: { rn: "`@react-native-community/datetimepicker`", android: "`DatePicker` / `DatePickerDialog`", ios: "`DatePicker(\"Due\", selection: $date)`" },
        },
      ],
      callout:
        "Every Compose control follows the same `value` + `onChange` pattern as `TextField`, and every SwiftUI control takes a binding. Once you've written one form, you've learned all of them.",
    },
  ],
  gotchas: [
    {
      title: "Forgetting to write back freezes the field",
      body: "If `onValueChange` doesn't update the state you pass as `value`, the Compose field won't change when the user types. That's correct controlled-input behavior, but it looks like a bug the first time.",
    },
    {
      title: "SwiftUI filters after the fact",
      body: "A binding stores the raw text first, so `.onChange` validation sees the bad value and corrects it. Don't trigger side effects (like a search request) from the uncorrected value.",
    },
    {
      title: "No singleLine, no IME action",
      body: "A Compose field without `singleLine = true` is multi-line, so the return key adds a newline and `KeyboardActions` never fires. Set it on every single-line field.",
    },
    {
      title: "requestFocus too early crashes",
      body: "Calling `focusRequester.requestFocus()` during composition throws, because the requester isn't attached to a field yet. Call it from `LaunchedEffect` or an event handler.",
    },
    {
      title: "Edge-to-edge needs imePadding",
      body: "After `enableEdgeToEdge()`, Android no longer moves your content for the keyboard. A bottom composer hides behind it until you add `Modifier.imePadding()`.",
    },
    {
      title: "TextField has no border on iOS",
      body: "A bare SwiftUI `TextField` is invisible apart from its placeholder. Add `.textFieldStyle(.roundedBorder)`, put it in a `Form`, or style it yourself.",
    },
  ],
  cheatsheet: [
    { rn: "`<TextInput>`", android: "`OutlinedTextField` / `TextField`", ios: "`TextField`" },
    { rn: "`value` + `onChangeText`", android: "`value` + `onValueChange`", ios: "`text: $text`" },
    { rn: "`placeholder`", android: "`label = { Text(…) }`", ios: "`TextField(\"Placeholder\", …)`" },
    { rn: "`secureTextEntry`", android: "`PasswordVisualTransformation()`", ios: "`SecureField`" },
    { rn: "`multiline`", android: "Omit `singleLine` (set `minLines`, `maxLines`)", ios: "`axis: .vertical` / `TextEditor`" },
    { rn: "`keyboardType`", android: "`KeyboardOptions(keyboardType = …)`", ios: "`.keyboardType(…)`" },
    { rn: "`autoCapitalize`", android: "`KeyboardOptions(capitalization = …)`", ios: "`.textInputAutocapitalization(…)`" },
    { rn: "`autoComplete`", android: "`semantics { contentType = … }`", ios: "`.textContentType(…)`" },
    { rn: "`returnKeyType`", android: "`imeAction = ImeAction.…`", ios: "`.submitLabel(…)`" },
    { rn: "`onSubmitEditing`", android: "`KeyboardActions(onDone = …)`", ios: "`.onSubmit { }`" },
    { rn: "`ref.focus()`", android: "`focusRequester.requestFocus()`", ios: "`focused = .field`" },
    { rn: "`Keyboard.dismiss()`", android: "`focusManager.clearFocus()`", ios: "`focused = nil`" },
    { rn: "`KeyboardAvoidingView`", android: "`Modifier.imePadding()`", ios: "Automatic / `.safeAreaInset`" },
    { rn: "Error text", android: "`isError` + `supportingText`", ios: "`Section` footer / `Text`" },
  ],
  quiz: [
    {
      question: "A Compose `OutlinedTextField(value = name, onValueChange = { })` doesn't change when you type. Why?",
      options: [
        "`OutlinedTextField` needs a `label` to be editable",
        "The handler never writes the new text to `name`, and the field always shows `value`",
        "It needs `singleLine = true`",
        "Text fields only update after the keyboard closes",
      ],
      answer: 1,
      explanation: "Compose fields are controlled. Write the new text back with `onValueChange = { name = it }`, exactly as you would with `onChangeText`.",
    },
    {
      question: "You set `imeAction = ImeAction.Done` and a `KeyboardActions(onDone = …)`, but the return key inserts a newline instead. What's missing?",
      options: [
        "`KeyboardType.Text`",
        "`singleLine = true`",
        "A `FocusRequester`",
        "`autoCorrectEnabled = false`",
      ],
      answer: 1,
      explanation: "Multi-line fields use the return key for newlines. `singleLine = true` turns it into an action key, like a single-line RN `TextInput`.",
    },
    {
      question: "How do you move focus to the password field in SwiftUI?",
      options: [
        "Hold a reference to the field and call `.focus()`",
        "Assign to a `@FocusState` variable, e.g. `focused = .password`",
        "Use a `FocusRequester`",
        "Post a notification to the field",
      ],
      answer: 1,
      explanation: "SwiftUI focus is state, not a method call. Bind each field with `.focused($focused, equals: …)` and assign to change focus. Assign `nil` to dismiss the keyboard.",
    },
    {
      question: "A PIN field filters out letters. In SwiftUI, when does the filtering happen?",
      options: [
        "Before the binding updates, so letters never reach state",
        "After the binding writes the raw text, in `.onChange(of:)`",
        "When the user presses return",
        "SwiftUI can't filter text input",
      ],
      answer: 1,
      explanation: "The binding stores the raw text first. You correct it in `.onChange`. On Android you filter inside `onValueChange`, before the value is stored.",
    },
    {
      question: "Your Android chat screen calls `enableEdgeToEdge()`. When the keyboard opens, it covers the message composer. What fixes it?",
      options: [
        "Wrap the screen in a `KeyboardAvoidingView`",
        "Add `Modifier.imePadding()` to the container",
        "Call `focusManager.clearFocus()`",
        "Turn off edge to edge",
      ],
      answer: 1,
      explanation: "The keyboard is reported as a window inset. With edge to edge, you apply insets yourself, and `imePadding()` pads by the keyboard's height.",
    },
    {
      question: "Your Compose screen calls `focusRequester.requestFocus()` directly in the composable body. What happens?",
      options: [
        "The field gets focus on first display",
        "It throws, because the requester isn't attached yet during composition",
        "It's silently ignored",
        "Focus moves on every recomposition, which is fine",
      ],
      answer: 1,
      explanation: "Focus is a side effect. Request it from `LaunchedEffect(Unit)`, which runs after the field is composed and attached (Chapter 6).",
    },
    {
      kind: "bug",
      platform: "android",
      question: "Typing does nothing: the field stays empty. Which line is the bug?",
      code: `@Composable
fun NameField() {
    var name by remember { mutableStateOf("") }
    TextField(
        value = name,
        onValueChange = { },
        label = { Text("Name") },
    )
}`,
      answer: 6,
      explanation: "`TextField` is a controlled input. It shows `value` and reports edits through `onValueChange`, the way RN's `TextInput` has `value` and `onChangeText`. If the state never changes, every keystroke is thrown away. Use `onValueChange = { name = it }`.",
    },
    {
      kind: "bug",
      platform: "ios",
      question: "The password shows in plain text, and the keyboard offers autocorrect suggestions for it. Which line is the bug?",
      code: `struct LoginForm: View {
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        Form {
            TextField("Email", text: $email)
                .keyboardType(.emailAddress)
            TextField("Password", text: $password)
        }
    }
}`,
      answer: 9,
      explanation: "Passwords need `SecureField(\"Password\", text: $password)`, SwiftUI's `secureTextEntry`. It masks the input, turns off autocorrect, and lets password managers fill it.",
    },
  ],
};
