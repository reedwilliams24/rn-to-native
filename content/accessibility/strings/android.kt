// res/values/strings.xml (and res/values-es/strings.xml for Spanish, etc.)
// <string name="greeting">Hello, %1$s</string>
// <plurals name="todo_count">
//     <item quantity="one">%d todo</item>
//     <item quantity="other">%d todos</item>
// </plurals>

@Composable
fun Header(name: String, count: Int) {
    Column {
        Text(stringResource(R.string.greeting, name))
        // count is passed twice: once to pick the form, once to format it
        Text(pluralStringResource(R.plurals.todo_count, count, count))
    }
}

// Outside composables: context.getString(R.string.greeting, name)
