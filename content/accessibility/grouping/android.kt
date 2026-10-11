@Composable
fun TodoRow(title: String, due: String, done: Boolean, onToggle: () -> Unit) { // @link:fn
    Row(
        Modifier
            .fillMaxWidth()
            // toggleable merges its children into one TalkBack node // @link:group
            .toggleable(value = done, role = Role.Checkbox, onValueChange = { onToggle() }) // @link:toggle,role,state,group
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        // null handler: the row owns the click, so the checkbox isn't a separate stop
        Checkbox(checked = done, onCheckedChange = null) // @link:check
        Column(Modifier.padding(start = 8.dp)) {
            Text(title) // @link:title
            Text("Due $due", style = MaterialTheme.typography.bodySmall) // @link:due
        }
    }
}
// TalkBack: "Buy milk, Due Friday, checkbox, not checked"
