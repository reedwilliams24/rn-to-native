// res/values/strings.xml (and res/values-es/strings.xml for Spanish, etc.) // @link:file
// <string name="greeting">Hello, %1$s</string> // @link:greeting-str
// <plurals name="todo_count"> // @link:plural-str
//     <item quantity="one">%d todo</item>
//     <item quantity="other">%d todos</item>
// </plurals>

@Composable
fun Header(name: String, count: Int) { // @link:fn
    Column {
        Text(stringResource(R.string.greeting, name)) // @link:greeting
        // count is passed twice: once to pick the form, once to format it
        Text(pluralStringResource(R.plurals.todo_count, count, count)) // @link:plural
    }
}

// Outside composables: context.getString(R.string.greeting, name) // @link:outside
