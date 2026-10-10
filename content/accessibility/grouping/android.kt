@Composable
fun TodoRow(title: String, due: String, done: Boolean, onToggle: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            // toggleable merges its children into one TalkBack node
            .toggleable(value = done, role = Role.Checkbox, onValueChange = { onToggle() })
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        // null handler: the row owns the click, so the checkbox isn't a separate stop
        Checkbox(checked = done, onCheckedChange = null)
        Column(Modifier.padding(start = 8.dp)) {
            Text(title)
            Text("Due $due", style = MaterialTheme.typography.bodySmall)
        }
    }
}
// TalkBack: "Buy milk, Due Friday, checkbox, not checked"
